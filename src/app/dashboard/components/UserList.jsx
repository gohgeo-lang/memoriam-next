"use client";
import React from "react";

export default function UserList({ data, onEdit, onDelete }) {
  if (!data?.length)
    return (
      <p className="text-center text-gray-500 mt-10">
        등록된 사용자가 없습니다.
      </p>
    );

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-2 py-2 sm:px-0">
        <div className="bg-gray-400 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 shadow-xl p-2 gap-1">
          {data.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1 p-6 flex flex-col items-center"
            >
              {/* 프로필 */}
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl font-bold mb-4">
                {user.name ? user.name.charAt(0) : "?"}
              </div>

              {/* 사용자 정보 */}
              <h2 className="text-lg font-semibold text-gray-800">
                {user.name || "이름 정보 없음"}
              </h2>
              <p className="text-gray-500 mb-3">
                {user.email || "이메일 정보 없음"}
              </p>

              {/* 버튼 */}
              <div className="mt-auto flex gap-3">
                <button
                  onClick={() => onEdit?.(user)}
                  className="text-sm text-blue-600 font-medium hover:underline"
                >
                  수정
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => onDelete?.(user)}
                  className="text-sm text-red-500 font-medium hover:underline"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
