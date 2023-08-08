import Image from "next/image";
import { Inter } from "next/font/google";
import React, { useState } from "react";
import Header from "@/components/Header";
import Button from "@/components/Button";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [topic, setTopic] = useState<string>("blockchain");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const prompt = `Explain ${topic} in the simplest terms possible - as if for a beginner - and then send me a question to test my knowledge `;

  const handlePrompt = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined
  ) => {};

  // to add: dashboard

  return (
    <div>
      <Header></Header>
      <main
        className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
      >
        <Button topic="blockchain" endpoint="/api/feynman"></Button>
      </main>
    </div>
  );
}
