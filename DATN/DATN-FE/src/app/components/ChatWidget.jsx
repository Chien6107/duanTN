import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, User, Sparkles, Bot, Heart, Users } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Link } from "react-router";
import { normalizeVietnameseText } from "../utils/vietnameseText";
import { containsBlockedLanguage } from "../utils/contentModeration";

const normalizeAiText = (value = "") => String(value)
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/đ/g, "d")
  .replace(/Đ/g, "D")
  .toLowerCase()
  .replace(/[^a-z0-9\s]/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const productSearchText = (product) => normalizeAiText([
  product.name,
  product.categoryName,
  product.category,
  product.brand,
  product.brandName,
  product.description,
  ...(product.colors || []),
  ...(product.sizes || []),
  ...(product.variants || []).flatMap((variant) => [variant.color, variant.size])
].filter(Boolean).join(" "));

const parseBudget = (query) => {
  const amounts = [...query.matchAll(/(\d+(?:[.,]\d+)?)\s*(trieu|tr|k|nghin|ngan|000)?/g)]
    .map((match) => {
      let value = Number(match[1].replace(",", "."));
      if (["trieu", "tr"].includes(match[2])) value *= 1_000_000;
      else if (["k", "nghin", "ngan"].includes(match[2])) value *= 1_000;
      return value >= 10_000 ? value : null;
    })
    .filter(Boolean);
  if (!amounts.length) return {};
  if (/duoi|toi da|khong qua|tam gia/.test(query)) return { max: amounts[0] };
  if (/tren|tu/.test(query) && amounts.length === 1) return { min: amounts[0] };
  if (amounts.length >= 2) return { min: Math.min(...amounts), max: Math.max(...amounts) };
  return { max: amounts[0] };
};

const AI_INTENT_TERMS = {
  "đi làm": ["di lam", "cong so", "van phong", "hop", "lich su"],
  "dự tiệc": ["du tiec", "di tiec", "sang trong", "da hoi", "cuoi"],
  "đi chơi": ["di choi", "hen ho", "dao pho", "cuoi tuan"],
  "đi biển": ["di bien", "du lich", "mua he", "thoang mat"],
  "thể thao": ["the thao", "tap gym", "chay bo", "nang dong"]
};

export function ChatWidget() {
  const {
    currentUser,
    chats = [],
    sendMessage,
    products = [],
    isAutoReplyEnabled,
    setIsAutoReplyEnabled,
    openLoginModal
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("staff"); // "staff" or "ai"
  const [staffSubTab, setStaffSubTab] = useState("private"); // "private" (Nhắn riêng) or "general" (Nhắn chung)
  const [inputText, setInputText] = useState("");
  const [staffInputError, setStaffInputError] = useState("");
  const messagesEndRef = useRef(null);
  const staffThreadRef = useRef(null);
  const staffAutoScrollRef = useRef(true);

  // AI Chat states
  const [aiMessages, setAiMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("foxstyle_ai_chats");
      return saved ? JSON.parse(saved) : [
        {
          id: "ai_init",
          sender: "ai",
          content: "Xin chào! Tôi là Trợ lý AI Tìm trang phục của FoxStyle. Hãy mô tả trang phục bạn đang tìm kiếm (Ví dụ: 'áo khoác mùa đông', 'đầm hoa màu đen', 'váy hồng'). Tôi sẽ lọc danh mục sản phẩm và gợi ý trang phục phù hợp nhất cho bạn!",
          time: new Date().toISOString()
        }
      ];
    } catch (e) {
      return [
        {
          id: "ai_init",
          sender: "ai",
          content: "Xin chào! Tôi là Trợ lý AI Tìm trang phục của FoxStyle. Hãy mô tả trang phục bạn đang tìm kiếm (Ví dụ: 'áo khoác mùa đông', 'đầm hoa màu đen', 'váy hồng'). Tôi sẽ lọc danh mục sản phẩm và gợi ý trang phục phù hợp nhất cho bạn!",
          time: new Date().toISOString()
        }
      ];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("foxstyle_ai_chats", JSON.stringify(aiMessages));
    } catch (e) {}
  }, [aiMessages]);

  const [aiInputText, setAiInputText] = useState("");
  const [aiInputError, setAiInputError] = useState("");
  const aiMessagesEndRef = useRef(null);
  const aiThreadRef = useRef(null);
  const aiAutoScrollRef = useRef(true);

  // Find active chat session based on sub-tab
  const generalChat = (chats || []).find((c) => c?.customerId === "general_group") || {
    customerId: "general_group",
    customerName: "💬 Nhóm thông báo chung",
    messages: []
  };
  
  const privateChat = currentUser ? (chats || []).find((c) => String(c?.customerId) === String(currentUser.id)) : null;

  
  const activeChat = staffSubTab === "general" ? generalChat : privateChat;
  const messages = activeChat ? activeChat.messages : [];

  // Keep auto-scroll enabled only while the user is already near the bottom.
  useEffect(() => {
    staffAutoScrollRef.current = true;
  }, [staffSubTab]);

  useEffect(() => {
    if (activeTab !== "staff" || !isOpen || !staffAutoScrollRef.current) return;

    const frame = requestAnimationFrame(() => {
      const thread = staffThreadRef.current;
      thread?.scrollTo({ top: thread.scrollHeight, behavior: "smooth" });
    });
    return () => cancelAnimationFrame(frame);
  }, [messages.length, isOpen, activeTab, staffSubTab]);

  useEffect(() => {
    if (activeTab !== "ai" || !isOpen || !aiAutoScrollRef.current) return;

    const frame = requestAnimationFrame(() => {
      const thread = aiThreadRef.current;
      thread?.scrollTo({ top: thread.scrollHeight, behavior: "smooth" });
    });
    return () => cancelAnimationFrame(frame);
  }, [aiMessages.length, isOpen, activeTab]);

  const handleThreadScroll = (event, autoScrollRef) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    autoScrollRef.current = scrollHeight - scrollTop - clientHeight <= 80;
  };

  // Hide widget for Admin and Staff roles (Admin has AdminChats)
  if (currentUser && (currentUser.role === "admin" || currentUser.role === "staff")) {
    return null;
  }

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (containsBlockedLanguage(inputText)) {
      setStaffInputError("Vui lòng sử dụng ngôn từ lịch sự khi trò chuyện.");
      return;
    }

    if (!currentUser) {
      openLoginModal();
      return;
    }
    setStaffInputError("");

    staffAutoScrollRef.current = true;

    if (staffSubTab === "general") {
      sendMessage(
        "general_group",
        "💬 Nhóm thông báo chung",
        "customer",
        currentUser.fullName,
        inputText.trim()
      );
    } else {
      sendMessage(
        currentUser.id,
        currentUser.fullName,
        "customer",
        currentUser.fullName,
        inputText.trim()
      );
    }
    setInputText("");
  };

  const triggerAiQuery = (customText) => {
    const queryText = customText || aiInputText.trim();
    if (!queryText) return;

    if (containsBlockedLanguage(queryText)) {
      setAiInputError("Vui lòng sử dụng ngôn từ lịch sự khi trò chuyện.");
      return;
    }
    setAiInputError("");

    aiAutoScrollRef.current = true;

    const query = queryText.toLowerCase();
    const normalizedQuery = normalizeAiText(queryText);
    const lastRecommendation = [...aiMessages]
      .reverse()
      .find((message) => message.sender === "ai" && message.matchedProducts?.length);
    const previousProducts = lastRecommendation?.matchedProducts || [];
    const ordinalMatch = normalizedQuery.match(/(?:(?:mau|cai|san pham)\s*(?:thu\s*)?|thu\s+)(1|2|3|4|5|dau tien|hai|ba|bon|nam)\b/);
    const ordinalMap = { "1": 0, "dau tien": 0, "2": 1, "hai": 1, "3": 2, "ba": 2, "4": 3, "bon": 3, "5": 4, "nam": 4 };
    const ordinalIndex = ordinalMatch ? ordinalMap[ordinalMatch[1]] : null;
    const namedProduct = previousProducts.find((product) =>
      normalizedQuery.includes(normalizeAiText(product.name))
    );
    const contextProducts = namedProduct
      ? [namedProduct]
      : ordinalIndex !== null && previousProducts[ordinalIndex]
        ? [previousProducts[ordinalIndex]]
        : previousProducts;
    const recentCustomerContext = aiMessages
      .filter((message) => message.sender === "user")
      .slice(-2)
      .map((message) => message.content)
      .join(" ");
    const isFollowUp = ordinalIndex !== null || Boolean(namedProduct) || /mau nay|cai nay|san pham nay|may mau|mau gi|gia bao nhieu|con size|con hang|loai nao|cai nao/.test(normalizedQuery);
    const searchQuery = normalizeAiText(isFollowUp ? `${recentCustomerContext} ${queryText}` : queryText);

    // Add user message
    const userMsg = {
      id: "ai_user_" + Date.now(),
      sender: "user",
      content: queryText,
      time: new Date().toISOString()
    };
    
    setAiMessages((prev) => [...prev, userMsg]);
    setAiInputText("");

    // Simulate AI intelligent advice calculation
    setTimeout(() => {
      let matched = [];
      let replyContent = "";

      // 1. Size advice check (Height & Weight query)
      if (/gia bao nhieu|bao nhieu tien|gia nao/.test(normalizedQuery) && contextProducts.length) {
        matched = contextProducts;
        replyContent = `Giá hiện tại của ${contextProducts.length > 1 ? "các mẫu vừa gợi ý" : contextProducts[0].name}:\n${contextProducts.map((item) => `• ${item.name}: ${Number(item.price || 0).toLocaleString("vi-VN")}đ${Number(item.originalPrice || 0) > Number(item.price || 0) ? ` (giá gốc ${Number(item.originalPrice).toLocaleString("vi-VN")}đ)` : ""}`).join("\n")}`;
      } else if (/re nhat|gia thap nhat|tiet kiem nhat/.test(normalizedQuery) && previousProducts.length) {
        const cheapest = [...previousProducts].sort((a, b) => Number(a.price || 0) - Number(b.price || 0))[0];
        matched = [cheapest];
        replyContent = `Mẫu tiết kiệm nhất là ${cheapest.name}, giá ${Number(cheapest.price || 0).toLocaleString("vi-VN")}đ. Mẫu đang ${Number(cheapest.quantity || 0) > 0 ? "còn hàng" : "tạm hết hàng"}.`;
      } else if (/so sanh|khac nhau|nen chon (mau|cai) nao/.test(normalizedQuery) && previousProducts.length >= 2) {
        matched = previousProducts.slice(0, 2);
        const [first, second] = matched;
        replyContent = `So sánh nhanh hai mẫu:\n• ${first.name}: ${Number(first.price || 0).toLocaleString("vi-VN")}đ, ${first.material || "chưa cập nhật chất liệu"}, còn ${Number(first.quantity || 0)} sản phẩm.\n• ${second.name}: ${Number(second.price || 0).toLocaleString("vi-VN")}đ, ${second.material || "chưa cập nhật chất liệu"}, còn ${Number(second.quantity || 0)} sản phẩm.\nNếu ưu tiên tiết kiệm, mình chọn ${Number(first.price || 0) <= Number(second.price || 0) ? first.name : second.name}.`;
      } else if (/chat lieu|vai gi|lam bang gi/.test(normalizedQuery) && contextProducts.length) {
        matched = contextProducts;
        replyContent = contextProducts.map((product) => `• ${product.name}: ${product.material || "chất liệu đang được cửa hàng cập nhật"}.`).join("\n");
      } else if (/thuong hieu|hang nao|brand|xuat xu|san xuat o dau/.test(normalizedQuery) && contextProducts.length) {
        matched = contextProducts;
        replyContent = contextProducts.map((product) => `• ${product.name}: thương hiệu ${product.brand || product.brandName || "FoxStyle"}, xuất xứ ${product.origin || "Việt Nam"}.`).join("\n");
      } else if (/giat|bao quan|cham soc|ui do/.test(normalizedQuery) && contextProducts.length) {
        matched = contextProducts;
        replyContent = contextProducts.map((product) => `• ${product.name}: ${product.careInstructions || "giặt nhẹ ở nhiệt độ thường, phơi trong bóng râm và tránh chất tẩy mạnh"}.`).join("\n");
      } else if (/mau gi|may mau|co mau|mau nao/.test(normalizedQuery) && contextProducts.length) {
        matched = contextProducts.filter((product) => {
          const colors = [...new Set([...(product.colors || []), ...(product.variants || []).map((variant) => variant.color)].filter(Boolean))];
          return !/co mau (den|trang|do|hong|vang|xanh|xam|be|tim|nau|cam)/.test(normalizedQuery)
            || colors.some((color) => searchQuery.includes(normalizeAiText(color)));
        });
        const colorLines = contextProducts.map((product) => {
          const colors = [...new Set([...(product.colors || []), ...(product.variants || []).map((variant) => variant.color)].filter(Boolean))];
          return `• ${product.name}: ${colors.length ? colors.join(", ") : "chưa cập nhật màu"}`;
        });
        replyContent = `${matched.length ? "Có, mình đã kiểm tra màu của các mẫu vừa xem:" : "Màu bạn hỏi hiện chưa có trong các mẫu vừa xem."}\n${colorLines.join("\n")}`;
      } else if (/con size|size [a-z0-9]+|con hang/.test(normalizedQuery) && contextProducts.length && !/\b(kg|cm|cao|nang)\b/.test(normalizedQuery)) {
        const requestedSize = normalizedQuery.match(/size\s*([a-z0-9]+)/)?.[1]?.toUpperCase();
        const requestedColor = ["den", "trang", "do", "hong", "vang", "xanh", "xam", "be", "tim", "nau", "cam"]
          .find((color) => new RegExp(`\\b${color}\\b`).test(normalizedQuery));
        matched = contextProducts.filter((product) => (product.variants || []).some((variant) =>
          Number(variant.quantity ?? 1) > 0 &&
          (!requestedSize || String(variant.size).toUpperCase() === requestedSize) &&
          (!requestedColor || normalizeAiText(variant.color).includes(requestedColor))
        ));
        replyContent = matched.length
          ? `${requestedColor ? `Màu ${requestedColor}` : ""}${requestedColor && requestedSize ? ", " : ""}${requestedSize ? `size ${requestedSize}` : "Sản phẩm"} hiện còn hàng ở ${matched.length} mẫu bên dưới. Bạn nhấn vào mẫu để chọn đúng biến thể nhé.`
          : `Biến thể ${requestedColor ? `màu ${requestedColor} ` : ""}${requestedSize ? `size ${requestedSize}` : "bạn hỏi"} hiện đã hết ở các mẫu vừa xem. Bạn cho mình màu hoặc size khác để tìm tiếp nhé.`;
      } else if (/\b(size|kg|cm|cao|nang|can nang|vong eo)\b/.test(normalizedQuery)) {
        // Regex extract height in cm or meter format (e.g. 1m68 or 168cm)
        let heightCm = 168;
        let weightKg = 62;

        const hMeterMatch = queryText.match(/1m(\d{2})/i);
        const hCmMatch = queryText.match(/(\d{3})\s*cm/i);
        if (hMeterMatch) heightCm = 100 + Number(hMeterMatch[1]);
        else if (hCmMatch) heightCm = Number(hCmMatch[1]);

        const wKgMatch = queryText.match(/(\d{2,3})\s*kg/i);
        if (wKgMatch) weightKg = Number(wKgMatch[1]);

        // Calculate accurate letter size
        let suggestedSize = "M";
        if (weightKg < 48) suggestedSize = "S";
        else if (weightKg <= 56) suggestedSize = "M";
        else if (weightKg <= 66) suggestedSize = "L";
        else if (weightKg <= 76) suggestedSize = "XL";
        else if (weightKg <= 87) suggestedSize = "2XL";
        else suggestedSize = "3XL";

        if (heightCm >= 175 && (suggestedSize === "S" || suggestedSize === "M")) {
          if (suggestedSize === "S") suggestedSize = "M";
          else if (suggestedSize === "M") suggestedSize = "L";
        }

        // Calculate pants numeric size
        let suggestedPantSize = 30;
        if (weightKg < 50) suggestedPantSize = 28;
        else if (weightKg <= 55) suggestedPantSize = 29;
        else if (weightKg <= 61) suggestedPantSize = 30;
        else if (weightKg <= 67) suggestedPantSize = 31;
        else if (weightKg <= 74) suggestedPantSize = 32;
        else if (weightKg <= 80) suggestedPantSize = 33;
        else if (weightKg <= 86) suggestedPantSize = 34;
        else suggestedPantSize = 36;

        matched = products.slice(0, 4);
        replyContent = `💡 **Tư vấn chọn Size AI chuẩn xác cho vóc dáng (${heightCm}cm, ${weightKg}kg):**\n- **Áo / Áo khoác / Đầm:** Size đề xuất chuẩn nhất là **Size ${suggestedSize}** (Vừa vặn phom dáng, độ khớp 98.5%).\n- **Quần Jeans / Quần tây:** Size đề xuất chuẩn nhất là **Size ${suggestedPantSize}** (Lưng vừa, đùi suông đẹp).\n- Form thiết kế của FoxStyle theo chuẩn số đo Việt Nam. Dưới đây là các mẫu nổi bật đang sẵn Size của bạn nhé:`;
      } else if (/^(xin chao|chao|hello|hi|alo)\b/.test(normalizedQuery)) {
        replyContent = "Chào bạn! Mình có thể tìm đồ theo loại sản phẩm, màu sắc, size, mức giá và hoàn cảnh sử dụng. Ví dụ: “Tìm áo nam màu đen size L dưới 500 nghìn để đi làm”.";
      } else if (/don hang|giao hang|van chuyen|ma don|toi dau/.test(normalizedQuery)) {
        replyContent = currentUser
          ? "Bạn mở mục Đơn hàng trên thanh đầu trang để xem trạng thái, thanh toán, vận chuyển và chi tiết từng sản phẩm. Nếu đơn có sự cố, hãy chuyển sang tab Nhân viên để được hỗ trợ trực tiếp."
          : "Bạn cần đăng nhập trước, sau đó mở mục Đơn hàng trên thanh đầu trang để kiểm tra trạng thái giao hàng.";
      } else if (/doi tra|bao hanh|hoan tien|chinh sach/.test(normalizedQuery)) {
        replyContent = "FoxStyle hỗ trợ đổi/trả và bảo hành theo tình trạng sản phẩm, thời hạn ghi trên đơn hoặc phiếu bảo hành. Sản phẩm cần còn đủ thông tin đơn hàng; bạn có thể mở trang Chính sách hoặc nhắn nhân viên để kiểm tra trường hợp cụ thể.";
      } else if (/phoi (do|voi)|mac voi gi|hop voi gi/.test(normalizedQuery) && contextProducts.length) {
        matched = contextProducts;
        const base = productSearchText(contextProducts[0]);
        const styling = /dam|vay/.test(base)
          ? "phối cùng giày cao gót hoặc sandal tối giản và túi nhỏ; chọn phụ kiện cùng tông để tổng thể thanh lịch"
          : /ao|polo|so mi/.test(base)
            ? "phối với quần jeans để trẻ trung, hoặc quần tây/chân váy để đi làm; thêm sneaker trắng hoặc giày da"
            : /quan/.test(base)
              ? "phối với áo thun trơn cho phong cách hằng ngày, hoặc sơ mi/blazer khi cần lịch sự"
              : "ưu tiên một món màu trung tính và phụ kiện tối giản để sản phẩm là điểm nhấn";
        replyContent = `Với ${contextProducts[0].name}, bạn nên ${styling}. Nếu cho mình biết bạn mặc đi đâu, mình sẽ lọc thêm món phối cùng phù hợp.`;
      } else if (/mo ta|chi tiet|co gi dac biet|uu diem/.test(normalizedQuery) && contextProducts.length) {
        matched = contextProducts;
        replyContent = contextProducts.map((product) => `• ${product.name}: ${product.description || "thiết kế thời trang dễ phối, phù hợp sử dụng hằng ngày"}`).join("\n");
      } else if (/khuyen mai|giam gia|sale|uu dai/.test(normalizedQuery) && contextProducts.length && isFollowUp) {
        const discounted = contextProducts.filter((product) => Number(product.originalPrice || 0) > Number(product.price || 0));
        matched = discounted;
        replyContent = discounted.length
          ? discounted.map((product) => {
              const percent = Math.round((1 - Number(product.price) / Number(product.originalPrice)) * 100);
              return `• ${product.name}: giảm ${percent}%, còn ${Number(product.price).toLocaleString("vi-VN")}đ.`;
            }).join("\n")
          : "Các mẫu vừa xem hiện chưa có giảm giá trực tiếp. Bạn có thể hỏi “tìm sản phẩm đang sale” để mình lọc các mẫu ưu đãi khác.";
      } else {
        const { min, max } = parseBudget(searchQuery);
        const activeProducts = products.filter((product) =>
          ![0, "0", false, "INACTIVE", "STOPPED", "DISCONTINUED"].includes(product.status) &&
          Number(product.quantity ?? 1) > 0
        );
        const colors = ["den", "trang", "do", "hong", "vang", "xanh", "xam", "be", "tim", "nau", "cam"];
        const requestedColors = colors.filter((color) => new RegExp(`\\b${color}\\b`).test(searchQuery));
        const stopWords = new Set(["toi", "muon", "can", "tim", "mua", "cho", "mot", "san", "pham", "do", "gia", "duoi", "tren", "khoang", "va", "co", "khong", "giup", "minh", "voi", "de"]);
        const queryTokens = searchQuery.split(" ").filter((token) => token.length > 1 && !stopWords.has(token) && !/^\d+$/.test(token));
        const occasion = Object.entries(AI_INTENT_TERMS).find(([, terms]) => terms.some((term) => searchQuery.includes(term)));

        matched = activeProducts
          .map((product) => {
            const haystack = productSearchText(product);
            const price = Number(product.price || 0);
            if (min && price < min) return null;
            if (max && price > max) return null;
            if (requestedColors.length && !requestedColors.some((color) => haystack.includes(color))) return null;
            let score = queryTokens.reduce((total, token) => total + (haystack.includes(token) ? 3 : 0), 0);
            if (occasion) {
              const occasionHits = occasion[1].filter((term) => haystack.includes(term)).length;
              score += occasionHits * 2;
              const categoryBoost = occasion[0] === "dự tiệc" && /dam|vay|blazer/.test(haystack)
                || occasion[0] === "đi làm" && /so mi|quan tay|blazer|polo/.test(haystack)
                || occasion[0] === "đi biển" && /dam|vay|short|ao thun/.test(haystack);
              if (categoryBoost) score += 4;
            }
            if (/combo|set/.test(searchQuery) && product.isCombo) score += 8;
            if (/khuyen mai|giam gia|sale/.test(searchQuery) && Number(product.originalPrice || 0) > price) score += 8;
            return { product, score };
          })
          .filter(Boolean)
          .sort((a, b) => b.score - a.score || Number(b.product.averageRating || 0) - Number(a.product.averageRating || 0))
          .filter((entry) => entry.score > 0 || min || max)
          .map((entry) => entry.product);

        if (matched.length > 0) {
          const priceNote = min || max
            ? ` trong mức giá${min ? ` từ ${min.toLocaleString("vi-VN")}đ` : ""}${max ? ` đến ${max.toLocaleString("vi-VN")}đ` : ""}`
            : "";
          replyContent = `Mình hiểu bạn đang cần${occasion ? ` trang phục ${occasion[0]}` : " sản phẩm phù hợp"}${requestedColors.length ? `, màu ${requestedColors.join("/")}` : ""}${priceNote}. Mình tìm thấy ${matched.length} lựa chọn đang còn hàng và xếp mẫu phù hợp nhất lên trước:`;
        } else {
          matched = activeProducts
            .sort((a, b) => Number(b.averageRating || 0) - Number(a.averageRating || 0))
            .slice(0, 4);
          replyContent = `Mình đã hiểu yêu cầu “${queryText}” nhưng hiện chưa có mẫu đáp ứng đủ tất cả điều kiện. Bạn có thể nới mức giá, đổi màu hoặc cho mình biết loại đồ/size để mình lọc chính xác hơn. Đây là vài mẫu đang còn hàng để bạn tham khảo:`;
        }
      }

      const aiReply = {
        id: "ai_reply_" + Date.now(),
        sender: "ai",
        content: replyContent,
        matchedProducts: matched.slice(0, 5),
        time: new Date().toISOString()
      };

      setAiMessages((prev) => [...prev, aiReply]);
    }, 800);
  };

  const handleAiSend = (e) => {
    e.preventDefault();
    triggerAiQuery();
  };

  return (
    <div className="fixed bottom-3 right-3 z-50 flex max-w-[calc(100vw-1.5rem)] flex-col items-end sm:bottom-6 sm:right-6">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 h-[min(520px,calc(100dvh-7rem))] w-[min(380px,calc(100vw-1.5rem))] bg-white border border-zinc-200 shadow-2xl rounded-3xl overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-250">
          
          {/* Header */}
          <div className="bg-zinc-950 text-white px-5 py-4 flex flex-col shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center font-black text-xs text-white">
                  FS
                </div>
                <div>
                  <h3 className="font-extrabold text-sm tracking-wide">Hỗ trợ FoxStyle</h3>
                  <p className="text-[10px] text-zinc-400 font-semibold">Tích hợp Trợ lý AI và Chat tay</p>
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

            {/* Mode Tabs Select */}
            <div className="flex bg-zinc-900 p-1 rounded-xl mt-3 text-xs font-semibold text-zinc-400">
              <button
                onClick={() => setActiveTab("staff")}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center space-x-1 transition ${
                  activeTab === "staff" ? "bg-zinc-800 text-white font-bold" : "hover:text-white"
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Tư vấn viên</span>
              </button>
              <button
                onClick={() => setActiveTab("ai")}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center space-x-1 transition ${
                  activeTab === "ai" ? "bg-zinc-800 text-white font-bold" : "hover:text-white"
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>Trợ lý AI tìm đồ</span>
              </button>
            </div>
          </div>

          {/* TAB 1: STAFF CHAT */}
          {activeTab === "staff" && (
            <>
              {/* Auto Bot Toggle bar */}
              <div className="px-4 py-2 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-700">Tư vấn viên trực tuyến</span>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <span className="text-[9px] text-zinc-500 font-extrabold uppercase">
                    {isAutoReplyEnabled ? "Auto Bot" : "Manual"}
                  </span>
                  <input
                    type="checkbox"
                    checked={isAutoReplyEnabled}
                    onChange={(e) => setIsAutoReplyEnabled(e.target.checked)}
                    className="rounded text-orange-600 focus:ring-orange-500 h-3 w-3 border-zinc-300"
                  />
                </label>
              </div>

              {/* Chat Thread */}
              <div
                ref={staffThreadRef}
                onScroll={(event) => handleThreadScroll(event, staffAutoScrollRef)}
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/50"
              >
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
                    <MessageSquare className="h-10 w-10 text-zinc-300" />
                    <p className="text-xs font-bold text-zinc-800">
                      {staffSubTab === "general" ? "Phòng chat chung FoxStyle" : "Liên hệ tư vấn viên"}
                    </p>
                    <p className="text-[11px] text-zinc-500 max-w-[200px] leading-relaxed">
                      {staffSubTab === "general" 
                        ? "Gửi tin nhắn công khai trong phòng chat chung để mọi người cùng thảo luận nhé!"
                        : "Nhập tin nhắn bên dưới để bắt đầu trò chuyện riêng tư với nhân viên của chúng tôi!"}
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = currentUser && String(msg.senderId) === String(currentUser.id);
                    const isSystem = msg.senderRole === "system";

                    if (isSystem) {
                      return (
                        <div key={msg.id} className="text-center">
                          <span className="inline-block px-2.5 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[10px] text-zinc-500 font-bold">
                            {normalizeVietnameseText(msg.content)}
                          </span>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={msg.id}
                        className={`flex items-start gap-2.5 ${isMe ? "justify-end" : ""}`}
                      >
                        {!isMe && (
                          <div className="w-7 h-7 rounded-full bg-zinc-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0 shadow-sm">
                            {msg.senderName.charAt(0)}
                          </div>
                        )}
                        <div className="max-w-[70%]">
                          {!isMe && (
                            <span className="block text-[8px] text-zinc-400 font-extrabold mb-0.5 ml-1 uppercase">
                              {normalizeVietnameseText(msg.senderName)} ({msg.senderRole === "admin" ? "Quản trị" : msg.senderRole === "staff" ? "Nhân viên" : "Khách"})
                            </span>
                          )}
                          <div
                            className={`whitespace-pre-line p-3 rounded-2xl text-xs font-medium leading-relaxed ${
                              isMe
                                ? "bg-zinc-950 text-white rounded-tr-none shadow-sm"
                                : "bg-white border border-zinc-200 text-zinc-800 rounded-tl-none shadow-sm"
                            }`}
                          >
                            {normalizeVietnameseText(msg.content)}
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

              {/* Input bar */}
              <form onSubmit={handleSend} className="p-3 border-t border-zinc-150 bg-white flex flex-wrap gap-2">
                {staffInputError && (
                  <p className="w-full text-[10px] font-semibold text-red-600" role="alert">
                    {staffInputError}
                  </p>
                )}
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    if (staffInputError) setStaffInputError("");
                  }}
                  placeholder="Nhập câu hỏi đến cửa hàng..."
                  className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-zinc-900 focus:bg-white transition"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2 rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 hover:scale-105 transition disabled:opacity-50 disabled:scale-100 flex items-center justify-center shrink-0"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </>
          )}

          {/* TAB 2: AI OUTFIT FINDER */}
          {activeTab === "ai" && (
            <>
              {/* Chat Thread */}
              <div
                ref={aiThreadRef}
                onScroll={(event) => handleThreadScroll(event, aiAutoScrollRef)}
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-amber-50/10"
              >
                {aiMessages.map((msg) => {
                  const isMe = msg.sender === "user";
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                    >
                      <div className={`flex items-start gap-2.5 ${isMe ? "justify-end" : ""}`}>
                        {!isMe && (
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold flex items-center justify-center shrink-0">
                            <Bot className="h-4 w-4" />
                          </div>
                        )}
                        <div className="max-w-[85%]">
                          <div
                            className={`p-3 rounded-2xl text-xs font-medium leading-relaxed ${
                              isMe
                                ? "bg-amber-600 text-white rounded-tr-none"
                                : "bg-white border border-zinc-200 text-zinc-800 rounded-tl-none shadow-sm"
                            }`}
                          >
                            {normalizeVietnameseText(msg.content)}
                          </div>
                        </div>
                      </div>

                      {/* Display Matched Products Cards */}
                      {!isMe && msg.matchedProducts && msg.matchedProducts.length > 0 && (
                        <div className="w-full pl-9 mt-3 overflow-x-auto flex gap-3 pb-2 scrollbar-thin">
                          {msg.matchedProducts.map((prod) => (
                            <Link
                              key={prod.id}
                              to={`/products/${prod.id}`}
                              onClick={() => setIsOpen(false)} // Close widget on redirect
                              className="w-36 bg-white border border-zinc-150 rounded-2xl p-2 shrink-0 shadow-sm hover:border-orange-500 transition block text-left group"
                            >
                              <div className="aspect-square bg-zinc-50 rounded-xl overflow-hidden relative border border-zinc-100">
                                <img
                                  src={prod.image}
                                  alt={prod.name}
                                  className="w-full h-full object-cover group-hover:scale-103 transition"
                                />
                              </div>
                              <h4 className="text-[10px] font-extrabold text-zinc-800 mt-2 line-clamp-2 leading-tight">
                                {prod.name}
                              </h4>
                              <p className="text-[11px] font-black text-orange-600 mt-1">
                                {prod.price.toLocaleString("vi-VN")}đ
                              </p>
                            </Link>
                          ))}
                        </div>
                      )}

                      <span className="block text-[8px] text-zinc-400 font-semibold mt-1 px-10">
                        {new Date(msg.time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                  );
                })}
                <div ref={aiMessagesEndRef} />
              </div>

              {/* Quick Choice Chips */}
              <div className="px-3 py-2 border-t border-zinc-100 bg-amber-50/30 overflow-x-auto flex gap-1.5 scrollbar-thin">
                {[
                  "📏 Tư vấn Size (1m65, 55kg)",
                  "💼 Đi làm công sở",
                  "💃 Dự tiệc sang trọng",
                  "🏖️ Đồ đi biển",
                  "✨ FoxStyle Premium"
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => triggerAiQuery(chip)}
                    className="px-2.5 py-1 bg-white hover:bg-amber-600 hover:text-white border border-amber-200 text-amber-900 rounded-full text-[10px] font-extrabold whitespace-nowrap transition cursor-pointer shadow-2xs"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Input bar */}
              <form onSubmit={handleAiSend} className="p-3 border-t border-zinc-150 bg-white flex flex-wrap gap-2">
                {aiInputError && (
                  <p className="w-full text-[10px] font-semibold text-red-600" role="alert">
                    {aiInputError}
                  </p>
                )}
                <input
                  type="text"
                  value={aiInputText}
                  onChange={(e) => {
                    setAiInputText(e.target.value);
                    if (aiInputError) setAiInputError("");
                  }}
                  placeholder="Hỏi AI chọn size, outfit đi làm, đầm hoa..."
                  className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-amber-500 focus:bg-white transition"
                />
                <button
                  type="submit"
                  disabled={!aiInputText.trim()}
                  className="p-2 rounded-xl bg-amber-600 text-white hover:bg-amber-700 hover:scale-105 transition disabled:opacity-50 disabled:scale-100 flex items-center justify-center shrink-0"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </>
          )}

        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-zinc-950 text-white shadow-2xl transition hover:scale-105 hover:bg-zinc-800 active:scale-95 sm:h-14 sm:w-14"
        title="Trò chuyện hỗ trợ"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
        {!isOpen && activeTab === "ai" && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-white text-[8px] font-black animate-bounce">
            AI
          </span>
        )}
      </button>
    </div>
  );
}
