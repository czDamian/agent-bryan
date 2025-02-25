"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { AiOutlineSend, AiOutlineLoading3Quarters } from "react-icons/ai";

const RequestPage = () => {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!query.trim()) return;

    const userMessage = { role: "user", parts: [{ text: query }] };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setQuery("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, history: updatedMessages }),
      });

      const data = await response.json();
      const aiMessage = { role: "model", parts: [{ text: data.message }] };
      setMessages([...updatedMessages, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto flex flex-col h-[90vh] p-6 bg-gray-900 text-white">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <h2 className="text-2xl font-bold">Hi, am Agent Bryan</h2>
          <p className="text-gray-400 mt-2">
            Ask me anything about the “Don’t Die Blueprint” and I will do my
            best to assist you.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-4 p-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`p-3 max-w-[80%] rounded-lg ${
                  msg.role === "user" ? "bg-blue-600" : "bg-gray-700"
                }`}
              >
                <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Input & Send Button */}
      <div className="flex items-center gap-2 p-4 bg-gray-800 rounded-lg">
        <input
          type="text"
          placeholder="Who is the author of the “Don’t Die Blueprint”?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          autoFocus
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="p-2 bg-green-600 rounded-full hover:bg-green-700"
        >
          {loading ? (
            <AiOutlineLoading3Quarters className="animate-spin" />
          ) : (
            <AiOutlineSend />
          )}
        </button>
      </div>
    </div>
  );
};

export default RequestPage;
