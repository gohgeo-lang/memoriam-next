"use client";

import { useEffect, useState } from "react";

export default function PointsPage() {
  const [points, setPoints] = useState([]);
  const [balance, setBalance] = useState(0);

  const fetchPoints = async () => {
    const res = await fetch("/api/points");
    const data = await res.json();
    setPoints(data);
    const total = data.reduce((acc, p) => {
      return p.type === "earn" ? acc + p.amount : acc - p.amount;
    }, 0);
    setBalance(total);
  };

  useEffect(() => {
    fetchPoints();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-5">
      <h2 className="text-lg font-semibold text-[#7b5449] mb-6 flex items-center gap-2">
        포인트 내역
      </h2>

      <div className="bg-white shadow rounded-xl p-6 mb-6 text-center">
        <p className="text-sm text-gray-500 mb-1">현재 잔액</p>
        <p className="text-2xl font-semibold text-[#7b5449]">
          {balance.toLocaleString()} P
        </p>
      </div>

      <div className="space-y-3 max-w-2xl mx-auto">
        {points.length === 0 ? (
          <p className="text-center text-gray-400 text-sm">
            포인트 내역이 없습니다.
          </p>
        ) : (
          points.map((p) => (
            <div
              key={p.id}
              className={`bg-white shadow-sm rounded-xl p-4 border-l-4 ${
                p.type === "earn" ? "border-l-green-500" : "border-l-red-400"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-800">
                  {p.description ||
                    (p.type === "earn" ? "포인트 적립" : "포인트 사용")}
                </span>
                <span
                  className={`font-semibold ${
                    p.type === "earn" ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {p.type === "earn" ? "+" : "-"}
                  {p.amount.toLocaleString()} P
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {new Date(p.createdAt).toLocaleString("ko-KR")}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
