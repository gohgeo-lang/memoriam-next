"use client";

import { useActionState } from "react";
import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import { loginAction } from "../actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAction, {
    message: "",
    success: false,
  });
  const [isTransPending, startTransition] = useTransition();

  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => router.push("/"), 1500);
      return () => clearTimeout(timer);
    }
  }, [state.success, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const pw = e.target.password.value;

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, pw);
      const idToken = await userCred.user.getIdToken();

      const formData = new FormData();
      formData.set("idToken", idToken);

      startTransition(() => {
        formAction(formData);
      });
    } catch (err) {
      console.error("로그인 실패:", err);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20">
      {state.message && (
        <div className="mb-4 px-4 py-2 text-white bg-[#7b5449] rounded">
          {state.message}
        </div>
      )}

      <form onSubmit={handleLogin} className="flex flex-col gap-2">
        <input
          type="email"
          name="email"
          placeholder="이메일"
          className="border p-2"
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          className="border p-2"
        />
        <button
          type="submit"
          disabled={isPending || isTransPending}
          className="bg-[#7b5449] text-white p-2 rounded"
        >
          {isPending || isTransPending ? "처리중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}
