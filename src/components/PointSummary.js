"use client";

import { useEffect, useState } from "react";

export default function PointSummary({ className = "" }) {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch("/api/cookies");
        if (!res.ok) return;
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error("포인트 요약 조회 실패:", err);
      }
    };
    fetchSummary();
  }, []);

  if (!summary)
    return (
      <p className={`text-sm text-gray-400 ${className}`}>
        포인트 불러오는 중...
      </p>
    );

  return (
    <div className={`text-right ${className}`}>
      <p className="text-xs text-gray-500 mb-1">보유 포인트</p>
      <p className="text-lg font-semibold text-[#7b5449]">
        {summary.totalPoints?.toLocaleString() ?? 0}P
      </p>
    </div>
  );
}
