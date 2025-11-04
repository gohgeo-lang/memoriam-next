"use client";
import { useEffect, useState } from "react";

export default function Mypage() {
  const [user, setUser] = useState(null);
  const [naem, setName] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetch("/api/users/me")
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setName(data.name || "");
      });
  }, []);

  const handleUpdate = async () => {
    await fetch("/api/users/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }),
    });
    alert("정보가 수정되었습니다!");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!file) return alert("이미지를 선택해주세요.");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/users/upload", {
      method: "POST",
      body: FormData,
    });

    const data = await res.json();
    if (data.url) {
      setUser((prev) => ({ ...prev, image: data.url }));
      alert("프로필 사진이 변경되었습니다!");
    }
  };

  if (!user) return <p>로딩중...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg space-y-4">
      <h1 className="text-2xl font-semibold mb-4">마이페이지</h1>

      <div className="flex flex-col items-center">
        <img
          src={preview || user.image || "/default-avatar.png"}
          alt="프로필"
          className="w-32 h-32 rounded-full object-cover mb-2"
        />
        <input type="file" onChange={handleFileChange} />
        <button
          onClick={handleUpload}
          className="bg-gray-700 text-white px-3 py-1 rounded mt-2"
        >
          프로필 변경
        </button>
      </div>

      <div>
        <p className="text-sm text-gray-600">이메일: {user.email}</p>
        <input
          className="border p-2 w-full my-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름 수정"
        />
        <input
          type="password"
          className="border p-2 w-full my-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호 변경"
        />
        <button
          onClick={handleUpdate}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          수정하기
        </button>
      </div>
    </div>
  );
}
