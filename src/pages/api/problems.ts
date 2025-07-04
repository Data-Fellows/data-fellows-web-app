import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";

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

    // Log the incoming messages for debugging
    console.log("\n======= INCOMING CONVERSATION MESSAGES =======");
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
      `Filtered out ${messages.length - filteredMessages.length} system messages`
    );

    // Create a system prompt that instructs GPT to generate problem suggestions
    const systemPrompt = {
      role: "system" as const,
      content: `<system_prompt>
  <context>
    The assistant is a senior data-consulting recruiter.  
    It has access to the full conversation history and will draft problem statements that reflect the business challenges discussed so far.
  </context>

  <task>
    Produce exactly <count>3</count> distinct data-consulting problem statements / job descriptions.
  </task>

  <schema>
    <![CDATA[
    {
      "_id": "uuid-v4",
      "fellowField": "string",
      "type": ["string", "..."],
      "skills": ["string", "..."],
      "description": "string",
      "candidatesQualification": "string",
      "niceToHaves": "string",
      "payRange": { "min": int, "max": int }
    }
    ]]>
  </schema>

  <constraints>
    <json_only>true</json_only>
    <pay_min>100</pay_min>
    <pay_max>1000</pay_max>
    <!-- ensure 0 < max-min ≤ 300 -->
    <spread_limit>300</spread_limit>
    <array_length>3</array_length>
    <no_extraneous_text>true</no_extraneous_text>
  </constraints>

  <validation>
    Before finalising, internally verify that:
    1️⃣ The output parses as JSON.  
    2️⃣ There are 3 elements.  
    3️⃣ Each payRange obeys 100 ≤ min < max ≤ 1000 and (max-min) ≤ 300.  
    4️⃣ No keys are missing or renamed.
  </validation>

  <output>
    Return ONLY the JSON array (no XML, markdown, commentary, or code-fences).
  </output>
</system_prompt>`,
    };

    const combinedMessages = [systemPrompt, ...filteredMessages];
    console.log(
      "======= FULL MESSAGES SENT TO API (including system prompt) ======="
    );
    console.log(`Total messages: ${combinedMessages.length}`);
    console.log("SYSTEM PROMPT:");
    console.log(JSON.stringify(combinedMessages[0].content, null, 2));
    console.log("\nALL MESSAGES:");
    console.log(JSON.stringify(combinedMessages, null, 2));
    console.log(
      "==================================================================\n"
    );

    async function generateAndParse(
      attemptLabel: string
    ): Promise<any[] | null> {
      try {
        console.log(`\n[${attemptLabel}] Sending request to OpenAI...`);
        const response = await openai.chat.completions.create({
          model: "gpt-4-turbo-preview",
          messages: combinedMessages,
          temperature: 0.3,
          max_tokens: 2000,
        });
        const content = response.choices[0].message.content || "";
        console.log(`\n[${attemptLabel}] Raw OpenAI response:`, content);
        const cleanedContent = content
          .replace(/^(?:```json|```)\s*([\s\S]*?)\s*(?:```)?$/g, "$1")
          .trim();
        console.log(`\n[${attemptLabel}] Cleaned content:`, cleanedContent);
        let parsedContent;
        try {
          parsedContent = JSON.parse(cleanedContent);
          return Array.isArray(parsedContent) ? parsedContent : [parsedContent];
        } catch (err) {
          console.error(`[${attemptLabel}] JSON.parse failed:`, err);
          const jsonArrayMatch = cleanedContent.match(/\[\s*\{[\s\S]*\}\s*\]/);
          if (jsonArrayMatch) {
            try {
              return JSON.parse(jsonArrayMatch[0]);
            } catch (err2) {
              console.error(
                `[${attemptLabel}] JSON.parse (regex array) failed:`,
                err2
              );
            }
          }
          const jsonObjectMatches = Array.from(
            cleanedContent.matchAll(/\{[\s\S]*?\}/g)
          );
          if (jsonObjectMatches.length > 0) {
            const objects = jsonObjectMatches
              .map((match) => {
                try {
                  return JSON.parse(match[0]);
                } catch (err3) {
                  console.error(
                    `[${attemptLabel}] JSON.parse (object) failed:`,
                    err3,
                    match[0]
                  );
                  return null;
                }
              })
              .filter(Boolean);
            if (objects.length > 0) return objects;
          }
        }
        return null;
      } catch (err) {
        console.error(`[${attemptLabel}] OpenAI call failed:`, err);
        return null;
      }
    }

    // First attempt
    let problems = await generateAndParse("First attempt");
    if (!problems || problems.length === 0) {
      // Second attempt: regenerate
      problems = await generateAndParse("Second attempt");
      if (!problems || problems.length === 0) {
        return res.status(500).json({ 
          error: "Failed to generate valid problems after two attempts" 
        });
      }
    }

    // Ensure each problem has an ID
    problems = problems.map((problem) => ({
      ...problem,
      _id: problem._id || uuidv4(),
    }));

    return res.json({ problems });
  } catch (error) {
    console.error("Error generating problems:", error);
    return res.status(500).json({ error: "Failed to generate problems" });
  }
}
