"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";

export default function MyPage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/users/me")
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setName(data.name || "");
      });
  }, []);

  if (!user)
    return <p className="text-center mt-10 text-gray-500">로딩 중...</p>;

  const handleUpdate = async () => {
    setLoading(true);
    const res = await fetch("/api/users/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }),
    });
    const updated = await res.json();
    setUser(updated);
    setPassword("");
    setLoading(false);
    alert("정보가 수정되었습니다.");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!file) return alert("이미지를 선택하세요.");
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    const res = await fetch("/api/users/upload", {
      method: "POST",
      body: formData,
    });
    const updated = await res.json();
    setUser(updated);
    setPreview(null);
    setLoading(false);
    alert("프로필 이미지가 변경되었습니다!");
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    alert("로그아웃 되었습니다.");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5 flex flex-col items-center">
      <div className="flex flex-col items-center mb-6">
        <Image
          src={preview || user.image || "/default-avatar.png"}
          alt="프로필"
          width={100}
          height={100}
          className="rounded-full border border-gray-300 object-cover"
        />
        <input type="file" onChange={handleFileChange} className="mt-2" />
        <button
          onClick={handleUpload}
          disabled={loading}
          className="mt-2 text-sm bg-[#7b5449] text-white px-3 py-1 rounded disabled:opacity-50"
        >
          프로필 변경
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {[
          { id: "info", label: "내 정보" },
          { id: "address", label: "주소 관리" },
          { id: "family", label: "가족" },
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
        {activeTab === "info" && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-[#7b5449] mb-2">
              내 정보 수정
            </h3>
            <label className="block text-sm font-medium">이름</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 w-full rounded"
            />
            <label className="block text-sm font-medium mt-3">
              비밀번호 변경
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="새 비밀번호"
              className="border p-2 w-full rounded"
            />
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="mt-4 px-4 py-2 bg-[#7b5449] text-white rounded disabled:opacity-50"
            >
              {loading ? "수정 중..." : "정보 수정"}
            </button>

            <hr className="my-5" />
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-700 text-sm"
            >
              로그아웃
            </button>
          </div>
        )}
        {activeTab === "address" && <Placeholder text="주소 관리 화면" />}
        {activeTab === "family" && <Placeholder text="가족 관리 화면" />}
      </div>
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
