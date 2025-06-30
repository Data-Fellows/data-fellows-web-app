import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { text } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Invalid text provided" });
    }

    // Check if we have the required environment variables
    const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;
    const VOICE_ID = process.env.DEEPGRAM_VOICE_ID || "aura-asteria-en";

    if (!DEEPGRAM_API_KEY) {
      console.error("DEEPGRAM_API_KEY not configured");
      return res.status(500).json({ error: "TTS service not configured" });
    }

    console.log(`[DEEPGRAM] TTS request for ${text.length} characters`);

    const response = await fetch(
      `https://api.deepgram.com/v1/speak?voice=${VOICE_ID}`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${DEEPGRAM_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[DEEPGRAM] API error: ${response.status} - ${errorText}`);
      return res.status(500).json({ error: "TTS service error" });
    }

    const audioBuffer = await response.arrayBuffer();

    // Set appropriate headers for audio response
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Length", audioBuffer.byteLength.toString());
    res.setHeader("Cache-Control", "no-cache");

    // Send the audio data
    res.send(Buffer.from(audioBuffer));
  } catch (error) {
    console.error("Error in TTS API:", error);
    return res.status(500).json({ error: "Failed to generate audio" });
  }
}
