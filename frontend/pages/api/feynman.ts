// Import necessary types from Next.js
import type { NextApiRequest, NextApiResponse } from "next";

// // Check if required environment variable is set
// if (!process.env.OPEN_AI_API_KEY) {
//   console.log("Nope no API key");
//   throw new Error("Missing env var from OpenAI");
// } else {
//   console.log("OpenAI API Key is set");
// }

// // Define ChatGPTAgent type as a union of user and system
// type ChatGPTAgent = "user" | "system";

// Define ChatGPTMessage interface
interface ChatGPTMessage {
  role: "user" | "assistant";
  content: string;
}

// Define promptPayload interface
interface promptPayload {
  model: string;
  messages: ChatGPTMessage[];
  temperature: number;
  max_tokens: number;
}

// Define async handler function
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const payload: promptPayload = {
      model: "gpt-4",
      messages: req.body.messages, // build out these messages
      temperature: 1,
      max_tokens: 500,
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
      },
      method: "POST",
      body: JSON.stringify(payload),
    });

    // Parse response JSON and send it back in the response
    const data = await response.json();
    return res.json(data);
  } catch (error) {
    console.log("The Error: ", error);
  }
}
