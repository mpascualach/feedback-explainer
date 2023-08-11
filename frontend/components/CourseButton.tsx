// components/TailwindButton.tsx
import React, { useState } from "react";

interface ButtonProps {
  topic: string;
  onClick: () => void;
}

const CourseButton: React.FC<ButtonProps> = ({ topic, onClick }) => {
  const [toggle, setToggle] = useState<boolean>(false);

  return (
    <div className="flex-grow-0 flex-shrink mt-10 mb-10">
      <button
        onClick={onClick}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg capitalize p-4 pl-6 pr-6"
      >
        {topic}
      </button>
      {toggle && (
        <>
          <button
            onClick={onClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg capitalize p-4 pl-6 pr-6"
          >
            Tutorial
          </button>
          <button
            onClick={onClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg capitalize p-4 pl-6 pr-6"
          >
            Test
          </button>
        </>
      )}
    </div>
  );
};

export default CourseButton;
