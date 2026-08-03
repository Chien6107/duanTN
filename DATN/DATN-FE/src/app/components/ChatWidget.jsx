import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, User } from "lucide-react";
import { useApp } from "../context/AppContext";

export function ChatWidget() {
  const { currentUser, chats, sendMessage } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  // Only render for logged-in customers (not admins or staff)
  if (!currentUser || currentUser.role === "admin" || currentUser.role === "staff") {
    return null;
  }

  // Find chat session for current user
  const userChat = chats.find((c) => c.customerId === currentUser.id);
  const messages = userChat ? userChat.messages : [];

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendMessage(
      currentUser.id,
      currentUser.fullName,
      "customer",
      currentUser.fullName,
      inputText.trim()
    );
    setInputText("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 h-[450px] bg-white border border-zinc-200 shadow-2xl rounded-3xl overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-250">
          {/* Header */}
          <div className="bg-zinc-950 text-white px-5 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center font-black text-xs text-white">
                FS
              </div>
              <div>
                <h3 className="font-extrabold text-sm tracking-wide">Hỗ trợ FoxStyle</h3>
                <p className="text-[10px] text-zinc-400 font-semibold">Thường phản hồi sau vài phút</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition"
              title="Đóng chat"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/50">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
                <MessageSquare className="h-10 w-10 text-zinc-300" />
                <p className="text-xs font-bold text-zinc-800">Bắt đầu trò chuyện</p>
                <p className="text-[11px] text-zinc-500 max-w-[200px] leading-relaxed">
                  Nhập tin nhắn bên dưới để liên hệ trực tiếp với nhân viên hỗ trợ của chúng tôi!
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderRole === "customer";
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${isMe ? "justify-end" : ""}`}
                  >
                    {!isMe && (
                      <div className="w-7 h-7 rounded-full bg-zinc-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                        {msg.senderName.charAt(0)}
                      </div>
                    )}
                    <div className="max-w-[70%]">
                      <div
                        className={`p-3 rounded-2xl text-xs font-medium leading-relaxed ${
                          isMe
                            ? "bg-zinc-950 text-white rounded-tr-none"
                            : "bg-white border border-zinc-200 text-zinc-800 rounded-tl-none shadow-sm"
                        }`}
                      >
                        {msg.content}
                      </div>
                      <span className="block text-[9px] text-zinc-400 font-semibold mt-1 px-1">
                        {new Date(msg.time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Send Input Footer */}
          <form onSubmit={handleSend} className="p-3 border-t border-zinc-150 bg-white flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-zinc-900 focus:bg-white transition"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 hover:scale-105 transition disabled:opacity-50 disabled:scale-100 flex items-center justify-center shrink-0"
              title="Gửi"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-950 hover:bg-zinc-800 text-white shadow-2xl hover:scale-105 active:scale-95 transition"
        title="Trò chuyện hỗ trợ"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>
    </div>
  );
}
