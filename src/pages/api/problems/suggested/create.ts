import { NextApiRequest, NextApiResponse } from "next";
import { SuggestedProblem } from "@/api/problems";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { suggestions } = req.body;

    if (!suggestions || !Array.isArray(suggestions)) {
      return res.status(400).json({ 
        error: "Invalid suggestions format",
        status: "ERROR",
        message: "Suggestions must be an array" 
      });
    }

    // Validate each suggestion has required fields
    const isValid = suggestions.every((suggestion: SuggestedProblem) => 
      suggestion.fellowField && 
      suggestion.type && Array.isArray(suggestion.type) &&
      suggestion.skills && Array.isArray(suggestion.skills) &&
      suggestion.description &&
      suggestion.candidatesQualification &&
      suggestion.payRange && 
      typeof suggestion.payRange.min === 'number' &&
      typeof suggestion.payRange.max === 'number'
    );

    if (!isValid) {
      return res.status(400).json({ 
        error: "Invalid suggestion data",
        status: "ERROR",
        message: "Each suggestion must have all required fields" 
      });
    }

    // In a real implementation, this would save to a database
    // For now, just return success
    console.log(`[SUGGESTED PROBLEMS] Received ${suggestions.length} suggestions to save`);
    
    return res.status(200).json({ 
      status: "CREATED",
      message: "Suggested problems saved successfully",
      suggestions: suggestions 
    });
  } catch (error) {
    console.error("Error saving suggested problems:", error);
    return res.status(500).json({ 
      error: "Failed to save suggested problems",
      status: "ERROR",
      message: "Internal server error" 
    });
  }
} 