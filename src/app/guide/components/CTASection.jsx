"use client";
import Reservation from "./Reservation";
import { useState } from "react";

export default function CTASection() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen((prev) => !prev); // ← true ↔ false 토글
  };

  return (
    <section className="py-16 bg-indigo-600 text-white text-center">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          지금 상담 신청하기
        </h2>
        <p className="mb-8 text-lg md:text-xl">
          빠르고 간편하게 예약하고, 안심 서비스를 경험하세요.
        </p>
        <button
          onClick={toggleModal}
          className="bg-white text-indigo-600 font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl hover:bg-[#d9c1bb] transition"
        >
          {isOpen ? "신청 취소" : "상담 신청"}
        </button>
        <Reservation isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </section>
  );
}
