"use client";

import { useEffect, useState } from "react";
import { Gift, CheckCircle2, PawPrint, PlayCircle } from "lucide-react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function CookiesPage() {
  const [quests, setQuests] = useState([]);
  const [total, setTotal] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [adModal, setAdModal] = useState(false);
  const [adTimer, setAdTimer] = useState(5);
  const [adRunning, setAdRunning] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/cookies");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "데이터 로드 실패");

      setQuests(data.quests || []);
      setTotal(data.totalCookies || 0);
      setCompletedCount(data.completedCount || 0);
    } catch (err) {
      toast.error("쿠키 정보를 불러오지 못했습니다");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const claim = async (type, bonus = false) => {
    try {
      const res = await fetch("/api/cookies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, bonus }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        setCompletedCount(data.completedCount || 0);
        fetchData();
      } else {
        toast.error(data.message || "보상 실패");
      }
    } catch (err) {
      toast.error("보상 처리 실패");
    }
  };

  const startAd = () => {
    if (adRunning) return;
    setAdRunning(true);
    setAdModal(true);
    setAdTimer(5);

    let t = 5;
    const timer = setInterval(() => {
      t -= 1;
      setAdTimer(t);
      if (t <= 0) {
        clearInterval(timer);
        setAdModal(false);
        setAdRunning(false);
        claim("ad_watch", true);
      }
    }, 1000);
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-500">불러오는 중...</p>;

  const fixedOrder = ["login_today", "write_post", "write_comment", "ad_watch"];
  const fixedQuests = quests.filter((q) => fixedOrder.includes(q.type));
  const randomQuests = quests.filter((q) => !fixedOrder.includes(q.type));

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5 relative">
      <Toaster position="top-center" />

      {adModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white w-80 p-6 rounded-xl text-center">
            <p className="text-lg font-semibold text-[#7b5449]">광고 시청중</p>
            <p className="text-2xl font-bold mt-3 text-[#7b5449]">
              {adTimer} 초 남음
            </p>
          </div>
        </div>
      )}

      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow p-6 mb-6 text-center">
        <PawPrint className="mx-auto text-[#7b5449] w-10 h-10 mb-2" />
        <h2 className="text-lg font-semibold text-[#7b5449]">내 쿠키</h2>
        <p className="text-3xl font-bold text-[#7b5449] mt-1">
          {total.toLocaleString()}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          오늘의 미션을 완료하고 쿠키를 모아보세요
        </p>
      </div>

      <div className="text-center text-sm text-gray-600 mb-6">
        지금까지 완료한 미션
        <span className="font-semibold text-[#7b5449]">{completedCount}</span>개
      </div>

      <div className="space-y-4 max-w-xl mx-auto">
        <h3 className="text-[#7b5449] font-semibold text-sm mb-1 mt-4">
          데일리미션
        </h3>

        {fixedQuests.map((q) => (
          <div
            key={q.type}
            className={`flex justify-between items-center bg-white rounded-xl shadow p-4 ${
              q.rewarded ? "opacity-60" : ""
            }`}
          >
            <div>
              <p className="font-medium text-gray-800">{q.label}</p>
              <p className="text-xs text-gray-500">보상: {q.reward}</p>
            </div>

            {q.rewarded ? (
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            ) : q.completed ? (
              q.type === "ad_watch" ? (
                <button
                  onClick={() => claim(q.type)}
                  className="bg-[#7b5449] text-white text-sm px-4 py-1 rounded-lg hover:bg-[#6a483d]"
                >
                  보상받기
                </button>
              ) : (
                <button
                  onClick={() => claim(q.type)}
                  className="bg-[#7b5449] text-white text-sm px-4 py-1 rounded-lg hover:bg-[#6a483d]"
                >
                  보상받기
                </button>
              )
            ) : q.type === "ad_watch" ? (
              <button
                onClick={startAd}
                className="flex items-center gap-1 bg-[#7b5449] text-white text-sm px-4 py-1 rounded-lg hover:bg-[#6a483d]"
              >
                <PlayCircle className="w-4 h-4" />
                광고보기
              </button>
            ) : (
              <span className="text-xs text-gray-400">퀘스트 미완료</span>
            )}
          </div>
        ))}

        <h3 className="text-[#7b5449] font-semibold text-sm mb-1 mt-8">
          오늘의 미션
        </h3>

        {randomQuests.map((q) => (
          <div
            key={q.type}
            className={`flex justify-between items-center bg-white rounded-xl shadow p-4 ${
              q.rewarded ? "opacity-60" : ""
            }`}
          >
            <div>
              <p className="font-medium text-gray-800">{q.label}</p>
              <p className="text-xs text-gray-500">보상: {q.reward}</p>
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
              <span className="text-xs text-gray-400">미션 미완료</span>
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
