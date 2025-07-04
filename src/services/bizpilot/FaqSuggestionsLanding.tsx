'use client'

import React from 'react'

interface FaqSuggestionsLandingProps {
  onQuestionClick: (question: string) => void
}

const faqQuestions = [
  {
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    text: "Help me analyze my sales data",
  },
  {
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    text: "Find patterns in customer behavior",
  },
  {
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    text: "Automate my reporting process",
  },
]

export default function FaqSuggestionsLanding({ onQuestionClick }: FaqSuggestionsLandingProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">Try asking:</p>
      <div className="flex flex-wrap gap-2">
        {faqQuestions.map((faq, index) => (
          <button
            key={index}
            onClick={() => onQuestionClick(faq.text)}
            className="group flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs transition-all hover:border-primary hover:bg-primary/5 hover:shadow-sm"
          >
            <span className="text-muted-foreground group-hover:text-primary transition-colors">
              {faq.icon}
            </span>
            <span className="text-foreground">{faq.text}</span>
          </button>
        ))}
      </div>
    </div>
  )
} 