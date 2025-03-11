import { AiOutlineLoading3Quarters, AiOutlineSend } from "react-icons/ai";

const ChatInput = ({ value, onChange, onSend, loading }) => (
  <div className="flex items-center gap-2 p-4 bg-light-pink-50 rounded-lg">
    <input
      type="text"
      placeholder="Who is the author of the Don't Die Blueprint?"
      value={value}
      onChange={onChange}
      className="flex-1 bg-transparent outline-none placeholder-gray-400"
      onKeyDown={(e) => e.key === "Enter" && onSend()}
      autoFocus
    />
    <button
      onClick={onSend}
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
);

export default ChatInput;