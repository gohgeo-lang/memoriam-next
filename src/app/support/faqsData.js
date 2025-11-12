"use client";
import React, { useState, useRef, useEffect } from "react";

export default function ChatBot({ className, faqs }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "안녕하세요 🐾 반려동물 장례 서비스 FAQ 챗봇입니다.\n궁금한 점을 입력해주세요. 예: '장례 절차', '추모관', '예약 취소' 등",
    },
  ]);
  const [input, setInput] = useState("");
  const [adminConnected, setAdminConnected] = useState(false);
  const [pendingOptions, setPendingOptions] = useState(null); // 다중 선택 대기 상태
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 관련 FAQ 찾기 (부분일치)
  const findRelatedFAQs = (keyword) => {
    const normalized = keyword.trim().toLowerCase();
    const related = [];
    for (const section of faqs) {
      for (const item of section.items) {
        if (item.q.toLowerCase().includes(normalized)) {
          related.push(item);
        }
      }
    }
    return related;
  };

  const handleSend = () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

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
          text: "관리자에게 연결되었습니다. 메시지를 작성하세요.",
        },
      ]);
      setInput("");
      setPendingOptions(null);
      return;
    }

    // 사용자가 이전에 선택해야 하는 옵션이 있는 경우
    if (pendingOptions) {
      const choice = parseInt(trimmedInput);
      if (!isNaN(choice) && choice >= 1 && choice <= pendingOptions.length) {
        const selected = pendingOptions[choice - 1];
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: `${selected.a}\n\n원하는 답변이 없으셨다면 "연결"을 입력해주세요.`,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "잘못된 선택입니다. 번호를 다시 입력해주세요.",
          },
        ]);
        setInput("");
        return;
      }
      setPendingOptions(null);
      setInput("");
      return;
    }

    // 관련 질문 찾기
    const relatedFAQs = findRelatedFAQs(trimmedInput);

    if (relatedFAQs.length === 0) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `관련된 정보를 찾지 못했습니다.\n원하시는 답변이 없으셨다면 "연결"을 입력해주세요.`,
        },
      ]);
    } else if (relatedFAQs.length === 1) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `${relatedFAQs[0].a}\n\n원하시는 답변이 없으셨다면 "연결"을 입력해주세요.`,
        },
      ]);
    } else {
      // 여러 관련 질문이 있는 경우
      const optionList = relatedFAQs
        .map((item, i) => `${i + 1}. ${item.q}`)
        .join("\n");
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `여러 관련 질문이 있습니다. 원하시는 항목 번호를 입력해주세요:\n${optionList}`,
        },
      ]);
      setPendingOptions(relatedFAQs);
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
