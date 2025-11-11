"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AddressPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false); // ✅ 추가
  const [form, setForm] = useState({
    id: null,
    name: "",
    phone: "",
    address: "",
    detail: "",
    isDefault: false,
  });

  const fetchAddresses = async () => {
    const res = await fetch("/api/address");
    const data = await res.json();
    setAddresses(data);
    if (data.length > 0) {
      const defaultAddr = data.find((a) => a.isDefault) || data[0];
      setForm(defaultAddr);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const method = form.id ? "PATCH" : "POST";
    const payload = { ...form };
    if (!form.id) delete payload.id; // ✅ POST 시 id 제거

    const res = await fetch("/api/address", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert(form.id ? "수정 완료" : "등록 완료");
      fetchAddresses();
    } else {
      alert("오류가 발생했습니다.");
    }
    setLoading(false);
  };

  const handleEdit = (a) => setForm(a);

  const handleDelete = async (id) => {
    if (!confirm("삭제하시겠습니까?")) return;
    await fetch("/api/address", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchAddresses();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-5">
      <h2 className="text-lg font-semibold text-[#7b5449] mb-6">주소 관리</h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-3 bg-white p-6 rounded-lg shadow mb-6"
      >
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
            onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
          />
          기본주소로 설정
        </label>
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
            {loading
              ? form.id
                ? "수정 중..."
                : "등록 중..."
              : form.id
              ? "수정하기"
              : "등록하기"}
          </button>
        </div>
      </form>

      <div className="space-y-3">
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
                    기본주소
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
  );
}
