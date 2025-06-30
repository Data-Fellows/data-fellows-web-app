import { NextApiRequest, NextApiResponse } from "next";

// In-memory storage for now (in production, use a database)
const conversationStore = new Map<string, any>();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    console.log("POST /api/bizpilot/conversations called");

    try {
      // For API routes, we'll need to verify authentication differently
      // Since getUser() works client-side, we'll use a different approach
      const userId = req.body.userId || "demo-user"; // TODO: Implement proper auth

      console.log("Saving conversation for user:", userId);

      const { messages, context } = req.body;
      console.log(
        "Saving conversation with context:",
        context,
        "messages count:",
        messages?.length
      );

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages format" });
      }

      // Store conversation with timestamp
      const conversationData = {
        userId: userId,
        messages,
        context: context || "onboarding", // "onboarding" or "dashboard"
        timestamp: new Date().toISOString(),
      };

      // Store by userId (in production, use proper database)
      conversationStore.set(userId, conversationData);
      console.log("Conversation stored for user:", userId);
      console.log("Current store size:", conversationStore.size);

      return res.json({
        success: true,
        message: "Conversation saved successfully",
      });
    } catch (error) {
      console.error("Error saving conversation:", error);
      return res.status(500).json({ error: "Failed to save conversation" });
    }
  } else if (req.method === "GET") {
    console.log("GET /api/bizpilot/conversations called");

    try {
      // For API routes, we'll need to verify authentication differently
      const userId = (req.query.userId as string) || "demo-user"; // TODO: Implement proper auth

      console.log("Retrieving conversation for user:", userId);

      // Retrieve conversation from store
      const conversation = conversationStore.get(userId);
      console.log(
        "Retrieved conversation for user:",
        userId,
        "found:",
        !!conversation
      );
      console.log("Current store size:", conversationStore.size);
      console.log("Store keys:", Array.from(conversationStore.keys()));

      if (!conversation) {
        return res.json({
          success: true,
          conversation: null,
          message: "No previous conversation found",
        });
      }

      console.log(
        "Returning conversation with",
        conversation.messages.length,
        "messages"
      );
      return res.json({
        success: true,
        conversation,
      });
    } catch (error) {
      console.error("Error retrieving conversation:", error);
      return res.status(500).json({ error: "Failed to retrieve conversation" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
