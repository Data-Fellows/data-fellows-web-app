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
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages format" });
    }

    // System prompt for problem generation
    const systemPrompt = `You are an expert business consultant and job market analyst. Based on the conversation with the business owner, generate 3-5 specific job problems/opportunities that their business needs to solve.

Each problem should be:
1. Directly related to challenges or needs mentioned in the conversation
2. Specific and actionable
3. Suitable for hiring data science, analytics, or technical professionals
4. Include realistic salary ranges
5. Specify required skills and qualifications

Return the response in this JSON format:
{
  "problems": [
    {
      "title": "Problem title",
      "description": "Detailed description of the problem and what needs to be solved",
      "fellowField": "Data Science" | "Data Analytics" | "Business Intelligence" | "Machine Learning" | "Software Development",
      "type": ["Full-time", "Part-time", "Contract", "Freelance"],
      "skills": ["skill1", "skill2", "skill3"],
      "candidatesQualification": "Detailed qualification requirements",
      "niceToHaves": "Nice to have skills and experience",
      "payRange": {
        "min": 50000,
        "max": 80000
      }
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.filter((m: any) => m.role !== "system"), // Remove existing system messages
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0].message.content;
    let problems;

    try {
      problems = JSON.parse(content || "{}");
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      // Fallback response if JSON parsing fails
      problems = {
        problems: [
          {
            title: "Data Analytics Specialist",
            description:
              "Analyze business data to identify trends and opportunities for growth",
            fellowField: "Data Analytics",
            type: ["Full-time"],
            skills: ["Python", "SQL", "Excel", "Data Visualization"],
            candidatesQualification:
              "Bachelor's degree in relevant field with 2+ years experience",
            niceToHaves: "Experience with business intelligence tools",
            payRange: { min: 55000, max: 75000 },
          },
        ],
      };
    }

    return res.json(problems);
  } catch (error) {
    console.error("Error generating problems:", error);
    return res.status(500).json({ error: "Failed to generate problems" });
  }
}
