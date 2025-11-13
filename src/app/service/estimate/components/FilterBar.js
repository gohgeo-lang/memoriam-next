// components/FilterBar.jsx
"use client";
import { useState } from "react";

const TAGS = ["24시간", "픽업", "개별화장", "유골함제공", "추모실"];

export default function FilterBar({ onChange }) {
  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("");
  const [tags, setTags] = useState([]);
  const [sort, setSort] = useState("추천");

  const toggleTag = (t) => {
    setTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  };

  const apply = () => onChange({ keyword, city, tags, sort });

  return (
    <div className="rounded-xl p-4 m-2 bg-[#d5d5d5] shadow-sm">
      {/* 입력 & 필터 영역 */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col md:flex-row flex-1 gap-3 md:items-end">
          {/* 검색 input */}
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="업체명, 서비스 검색"
            className="w-full md:flex-1 md:max-w-lg rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7b5449]"
          />

          {/* 지역, 정렬, 적용 버튼을 한 줄로 */}
          <div className="flex flex-row gap-2 w-full md:w-auto mt-2 md:mt-0">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7b5449]"
            >
              <option value="">지역 전체</option>
              <option value="서울">서울</option>
              <option value="부산">부산</option>
              <option value="대구">대구</option>
              <option value="인천">인천</option>
              <option value="광주">광주</option>
              <option value="대전">대전</option>
              <option value="울산">울산</option>
              <option value="세종">세종</option>
              <option value="경기">경기</option>
              <option value="강원">강원</option>
              <option value="충청북도">충청북도</option>
              <option value="충청남도">충청남도</option>
              <option value="전북">전북</option>
              <option value="전라남도">전라남도</option>
              <option value="경상북도">경상북도</option>
              <option value="경상남도">경상남도</option>
              <option value="제주">제주</option>
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7b5449]"
            >
              <option>추천</option>
              <option>거리순</option>
              <option>낮은가격</option>
              <option>높은평점</option>
            </select>

            <button
              onClick={apply}
              className="flex-1 rounded-lg border px-4 py-2 text-sm text-black hover:scale-105 hover:bg-[#7b5449] hover:text-white active:scale-95 transition-transform duration-150"
            >
              적용
            </button>
          </div>
        </div>
      </div>

      {/* 태그 버튼 영역 */}
      <div className="mt-3 flex flex-wrap gap-2">
        {TAGS.map((t) => (
          <button
            key={t}
            onClick={() => toggleTag(t)}
            className={`rounded-full px-3 py-1 text-xs transition-colors duration-200 ${
              tags.includes(t)
                ? "bg-[#7b5449] text-white"
                : "bg-gray-200 text-[#7b5449] hover:bg-[#7b5449]/50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
