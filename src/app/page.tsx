"use client"

import React, { useState } from 'react';

export default function Home() {
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<string>('');

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(event.target.value);
  };

  const handleAskButtonClick = async () => {
    if (userInput.trim() === '') return;

    try {
      // Make the API call to POST /api/openai
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: userInput }), // Send the user input in the body
      });

      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      // Extract the response JSON
      const data = await response.json();

      // Update conversation history with the user input and the AI response
      setConversationHistory(prevHistory => [...prevHistory, userInput, data.response]);

      // Clear the user input field
      setUserInput('');
    } catch (error) {
      console.error('Error:', error);
      // Handle error
    }
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <div className="flex flex-col items-center w-full max-w-lg">
        {/* Conversation history */}
        <div className="border border-gray-300 p-4 mb-4 w-full">
          {conversationHistory.map((message, index) => (
            <div key={index} className="mb-2">
              <span className="font-bold">User:</span> {message}
            </div>
          ))}
        </div>
        {/* Textarea and Ask button */}
        <div className="flex w-full">
          <textarea
            value={userInput}
            onChange={handleInputChange}
            placeholder="Type your message here..."
            className="border border-gray-300 p-2 flex-grow rounded-lg mr-2"
            rows={4}
          />
          <button
            onClick={handleAskButtonClick}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Ask the AI
          </button>
        </div>
      </div>
    </div>
  );
}
