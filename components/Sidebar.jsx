"use client";
import { useState, useEffect } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import Link from "next/link";
import { FiLogOut } from "react-icons/fi";
import { BiMessageAdd } from "react-icons/bi";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("/api/chat-history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
      {/* Top Navigation Bar */}
      <div className="fixed bg-transparent backdrop-blur-md top-0 left-1/2 transform -translate-x-1/2 w-full max-w-lg  text-white px-4 py-3 flex items-center justify-between">
        <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Sidebar">
          <AiOutlineMenu size={24} title="Sidebar" />
        </button>
        <button className="font-medium">Chat Page</button>
        <Link href="/chat">
          <BiMessageAdd
            className="hover:text-dark-pink-100 transition"
            size={26}
            title="New Chat"
          />
        </Link>
      </div>
      {isOpen && (
        <div className="fixed left-0 top-0 w-64 h-full bg-light-pink-50 text-black p-4 shadow-lg z-50">
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-white bg-light-pink-100 mb-8"
          >
            <AiOutlineClose size={24} />
          </button>
          <div className="flex flex-col space-between justify-between min-h-[80vh]">
            <ul>
              <h2 className="text-xl font-semibold mb-4">Recent Chats</h2>
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
            <div>
              <div className="flex flex-col gap-2">
                <Link
                  href="/personalize"
                  className="hover:bg-light-pink-100  py-2 px-2 rounded-md"
                >
                  Personalize
                </Link>
                <Link
                  href="/"
                  className="hover:bg-light-pink-100  py-2 px-2 rounded-md"
                >
                  <FiLogOut className="inline mr-2" />
                  Sign Out
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
