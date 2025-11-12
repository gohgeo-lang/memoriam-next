"use client";
import React, { useState, useRef, useEffect } from "react";

export default function ChatBot({ className, faqs }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [adminConnected, setAdminConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const lastMessageRef = useRef("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "안녕하세요 🐾 반려동물 장례 서비스 FAQ 챗봇입니다.\n궁금한 점을 입력해주세요. 예: '장례 절차', '추모관', '예약 취소' 등",
    },
  ]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ✅ 문자열 정규화 (공백, 문장부호 제거 + 소문자 변환)
  const normalize = (text) =>
    text
      .replace(/\s+/g, "")
      .replace(/[.,!?]/g, "")
      .toLowerCase();

  // ✅ FAQ 답변 검색: 1) 정확 일치 → 2) 부분 일치 (공백 무시)
  const getFAQAnswer = (question) => {
    const qNorm = normalize(question);

    // 1️⃣ 정확 일치
    for (const section of faqs) {
      for (const item of section.items) {
        if (normalize(item.q) === qNorm) {
          return { answer: item.a, keyword: item.q };
        }
      }
    }

    // 2️⃣ 부분 일치 (공백 무시)
    for (const section of faqs) {
      for (const item of section.items) {
        const itemNorm = normalize(item.q);
        if (qNorm.includes(itemNorm) || itemNorm.includes(qNorm)) {
          return { answer: item.a, keyword: item.q };
        }
      }
    }

    // 3️⃣ 아무것도 없으면 null
    return null;
  };

  const handleSend = () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    // 동일 질문 중복 방지
    if (trimmedInput === lastMessageRef.current) {
      setInput("");
      return;
    }
    lastMessageRef.current = trimmedInput;

    // 사용자 메시지 추가
    setMessages((prev) => [...prev, { sender: "user", text: trimmedInput }]);

    // 관리자 연결 처리
    if (trimmedInput === "연결") {
      setAdminConnected(true);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "관리자에게 연결되었습니다. 메시지를 작성하세요.",
        },
      ]);
      setInput("");
      return;
    }

    // FAQ 검색
    const result = getFAQAnswer(trimmedInput);
    if (result) {
      const highlighted = result.answer.replace(
        new RegExp(result.keyword, "gi"),
        (match) => `<mark class='bg-yellow-200'>${match}</mark>`
      );

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `${highlighted}\n\n원하는 답변이 없으셨나요? "연결"을 입력하시면 관리자에게 연결됩니다.`,
          html: true,
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `관련된 정보를 찾지 못했습니다.\n원하는 답변이 없으셨나요? "연결"을 입력하시면 관리자에게 연결됩니다.`,
        },
      ]);
    }

    setInput("");
  };

  // ✅ 한글 입력 중 Enter 중복 방지
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`${className} font-sans`}>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 bg-[#6D4C41] text-white px-4 py-3 rounded-full shadow-lg z-50"
        >
          Chat
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-4 right-4 w-80 h-96 bg-white border border-gray-300 rounded-xl shadow-lg flex flex-col z-50">
          {/* 헤더 */}
          <div className="flex justify-between items-center bg-[#6D4C41] text-white px-4 py-2 rounded-t-xl">
            <span>FAQ 챗봇</span>
            <button onClick={() => setIsOpen(false)} className="font-bold">
              ×
            </button>
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-[#F5F5F5]">
            {messages.map((msg, i) =>
              msg.html ? (
                <div
                  key={i}
                  className={`p-2 rounded-lg max-w-[80%] whitespace-pre-wrap break-words ${
                    msg.sender === "user"
                      ? "bg-[#D7CCC8] ml-auto"
                      : "bg-[#EFEBE9] mr-auto"
                  }`}
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                />
              ) : (
                <div
                  key={i}
                  className={`p-2 rounded-lg max-w-[80%] whitespace-pre-wrap break-words ${
                    msg.sender === "user"
                      ? "bg-[#D7CCC8] ml-auto"
                      : "bg-[#EFEBE9] mr-auto"
                  }`}
                >
                  {msg.text}
                </div>
              )
            )}
            <div ref={messagesEndRef}></div>
          </div>

          {/* 입력 영역 */}
          <div className="p-2 border-t border-gray-300 flex gap-2">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-1"
              placeholder="질문을 입력하세요..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
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
