import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { MessageSquare, Send, User, Calendar, Smile } from "lucide-react";

export function AdminChats() {
  const { chats, sendMessage, currentUser } = useApp();
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const messagesEndRef = useRef(null);

  // Get active chat session
  const activeChat = chats.find((c) => c.customerId === selectedCustomerId);
  const messages = activeChat ? activeChat.messages : [];

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Mark selected chat as read (reset unreadCount to 0 locally)
  useEffect(() => {
    if (activeChat && activeChat.unreadCount > 0) {
      activeChat.unreadCount = 0;
    }
  }, [activeChat]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedCustomerId || !activeChat) return;

    sendMessage(
      selectedCustomerId,
      activeChat.customerName,
      currentUser.role, // "admin" or "staff"
      currentUser.fullName,
      replyText.trim()
    );
    setReplyText("");
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden h-[calc(100vh-210px)] flex animate-in fade-in duration-200">
      
      {/* Left Pane: Customer List */}
      <div className="w-80 border-r border-gray-100 flex flex-col bg-gray-50/50">
        <div className="p-5 border-b border-gray-100 bg-white">
          <h3 className="font-extrabold text-gray-800 text-sm uppercase tracking-wider flex items-center">
            <MessageSquare className="h-4.5 w-4.5 mr-2 text-orange-600" />
            <span>Hội thoại hỗ trợ</span>
          </h3>
          <p className="text-xs text-gray-400 font-semibold mt-1">Danh sách khách hàng cần hỗ trợ</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-100/50">
          {chats.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-xs font-semibold">
              Chưa có cuộc trò chuyện nào từ khách hàng.
            </div>
          ) : (
            chats.map((chat) => {
              const isSelected = chat.customerId === selectedCustomerId;
              const hasUnread = chat.unreadCount > 0;
              return (
                <button
                  key={chat.id}
                  onClick={() => setSelectedCustomerId(chat.customerId)}
                  className={`w-full p-4 text-left transition flex items-start space-x-3 ${
                    isSelected ? "bg-white border-l-4 border-orange-600 shadow-sm" : "hover:bg-gray-100/50"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-zinc-900 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
                    {chat.customerName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-gray-800 truncate block">
                        {chat.customerName}
                      </span>
                      <span className="text-[9px] text-gray-400 font-bold shrink-0">
                        {new Date(chat.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className={`text-xs mt-1 truncate ${hasUnread ? "font-bold text-gray-900" : "text-gray-500 font-medium"}`}>
                      {chat.lastMessage}
                    </p>
                  </div>
                  {hasUnread && (
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full shrink-0 animate-pulse mt-1" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Pane: Chat History */}
      <div className="flex-1 flex flex-col bg-white">
        {activeChat ? (
          <>
            {/* Thread Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white shadow-sm z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 text-white font-black text-sm flex items-center justify-center shadow">
                  {activeChat.customerName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-extrabold text-gray-800 text-sm">{activeChat.customerName}</h4>
                  <p className="text-[10px] text-emerald-600 font-bold flex items-center">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse" />
                    Đang trực tuyến
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
              {messages.map((msg) => {
                const isMe = msg.senderRole !== "customer";
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isMe ? "justify-end" : ""}`}
                  >
                    {!isMe && (
                      <div className="w-8 h-8 rounded-full bg-zinc-900 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm border border-white">
                        {msg.senderName.charAt(0)}
                      </div>
                    )}
                    <div className="max-w-[65%]">
                      <div className="flex items-baseline space-x-1.5 px-1">
                        <span className="text-[10px] font-extrabold text-gray-400 uppercase">
                          {isMe ? `${msg.senderName} (${msg.senderRole})` : msg.senderName}
                        </span>
                      </div>
                      <div
                        className={`p-3 rounded-2xl text-xs leading-relaxed font-medium mt-1 ${
                          isMe
                            ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-tr-none shadow-md"
                            : "bg-white border border-gray-200 text-zinc-800 rounded-tl-none shadow-sm"
                        }`}
                      >
                        {msg.content}
                      </div>
                      <span className="block text-[9px] text-gray-400 font-semibold mt-1 px-1">
                        {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(msg.time).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Section */}
            <form onSubmit={handleSend} className="p-4 border-t border-gray-100 bg-white flex gap-3 z-10 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Phản hồi đến ${activeChat.customerName}...`}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 text-xs outline-none focus:border-orange-500 focus:bg-white transition"
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="px-5 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold hover:scale-102 active:scale-98 transition disabled:opacity-50 disabled:scale-100 flex items-center justify-center space-x-2 text-xs shadow-md shrink-0"
              >
                <span>Gửi phản hồi</span>
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 animate-pulse">
              <MessageSquare className="h-8 w-8" />
            </div>
            <h3 className="text-base font-extrabold text-gray-800">Chưa chọn hội thoại</h3>
            <p className="text-xs text-gray-500 max-w-xs font-semibold leading-relaxed">
              Vui lòng chọn một khách hàng từ danh sách hội thoại bên trái để bắt đầu nhắn tin hỗ trợ và trả lời thắc mắc.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
