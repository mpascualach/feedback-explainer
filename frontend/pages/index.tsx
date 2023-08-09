import React, { useEffect, useState, useRef } from "react";
import Header from "@/components/Header";
import CourseButton from "@/components/CourseButton";
import InputBox from "@/components/InputBox"; // Adjust the path accordingly
import { call } from "viem/actions";

interface Message {
  role: string;
  content: string;
}

export default function Home() {
  const [topic, setTopic] = useState<string>("blockchain");

  const [loading, setLoading] = useState<boolean>(false);
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  const topics = ["blockchain", "decentralisation", "oracles"];

  const numOfQuestions = 3;
  // const prompt = `Explain ${topic} in the simplest terms possible - as if for a beginner.
  // Then send me ${numOfQuestions} question to test my knowledge.
  // Send me these questions one by one - wait until I've answered one before sending me the next one.
  // Once I've answered all ${numOfQuestions} of your questions correctly, end your next message with "Well done!".`;

  const prompt = `Could you describe ${topic} in terms that an intermediate learner might know about. Use one paragraph for now.`;
  const [testing, setTesting] = useState<boolean>();

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

  /* Button area stuff */

  const handleClick = async (topic: string) => {
    setLoading(true); // set loading to true

    const initialPrompt = `Could you describe ${topic} in terms that an intermediate learner might know about. Use one paragraph for now.`;
    const firstPromptMessage = {
      // create first prompt prompt
      role: "user",
      content: initialPrompt,
    };

    console.log("Initial prompt: ", firstPromptMessage);
    callApi([firstPromptMessage]); // pass it onto api call
  };

  /* core API call functionality */

  const callApi = async (messagesToSend: Message[]) => {
    console.log("Sending these messages: ", messagesToSend);
    setLoading(true);

    // const response = await fetch("/api/feynman-chat", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Access-Control-Allow-Origin": "*",
    //   },
    //   body: JSON.stringify({ messages: messagesToSend }),
    // });

    const response = await fetch(`/topics/${topic}/initialDefinition.json`);

    // const response = await fetch("/testResponse.json");

    const data = await response.json();
    const assistantMessage = data.choices[0].message;
    assistantMessage.content = assistantMessage.content.replace(
      /\n/g,
      "<br />"
    );

    await setMessages((prevMessages) => {
      return [...prevMessages, assistantMessage];
    });

    setLoading(false);
  };

  /* Pre-test zone */

  const requestSimplification = async () => {
    // send message to api with a prompt like: could you simplify this - for someone who's a beginner?
    const simplificationRequest = `Ok! Could you simplify this - in terms a beginner would understand?`;
    const simplificationMessage = {
      role: "user",
      content: simplificationRequest,
    };

    const updatedMessages = [...messages, simplificationMessage];
    setMessages(updatedMessages);
    setUserPrompt("");
  };

  const startTest = async () => {
    const testRequest = `Ok! Send me ${numOfQuestions} questions to test my knowledge.`;
    const testMessage = {
      role: "user",
      content: testRequest,
    };

    const updatedMessages = [...messages, testMessage];
    setMessages(updatedMessages);
    setUserPrompt("");
    callApi(updatedMessages);
  };

  /* Test zone */

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

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement> | KeyboardEvent
  ) => {
    event.preventDefault();

    if (userPrompt.trim() !== "") {
      const userMessage = {
        // craft user message
        role: "user",
        content: userPrompt,
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setUserPrompt("");
      callApi(updatedMessages);
    } else {
      console.log("Please enter something before submitting");
    }
  };

  /* Certification time */

  const generateCertification = async () => {
    // probably will take the form of a dall-e generated icon?
  };

  return (
    <div>
      <Header></Header>
      <main
        className={`flex flex-col items-center justify-between p-12`}
        style={{ height: "90vh" }}
      >
        {/* courses zone */}
        {!messages.length && !loading && (
          <>
            <h1>Hello learner! What would you like to learn today?</h1>
            <div>
              {topics.map((topic) => (
                <CourseButton
                  topic={topic}
                  onClick={() => handleClick(topic)}
                ></CourseButton>
              ))}
            </div>
          </>
        )}

        {/* chain of messages */}
        <div className="relative flex flex-col justify-between overflow-scroll">
          {messages.map((message, index) => (
            <div key={index}>
              <div
                dangerouslySetInnerHTML={{ __html: message.content }}
                className={`p-4 text-white text-xl w-full h-auto`}
              />
              <hr className="mt-10 mb-10"></hr>
            </div>
          ))}
        </div>
        {loading ? <p>Loading...</p> : <></>}

        {/* input box */}
        {!messages.length ? (
          <></>
        ) : (
          <>
            {testing ? (
              <InputBox
                userPrompt={userPrompt}
                handleSubmit={handleSubmit}
                handleInputChange={handleInputChange}
                handleTextareaResize={handleTextareaResize}
              />
            ) : (
              <div className="flex relative w-6/12 justify-around text-xl">
                <button
                  onClick={requestSimplification}
                  className=" right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  Simplify
                </button>
                <button
                  onClick={startTest}
                  className=" right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  Test yourself
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
