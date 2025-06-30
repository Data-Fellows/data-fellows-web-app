import React from 'react';

interface TransitionScreenProps {
  message?: string;
}

const TransitionScreen: React.FC<TransitionScreenProps> = ({ 
  message = "Analyzing your business needs..." 
}) => {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8">
      <div className="mb-8">
        <div className="relative">
          {/* Animated circles */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-32 w-32 animate-ping rounded-full bg-primary opacity-20"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-24 w-24 animate-ping rounded-full bg-primary opacity-30" style={{ animationDelay: '0.5s' }}></div>
          </div>
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-primary">
            <svg
              className="h-16 w-16 text-primary-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
        </div>
      </div>
      
      <h2 className="mb-4 text-2xl font-bold text-foreground">{message}</h2>
      
      <div className="flex items-center space-x-2">
        <div
          className="h-3 w-3 animate-bounce rounded-full bg-primary"
          style={{ animationDelay: '0ms' }}
        ></div>
        <div
          className="h-3 w-3 animate-bounce rounded-full bg-primary"
          style={{ animationDelay: '150ms' }}
        ></div>
        <div
          className="h-3 w-3 animate-bounce rounded-full bg-primary"
          style={{ animationDelay: '300ms' }}
        ></div>
      </div>
      
      <p className="mt-6 text-center text-muted-foreground">
        Adding your personalized solutions to the dashboard...
      </p>
    </div>
  );
};

export default TransitionScreen; 