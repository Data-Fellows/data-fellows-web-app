'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Message } from '@/types/bizpilot'
import FaqSuggestionsLanding from './FaqSuggestionsLanding'

interface ChatInterfaceLandingProps {
  messages: Message[]
  onSendMessage: (message: string) => void
  isProcessing?: boolean
  chatClosed?: boolean
  showFaqSuggestions?: boolean
}

export default function ChatInterfaceLanding({
  messages,
  onSendMessage,
  isProcessing = false,
  chatClosed = false,
  showFaqSuggestions = true,
}: ChatInterfaceLandingProps) {
  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputMessage.trim() && !isProcessing && !chatClosed) {
      onSendMessage(inputMessage.trim())
      setInputMessage('')
    }
  }

  const handleFaqClick = (question: string) => {
    if (!isProcessing && !chatClosed) {
      onSendMessage(question)
    }
  }

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              } animate-in fade-in slide-in-from-bottom-2`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground border border-border'
                }`}
              >
                <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex justify-start animate-in fade-in">
              <div className="bg-muted rounded-2xl px-4 py-3 border border-border">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* FAQ Suggestions - Only show for first message */}
      {showFaqSuggestions && messages.length <= 1 && !chatClosed && (
        <div className="border-t border-border px-4 py-3 sm:px-6 sm:py-4">
          <FaqSuggestionsLanding onQuestionClick={handleFaqClick} />
        </div>
      )}

      {/* Input Area */}
      {!chatClosed && (
        <div className="border-t border-border p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={isProcessing}
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={isProcessing || !inputMessage.trim()}
              className="rounded-lg bg-primary px-4 py-2 sm:px-6 sm:py-2.5 font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  )
} 