"use client";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

// 예제 데이터
const faqs = [
  {
    category: "장례 절차",
    items: [
      {
        q: "반려동물 장례는 어떤 순서로 진행되나요?",
        a: "기본적으로 1) 임종 확인 2) 장례 방식 선택 3) 염습 4) 입관 5) 고별식 6) 화장 또는 매장 순으로 진행됩니다. 각 단계는 유가족의 의향에 따라 조정 가능합니다.",
      },
      {
        q: "장례 준비에 얼마나 시간이 걸리나요?",
        a: "연락 주시면 2시간 이내에 전문 장례지도사가 방문 가능합니다. 전체 장례 절차는 보통 4~5시간 정도 소요됩니다.",
      },
    ],
  },
  {
    category: "비용 안내",
    items: [
      {
        q: "장례 비용은 어떻게 되나요?",
        a: "기본 장례 패키지는 50만원부터 시작하며, 반려동물의 크기와 선택하신 서비스에 따라 차등 적용됩니다. 자세한 견적은 상담을 통해 안내해 드립니다.",
      },
      {
        q: "부대비용이 추가될 수 있나요?",
        a: "화장, 유골함 선택, 장례식장 대여 등에 따라 추가 비용이 발생할 수 있습니다. 모든 비용은 사전에 투명하게 안내해 드립니다.",
      },
    ],
  },
  {
    category: "준비사항",
    items: [
      {
        q: "장례식 전에 준비해야 할 것들이 있나요?",
        a: "반려동물의 평소 사진과 추억이 담긴 물품들을 준비해 주시면 좋습니다. 장례식장 꾸미기와 고별식에 사용됩니다.",
      },
      {
        q: "긴급상황 시 어떻게 해야 하나요?",
        a: "24시간 긴급전화(1588-0000)로 연락 주시면 즉시 전문 상담원이 응대해 드립니다. 야간에도 신속한 출동이 가능합니다.",
      },
    ],
  },
];

export default function FAQ() {
  const [openIndexes, setOpenIndexes] = useState({}); // { "장례 절차-0": true, ... }

  const toggle = (category, index) => {
    const key = `${category}-${index}`;
    setOpenIndexes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        자주 묻는 질문
      </h1>

      <div className="space-y-8">
        {faqs.map((section) => (
          <section
            key={section.category}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {section.category}
            </h2>
            <div className="space-y-4">
              {section.items.map((item, idx) => {
                const key = `${section.category}-${idx}`;
                const isOpen = openIndexes[key];
                return (
                  <article key={key} className="border-b border-gray-200">
                    <button
                      onClick={() => toggle(section.category, idx)}
                      className="w-full text-left py-4 flex justify-between items-center focus:outline-none"
                    >
                      <span className="text-gray-900 font-medium">
                        {item.q}
                      </span>
                      {isOpen ? (
                        <FaChevronUp className="text-indigo-600" />
                      ) : (
                        <FaChevronDown className="text-indigo-600" />
                      )}
                    </button>
                    {isOpen && <p className="text-gray-600 py-2">{item.a}</p>}
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
