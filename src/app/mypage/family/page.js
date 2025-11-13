"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export const runtime = "nodejs";

export default function FamilyPage() {
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    id: null,
    name: "",
    species: "",
    breed: "",
    birthDate: "",
    memo: "",
    photo: "",
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const fetchFamilies = async () => {
    try {
      const res = await fetch("/api/family");
      if (!res.ok) {
        if (res.status === 401) {
          setFamilies([]);
          return;
        }
        throw new Error();
      }
      const data = await res.json();
      setFamilies(Array.isArray(data) ? data : []);
    } catch (err) {
      setFamilies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFamilies();
  }, []);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/family/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setForm({ ...form, photo: data.url });
    } catch (err) {
      setUploadError("이미지 업로드 실패");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = form.id ? "PATCH" : "POST";
    const res = await fetch("/api/family", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({
        id: null,
        name: "",
        species: "",
        breed: "",
        birthDate: "",
        memo: "",
        photo: "",
      });
      fetchFamilies();
    }
  };

  const handleDelete = async (id) => {
    const ok = confirm("정말 삭제하시겠습니까?");
    if (!ok) return;
    await fetch("/api/family", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchFamilies();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-5">
      <h2 className="text-lg font-semibold text-[#7b5449] mb-6">가족 관리</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow p-6 space-y-4 max-w-xl mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">이름</p>
            <input
              placeholder="예: 쿠키"
              className="border p-2 w-full rounded"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">종(species)</p>
            <input
              placeholder="예: 강아지"
              className="border p-2 w-full rounded"
              value={form.species}
              onChange={(e) => setForm({ ...form, species: e.target.value })}
            />
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">품종(breed)</p>
            <input
              placeholder="예: 말티즈"
              className="border p-2 w-full rounded"
              value={form.breed}
              onChange={(e) => setForm({ ...form, breed: e.target.value })}
            />
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">생일</p>
            <input
              type="date"
              className="border p-2 w-full rounded"
              value={form.birthDate}
              onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
            />
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-1">메모</p>
          <textarea
            placeholder="예: 우리 집 첫째, 장난감 좋아함"
            className="border p-2 w-full rounded"
            value={form.memo}
            onChange={(e) => setForm({ ...form, memo: e.target.value })}
          />
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-1">사진</p>
          <div className="flex items-center gap-3">
            <label className="cursor-pointer bg-gray-100 px-3 py-2 rounded border text-sm text-gray-700 hover:bg-gray-200">
              {uploading ? "업로드 중..." : "이미지 선택"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
                disabled={uploading}
              />
            </label>

            {form.photo && (
              <Image
                src={form.photo}
                alt="family photo"
                width={60}
                height={60}
                className="rounded-md object-cover border"
              />
            )}
          </div>
        </div>

        {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => (window.location.href = "/mypage")}
            className="flex-1 text-center bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg transition"
          >
            돌아가기
          </button>
          <button
            type="submit"
            className="flex-1 bg-[#7b5449] hover:bg-[#6a483d] text-white py-2 rounded-lg transition"
          >
            {form.id ? "수정하기" : "등록하기"}
          </button>
        </div>
      </form>

      {loading ? (
        <p className="text-center text-gray-500 mt-10">불러오는 중...</p>
      ) : Array.isArray(families) && families.length > 0 ? (
        <div className="mt-10 grid gap-4 md:grid-cols-2 max-w-3xl mx-auto">
          {families.map((f) => (
            <div
              key={f.id}
              className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition"
            >
              {f.photo && (
                <Image
                  src={f.photo}
                  alt={f.name}
                  width={64}
                  height={64}
                  className="rounded-md object-cover border"
                />
              )}
              <div className="flex-1">
                <p className="font-semibold text-[#7b5449]">{f.name}</p>
                <p className="text-sm text-gray-600">
                  {f.species} / {f.breed}
                </p>
                <p className="text-xs text-gray-500">
                  {f.birthDate?.slice(0, 10)} | {f.memo}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setForm(f)}
                  className="text-xs text-blue-500 hover:underline"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDelete(f.id)}
                  className="text-xs text-red-500 hover:underline"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 mt-10">
          등록된 가족이 없습니다.
        </p>
      )}
    </div>
  );
}
