import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    // const payload = {
    //   prompt: req.body.imagePrompt,
    //   n: 4,
    //   size: "1024x1024",
    // };

    // const response = await fetch(
    //   "https://api.openai.com/v1/images/generations",
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    //     },
    //     method: "POST",
    //     body: JSON.stringify(payload),
    //   }
    // );

    const response = async () => {
      await openai.createImage({
        prompt: req.body.imagePrompt,
        n: 4,
        size: "512x512",
      });
    };

    const data = await response();
    return res.json(data);
  } catch (error) {
    console.log("The Error: ", error);
  }
}
