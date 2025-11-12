"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import LoadingSpinner from "@/components/LoadingSpinner";
import Section from "@/components/Section";

export default function CookieHistoryPage() {
  const { data: session, status } = useSession();
  const [histories, setHistories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      setIsLoading(false);
      return;
    }

    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/cookies/history");
        if (!res.ok) throw new Error("히스토리를 불러오지 못했습니다.");
        const data = await res.json();
        setHistories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("쿠키 히스토리 조회 실패:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [status]);

  if (status === "loading" || isLoading)
    return <LoadingSpinner text="쿠키 내역을 불러오는 중..." />;

  if (status === "unauthenticated")
    return (
      <p className="text-center mt-10 text-gray-500">
        로그인 후 이용 가능한 페이지입니다.
      </p>
    );

  if (error)
    return (
      <div className="text-center mt-10 text-red-500">
        데이터를 불러오는 중 오류가 발생했습니다.
        <div className="mt-4">
          <button
            onClick={() => location.reload()}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition"
          >
            다시 시도
          </button>
        </div>
      </div>
    );

  if (histories.length === 0)
    return (
      <div className="min-h-screen bg-gray-50 py-10 flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">아직 쿠키 내역이 없습니다 🍪</p>

        <Link
          href="/mypage/cookies"
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg transition"
        >
          쿠키 페이지로 돌아가기
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5">
      <Section title="내 쿠키 내역">
        <div className="overflow-x-auto">
          <table className="min-w-full border-t border-gray-200 bg-white rounded-xl shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-sm text-gray-600">
                <th className="py-3 px-4 text-left w-[40%]">유형</th>
                <th className="py-3 px-4 text-left w-[20%]">수량</th>
                <th className="py-3 px-4 text-left w-[40%]">날짜</th>
              </tr>
            </thead>
            <tbody>
              {histories.map((h) => (
                <tr
                  key={h.id}
                  className="border-t text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4">
                    {h.description || h.type || "기타"}
                  </td>
                  <td className="py-3 px-4 text-[#7b5449] font-semibold">
                    +{h.amount} 🍪
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs">
                    {new Date(h.createdAt).toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/mypage/cookies"
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition"
          >
            쿠키 페이지로 돌아가기
          </Link>
        </div>
      </Section>
    </div>
  );
}
