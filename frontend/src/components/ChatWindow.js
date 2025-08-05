// /frontend/src/components/ChatWindow.js

// 1. We import 'useEffect' from React.
import React, { useState, useEffect } from 'react';

function ChatWindow({ analysisContext }) {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I am ready to answer questions about the uploaded X-ray.", sender: 'ai' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // 2. We add the useEffect hook.
  // This code will automatically run every time the 'analysisContext' prop changes.
  useEffect(() => {
    // This will print a message to the browser's developer console (F12 -> Console).
    console.log("ChatWindow received new context:", analysisContext);
  }, [analysisContext]); // The hook depends on analysisContext

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user'
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsTyping(true);
    setInputValue('');

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: inputValue,
          context: analysisContext,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const aiMessage = {
        id: messages.length + 2,
        text: data.answer,
        sender: 'ai'
      };

      setMessages(prevMessages => [...prevMessages, aiMessage]);

    } catch (error) {
      console.error("Failed to get chat response:", error);
      const errorMessage = {
        id: messages.length + 2,
        text: "Sorry, I couldn't connect to the server. Please try again.",
        sender: 'ai'
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-full border border-gray-200 rounded-lg flex flex-col bg-white">
      
      <div className="p-2 bg-yellow-100 text-xs text-yellow-800 border-b border-yellow-200">
        <p className="font-bold">Debug Info:</p>
        <p><strong>Current Context:</strong> {analysisContext || "Empty"}</p>
      </div>

      <div className="flex-grow p-4 overflow-y-auto">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`rounded-lg px-4 py-2 max-w-xs lg:max-w-md ${
                message.sender === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="mb-4 flex justify-start">
            <div className="rounded-lg px-4 py-2 bg-gray-200 text-gray-500">
              Typing...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 flex items-center">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask a question..."
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isTyping}
        />
        <button
          onClick={handleSendMessage}
          className="ml-3 bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-300"
          disabled={isTyping}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;
