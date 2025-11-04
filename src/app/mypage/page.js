"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function MyPage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    fetch("/api/users/me")
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []);

  if (!user)
    return <p className="text-center mt-10 text-gray-500">로딩 중...</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5 flex flex-col items-center">
      <div className="flex flex-col items-center mb-6">
        <Image
          src={user.image || "/default-avatar.png"}
          alt="프로필"
          width={80}
          height={80}
          className="rounded-full border border-gray-300 object-cover"
        />
        <h2 className="text-lg font-semibold mt-2">{user.name || "사용자"}</h2>
        <p className="text-gray-500 text-sm">{user.email}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {[
          { id: "info", label: "내 정보" },
          { id: "address", label: "주소 관리" },
          { id: "payment", label: "결제수단" },
          { id: "points", label: "포인트" },
          { id: "posts", label: "게시물" },
          { id: "comments", label: "댓글" },
          { id: "family", label: "가족" },
          { id: "notifications", label: "알림" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1 rounded-full text-sm ${
              activeTab === tab.id
                ? "bg-[#7b5449] text-white"
                : "bg-white border border-gray-300 text-gray-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white w-full max-w-2xl rounded-lg shadow p-6">
        {activeTab === "info" && <MyInfo user={user} />}
        {activeTab === "address" && <Placeholder text="주소 관리 화면" />}
        {activeTab === "payment" && <Placeholder text="결제수단 관리 화면" />}
        {activeTab === "points" && <Placeholder text="포인트 내역 화면" />}
        {activeTab === "posts" && <Placeholder text="게시물 관리 화면" />}
        {activeTab === "comments" && <Placeholder text="댓글 관리 화면" />}
        {activeTab === "family" && <Placeholder text="가족 관리 화면" />}
        {activeTab === "notifications" && <Placeholder text="알림함 화면" />}
      </div>
    </div>
  );
}

function MyInfo({ user }) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-[#7b5449]">내 정보</h3>
      <p>이름: {user.name || "정보 없음"}</p>
      <p>이메일: {user.email}</p>
      <p>가입일: {new Date(user.createdAt).toLocaleDateString()}</p>
      <button
        className="mt-3 px-4 py-2 bg-[#7b5449] text-white rounded"
        onClick={() => alert("내 정보 수정 기능은 곧 추가됩니다.")}
      >
        내 정보 수정
      </button>
    </div>
  );
}

function Placeholder({ text }) {
  return (
    <div className="text-center text-gray-500 py-10">
      <p>{text}</p>
      <p className="text-sm mt-2">현재 준비 중입니다.</p>
    </div>
  );
}
