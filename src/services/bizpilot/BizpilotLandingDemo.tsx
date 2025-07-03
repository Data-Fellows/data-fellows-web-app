'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Message } from '@/types/bizpilot'
import { FaRobot, FaTimes } from 'react-icons/fa'
import ChatInterfaceLanding from './ChatInterfaceLanding'
import { motion, AnimatePresence } from 'framer-motion'

interface BizpilotLandingDemoProps {
  onSignUpClick?: (userType: 'data-professional' | 'business-owner') => void
}

const DEMO_SYSTEM_PROMPT = `<system_prompt>
  <identity>
    You are BizPilot Demo, a friendly AI assistant showcasing how DataFellows can help businesses with their data challenges.
    You're here to give visitors a taste of what's possible, not conduct a full consultation.
  </identity>

  <conversation_approach>
    • Be enthusiastic and welcoming
    • Focus on understanding one key challenge quickly
    • Show immediate value through insights
    • Keep responses concise and impactful
  </conversation_approach>

  <conversation_flow>
    In just 2-3 exchanges:
    1️⃣ Understand their business type and main data challenge
    2️⃣ Provide one powerful insight or observation
    3️⃣ Tease the full solution available after signup
  </conversation_flow>

  <constraints>
    <max_exchanges>3</max_exchanges>
    <response_length>50-75 words</response_length>
    <end_with_cta>true</end_with_cta>
  </constraints>
</system_prompt>`

export default function BizpilotLandingDemo({ onSignUpClick }: BizpilotLandingDemoProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  
  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])
  
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: DEMO_SYSTEM_PROMPT
    },
    {
      role: 'assistant',
      content: "Hi! I'm BizPilot. In 30 seconds, I can show you how DataFellows can transform your business data challenges. What's your biggest data headache right now?",
    },
  ])
  const [isProcessing, setIsProcessing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [userMessageCount, setUserMessageCount] = useState(0)

  // Floating button animation
  const floatingButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    // Show the floating button after 3 seconds on page load
    const timer = setTimeout(() => {
      if (!hasInteracted && floatingButtonRef.current) {
        floatingButtonRef.current.classList.add('animate-bounce')
        setTimeout(() => {
          floatingButtonRef.current?.classList.remove('animate-bounce')
        }, 3000)
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [hasInteracted])

  const handleSendMessage = async (message: string) => {
    const newUserMessageCount = userMessageCount + 1
    setUserMessageCount(newUserMessageCount)
    setHasInteracted(true)

    const updatedMessages: Message[] = [
      ...messages,
      { role: 'user', content: message },
    ]
    setMessages(updatedMessages)
    setIsProcessing(true)

    try {
      // Check if this is the final exchange
      const isLastExchange = newUserMessageCount >= 2

      let messagesToSend = [...updatedMessages]
      
      if (isLastExchange) {
        messagesToSend = [
          {
            role: 'system',
            content: `The user has now sent ${newUserMessageCount} messages. This is the FINAL response. Provide ONE specific insight about their challenge, then say: "I can see exactly how to help you [specific benefit]. Want to see the full solution? Sign up for free and I'll show you [specific outcome]." Keep it under 75 words total.`,
          },
          ...updatedMessages,
        ]
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: messagesToSend }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      const assistantMessage: Message = data.response

      setMessages([...updatedMessages, assistantMessage])
      
      // Show results preview after final exchange
      if (isLastExchange) {
        setTimeout(() => {
          setShowResults(true)
        }, 1500)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      {/* Floating BizPilot Button - positioned to avoid theme toggle */}
      <motion.button
        ref={floatingButtonRef}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-40 group"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative">
          {/* Pulsing ring */}
          <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-25" />
          
          {/* Button content */}
          <div className="relative flex items-center gap-2 sm:gap-3 rounded-full bg-primary px-4 sm:px-6 py-2.5 sm:py-3 text-primary-foreground shadow-lg transition-all duration-200 group-hover:shadow-xl">
            <FaRobot className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="font-semibold text-sm sm:text-base">Try BizPilot Free</span>
          </div>
          
          {/* Notification badge */}
          {!hasInteracted && (
            <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs animate-bounce">
              !
            </div>
          )}
        </div>
      </motion.button>

      {/* BizPilot Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed z-[201] flex items-center justify-center inset-0 px-4 py-4 sm:py-8 md:py-16"
            >
              <div className="flex w-full max-w-2xl h-[450px] sm:h-[600px] max-h-[75vh] sm:max-h-[80vh] flex-col rounded-2xl bg-background shadow-2xl border border-border">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3 sm:px-6 sm:py-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-primary">
                      <FaRobot className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-foreground">BizPilot</h3>
                      <p className="text-xs text-muted-foreground hidden sm:block">See what&apos;s possible in 30 seconds</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-full p-1.5 sm:p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <FaTimes className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>

                {/* Chat Interface */}
                <div className="flex-1 min-h-0 flex flex-col">
                  {!showResults ? (
                    <ChatInterfaceLanding
                      messages={messages.filter((m) => m.role !== 'system')}
                      onSendMessage={handleSendMessage}
                      isProcessing={isProcessing}
                      chatClosed={showResults}
                      showFaqSuggestions={userMessageCount === 0}
                    />
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex-1 overflow-y-auto p-6 sm:p-8"
                    >
                      <div className="flex flex-col items-center justify-center min-h-full text-center">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                          <svg className="h-10 w-10 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        
                        <h3 className="mb-3 text-xl sm:text-2xl font-bold text-foreground">
                          Your Personalized Solution is Ready!
                        </h3>
                        
                        <p className="mb-6 sm:mb-8 max-w-md text-sm sm:text-base text-muted-foreground px-2 sm:px-0">
                          Based on our conversation, I&apos;ve identified 3 specific ways DataFellows can help transform your business. Sign up to see your complete action plan.
                        </p>

                        <div className="space-y-4">
                          <div className="rounded-lg border border-border bg-card p-4 text-left">
                            <h4 className="mb-2 font-semibold text-foreground">What you&apos;ll get:</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              <li className="flex items-start gap-2">
                                <svg className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Custom data solutions tailored to your challenges</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <svg className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Matched with verified data professionals</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <svg className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>AI-powered insights and recommendations</span>
                              </li>
                            </ul>
                          </div>

                          <div className="flex flex-col gap-3 sm:flex-row">
                            <button
                              onClick={() => {
                                setIsOpen(false)
                                onSignUpClick?.('business-owner')
                              }}
                              className="flex-1 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                              Sign Up as Business Owner
                            </button>
                            <button
                              onClick={() => {
                                setIsOpen(false)
                                onSignUpClick?.('data-professional')
                              }}
                              className="flex-1 rounded-lg border border-primary bg-background px-6 py-3 font-semibold text-primary hover:bg-muted transition-colors"
                            >
                              Sign Up as Data Professional
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
} 