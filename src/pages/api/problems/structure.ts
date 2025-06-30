import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { messages, generatedProblems } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages format" });
    }

    // System prompt for structured data extraction
    const systemPrompt = `You are an expert business analyst. Based on the conversation and generated problems, extract structured information about the employer/business to update their profile.

Extract the following information if mentioned in the conversation:
- Company industry/sector
- Company size (number of employees)
- Current tools and technologies they use
- Main business challenges
- Goals and objectives
- Budget considerations
- Timeline preferences
- Preferred work arrangements (remote, hybrid, onsite)

Return the response in this JSON format:
{
  "structuredResult": {
    "industry": "string or null",
    "companySize": "string or null", 
    "currentTools": ["tool1", "tool2"] or [],
    "mainChallenges": ["challenge1", "challenge2"] or [],
    "businessGoals": ["goal1", "goal2"] or [],
    "budgetRange": "string or null",
    "timeline": "string or null",
    "workPreferences": ["remote", "hybrid", "onsite"] or [],
    "additionalNotes": "string or null"
  }
}`;

    const conversationText = messages
      .filter((m: any) => m.role === "user" || m.role === "assistant")
      .map((m: any) => `${m.role}: ${m.content}`)
      .join("\n");

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Conversation:\n${conversationText}\n\nGenerated Problems:\n${JSON.stringify(
            generatedProblems,
            null,
            2
          )}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 1500,
    });

    const content = response.choices[0].message.content;
    let structuredData;

    try {
      structuredData = JSON.parse(content || "{}");
    } catch (parseError) {
      console.error("Error parsing structure extraction response:", parseError);
      // Fallback response if JSON parsing fails
      structuredData = {
        structuredResult: {
          industry: null,
          companySize: null,
          currentTools: [],
          mainChallenges: [],
          businessGoals: [],
          budgetRange: null,
          timeline: null,
          workPreferences: [],
          additionalNotes: "Data extraction failed, manual review required",
        },
      };
    }

    return res.json(structuredData);
  } catch (error) {
    console.error("Error extracting structure:", error);
    return res.status(500).json({ error: "Failed to extract structure" });
  }
}
