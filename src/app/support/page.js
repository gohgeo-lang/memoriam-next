"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function SupportPage() {
  const router = useRouter();
  const faqs = [
    {
      category: "서비스 이용 관련",
      items: [
        {
          q: "반려동물 장례 중계 플랫폼은 어떤 서비스인가요?",
          a: "전국의 인증된 장례식장 정보를 비교하고, 장례 절차를 예약·중계해드리는 서비스입니다. 디지털 추모관, 장례비용 견적, 영정사진 제작 등도 함께 이용할 수 있습니다.",
        },
        {
          q: "직접 장례식장에 가지 않아도 되나요?",
          a: "온라인으로 예약과 절차 안내가 가능하지만, 마지막 작별 인사를 위해 직접 방문하실 수도 있습니다.",
        },
        {
          q: "중계 플랫폼을 이용하면 어떤 점이 좋은가요?",
          a: "비용 투명성, 거리·평가 기반 추천, 후기 검증 시스템을 통해 안심하고 선택하실 수 있습니다.",
        },
      ],
    },
    {
      category: "장례 절차 및 비용 관련",
      items: [
        {
          q: "반려동물 장례 절차는 어떻게 진행되나요?",
          a: "접수 → 픽업(또는 방문) → 장례 절차 → 수목장/납골/자택 유골함 선택 → 디지털 추모관 등록 순으로 진행됩니다.",
        },
        {
          q: "장례비용은 어떻게 계산되나요?",
          a: "체중, 화장 방식(개별/공동), 추가 서비스(영정사진, 추모함 등)에 따라 자동 견적이 산출됩니다.",
        },
        {
          q: "견적이 실제 비용과 다른 경우도 있나요?",
          a: "현장 상황에 따라 소폭 차이가 있을 수 있지만, 모든 추가 비용은 사전 동의 후 진행됩니다.",
        },
      ],
    },
    {
      category: "디지털 추모관 관련",
      items: [
        {
          q: "디지털 추모관이란 무엇인가요?",
          a: "반려동물의 사진, 영상, 추억글을 등록하여 영원히 기억할 수 있는 온라인 공간입니다.",
        },
        {
          q: "추모관은 무료인가요?",
          a: "기본형은 무료 제공, 프리미엄(맞춤 디자인, 음악 삽입 등)은 유료로 이용 가능합니다.",
        },
        {
          q: "가족이나 친구와 공유할 수 있나요?",
          a: "링크로 공유하거나, 함께 작성 권한을 부여할 수 있습니다.",
        },
      ],
    },
    {
      category: "영정사진 서비스 관련",
      items: [
        {
          q: "영정사진은 어떻게 만들어지나요?",
          a: "업로드한 사진을 기반으로 AI 및 전문 디자이너가 합성·보정하여 제작합니다.",
        },
        {
          q: "사진 퀄리티가 좋지 않아도 괜찮나요?",
          a: "해상도가 높을수록 좋지만, 보정 서비스를 통해 보완할 수 있습니다.",
        },
        {
          q: "제작된 영정사진은 어디서 받나요?",
          a: "장례 당일 출력본과 함께, 디지털 파일 형태로 이메일/문자로 전송됩니다.",
        },
      ],
    },
    {
      category: "예약 및 취소 관련",
      items: [
        {
          q: "예약은 언제까지 가능한가요?",
          a: "24시간 실시간 접수 가능합니다. 단, 일부 지역은 야간 픽업이 제한될 수 있습니다.",
        },
        {
          q: "예약 취소나 변경은 어떻게 하나요?",
          a: "장례 진행 2시간 전까지는 무료 취소 가능하며, 이후에는 일부 위약금이 발생할 수 있습니다.",
        },
      ],
    },
    {
      category: "기타 문의",
      items: [
        {
          q: "반려동물의 종에 따라 장례 방식이 다른가요?",
          a: "네, 체중과 종에 따라 장례 절차와 비용이 달라집니다. 견적 시 자동 반영됩니다.",
        },
        {
          q: "유골 보관은 어떻게 하나요?",
          a: "수목장, 납골당, 유골함 보관 등 여러 옵션을 안내드립니다.",
        },
        {
          q: "사람처럼 제사도 가능한가요?",
          a: "추모관의 ‘기일 알림’ 기능을 통해 매년 헌화 서비스를 제공합니다.",
        },
      ],
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="max-w-[800px] mx-auto py-16 px-6">
      <h1 className="text-3xl font-bold text-center mb-10 text-[#5D4037]">
        자주 묻는 질문 (FAQ)
      </h1>

      {faqs.map((section, i) => (
        <div key={i} className="mb-10">
          <h2 className="text-xl font-semibold text-[#6D4C41] mb-4 border-b pb-2">
            {section.category}
          </h2>
          {section.items.map((item, j) => {
            const index = `${i}-${j}`;
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border border-[#D7CCC8] rounded-xl mb-2 transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left px-5 py-3 flex justify-between items-center"
                >
                  <span className="font-medium text-[#4E342E]">{item.q}</span>
                  <span className="text-[#A1887F] text-lg">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-4 text-[#5D4037] bg-[#EFEBE9]">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      {/* 하단 CTA 버튼들 */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
        <button
          onClick={() => router.push("/service/estimate")}
          className="bg-[#6D4C41] hover:bg-[#5D4037] text-white px-6 py-3 rounded-xl shadow-md transition-all"
        >
          장례비용 간단 계산
        </button>
        <button
          onClick={() => router.push("/service/memoriam")}
          className="bg-[#6D4C41] hover:bg-[#5D4037] text-white px-6 py-3 rounded-xl shadow-md transition-all"
        >
          디지털 추모관 이용하기
        </button>
        <button
          onClick={() => router.push("/service/photo")}
          className="bg-[#6D4C41] hover:bg-[#5D4037] text-white px-6 py-3 rounded-xl shadow-md transition-all"
        >
          영정사진 제작하기
        </button>
      </div>
    </div>
  );
}
