import React, { useEffect, useState, useRef } from "react";

import Header from "@/components/Header";
import CourseButton from "@/components/CourseButton";
import InputBox from "@/components/InputBox";

import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import { contractAddress } from "../constants/ethConstants";

import { Configuration, OpenAIApi } from "openai";

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

  const [simplificationPossible, setSimplificationPossiblity] =
    useState<boolean>(true);
  const [tutorial, setTutorial] = useState<boolean>();
  const [summaryStarted, startSummary] = useState<boolean>();

  const [certificationReady, setCertificationReady] = useState<boolean>();
  const [certificationStarted, setCertificationStarted] = useState<boolean>();

  const [testing, setTesting] = useState<boolean>();
  const [points, setPoints] = useState<number>(0);

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

  /* Certification time */
  const prepareCertificate = async () => {
    setLoading(true);
    const imagePrompt = `A cute image representing ${topic}`;
    const apiUrl = `https://api.openai.com/v1/images/generations`;

    const requestOptions = {
      method: "POST",
      headers: {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      },
      body: JSON.stringify({ prompt: imagePrompt }),
    };

    fetch(apiUrl, requestOptions as any)
      .then((response) => response.json())
      .then((data) => {
        console.log("Data: ", data);
      });
    // console.log("REs: ", res);
  };

  const generateCertification = async () => {
    const abi = [
      "function mintCertification(string memory title,string memory description,string memory imageURI,string memory issuer) external",
    ];

    const web3Modal = new Web3Modal({
      cacheProvider: true,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
        },
      },
    });
    const instance = await web3Modal.connect();
    const provider = new ethers.BrowserProvider(instance);
    const signer = await provider.getSigner();
    const smartContract = new ethers.Contract(contractAddress, abi, provider);
    const contractWithSigner: ethers.BaseContract =
      smartContract.connect(signer);

    const title = `Certification of ${topic} complete`;
    const description = `This is to certify that ${topic} has been understood to such a point where ${signer.address} is no longer a beginner.`;
    const imageURI = "Test";
    const issuer = "Feynman";

    const tx = await (contractWithSigner as any).mintCertification(
      title,
      description,
      imageURI,
      issuer
    );

    await tx.wait();
  };

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

    const response = await fetch("/api/feynman-chat", {
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

  /* Pre-test zone */

  const startTutorial = async (topic: string) => {
    prepareCertificate();
    // setTutorial(true);
    // const tutorialRequest = `Could you summarise the concept of ${topic} for me? This will be in the context of blockchain-based technology. If at any point I summarise it correctly, please start your messae with 'Yes, that's correct!'`;
    // const tutorialMessage = {
    //   role: "user",
    //   content: tutorialRequest,
    // };
    // callApi([tutorialMessage]);
  };

  const requestSimplification = async () => {
    const simplificationRequest = `Ok! Could you simplify this?`;
    const simplificationMessage = {
      role: "user",
      content: simplificationRequest,
    };

    const updatedMessages = [...messages, simplificationMessage];
    setMessages(updatedMessages);
    setUserPrompt("");
    callApi(updatedMessages);

    setSimplificationPossiblity(false);
  };

  const prepareSummary = async () => {
    // enable input box
  };

  const submitSummary = async () => {
    // send message to api with a prompt like: so is it like?
  };

  const startTest = async (topic: string) => {
    // hide buttons or tutorial
    // const testRequest = `Ok! Send me ${numOfQuestions} questions to test my knowledge. Each time I get a question right, add '+1' at the end of your message.`;
    // const testMessage = {
    //   role: "user",
    //   content: testRequest,
    // };
    // const updatedMessages = [...messages, testMessage];
    // setMessages(updatedMessages);
    // setUserPrompt("");
    // callApi(updatedMessages);
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

  return (
    <div>
      <Header></Header>
      <main
        className={`flex flex-col items-center justify-between p-12`}
        style={{ height: "90vh" }}
      >
        {/* courses zone */}
        {!messages.length && !loading && (
          <div className="w-full text-center flex flex-col items-center">
            <h1 style={{ fontSize: "2rem" }}>
              Hello learner! What would you like to test yourself on?
            </h1>
            <div className="w-4/5">
              {topics.map((topic, index) => (
                <CourseButton
                  topic={topic}
                  onTutorialSelect={() => startTutorial(topic)}
                  onTestSelect={() => startTest(topic)}
                  key={index}
                ></CourseButton>
              ))}
            </div>
          </div>
        )}
        {/* maybe ensure that not all categories can be toggled at once? */}

        {/* tutorial zone */}

        {tutorial && (
          <div className="relative h-full">
            {!certificationStarted ? (
              <div
                className="relative flex flex-col justify-between overflow-scroll"
                style={{ height: "90%" }}
              >
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className="rounded mt-3 mb-3"
                    style={{
                      backgroundColor:
                        message.role === "assistant" ? "#2e2c2c" : "inherit",
                    }}
                  >
                    <div
                      dangerouslySetInnerHTML={{ __html: message.content }}
                      className={`p-4 text-white text-xl w-full h-auto pt-8 pb-8`}
                    />{" "}
                  </div>
                ))}
                {loading ? <p>Loading...</p> : <></>}
              </div>
            ) : (
              <div>
                <h1>Here's your certificate</h1>
              </div>
            )}
            {!summaryStarted ? (
              <div className="flex relative w-6/12 text-xl justify-center">
                {simplificationPossible ? (
                  <button
                    onClick={requestSimplification}
                    className="ml-4 mr-4 px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    Simplify
                  </button>
                ) : (
                  <></>
                  // <button
                  //   onClick={prepareSummary}
                  //   className="ml-4 mr-4 px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  // >
                  //   Summarise
                  // </button>
                )}

                <button
                  onClick={() => startTest}
                  className="ml-3 mr-3 px-4 py-2 bg-yellow-700 hover:bg-yellow-900 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  Test Yourself
                </button>
              </div>
            ) : (
              <InputBox
                userPrompt={userPrompt}
                handleSubmit={submitSummary}
                handleInputChange={handleInputChange}
                handleTextareaResize={handleTextareaResize}
              />
            )}
          </div>
        )}

        {/* chain of messages */}
        {testing && (
          <>
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
              {loading ? <p>Loading...</p> : <></>}
            </div>
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
