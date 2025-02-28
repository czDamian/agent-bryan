"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { AiOutlineSend, AiOutlineLoading3Quarters } from "react-icons/ai";
import Sidebar from "@/components/Sidebar";

const ChatHistory = () => {
  const { chatId } = useParams();
  const [history, setHistory] = useState([]);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchChatHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/c`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId }),
      });

      const data = await response.json();
      console.log("data message arry", data.history[0].messages);

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch chat history");
      }

      // Ensure history is an array and extract messages from the first object
      if (Array.isArray(data.history) && data.history.length > 0) {
        setHistory(data.history[0].messages || []);
      } else {
        setHistory([]);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!chatId) {
      setError("Invalid chat ID");
      return;
    }

    fetchChatHistory();
  }, [chatId]);

  const sendMessage = async () => {
    if (!query.trim()) return;

    const userMessage = { role: "user", parts: [{ text: query }] };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setQuery("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: updatedMessages,
          userEmail: "admin@admin.com",
          chatId: chatId,
        }),
        credentials: "include",
      });

      const data = await response.json();

      const aiMessage = { role: "model", parts: [{ text: data.message }] };
      setMessages([...updatedMessages, aiMessage]);
      fetchChatHistory();
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Sidebar />

      <h2 className="text-xl font-bold mb-4">Chat History</h2>
      <div className="max-w-lg mx-auto flex flex-col h-[90vh] p-6 bg-gray-900 text-white">
        {loading ? (
          <div className="flex items-center justify-center">
            <AiOutlineLoading3Quarters className="animate-spin text-3xl" />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : history.length > 0 ? (
          <div className="flex-1 overflow-y-auto space-y-4 p-4">
            {history.map((message, index) => (
              <div
                key={index}
                className={`p-3 flex justify-start ${
                  message.role === "AI" ? " justify-start" : " justify-end"
                }`}
              >
                {/* <strong className="">
                  {message.role === "user" ? "You: " : "AI: "}
                </strong> */}
                <div
                  className={`p-3  max-w-[80%] rounded-lg ${
                    message.role === "AI" ? "bg-blue-600" : "bg-gray-700"
                  }`}
                >
                  <ReactMarkdown>{message.msg}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No chat history found.</p>
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
    </div>
  );
};

export default ChatHistory;
