import React from 'react';

interface FaqSuggestionsProps {
  onSelectQuestion: (question: string) => void;
  isVisible: boolean;
}

const FaqSuggestions: React.FC<FaqSuggestionsProps> = ({ onSelectQuestion, isVisible }) => {
  const faqQuestions = [
    {
      icon: (
        <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      question: 'I\'m losing money because I can\'t track my sales data properly',
      shortLabel: 'Sales tracking issues'
    },
    {
      icon: (
        <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      question: 'I need to understand my customer behavior but don\'t know where to start',
      shortLabel: 'Customer insights'
    },
    {
      icon: (
        <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      question: 'My business data is all over the place and I need help organizing it',
      shortLabel: 'Data chaos'
    }
  ];

  if (!isVisible) return null;

  return (
    <div className="w-full px-4 py-3 border-t border-border bg-gradient-to-r from-primary/5 to-accent/5 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <p className="text-xs text-muted-foreground mb-2 font-medium">Common challenges we solve:</p>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {faqQuestions.map((faq, index) => (
          <button
            key={index}
            onClick={() => onSelectQuestion(faq.question)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm bg-background border border-border rounded-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 whitespace-nowrap flex-shrink-0 group shadow-sm hover:shadow-md active:scale-95"
            aria-label={`Ask: ${faq.question}`}
          >
            {faq.icon}
            <span className="font-medium">{faq.shortLabel}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FaqSuggestions; 