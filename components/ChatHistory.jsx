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
      <div className="max-w-lg border mx-auto flex flex-col p-6 ">
        {loading ? (
          <div className="flex items-center justify-center">
            <AiOutlineLoading3Quarters className="animate-spin text-3xl" />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : history.length > 0 ? (
          <div className="flex-1 overflow-y-auto space-y-4 p-4 mb-20">
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
                  className={`p-3  max-w-[80%] selection:text-light-pink-50 selection:bg-dark-pink-100 rounded-lg ${
                    message.role === "AI"
                      ? "bg-light-pink-200 "
                      : "bg-light-pink-50"
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
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-lg bg-light-pink-50 py-6 px-4 flex items-center gap-2 rounded-t-2xl shadow-md">
          <input
            type="text"
            placeholder="Who is the author of the “Don’t Die Blueprint”?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            autoFocus
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="p-2 bg-light-pink-100 rounded-full hover:bg-light-pink-200 transition"
          >
            {loading ? (
              <AiOutlineLoading3Quarters className="animate-spin text-gray-600" />
            ) : (
              <AiOutlineSend className="text-gray-700" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;
