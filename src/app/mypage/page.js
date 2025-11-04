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

  if (!user) return <p>로딩중...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">마이페이지</h1>
      <p>이메일: {user.email}</p>
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
  );
}
