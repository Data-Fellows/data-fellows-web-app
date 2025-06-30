import { Problem } from "@/types/bizpilot";
import React, { useState } from "react";

interface ProblemCardProps {
  problem: Problem;
}

const ProblemCard: React.FC<ProblemCardProps> = ({ problem }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative h-4 bg-gradient-to-r from-[#1d3f51] to-[#2c5875]"></div>

      <div className="p-6">
        <div className="flex flex-col mb-4">
          <div className="flex justify-between items-start mb-3">
            <span className="bg-[#e8eef2] text-[#1d3f51] text-xs font-bold px-2.5 py-1 rounded-md">
              {problem.fellowField}
            </span>
            <span className="bg-green-50 text-green-600 text-xs font-medium px-2.5 py-1 rounded-md">
              ${problem.payRange.min.toLocaleString()} - $
              {problem.payRange.max.toLocaleString()}
            </span>
          </div>

          <h3 className="text-lg font-bold text-gray-800 line-clamp-2 mb-2">
            {problem.description}
          </h3>
        </div>

        <div className="mb-4">
          <h4 className="text-xs uppercase font-semibold text-gray-500 tracking-wider mb-2">
            Required Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {problem.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-md"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-xs uppercase font-semibold text-gray-500 tracking-wider mb-2">
            Focus Areas
          </h4>
          <div className="flex flex-wrap gap-2">
            {problem.type.map((type, index) => (
              <span
                key={index}
                className="bg-[#e8eef2] text-[#1d3f51] text-xs font-medium px-2.5 py-1 rounded-md"
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ${
            isExpanded ? "max-h-96" : "max-h-0"
          }`}
        >
          <div className="border-t border-gray-100 pt-4 mb-4">
            <h4 className="text-xs uppercase font-semibold text-gray-500 tracking-wider mb-2">
              Candidate Qualifications
            </h4>
            <p className="text-gray-600 text-sm">
              {problem.candidatesQualification}
            </p>
          </div>

          {problem.niceToHaves && (
            <div className="border-t border-gray-100 pt-4 mb-4">
              <h4 className="text-xs uppercase font-semibold text-gray-500 tracking-wider mb-2">
                Nice to Have
              </h4>
              <p className="text-gray-600 text-sm">{problem.niceToHaves}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-3 mt-6">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#1d3f51] text-sm font-medium hover:text-[#2c5875] focus:outline-none"
          >
            {isExpanded ? "Show less" : "Show more details"}
          </button>

          <button className="w-full bg-[#1d3f51] hover:bg-[#2c5875] text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 shadow-sm">
            Apply for This Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProblemCard;
