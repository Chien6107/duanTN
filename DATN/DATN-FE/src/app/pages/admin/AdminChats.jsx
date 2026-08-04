import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import { useApp } from "../../context/AppContext";
import { MessageSquare, Send, Inbox, Database } from "lucide-react";

export function AdminChats() {
  const { chats, sendMessage, markChatAsRead, currentUser, users, isAutoReplyEnabled, setIsAutoReplyEnabled } = useApp();
  const [chatChannel, setChatChannel] = useState("customer"); // "customer" | "contact" | "internal"
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const messagesEndRef = useRef(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const targetChannel = searchParams.get("channel");
    if (!targetChannel) return;
    markChatAsRead(targetChannel);
    setSelectedCustomerId(targetChannel);
    if (targetChannel === "staff_admin_group" || targetChannel === "general_group") {
      setChatChannel("internal");
    } else if (targetChannel.startsWith("contact_")) {
      setChatChannel("contact");
    } else {
      setChatChannel("customer");
    }
  }, [searchParams, markChatAsRead]);

  // Filter chats by channel
  const channelChats = chats.filter(chat => {
    const isInternalGroup = chat.customerId === "staff_admin_group" || chat.customerId === "general_group";
    const isContactRequest = String(chat.customerId).startsWith("contact_");
    if (chatChannel === "internal") {
      return isInternalGroup;
    }
    if (chatChannel === "contact") {
      return isContactRequest;
    }
    return !isInternalGroup && !isContactRequest;
  });

  // Get active chat session
  const selectedUser = users ? users.find((u) => String(u.id) === String(selectedCustomerId)) : null;
  const activeChat = chats.find((c) => String(c.customerId) === String(selectedCustomerId)) || (selectedUser ? {
    customerId: selectedUser.id,
    customerName: selectedUser.fullName,
    messages: [],
    lastMessage: "",
    lastUpdated: new Date().toISOString()
  } : null);

  const messages = activeChat ? activeChat.messages : [];

  const selectChat = (customerId) => {
    markChatAsRead(customerId);
    setSelectedCustomerId(customerId);
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedCustomerId || !activeChat) return;

    sendMessage(
      selectedCustomerId,
      activeChat.customerName,
      currentUser.role,
      currentUser.fullName,
      replyText.trim()
    );
    setReplyText("");
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden h-[calc(100vh-210px)] flex animate-in fade-in duration-200">

      {/* Left Pane: Channels & Chat List */}
      <div className="w-80 border-r border-gray-100 flex flex-col bg-gray-50/50">
        
        {/* Channel Switcher */}
        <div className="p-4 border-b border-gray-100 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-gray-800 text-xs uppercase tracking-wider flex items-center">
              <MessageSquare className="h-4 w-4 mr-1.5 text-orange-600" />
              <span>Cuộc trò chuyện</span>
            </h3>
            <label className="flex items-center space-x-1 cursor-pointer select-none">
              <span className="text-[9px] text-zinc-500 font-extrabold uppercase">Bot</span>
              <input
                type="checkbox"
                checked={isAutoReplyEnabled}
                onChange={(e) => setIsAutoReplyEnabled(e.target.checked)}
                className="rounded text-orange-600 focus:ring-orange-500 h-3 w-3 border-zinc-300"
              />
            </label>
          </div>

          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setChatChannel("customer")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                chatChannel === "customer" ? "bg-white text-orange-600 shadow-2xs" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              💬 Khách Hàng
            </button>
            <button
              type="button"
              onClick={() => {
                setChatChannel("contact");
                setSelectedCustomerId(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                chatChannel === "contact" ? "bg-white text-emerald-600 shadow-2xs" : "text-gray-500 hover:text-gray-800"
              }`}
              title="Thông tin khách gửi từ trang Liên hệ"
            >
              <span className="inline-flex items-center gap-1">
                <Inbox className="h-3.5 w-3.5" />
                Liên Hệ
                {chats.filter((chat) => String(chat.customerId).startsWith("contact_") && chat.unreadCount > 0).length > 0 && (
                  <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] text-white">
                    {chats.filter((chat) => String(chat.customerId).startsWith("contact_") && chat.unreadCount > 0).length}
                  </span>
                )}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setChatChannel("internal");
                setSelectedCustomerId("staff_admin_group");
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                chatChannel === "internal" ? "bg-white text-indigo-600 shadow-2xs" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              🔒 Nội Bộ
            </button>
          </div>
        </div>

        {/* Chat Items List */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100/50">
          {channelChats.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-xs font-semibold">
              Không có cuộc trò chuyện nào trong kênh này.
            </div>
          ) : (
            channelChats.map((chat) => {
              const isSelected = String(chat.customerId) === String(selectedCustomerId);
              const hasUnread = chat.unreadCount > 0;
              const isGroup = chat.isGroup || ["staff_admin_group", "general_group"].includes(chat.customerId);

              return (
                <button
                  key={chat.id}
                  onClick={() => selectChat(chat.customerId)}
                  className={`w-full p-4 text-left transition flex items-start space-x-3 ${
                    isSelected ? "bg-white border-l-4 border-orange-600 shadow-sm" : "hover:bg-gray-100/50"
                  }`}
                >
                  <div className={`relative w-10 h-10 rounded-full font-bold text-sm flex items-center justify-center shrink-0 shadow-sm ${
                    isGroup ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white" : "bg-zinc-900 text-white"
                  }`}>
                    {isGroup ? "👥" : (chat.customerName || "?").charAt(0)}
                    {hasUnread && (
                      <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-red-500 ring-2 ring-white" />
                    )}
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
                    {hasUnread && (
                      <span className="mt-1 inline-flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-black text-white">
                        {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Pane: Active Thread */}
      <div className="flex-1 flex flex-col bg-white">
        {activeChat ? (
          <>
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white shadow-sm z-10">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full font-black text-sm flex items-center justify-center shadow ${
                  activeChat.customerId === "staff_admin_group"
                    ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                    : "bg-gradient-to-br from-orange-500 to-pink-600 text-white"
                }`}>
                  {activeChat.customerId === "staff_admin_group" ? "👥" : (activeChat.customerName || "?").charAt(0)}
                </div>
                <div>
                  <h4 className="font-extrabold text-gray-800 text-sm">{activeChat.customerName}</h4>
                  <p className="text-[10px] text-emerald-600 font-bold flex items-center">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse" />
                    {activeChat.customerId === "staff_admin_group"
                      ? "Kênh nội bộ (Quản trị viên ↔ Nhân viên)"
                      : activeChat.customerId === "general_group"
                      ? "Kênh Thông báo chung hệ thống"
                      : String(activeChat.customerId).startsWith("contact_")
                      ? "Yêu cầu từ biểu mẫu Liên hệ khách hàng"
                      : "Kênh Hỗ trợ (Nhân viên ↔ Khách hàng)"}
                  </p>
                </div>
              </div>

              <span
                className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700"
                title="Tin nhắn được lưu trong cơ sở dữ liệu và không thể xóa tại màn hình chat"
              >
                <Database className="h-4 w-4" />
                <span>Đã lưu vĩnh viễn</span>
              </span>
            </div>

            {/* Messages Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
              {messages.map((msg) => {
                const isMe = activeChat.customerId === "staff_admin_group"
                  ? msg.senderId === currentUser.id
                  : msg.senderRole !== "customer";
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isMe ? "justify-end" : ""}`}
                  >
                    {!isMe && (
                      <div className="w-8 h-8 rounded-full bg-zinc-900 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm border border-white">
                        {(msg.senderName || msg.senderRole || "?").charAt(0)}
                      </div>
                    )}
                    <div className="max-w-[65%]">
                      <div className="flex items-baseline space-x-1.5 px-1">
                        <span className="text-[10px] font-extrabold text-gray-400 uppercase">
                          {msg.senderName} ({msg.senderRole === "admin" ? "Quản trị" : msg.senderRole === "staff" ? "Nhân viên" : "Khách hàng"})
                        </span>
                      </div>
                      <div
                        className={`p-3 rounded-2xl text-xs leading-relaxed font-medium mt-1 ${isMe
                          ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-tr-none shadow-md"
                          : "bg-white border border-gray-200 text-zinc-800 rounded-tl-none shadow-sm"
                        }`}
                      >
                        <span className="whitespace-pre-line">{msg.content}</span>
                      </div>
                      <span className="block text-[9px] text-gray-400 font-semibold mt-1 px-1">
                        {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-4 border-t border-gray-100 bg-white flex gap-3 z-10 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Nhập phản hồi đến ${activeChat.customerName}...`}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 text-xs outline-none focus:border-orange-500 focus:bg-white transition"
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="px-5 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold hover:scale-102 active:scale-98 transition disabled:opacity-50 disabled:scale-100 flex items-center justify-center space-x-2 text-xs shadow-md shrink-0 cursor-pointer"
              >
                <span>Gửi tin nhắn</span>
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 animate-pulse">
              <MessageSquare className="h-8 w-8" />
            </div>
            <h3 className="text-base font-extrabold text-gray-800">Chưa chọn cuộc hội thoại</h3>
            <p className="text-xs text-gray-500 max-w-xs font-semibold leading-relaxed">
              Vui lòng chọn một cuộc hội thoại ở danh sách kênh bên trái để bắt đầu nhắn tin.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
