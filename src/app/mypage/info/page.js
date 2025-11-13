"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function InfoPage() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/users/me").then(async (res) => {
      const data = await res.json();
      setUser(data);
      setName(data.name || "");
      setPreview(data.image || null);
    });
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    if (password) formData.append("password", password);
    if (image) formData.append("file", image);

    const res = await fetch("/api/users/update", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      alert(data.message);
      setUser((prev) => ({
        ...prev,
        name: data.name,
        image: data.image,
        totalCookies: data.totalCookies,
      }));
      setPassword("");
    } else {
      alert(data.error || "수정 실패");
    }
    setLoading(false);
  };

  if (!user)
    return <p className="text-center mt-10 text-gray-500">로딩 중...</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-5 flex justify-center">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow p-6 flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                width={100}
                height={100}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-[100px] h-[100px] rounded-full bg-gray-200 text-gray-600 text-3xl font-semibold">
                {user.name ? user.name.charAt(0).toUpperCase() : "?"}
              </div>
            )}
            <div>
              <h2 className="text-lg font-semibold text-[#7b5449]">
                {name || "고객님"}
              </h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">보유 포인트</p>
            <p className="text-lg font-semibold text-[#7b5449]">
              {user.totalCookies?.toLocaleString() || 0}P
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold text-[#7b5449] mb-6">
            내 정보 수정
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center gap-4">
              <label className="cursor-pointer bg-gray-100 px-3 py-1 rounded border text-sm text-gray-700 hover:bg-gray-200">
                이미지 변경
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              {preview && (
                <Image
                  src={preview}
                  alt="preview"
                  width={60}
                  height={60}
                  className="rounded-full object-cover border"
                />
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">이름</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 w-full rounded"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                새 비밀번호 (선택)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="새 비밀번호를 입력하세요"
                className="border p-2 w-full rounded"
              />
            </div>

            <div className="flex gap-3">
              <Link
                href="/mypage"
                className="flex-1 text-center bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg transition"
              >
                돌아가기
              </Link>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-2 rounded-lg text-white font-medium transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#7b5449] hover:bg-[#6a483d]"
                }`}
              >
                {loading ? "수정 중..." : "수정하기"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
