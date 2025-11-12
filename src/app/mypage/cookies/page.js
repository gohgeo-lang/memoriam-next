"use client";

import { useEffect, useState } from "react";
import { Gift, CheckCircle2, PawPrint, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function CookiesPage() {
  const [quests, setQuests] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const res = await fetch("/api/cookies");
    const data = await res.json();
    setQuests(data.quests || []);
    setTotal(data.totalCookies || 0);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const claim = async (type) => {
    const res = await fetch("/api/cookies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });
    const data = await res.json();

    if (data.message?.includes("획득")) {
      toast.success(data.message);
      fetchData();
    } else {
      toast.error(data.message || "보상받을 수 없습니다 🐾");
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-500">불러오는 중...</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5">
      <Toaster position="top-center" />

      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow p-6 mb-6 text-center">
        <PawPrint className="mx-auto text-[#7b5449] w-10 h-10 mb-2" />
        <h2 className="text-lg font-semibold text-[#7b5449]">내 쿠키</h2>
        <p className="text-3xl font-bold text-[#7b5449] mt-1">
          {total.toLocaleString()} 🍪
        </p>
        <p className="text-sm text-gray-500 mt-1">
          오늘의 퀘스트를 완료하고 쿠키를 모아보세요!
        </p>
      </div>

      <div className="space-y-4 max-w-xl mx-auto">
        {quests.map((q) => (
          <div
            key={q.type}
            className={`flex justify-between items-center bg-white rounded-xl shadow p-4 ${
              q.rewarded ? "opacity-60" : ""
            }`}
          >
            <div>
              <p className="font-medium text-gray-800">{q.label}</p>
              <p className="text-xs text-gray-500">보상: {q.reward} 🍪</p>
            </div>

            {q.rewarded ? (
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            ) : q.completed ? (
              <button
                onClick={() => claim(q.type)}
                className="bg-[#7b5449] text-white text-sm px-4 py-1 rounded-lg hover:bg-[#6a483d]"
              >
                보상받기
              </button>
            ) : (
              <span className="text-xs text-gray-400">퀘스트 미완료</span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Link
          href="/mypage"
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg transition"
        >
          돌아가기
        </Link>
      </div>
    </div>
  );
}
