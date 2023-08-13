import React, { useEffect, useState, useRef } from "react";

import Head from "next/head";

import Header from "@/components/Header";
import CourseButton from "@/components/CourseButton";
import InputBox from "@/components/InputBox";

import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import { contractAddress } from "../constants/ethConstants";

import { Configuration, OpenAIApi } from "openai";
require("dotenv").config();

interface Message {
  role: string;
  content: string;
}

export default function Home() {
  const [topic, setTopic] = useState<string>("blockchain");

  const [loading, setLoading] = useState<boolean>(false);
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  const topics = ["blockchain", "decentralisation", "oracles", "ERC1155"];
  const numOfQuestions = 3;

  const [coursesEnabled, setCoursesEnabled] = useState<boolean>(true);

  const [simplificationPossible, setSimplificationPossiblity] =
    useState<boolean>(true);
  const [tutorial, setTutorial] = useState<boolean>();
  const [summaryStarted, startSummary] = useState<boolean>();

  const [certificationReady, setCertificationReady] = useState<boolean>();
  const [certificationStarted, setCertificationStarted] = useState<boolean>();

  const [certificationUrls, setCertificationUrls] = useState<string[]>([]);
  const [certificationUrl, setCertificationUrl] = useState<string>();

  const [mintingStarted, setMintingStarted] = useState<boolean>();
  const [certificationMinted, setCertificationMinted] = useState<boolean>();

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

  useEffect(() => {
    console.log(certificationUrls);
    console.log(certificationUrl);
  }, [certificationUrls]);

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

    if (
      (summaryStarted && assistantMessage.content.includes("Yes")) ||
      assistantMessage.content.includes("Exactly")
    ) {
      setCertificationReady(true);
    }

    await setMessages((prevMessages) => {
      return [...prevMessages, assistantMessage];
    });

    setLoading(false);
  };

  /* Tutorial zone */

  const startTutorial = async (topic: string) => {
    setTopic(topic);
    setCoursesEnabled(false);
    setTutorial(true);
    const tutorialRequest = `Could you summarise the concept of ${topic} for me? This will be in the context of blockchain-based technology. If at any point I summarise it correctly, please start your messae with 'Yes, that's correct!'`;
    const tutorialMessage = {
      role: "user",
      content: tutorialRequest,
    };
    callApi([tutorialMessage]);
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
    startSummary(true);
  };

  const submitSummary = async (
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
    }
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

  /* Certification time */
  const prepareCertificate = async () => {
    setCertificationStarted(true);
    setTutorial(false);
    setTesting(false);
    // yeah I should probably work with a string-based selector rather than a set of boolean ones...

    setLoading(true);
    const imagePrompt = `A cute image representing ${topic}`;
    const apiUrl = `https://api.openai.com/v1/images/generations`;

    const response = await fetch("/api/feynman-certification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ prompt: imagePrompt }),
    });

    const data = await response.json();
    console.log("Data: ", data);
    setCertificationUrls(data.data);
    setCertificationUrl(data.data[0]);
    // setCertificationUrl(
    //   "https://oaidalleapiprodscus.blob.core.windows.net/private/org-1B7Wa8qKPRWXkwJBymJ4H8nG/user-kh7tYZ7RpQuhlrwhKG95bcYG/img-3LLDmm1l7XxFWaQG1XMm6oiG.png?st=2023-08-13T08%3A28%3A19Z&se=2023-08-13T10%3A28%3A19Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-08-12T17%3A22%3A40Z&ske=2023-08-13T17%3A22%3A40Z&sks=b&skv=2021-08-06&sig=2h9ZpfAx7WadIgV7lJOgk3llx2JOU4HSN5%2B453vI9mg%3D"
    // );

    // fetch(apiUrl, requestOptions as any)
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log("Data: ", data);
    //   });
    // console.log("REs: ", res);
  };

  const mintCertification = async () => {
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

    // very hacky solution that I will address soon
    const tx = await (contractWithSigner as any).mintCertification(
      title,
      description,
      imageURI,
      issuer
    );

    await tx.wait();
    console.log("Certification minted");
    postMintingProcess();
  };

  const postMintingProcess = async () => {
    // reset everything
    setMessages([]);
    setCertificationMinted(true);
    setCertificationStarted(false);
    setCoursesEnabled(true);
    setUserPrompt("");

    setTimeout(() => {
      setCertificationMinted(false);
    }, 3000);
  };

  return (
    <div>
      <Head>
        <title>Feynman</title>
      </Head>
      <Header></Header>
      <main
        className={`flex flex-col items-center justify-between p-12`}
        style={{ height: "90vh" }}
      >
        {certificationMinted && (
          <div
            className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3 absolute"
            role="alert"
          >
            <p className="font-bold">Congratulations!</p>
            <p className="text-sm">
              Check your wallet to see your certification.
            </p>
          </div>
        )}

        {/* <div
          className="bg-red-100 border-t border-b border-red-500 text-red-700 px-4 py-3 absolute"
          role="alert"
        >
          <p className="font-bold">Informational message</p>
          <p className="text-sm">
            Some additional text to explain said message.
          </p>
        </div> */}

        {/* courses zone */}
        {coursesEnabled && (
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
            {!summaryStarted ? (
              <div className="flex relative text-xl justify-center">
                {simplificationPossible && (
                  <button
                    onClick={requestSimplification}
                    className="ml-4 mr-4 px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    Simplify
                  </button>
                )}

                <button
                  onClick={prepareSummary}
                  className="ml-3 mr-3 px-4 py-2 bg-yellow-700 hover:bg-yellow-900 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  Test Yourself
                </button>
              </div>
            ) : (
              <form className="flex justify-center">
                {!certificationReady ? (
                  <InputBox
                    userPrompt={userPrompt}
                    handleSubmit={submitSummary}
                    handleInputChange={handleInputChange}
                    handleTextareaResize={handleTextareaResize}
                  />
                ) : (
                  <button
                    onClick={prepareCertificate}
                    className="ml-4 mr-4 px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    Prepare Certificate
                  </button>
                )}
              </form>
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

        {certificationStarted && (
          <>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div
                className="bg-cover rounded w-9/12 h-3/4 flex justify-center items-center cursor-pointer"
                style={{
                  background: certificationUrl
                    ? `url(${certificationUrl})`
                    : `url('/testImg.png')`,
                  backgroundSize: "cover",
                }}
                onClick={mintCertification}
              >
                <div
                  className="bg-gray-800 p-5 rounded flex flex-col items-center text-xl"
                  style={{ height: "fit-content" }}
                >
                  <span className="capitalize">
                    {" "}
                    {topic} Certification of Understanding
                  </span>
                  <br></br>
                  <span>Click to mint</span>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
