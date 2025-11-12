"use client";
import React, { useState, useRef, useEffect } from "react";

export default function ChatBot({ className, faqs }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [adminConnected, setAdminConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const lastMessageRef = useRef(""); // 마지막 전송 메시지 저장

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getFAQAnswer = (question) => {
    for (const section of faqs) {
      for (const item of section.items) {
        if (item.q.trim() === question.trim()) {
          return item.a;
        }
      }
    }
    return null;
  };

  const handleSend = () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    // 동일한 질문 반복 입력 방지
    if (trimmedInput === lastMessageRef.current) {
      setInput("");
      return;
    }
    lastMessageRef.current = trimmedInput;

    // 사용자 메시지 추가
    const userMessage = { sender: "user", text: trimmedInput };
    setMessages((prev) => [...prev, userMessage]);

    // 관리자 연결 요청
    if (trimmedInput === "연결") {
      setAdminConnected(true);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "관리자에게 연결되었습니다. 메세지를 작성하세요.",
        },
      ]);
      setInput("");
      return;
    }

    // FAQ 답변 찾기 (정확 일치만)
    const answer = getFAQAnswer(trimmedInput);
    if (answer) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `${answer}\n\n원하는 답변이 없으셨나요? 관리자 연결을 원하시면 "연결"을 입력해주세요.`,
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `관련된 정보를 찾지 못했습니다.\n원하는 답변이 없으셨나요? 관리자 연결을 원하시면 "연결"을 입력해주세요.`,
        },
      ]);
    }

    setInput("");
  };

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
