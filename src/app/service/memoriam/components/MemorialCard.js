"use client";

import Image from "next/image";
import { FaHeart, FaEye } from "react-icons/fa";

export default function MemorialCard({ story, onOpenModal, onRemember }) {
  const handleCardClick = () => {
    onOpenModal(story);
  };

  const handleRememberClick = (e) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    onRemember(story.id);
  };

  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden transform transition-transform hover:scale-105 duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Next.js의 Image 컴포넌트 사용을 위해 div로 래핑하고 fill 속성 적용 */}
      <div className="relative h-64 w-full">
        <Image
          src={story.thumbnailUrl || "/image/dog-cat1.webp"}
          alt={story.petName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      <div className="p-6">
        <div className="uppercase tracking-wide text-sm text-[#7b5449] font-semibold">
          {story.ownerName}님의 이야기
        </div>
        <h3 className="block mt-1 text-lg leading-tight font-medium text-black truncate">
          {story.title}
        </h3>
        <p className="mt-2 text-gray-500 line-clamp-2">{story.content}</p>

        <div className="mt-4 flex justify-between items-center">
          {/* 함께 기억하기 버튼 */}
          <button
            onClick={handleRememberClick}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FaHeart className="text-red-400" />
            함께 기억하기 ({story.rememberCount})
          </button>

          {/* 이 이야기 들어보기 버튼 (모달 열기) */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // 이벤트 버블링 방지
              onOpenModal(story);
            }}
            className="text-sm font-semibold text-[#7b5449] hover:underline flex items-center gap-1"
          >
            <FaEye className="w-4 h-4" />
            자세히 보기
          </button>
        </div>
      </div>
    </div>
  );
}
