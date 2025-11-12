"use client";

import React, { useState, useEffect, useRef } from "react";

export default function ChatBot({ className, faqs }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [adminConnected, setAdminConnected] = useState(false);
  const [usedFAQs, setUsedFAQs] = useState(new Set()); // ✅ 이미 답변한 FAQ 기록
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "안녕하세요 🐾 반려동물 장례 서비스 FAQ 챗봇입니다.\n궁금한 점을 입력해주세요. 예: '장례 절차', '추모관', '예약 취소' 등",
    },
  ]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const normalize = (str) => str.replace(/\s+/g, "").toLowerCase();

  const findBestMatch = (question) => {
    const normalizedInput = normalize(question);

    // 너무 짧은 입력은 무시 (오탐 방지)
    if (normalizedInput.length < 2) return null;

    let best = null;
    let maxScore = 0;

    for (const section of faqs) {
      for (const item of section.items) {
        if (usedFAQs.has(item.q)) continue; // 이미 사용된 FAQ 제외

        const normalizedQ = normalize(item.q);

        let score = 0;

        // 간단 유사도: 포함 여부 + 길이 비율
        if (normalizedQ.includes(normalizedInput)) {
          score = normalizedInput.length / normalizedQ.length;
        } else if (normalizedInput.includes(normalizedQ)) {
          score = normalizedQ.length / normalizedInput.length;
        }

        if (score > maxScore) {
          maxScore = score;
          best = item;
        }
      }
    }

    return maxScore >= 0.3 ? best : null; // 0.3 이상만 선택
  };

  const handleSend = () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const userMessage = { sender: "user", text: trimmedInput };
    setMessages((prev) => [...prev, userMessage]);

    if (trimmedInput === "연결") {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "관리자에게 연결되었습니다. 메시지를 작성해주세요. 💬",
        },
      ]);
      setAdminConnected(true);
      setInput("");
      return;
    }

    const matchedFAQ = findBestMatch(trimmedInput);

    if (matchedFAQ) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `${matchedFAQ.a}\n\n더 궁금한 점이 있으신가요? '연결'을 입력하면 관리자에게 문의할 수 있습니다.`,
        },
      ]);

      // 사용한 FAQ 기록
      setUsedFAQs((prev) => new Set(prev).add(matchedFAQ.q));
    } else {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `관련된 정보를 찾지 못했어요 😥\n"연결"을 입력해 관리자에게 문의해주세요.`,
        },
      ]);
    }

    setInput("");
  };

  return (
    <div className={`${className} font-sans`}>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 bg-[#6D4C41] text-white px-4 py-3 rounded-full shadow-lg z-50"
        >
          💬 Chat
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-4 right-4 w-80 h-96 bg-white border border-gray-300 rounded-xl shadow-lg flex flex-col z-50">
          <div className="flex justify-between items-center bg-[#6D4C41] text-white px-4 py-2 rounded-t-xl">
            <span>FAQ 챗봇</span>
            <button onClick={() => setIsOpen(false)} className="font-bold">
              ×
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-[#F5F5F5]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[80%] whitespace-pre-wrap ${
                  msg.sender === "user"
                    ? "bg-[#D7CCC8] ml-auto"
                    : "bg-[#EFEBE9] mr-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>

          <div className="p-2 border-t border-gray-300 flex gap-2">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-1"
              placeholder="질문을 입력하세요..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-[#6D4C41] text-white px-3 py-1 rounded-lg"
            >
              전송
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
