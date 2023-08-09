import React from "react";

interface InputBoxProps {
  userPrompt: string;
  handleSubmit: (
    event: React.FormEvent<HTMLFormElement> | KeyboardEvent
  ) => void;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleTextareaResize: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const InputBox: React.FC<InputBoxProps> = ({
  userPrompt,
  handleSubmit,
  handleInputChange,
  handleTextareaResize,
}) => {
  return (
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
  );
};

export default InputBox;
