"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, pw);
      alert("회원가입 성공! 로그인 페이지로 이동합니다.");
      router.push("/login");
    } catch (error) {
      console.error("회원가입 오류:", error);

      let msg = "회원가입 중 오류가 발생했습니다.";

      if (error.code === "auth/invalid-email") {
        msg = "이메일 형식이 올바르지 않습니다.";
      } else if (error.code === "auth/weak-password") {
        msg = "비밀번호는 6자 이상이어야 합니다.";
      } else if (error.code === "auth/email-already-in-use") {
        msg = "이미 등록된 이메일입니다.";
      }

      alert(msg);
    }
  };

  return (
    <form
      onSubmit={handleSignup}
      className="flex flex-col gap-2 max-w-sm mx-auto mt-20"
    >
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2"
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        className="border p-2"
      />
      <button type="submit" className="bg-[#7b5449] text-white p-2 rounded">
        회원가입
      </button>
    </form>
  );
}
