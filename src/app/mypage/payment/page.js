"use client";

import { useState, useEffect } from "react";
import { CreditCard, Trash2, Star } from "lucide-react";

export const runtime = "nodejs";

export default function PaymentPage() {
  const [methods, setMethods] = useState([]);
  const [form, setForm] = useState({
    cardName: "",
    cardNumber: "",
    isDefault: false,
  });
  const [loading, setLoading] = useState(true);

  const fetchMethods = async () => {
    try {
      const res = await fetch("/api/payment");
      if (!res.ok) throw new Error("불러오기 실패");
      const data = await res.json();
      setMethods(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("결제수단 로드 실패:", err);
      setMethods([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.cardName || !form.cardNumber)
      return alert("카드명과 번호를 모두 입력하세요.");

    const res = await fetch("/api/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("결제수단이 등록되었습니다.");
      setForm({ cardName: "", cardNumber: "", isDefault: false });
      fetchMethods();
    } else {
      alert("등록 실패");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const res = await fetch("/api/payment", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) fetchMethods();
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-500">불러오는 중...</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-5">
      <h2 className="text-lg font-semibold text-[#7b5449] mb-6 flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-[#7b5449]" />
        결제수단 관리
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow p-6 space-y-4 max-w-xl mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="카드명 (예: 현대카드)"
            className="border p-2 w-full rounded"
            value={form.cardName}
            onChange={(e) => setForm({ ...form, cardName: e.target.value })}
          />
          <input
            placeholder="카드번호 (예: 1234-5678-9012-3456)"
            className="border p-2 w-full rounded"
            value={form.cardNumber}
            onChange={(e) => setForm({ ...form, cardNumber: e.target.value })}
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
          />
          기본 결제수단으로 설정
        </label>

        <button
          type="submit"
          className="w-full bg-[#7b5449] hover:bg-[#6a483d] text-white py-2 rounded-lg transition"
        >
          등록하기
        </button>
      </form>

      {Array.isArray(methods) && methods.length > 0 ? (
        <div className="mt-10 grid gap-4 md:grid-cols-2 max-w-3xl mx-auto">
          {methods.map((m) => (
            <div
              key={m.id}
              className={`rounded-xl shadow-sm p-4 bg-white border flex items-center justify-between ${
                m.isDefault ? "border-[#7b5449]" : "border-gray-200"
              }`}
            >
              <div>
                <p className="font-semibold text-[#7b5449] flex items-center gap-1">
                  {m.cardName}
                  {m.isDefault && (
                    <Star className="w-4 h-4 fill-[#7b5449] text-[#7b5449]" />
                  )}
                </p>
                <p className="text-sm text-gray-600">{m.cardNumber}</p>
              </div>
              <button
                onClick={() => handleDelete(m.id)}
                className="text-red-500 hover:text-red-600 transition"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 mt-10">
          등록된 결제수단이 없습니다.
        </p>
      )}
    </div>
  );
}
