import { Problem } from "@/types/bizpilot";
import React from "react";
import ProblemCard from "./ProblemCard";

interface ResultsDisplayProps {
  problems: Problem[];
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ problems }) => {
  if (problems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white p-10 rounded-xl shadow-xl text-center border border-gray-100">
        <div className="w-20 h-20 bg-[#e8eef2] rounded-full flex items-center justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-[#1d3f51]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          No Problem Suggestions Yet
        </h3>
        <p className="text-gray-500 max-w-md">
          Complete the consultation to see tailored problem suggestions for your
          business.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-100">
      <div className="flex flex-col mb-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-[#e8eef2] rounded-full flex items-center justify-center mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-[#1d3f51]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Recommended Solutions
          </h2>
        </div>
        <p className="text-gray-600 max-w-3xl">
          Based on our analysis of your business challenges, we&apos;ve
          identified the following opportunities. Each card represents a
          potential solution with the expertise required to address your
          specific needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {problems.map((problem) => (
          <ProblemCard key={problem.id} problem={problem} />
        ))}
      </div>
    </div>
  );
};

export default ResultsDisplay;
