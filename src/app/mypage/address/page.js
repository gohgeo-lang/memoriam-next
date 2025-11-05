"use client";

import { useState, useEffect } from "react";

export default function AddressPage() {
  const [addresses, setAddresses] = useState([]);
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
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = form.id ? "PATCH" : "POST";
    const res = await fetch("/api/address", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
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
    }
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
        <button className="w-full bg-[#7b5449] text-white py-2 rounded">
          {form.id ? "수정하기" : "등록하기"}
        </button>
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
