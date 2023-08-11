import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const payload = {
        "prompt": "a cute icon representing blockchain",
        "n": 1,
        "size": "1024x1024" 
    }

    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        method: "POST",
        body: JSON.stringify(payload);
      }
    );
  } catch (error) {
    console.log("The Error: ", error);
  }
}
