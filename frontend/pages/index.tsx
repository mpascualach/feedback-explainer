import React, { useEffect, useState, useRef } from "react";
import Header from "@/components/Header";
import CourseButton from "@/components/CourseButton";
import InputBox from "@/components/InputBox"; // Adjust the path accordingly

interface Message {
  role: string;
  content: string;
}

export default function Home() {
  const [topic, setTopic] = useState<string>("blockchain");

  const [loading, setLoading] = useState<boolean>(false);
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  const numOfQuestions = 3;
  // const prompt = `Explain ${topic} in the simplest terms possible - as if for a beginner.
  // Then send me ${numOfQuestions} question to test my knowledge.
  // Send me these questions one by one - wait until I've answered one before sending me the next one.
  // Once I've answered all ${numOfQuestions} of your questions correctly, end your next message with "Well done!".`;

  const prompt = `Could you describe ${topic} in terms that an intermediate learner might know about. Use at least three paragraphs.`;

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

  // useEffect(() => {
  //   console.log("Mesages changed to: ", messages);
  // }, [messages]);

  /* Button area stuff */

  const handleClick = async () => {
    setLoading(true); // set loading to true
    const firstPrompt = {
      // create first prompt prompt
      role: "user",
      content: prompt,
    };
    console.log("Initial prompt: ", firstPrompt);
    // setTimeout(() => {}, 2000);
    callApi([firstPrompt]); // pass it onto api call
  };

  /* core API call functionality */

  const callApi = async (messagesToSend: Message[]) => {
    console.log("Sending these messages: ", messagesToSend);
    setLoading(true);

    const response = await fetch("/api/feynman", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ messages: messagesToSend }),
    });

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

  /* Interaction zone */

  const requestSimplification = async () => {
    // send message to api with a prompt like: could you simplify this - for someone who's a beginner?
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
            <CourseButton
              topic="blockchain"
              onClick={handleClick}
            ></CourseButton>
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
            <button onClick={requestSimplification}>Simplify</button>
            <InputBox
              userPrompt={userPrompt}
              handleSubmit={handleSubmit}
              handleInputChange={handleInputChange}
              handleTextareaResize={handleTextareaResize}
            />
          </>
        )}
      </main>
    </div>
  );
}
