import { NextApiRequest, NextApiResponse } from "next";
import { SuggestedProblem } from "@/api/problems";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // For now, return empty suggestions
    // In a real implementation, this would fetch from a database
    const suggestions: SuggestedProblem[] = [];
    
    return res.status(200).json({ 
      suggestions,
      status: "OK",
      message: "No suggested problems available" 
    });
  } catch (error) {
    console.error("Error fetching suggested problems:", error);
    return res.status(500).json({ 
      error: "Failed to fetch suggested problems",
      suggestions: [] 
    });
  }
} 