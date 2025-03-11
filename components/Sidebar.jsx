"use client";
import { useState, useEffect } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import Link from "next/link";
import { BiMessageAdd } from "react-icons/bi";
import { FaCircleUser } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("/api/chat-history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await response.json();
        if (!data.history) {
          return;
        }
        setHistory(data.history || []);
        setUserEmail(data?.history[0]?.userId);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };
    fetchHistory();
  }, []);

  async function logout() {
    try {
      const response = await fetch("/api/onboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "logout",
        }),
        credentials: "include",
      });

      const result = await response.json();
      if (result?.message === "Logout successful") {
        window.location.href = "/onboard";
      }

      if (!response.ok) {
        throw new Error(result.error || "Logout failed");
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  // Sidebar animation variants
  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  // Backdrop animation variants
  const backdropVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 },
  };

  return (
    <div className="">
      {/* Top Navigation Bar */}
      <div className="fixed bg-transparent backdrop-blur-md top-0 left-1/2 transform -translate-x-1/2 w-full max-w-lg md:max-w-xl lg:max-w-2xl text-white px-4 py-3 flex items-center justify-between">
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

      {/* Animated overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={backdropVariants}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Animated sidebar */}
      <motion.div
        className="fixed left-0 top-0 w-64 h-full bg-light-pink-50 text-black p-4 shadow-lg z-50"
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 text-white bg-light-pink-100 mb-8"
        >
          <AiOutlineClose size={24} />
        </button>
        <div className="flex flex-col space-between justify-between min-h-[80vh]">
          <ul>
            <h2 className="text-xl font-semibold mb-4">Recent Chats</h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, staggerChildren: 0.1 }}
            >
              {history &&
                history.length >= 0 &&
                history.map((chat) => (
                  <motion.li
                    key={chat._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link
                      href={`/c/${chat._id}`}
                      className="block py-2 px-6 hover:bg-light-pink-100 rounded-md capitalize"
                    >
                      {chat.messages.length > 0
                        ? chat.messages[0].msg
                            .split(" ")
                            .slice(0, 3)
                            .join(" ") + " ..."
                        : "Untitled Chat"}
                    </Link>
                  </motion.li>
                ))}
            </motion.div>
          </ul>
          <div>
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                className="hover:bg-light-pink-100 py-2 px-2 rounded-md"
              >
                Home
              </Link>
              <Link
                href="/personalize"
                className="hover:bg-light-pink-100 py-2 px-2 rounded-md"
              >
                Personalize
              </Link>
              <div
                onClick={logout}
                title={userEmail}
                className="hover:bg-light-pink-100 py-2 px-2 rounded-md cursor-pointer"
              >
                <FaCircleUser className="inline pr-2" size={28} />
                Sign Out
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Sidebar;
