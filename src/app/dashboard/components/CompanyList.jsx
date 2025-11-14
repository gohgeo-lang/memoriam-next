"use client";
import React from "react";

export default function CompanyList({ data, onEdit }) {
  if (!data?.length)
    return (
      <p className="text-center text-gray-500 mt-10">등록된 업체가 없습니다.</p>
    );

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-2 py-2 sm:px-0">
        <div className="bg-gray-400 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 p-2 gap-1">
          {data.map((company) => (
            <div
              key={company.id}
              className={`p-6 rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 flex flex-col justify-between
                ${
                  company.registered
                    ? "bg-white border border-gray-200"
                    : "bg-red-50 border-2 border-red-300 opacity-90"
                }`}
            >
              {/* 이름 */}
              <h2 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                {company.name || "업체명 없음"}
              </h2>

              {/* 등록 상태 */}
              <span
                className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-3 self-start ${
                  company.registered
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {company.registered ? "등록됨" : "미등록"}
              </span>

              {/* 지역 */}
              <p className="text-gray-600 text-sm mb-4">
                📍 {company.city || "지역 정보 없음"}
              </p>

              {/* 수정 버튼 */}
              <button
                onClick={() => onEdit(company)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                수정
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
