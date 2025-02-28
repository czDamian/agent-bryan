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
    <div className="">
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-white ">
        <AiOutlineMenu size={24} className="ml-4" />
      </button>
      {isOpen && (
        <div className="fixed left-0 top-0 w-64 h-full bg-light-pink-50 text-black p-4 shadow-lg">
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-white bg-light-pink-100 mb-8"
          >
            <AiOutlineClose size={24} />
          </button>
          <h2 className="text-xl font-semibold mb-4">Recent Chats</h2>
          <ul>
            {history.map((chat) => (
              <li key={chat._id} className="">
                <Link
                  href={`/c/${chat._id}`}
                  className="block  py-2 px-6 hover:bg-light-pink-100 rounded-md capitalize"
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
