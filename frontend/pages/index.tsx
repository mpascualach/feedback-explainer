import Image from "next/image";
import { Inter } from "next/font/google";
import React, { useEffect, useState, useRef } from "react";
import Header from "@/components/Header";
import Button from "@/components/Button";

const inter = Inter({ subsets: ["latin"] });

interface Message {
  role: string;
  content: string;
}

export default function Home() {
  const [topic, setTopic] = useState<string>("blockchain");

  const [loading, setLoading] = useState<boolean>(false);
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  const prompt = `Explain ${topic} in the simplest terms possible - as if for a beginner - and then send me a question to test my knowledge `;

  useEffect(() => {
    setMessages([]);
  }, []);

  const handleClick = async () => {
    setLoading(true);
    setTimeout(() => {}, 2000);
    try {
      const response = await fetch("/testResponse.json");
      const data = await response.json();
      const message = data.choices[0].message;
      message.content = message.content.replace(/\n/g, "<br />");

      const messagesArray = messages;
      messagesArray.push(message);
      setMessages(messagesArray);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching API:", error);
      setLoading(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Update the userInput state with the current input value
    setUserPrompt(event.target.value);
  };

  const handleTextareaResize = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const textarea = event.target;
    textarea.style.height = "auto"; // Reset the height to measure the actual scrollHeight
    textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to the actual scrollHeight
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const userMessage = {
      role: "user",
      content: userPrompt,
    };

    const messagesArray = messages;
    messagesArray.push(userMessage);
    setMessages(messagesArray);
  };

  // to add: dashboard

  return (
    <div>
      <Header></Header>
      <main
        className={`flex flex-col items-center justify-between p-12 ${inter.className}`}
        style={{ height: "90vh" }}
      >
        {!messages.length && !loading && (
          <Button topic="blockchain" onClick={handleClick}></Button>
        )}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="relative flex flex-col justify-between h-full">
            {messages.map((message, index) => (
              <div
                dangerouslySetInnerHTML={{ __html: message.content }}
                className="p-4 text-white text-xl w-full"
                key={index}
              />
            ))}
            {!messages.length ? (
              <></>
            ) : (
              <>
                <form className="w-full relative" onSubmit={handleSubmit}>
                  <textarea
                    rows={1}
                    id="user_prompt"
                    className="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={userPrompt}
                    onChange={handleInputChange}
                    onInput={handleTextareaResize}
                    style={{ maxWidth: "calc(100% - 120px)" }}
                  />
                  <button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    type="submit"
                  >
                    Submit
                  </button>
                </form>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
