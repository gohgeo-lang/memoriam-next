"use client";

import ChatBot from "./ChatBot"; // ✅ 같은 폴더 안에 있으므로 이렇게
import faqs from "../../support/faqsData"; // ✅ support는 app 밑에 있으니까 이렇게 올라가야 함

export default function ChatBotWrapper() {
  return <ChatBot faqs={faqs} />;
}
