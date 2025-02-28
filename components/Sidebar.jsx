"use client";
import { useState, useEffect } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import Link from "next/link";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("/api/chat-history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "admin@admin.com" }),
          credentials: "include",
        });
        const data = await response.json();
        setHistory(data.history || []);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-white bg-blue-600"
      >
        <AiOutlineMenu size={24} />
      </button>
      {isOpen && (
        <div className="fixed left-0 top-0 w-64 h-full bg-gray-900 text-white p-4 shadow-lg">
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-white bg-red-600 mb-4"
          >
            <AiOutlineClose size={24} />
          </button>
          <h2 className="text-xl font-bold mb-4">Chat History</h2>
          <ul>
            {history.map((chat) => (
              <li key={chat._id} className="mb-2">
                <Link
                  href={`/c/${chat._id}`}
                  className="text-blue-400 hover:underline capitalize"
                >
                  {chat.messages.length > 0
                    ? chat.messages[0].msg.split(" ").slice(0, 3).join(" ") +
                      " ..."
                    : "Untitled Chat"}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
