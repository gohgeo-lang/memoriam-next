"use client";

import {
  MapPin,
  PawPrint,
  CreditCard,
  Gift,
  LogOut,
  Shield,
  PawPrintIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function MyPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/users/me").then(async (res) => {
      if (!res.ok) {
        console.error("유저 정보 불러오기 실패:", await res.text());
        return;
      }
      setUser(await res.json());
    });
  }, []);

  if (!user)
    return <p className="text-center mt-10 text-gray-500">로딩 중...</p>;

  const menuItems = [
    {
      href: "/mypage/address",
      label: "주소관리",
      icon: <MapPin className="w-6 h-6 text-[#7b5449]" />,
    },
    {
      href: "/mypage/family",
      label: "가족관리",
      icon: <PawPrint className="w-6 h-6 text-[#7b5449]" />,
    },
    {
      href: "/mypage/payment",
      label: "결제수단",
      icon: <CreditCard className="w-6 h-6 text-[#7b5449]" />,
    },
    {
      href: "/mypage/cookies",
      label: "쿠키",
      icon: <Gift className="w-6 h-6 text-[#7b5449]" />,
    },
  ];

  const detailLinks = [
    { href: "/mypage/info", label: "내 정보 관리" },
    { href: "/mypage/address", label: "주소 관리" },
    { href: "/mypage/family", label: "가족 관리" },
    { href: "/mypage/payment", label: "결제수단 관리" },
    { href: "/mypage/cookies", label: "쿠키" },
    { href: "/mypage/posts", label: "내가 쓴 게시물" },
    { href: "/mypage/comments", label: "내가 쓴 댓글" },
  ];

  const isAdmin = user?.email === "hong@gmail.com";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-5">
      <div className="bg-white rounded-2xl shadow p-6 flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name}
              width={100}
              height={100}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-[100px] h-[100px] rounded-full bg-gray-200 text-gray-600 text-3xl font-semibold">
              {user.name ? user.name.charAt(0).toUpperCase() : "?"}
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold text-[#7b5449]">
              {user.name || "고객님"}
            </h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-500 mb-1">보유 쿠키</p>
          <p className="text-lg font-semibold text-[#7b5449] flex items-center justify-end gap-1">
            {user.totalCookies?.toLocaleString() || 0} 🍪
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center bg-white shadow-sm rounded-xl py-4 hover:shadow-md transition group"
          >
            <div className="mb-1 group-hover:scale-110 transition-transform">
              {item.icon}
            </div>
            <p className="text-xs font-medium text-gray-700 group-hover:text-[#7b5449]">
              {item.label}
            </p>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow divide-y mb-8">
        {detailLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex justify-between items-center px-5 py-4 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">{item.label}</span>
            </div>
            <span className="text-gray-400">›</span>
          </Link>
        ))}
      </div>

      {isAdmin && (
        <div className="bg-white rounded-2xl shadow-sm py-4 text-center hover:bg-[#7b5449]/10 transition mb-3">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 text-sm font-medium text-[#7b5449] hover:underline"
          >
            <Shield className="w-4 h-4" />
            관리자페이지로 이동
          </Link>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm py-4 text-center hover:bg-gray-50 transition">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center justify-center gap-2 mx-auto text-sm text-gray-500 hover:text-red-500 transition"
        >
          <LogOut className="w-4 h-4" />
          로그아웃
        </button>
      </div>
    </div>
  );
}
