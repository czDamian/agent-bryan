"use client";
// new chat page
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { AiOutlineSend, AiOutlineLoading3Quarters } from "react-icons/ai";
import Sidebar from "./Sidebar";
const RequestPage = () => {
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [limitReached, setLimitReached] = useState("");

  const sendMessage = async () => {
    if (!query.trim()) return;
    setLimitReached("");

    const userMessage = { role: "user", parts: [{ text: query }] };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setQuery("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: updatedMessages,
          chatId: chatId,
        }),
        credentials: "include",
      });

      const data = await response.json();
      // Check if the response contains an error
      if (!response.ok) {
        // Check if the user has reached message limit for each chat
        if (data.limitReached) {
          setLimitReached(
            "Message limit for this chat has been exceeded, consider starting a new chat"
          );
          console.log(limitReached);
        }
        return;
      }
      setChatId(data.chatId);
      const aiMessage = { role: "model", parts: [{ text: data.message }] };
      setMessages([...updatedMessages, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Sidebar />
      <div className="max-w-lg md:max-w-xl lg:max-w-2xl mx-auto flex flex-col h-[100vh] p-6  text-black justify-end ">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h2 className="text-2xl font-bold">Hi, am Agent Bryan</h2>
            <p className="text-neutral-800 mt-2">
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
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-3 max-w-[80%] rounded-lg  selection:text-light-pink-50 selection:bg-dark-pink-100 ${
                    msg.role === "user"
                      ? "bg-light-pink-50"
                      : "bg-light-pink-200"
                  }`}
                >
                  <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* display error message if limit has been reached */}
        {limitReached && (
          <div className="fixed max-w-lg top-12 right-4 bg-light-pink-200 text-black px-4 py-3 rounded shadow-lg animate-[slide-in-right_0.5s_ease-out,fade-out_0.5s_ease-in_2.5s_forwards]">
            {limitReached}
          </div>
        )}
        {/* Input & Send Button */}
        <div className="flex items-center gap-2 p-4 bg-light-pink-50 rounded-lg ">
          <input
            type="text"
            placeholder="Who is the author of the “Don’t Die Blueprint”?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none placeholder-gray-400"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            autoFocus
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="p-2 bg-light-pink-50 rounded-full hover:bg-light-pink-200"
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

export default RequestPage;
