import { Inter } from "next/font/google";
import React, { useEffect, useState, useRef } from "react";
import Header from "@/components/Header";
import Button from "@/components/Button";

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
    console.log("Resetting messages");
    setMessages([]);
  }, []);

  useEffect(() => {
    const handleEnterKey = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSubmit(event);
      }
    };

    document.addEventListener("keydown", handleEnterKey);

    return () => {
      document.removeEventListener("keydown", handleEnterKey);
    };
  });

  const handleClick = async () => {
    setLoading(true);
    const firstPrompt = {
      role: "user",
      content: prompt,
    };
    // setTimeout(() => {}, 2000);
    try {
      // const response = await fetch("/testResponse.json");
      const response = await fetch("/api/feynman", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ messages: [firstPrompt] }),
      });

      const data = await response.json();
      const assistantMessage = data.choices[0].message;
      assistantMessage.content = assistantMessage.content.replace(
        /\n/g,
        "<br />"
      );

      setMessages((prevMessages) => [...prevMessages, assistantMessage]);

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

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement> | KeyboardEvent
  ) => {
    event.preventDefault();

    if (userPrompt.trim() !== "") {
      const userMessage = {
        role: "user",
        content: userPrompt,
      };

      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setUserPrompt("");
      callApi();
    } else {
      console.log("Please enter something before submitting");
    }
  };

  const callApi = async () => {
    setLoading(true);
    const response = await fetch("/testResponse2.json");
    console.log("Response: ", response);
    const data = await response.json();
    const assistantMessage = data.choices[0].message;
    assistantMessage.content = assistantMessage.content.replace(
      /\n/g,
      "<br />"
    );

    setMessages((prevMessages) => [...prevMessages, assistantMessage]);

    setLoading(false);
  };

  return (
    <div>
      <Header></Header>
      <main
        className={`flex flex-col items-center justify-between p-12`}
        style={{ height: "90vh" }}
      >
        {!messages.length && !loading && (
          <Button topic="blockchain" onClick={handleClick}></Button>
        )}
        <div className="relative flex flex-col justify-between overflow-scroll">
          {messages.map((message, index) => (
            <div
              dangerouslySetInnerHTML={{ __html: message.content }}
              className={`p-4 text-white text-xl w-full h-auto ${
                index > 0 ? "border-t border-gray-300" : ""
              }`}
              key={index}
            />
          ))}
        </div>
        {loading ? <p>Loading...</p> : <></>}
        {!messages.length ? (
          <></>
        ) : (
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
        )}
      </main>
    </div>
  );
}
