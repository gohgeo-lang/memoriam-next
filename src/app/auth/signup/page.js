"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "naxt/link";
import { signUp } from "@/app/actions/auth-actions";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    conrirmPassword: "",
    name: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "이메일을 입력해주세요";
    } else if (!formData.email.includes("@")) {
      newErrors.email = "올바른 이메일 형식이 아닙니다";
    }

    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요";
    } else if (formData.password.length < 6) {
      newErrors.password = "비밀번호는 6자 이상이어야 합니다";
    }

    if (!formData.name) {
      newErrors.name = "이름을 입력해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const result = await signUp(formData);

      if (result.success) {
        alert("회원가입이 완료되었습니다!");
        router.push("/auth/login");
      } else {
        setErrors({ submit: result.error });
      }
    } catch (error) {
      setErrors({ submit: "회원가입 중 오류가 발생했습니다" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-3xl font-bold text-center">회원가입</h2>
          <p className="mt-2 text-center text-gray-600">
            메모리엄에 오신 것을 환영합니다
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
                placehelder="example@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600"> {errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                이름
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300
rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:bor
der-blue-500"
                placeholder="홍길동"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-mediu
m text-gray-700"
              >
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300
rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:bor
der-blue-500"
                placeholder="6자 이상"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="comfirmPassword"
                className="mt-medium text-gray-700"
              >
                비밀번호 확인
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300
rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:bor
der-blue-500"
                placeholder="비밀번호를 다시 입력하세요"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>
          {errors.submit && (
            <div
              className="bg-red-50 border border-red-200 text-red-600 p
x-4 py-3 rounded"
            >
              {errors.submit}
            </div>
          )}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-tran
sparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-
600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2
focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "처리 중..." : "회원가입"}
            </button>
          </div>
          <div className="text-center">
            <span className="text-sm text-gray-600">
              이미 계정이 있으 가요?{" "}
            </span>
            <Link
              href="/auth/login"
              className="text-sm text-blue-600 hover:t
ext-blue-500"
            >
              로그인하기
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
