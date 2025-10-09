"use client";

import { useState } from "react";
import { signIn } from "@/app/actions/auth-actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("이메일과 비밀번호를 입력해주세요");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn(formData);
      if (result.success) {
        router.push("/");
        router.refresh();
      } else {
        setError(result.error || "로그인에 실패했습니다");
      }
    } catch (error) {
      setError("로그인 중 오류가 발생했습니다");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-3xl font-bold text-center">로그인</h2>
          <p className="mt-2 text-center text-gray-600">
            메모리엄에 다시 오신 것을 환영합니다
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder=" example@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                valut={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {error &
          (
            <div className="bg-red-50 border border-red-200 text-red0600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <button
              type="submdit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <Link
              href="/auth/signup"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              회원가입하기
            </Link>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-gray-600 hover:text-gray-500"
            >
              비밀번호를 잊으셨나요?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
