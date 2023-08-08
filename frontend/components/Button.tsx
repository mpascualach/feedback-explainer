// components/TailwindButton.tsx
import React, { useState } from "react";

interface ButtonProps {
  topic: string;
  endpoint: string;
}

const Button: React.FC<ButtonProps> = ({ topic, endpoint }) => {
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState("");

  const handleClick = async () => {
    setLoading(true);
    setTimeout(() => {}, 2000);
    try {
      const response = await fetch("/testResponse.json");
      const data = await response.json();
      console.log("Hello: ", data);
      setApiData(data.choices[0].message.content.replace(/\n/g, "<br />")); // Assuming the API returns a 'message' field
      setLoading(false);
    } catch (error) {
      console.error("Error fetching API:", error);
      setLoading(false);
    }
  };

  return (
    <div>
      {!loading && !apiData && (
        <button
          onClick={handleClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded capitalize"
        >
          {topic}
        </button>
      )}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {apiData && <div dangerouslySetInnerHTML={{ __html: apiData }} />}
        </div>
      )}
    </div>
  );
};

export default Button;
