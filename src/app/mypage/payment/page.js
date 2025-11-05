"use client";

import { useState, useEffect } from "react";

export default function PaymentPage() {
  const [methods, setMethods] = useState([]);
  const [form, setForm] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    isDefault: false,
  });

  const fetchMethods = async () => {
    const res = await fetch("/api/payment-methods");
    const data = await res.json();
    setMethods(data);
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/payment-methods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ cardName: "", cardNumber: "", expiry: "", isDefault: false });
    fetchMethods();
  };

  const handleDelete = async (id) => {
    if (!confirm("삭제하시겠습니까?")) return;
    await fetch("/api/payment-methods", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchMethods();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-5">
      <h2 className="text-lg font-semibold text-[#7b5449] mb-6 flex items-center gap-2">
        결제수단 관리
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow p-6 space-y-4 max-w-xl mx-auto"
      >
        <input
          placeholder="카드명 (예: 현대카드)"
          className="border p-2 w-full rounded"
          value={form.cardName}
          onChange={(e) => setForm({ ...form, cardName: e.target.value })}
        />
        <input
          placeholder="카드번호 (숫자만)"
          className="border p-2 w-full rounded"
          value={form.cardNumber}
          onChange={(e) => setForm({ ...form, cardNumber: e.target.value })}
        />
        <input
          placeholder="유효기간 (MM/YY)"
          className="border p-2 w-full rounded"
          value={form.expiry}
          onChange={(e) => setForm({ ...form, expiry: e.target.value })}
        />
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
          />
          기본 결제수단으로 설정
        </label>
        <button className="w-full bg-[#7b5449] hover:bg-[#6a483d] text-white py-2 rounded-lg transition">
          등록하기
        </button>
      </form>

      <div className="mt-10 grid gap-4 md:grid-cols-2 max-w-3xl mx-auto">
        {methods.map((m) => (
          <div
            key={m.id}
            className={`rounded-xl shadow-sm p-4 bg-white border ${
              m.isDefault ? "border-[#7b5449]" : "border-gray-200"
            } hover:shadow-md transition`}
          >
            <p className="font-semibold text-[#7b5449]">{m.cardName}</p>
            <p className="text-sm text-gray-700 tracking-wide">
              {m.cardNumber.replace(/\d{12}(\d{4})/, "**** **** **** $1")}
            </p>
            <p className="text-xs text-gray-500 mb-2">유효기간: {m.expiry}</p>
            {m.isDefault && (
              <span className="text-xs bg-[#7b5449] text-white px-2 py-0.5 rounded-full">
                기본결제수단
              </span>
            )}
            <div className="flex justify-end mt-3">
              <button
                onClick={() => handleDelete(m.id)}
                className="text-xs text-red-500 hover:underline"
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 space-y-3 max-w-xl mx-auto">
        <button
          onClick={async () => {
            const res = await fetch("/api/payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                amount: 10000,
                description: "테스트 결제 (10,000원)",
              }),
            });
            const data = await res.json();
            alert(data.message);
          }}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
        >
          테스트 결제 (10,000원)
        </button>

        <button
          onClick={async () => {
            const res = await fetch("/api/payment", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                amount: 10000,
                description: "테스트 환불 (10,000원)",
              }),
            });
            const data = await res.json();
            alert(data.message);
          }}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
        >
          테스트 환불 (10,000원)
        </button>
      </div>
    </div>
  );
}
