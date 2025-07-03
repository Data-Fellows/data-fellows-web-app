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

    // Log the incoming messages for debugging
    console.log("\n======= [STRUCTURE] INCOMING CONVERSATION MESSAGES =======");
    messages.forEach((msg: any, i: number) => {
      console.log(`[${i}] ROLE: ${msg.role}`);
      console.log(`CONTENT: ${JSON.stringify(msg.content)}`);
      console.log("---");
    });
    console.log("=============================================\n");

    // Filter out system messages from the conversation history
    const filteredMessages = messages.filter(
      (msg: any) => msg.role === "user" || msg.role === "assistant"
    );
    console.log(
      `[STRUCTURE] Filtered out ${
        messages.length - filteredMessages.length
      } system messages`
    );

    // If problems are not provided, generate them using the same logic as the main suggestion endpoint
    let problemsToUse = generatedProblems;
    if (!problemsToUse) {
      console.log("[STRUCTURE] No problems provided, using empty array...");
      problemsToUse = [];
    }

    // System prompt for structured extraction with dynamic approach
    const extractionPrompt = {
      role: "system" as const,
      content: `
          <system_prompt>
      <context>
        You are an expert data-consulting recruiter.  
        You have access to both the full conversation history (<history/>) and the model-generated problem suggestions (<suggestions/>).
      </context>

      <task>
        From those two sources extract and compile, in JSON, three groups of information:
        1. A mapping of each relevant <category> to the specific problem descriptions that fit it.  
        2. A business-data summary containing:  
          • collectBusinessData (boolean)  
          • businessData (array)  
          • dataAnalysisTools (array)  
          • challengesFaced (array, ≤ 5 words each)  
          • expectedOutcome (array, ≤ 5 words each)  
        3. A comprehensive list (≥ 5 items) of distinct skill names.
      </task>

      <schema>
        <![CDATA[
        {
          "categories": {
            "<CategoryName>": ["problem description 1", "..."],
            "...": ["..."]
          },
          "collectBusinessData": true | false,
          "businessData": ["Sales", "Customer", "..."],
          "dataAnalysisTools": ["Tool1", "..."],
          "challengesFaced": ["≤5 words", "..."],
          "expectedOutcome": ["≤5 words", "..."],
          "skillNames": ["Skill1", "Skill2", "Skill3", "Skill4", "Skill5", "..."]
        }
        ]]>
      </schema>

      <constraints>
        <json_only>true</json_only>
        <min_skills>5</min_skills>
        <max_phrase_words>5</max_phrase_words>
        <missing_value_rule>use [] for arrays or null for scalars if no data</missing_value_rule>
        <no_extraneous_text>true</no_extraneous_text>
      </constraints>

      <validation>
        Internally confirm before replying that:  
        1️⃣ The output parses as JSON.  
        2️⃣ All keys from the schema are present and correctly named.  
        3️⃣ Arrays contain strings; booleans are true/false.  
        4️⃣ Each "short phrase" field has ≤ 5 words.  
        5️⃣ There are at least 5 distinct skills.
      </validation>

      <output>
        Return **only** the JSON object (no XML, markdown, commentary, or code-fences).
      </output>
    </system_prompt>
      
      `,
    };

    // Compose messages for extraction
    const extractionMessages = [
      extractionPrompt,
      {
        role: "user" as const,
        content: `Conversation history: ${JSON.stringify(
          filteredMessages,
          null,
          2
        )}\n\nGenerated problems: ${JSON.stringify(problemsToUse, null, 2)}`,
      },
    ];

    console.log("[STRUCTURE] Sending extraction request to OpenAI...");
    // Call OpenAI for extraction
    const extractionResponse = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: extractionMessages,
      temperature: 0.3,
      max_tokens: 2000,
    });

    let structuredResult = null;
    try {
      const content = extractionResponse.choices[0].message.content || "";
      console.log("[STRUCTURE] Raw extraction response:", content);
      const jsonMatch = content.match(/{[\s\S]*}/);
      if (jsonMatch) {
        structuredResult = JSON.parse(jsonMatch[0]);
      } else {
        structuredResult = JSON.parse(content);
      }
      console.log(
        "Structured Extraction Result:",
        JSON.stringify(structuredResult, null, 2)
      );
    } catch (error) {
      console.error("[STRUCTURE] Error parsing structured extraction:", error);
      return res.status(500).json({ 
        error: "Failed to parse structured extraction" 
      });
    }

    return res.json({ structuredResult });
  } catch (error) {
    console.error("[STRUCTURE] General error:", error);
    return res.status(500).json({ 
      error: "Error processing your request" 
    });
  }
}
