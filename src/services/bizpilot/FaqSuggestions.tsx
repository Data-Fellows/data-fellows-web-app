import React from 'react';

interface FaqSuggestionsProps {
  onSelectQuestion: (question: string) => void;
  isVisible: boolean;
}

const FaqSuggestions: React.FC<FaqSuggestionsProps> = ({ onSelectQuestion, isVisible }) => {
  const faqQuestions = [
    {
      icon: '📊',
      question: 'How can I better organize my business data?',
      shortLabel: 'Organize data'
    },
    {
      icon: '🚀',
      question: 'What strategies can help me scale my business?',
      shortLabel: 'Scale business'
    },
    {
      icon: '💡',
      question: 'How do I identify new growth opportunities?',
      shortLabel: 'Find opportunities'
    }
  ];

  if (!isVisible) return null;

  return (
    <div className="w-full px-4 py-3 border-t border-gray-100 bg-gray-50/50 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <p className="text-xs text-gray-500 mb-2">Try asking:</p>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {faqQuestions.map((faq, index) => (
          <button
            key={index}
            onClick={() => onSelectQuestion(faq.question)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 whitespace-nowrap flex-shrink-0 group"
            aria-label={`Ask: ${faq.question}`}
          >
            <span className="text-base">{faq.icon}</span>
            <span className="text-gray-700 group-hover:text-gray-900">{faq.shortLabel}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FaqSuggestions; 