// components/TailwindButton.tsx
import React, { useState, useEffect } from "react";

interface ButtonProps {
  topic: string;
  onTutorialSelect: (topic: string) => void;
  onTestSelect: (topic: string) => void;
}

const CourseButton: React.FC<ButtonProps> = ({
  topic,
  onTutorialSelect,
  onTestSelect,
}) => {
  const [toggle, setToggle] = useState<boolean>();

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      setToggle(false);
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return (
    <div className="flex-grow-0 flex-shrink mt-10 mb-10 flex justify-center">
      <button
        onClick={() => setToggle(!toggle)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg capitalize p-4 pl-6 pr-6 w-40 text-center ml-3 mr-3"
      >
        {topic}
      </button>
      {toggle && (
        <>
          <button
            onClick={() => onTutorialSelect(topic)}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg capitalize p-4 pl-6 pr-6 w-40 ml-3 mr-3 text-center"
          >
            Tutorial
          </button>
          <button
            onClick={() => onTestSelect(topic)}
            className="bg-yellow-700 hover:bg-yellow-900 text-white font-bold py-2 px-4 rounded-lg capitalize p-4 pl-6 pr-6 w-40 ml-3 mr-3 text-center"
            style={{ backgroundColor: "#ce8c12" }}
          >
            Test
          </button>
        </>
      )}
    </div>
  );
};

export default CourseButton;
