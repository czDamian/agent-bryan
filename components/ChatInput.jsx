"use client";
import { useRef, useEffect } from "react";
import { AiOutlineLoading3Quarters, AiOutlineSend } from "react-icons/ai";
import { FaMicrophone } from "react-icons/fa";

const ChatInput = ({ value, onChange, onSend, loading }) => {
  const textareaRef = useRef(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
      textareaRef.current.style.height = `${Math.min(
        120,
        textareaRef.current.scrollHeight
      )}px`;
    }
  }, [value]);

  // Handle Enter key press (with shift key for new line)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        onSend();
      }
    }
  };

  return (
    <div className="flex items-center gap-2 p-3 bg-light-pink-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex-none px-2 text-gray-400">
        <FaMicrophone className="text-lg" />
      </div>

      <textarea
        ref={textareaRef}
        placeholder="Who is the author of the Don't Die Blueprint?"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-transparent outline-none placeholder-gray-400 resize-none py-2 min-h-10 max-h-32"
        autoFocus
      />

      <button
        onClick={onSend}
        disabled={loading || !value.trim()}
        className={`p-2.5 rounded-full transition-all duration-200 ${
          !loading && value.trim()
            ? "bg-light-pink-200 text-gray-700 hover:bg-light-pink-300"
            : "bg-white text-gray-400"
        }`}
        aria-label="Send message"
      >
        {loading ? (
          <AiOutlineLoading3Quarters className="animate-spin text-lg" />
        ) : (
          <AiOutlineSend className="text-lg" />
        )}
      </button>
    </div>
  );
};

export default ChatInput;
