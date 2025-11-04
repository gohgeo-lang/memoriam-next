"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";

export default function MyPage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    phone: "",
    address: "",
    detail: "",
    isDefault: false,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/users/me").then(async (res) => setUser(await res.json()));
  }, []);

  const fetchAddresses = async () => {
    const res = await fetch("/api/address");
    const data = await res.json();
    setAddresses(data);
  };

  useEffect(() => {
    if (activeTab === "address") fetchAddresses();
  }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const method = form.id ? "PATCH" : "POST";
    const res = await fetch("/api/address", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, userId: user?.id }),
    });
    if (res.ok) {
      alert(form.id ? "수정 완료" : "등록 완료");
      setForm({
        id: null,
        name: "",
        phone: "",
        address: "",
        detail: "",
        isDefault: false,
      });
      fetchAddresses();
    } else {
      alert("실패했습니다.");
    }
    setLoading(false);
  };

  const handleEdit = (a) => setForm(a);
  const handleDelete = async (id) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await fetch("/api/address", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchAddresses();
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    alert("로그아웃 되었습니다.");
    window.location.href = "/";
  };

  if (!user)
    return <p className="text-center mt-10 text-gray-500">로딩 중...</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5 flex flex-col items-center">
      <h2 className="text-lg font-semibold text-[#7b5449] mb-6">마이페이지</h2>

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
        {activeTab === "info" && <MyInfo user={user} onLogout={handleLogout} />}
        {activeTab === "address" && (
          <div>
            <h3 className="text-lg font-semibold text-[#7b5449] mb-4">
              주소 관리
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                placeholder="이름"
                className="border p-2 w-full rounded"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                placeholder="연락처"
                className="border p-2 w-full rounded"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <input
                placeholder="주소"
                className="border p-2 w-full rounded"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
              <input
                placeholder="상세주소"
                className="border p-2 w-full rounded"
                value={form.detail}
                onChange={(e) => setForm({ ...form, detail: e.target.value })}
              />
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(e) =>
                    setForm({ ...form, isDefault: e.target.checked })
                  }
                />
                기본주소지로 설정
              </label>
              <button className="w-full bg-[#7b5449] text-white py-2 rounded disabled:opacity-50">
                {form.id ? "수정하기" : "등록하기"}
              </button>
            </form>

            <div className="mt-8 space-y-3">
              {addresses.map((a) => (
                <div
                  key={a.id}
                  className={`border p-3 rounded ${
                    a.isDefault ? "border-[#7b5449]" : "border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">
                        {a.name} ({a.phone})
                      </p>
                      <p className="text-sm text-gray-600">
                        {a.address} {a.detail}
                      </p>
                      {a.isDefault && (
                        <span className="text-xs text-[#7b5449] font-medium">
                          기본배송지
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(a)}
                        className="text-sm text-blue-500"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="text-sm text-red-500"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === "family" && <Placeholder text="가족 관리 화면" />}
      </div>
    </div>
  );
}

function MyInfo({ user, onLogout }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-[#7b5449] mb-2">내 정보</h3>
      <p>이름: {user.name}</p>
      <p>이메일: {user.email}</p>
      <button
        onClick={onLogout}
        className="mt-4 px-4 py-2 bg-gray-200 rounded text-gray-700 text-sm"
      >
        로그아웃
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
