"use client";

import { FaBars } from "react-icons/fa";
import { IoChevronBack } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [message, setMessage] = useState("");
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      setMessage("로그아웃 되었습니다.");
      setTimeout(() => {
        setMessage("");
        window.location.href = "/";
      }, 1500);
    } catch (err) {
      console.error("로그아웃 실패:", err);
      setMessage("로그아웃 처리 중 오류가 발생했습니다.");
    }
  };

  const menuItems = [
    { path: "/brand", label: "브랜드" },
    { path: "/guide", label: "안심가이드" },
    { label: "서비스", hasSubmenu: true },
    { path: "/support", label: "고객센터" },
    ...(session
      ? [{ label: "로그아웃", action: handleLogout }]
      : [{ path: "/login", label: "로그인" }]),
  ];

  const submenuItems = [
    { path: "/service/estimate", label: "비교견적" },
    { path: "/service/photo", label: "영정사진" },
    { path: "/service/memoriam", label: "메모리얼" },
  ];

  let activeMenu = null;
  for (let item of menuItems) {
    if (item.path && pathname.startsWith(item.path)) {
      activeMenu = item.label;
      break;
    }
  }
  if (!activeMenu) {
    for (let sub of submenuItems) {
      if (pathname.startsWith(sub.path)) {
        activeMenu = sub.label;
        break;
      }
    }
  }

  return (
    <header className="z-10 fixed flex justify-between h-10 py-2 px-2 top-0 left-0 right-0 bg-gray-100/80 backdrop-blur-sm">
      {message && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-[#7b5449] text-white px-6 py-2 rounded shadow-md z-50">
          {message}
        </div>
      )}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="relative h-full w-24 transition duration-200 hover:scale-[1.03]"
        >
          <Image
            src="/image/memoriam-logo.png"
            alt="Memoriam Logo"
            fill
            priority
            className="object-contain"
          />
        </Link>
        {activeMenu && <span className="text-xs font-thin">{activeMenu}</span>}
      </div>

      {!isOpen ? (
        <button
          className="text-base text-[#7b5449] cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <FaBars />
        </button>
      ) : submenuOpen ? (
        <button
          className="text-base text-[#7b5449] cursor-pointer z-20"
          onClick={() => setSubmenuOpen(false)}
        >
          <IoChevronBack />
        </button>
      ) : (
        <button
          className="text-base text-[#7b5449] cursor-pointer z-30"
          onClick={() => {
            setIsOpen(false);
            setSubmenuOpen(false);
          }}
        >
          <IoClose />
        </button>
      )}

      <nav
        className={`fixed top-2.5 left-0 right-0 flex justify-center gap-3 p-0
          transition-all duration-300 ease-in-out ${
            isOpen && !submenuOpen
              ? "opacity-100 translate-x-20 text-[#7b5449] pointer-events-auto"
              : "opacity-0 translate-x-100 text-[#7b5449] pointer-events-none"
          }`}
      >
        {menuItems.map((item, index) =>
          item.hasSubmenu ? (
            <span
              key={item.label}
              onClick={() => setSubmenuOpen(!submenuOpen)}
              className="text-sm font-thin text-[#7b5449] cursor-pointer"
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              {item.label}
            </span>
          ) : item.action ? (
            <button
              key={item.label}
              onClick={item.action}
              className="text-sm font-thin text-[#7b5449] cursor-pointer bg-transparent border-0"
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              {item.label}
            </button>
          ) : (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => {
                setIsOpen(false);
                setSubmenuOpen(false);
              }}
              className="text-sm font-thin text-[#7b5449] no-underline cursor-pointer"
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              {item.label}
            </Link>
          )
        )}
      </nav>

      <div
        className={`fixed top-2.5 left-0 right-0 flex justify-center gap-6 p-0 ${
          submenuOpen && isOpen
            ? "opacity-100 translate-x-20 text-[#7b5449] pointer-events-auto"
            : "opacity-0 translate-x-100 text-[#7b5449] pointer-events-none"
        }`}
      >
        {submenuItems.map((sub, subIndex) => (
          <Link
            className="no-underline text-sm font-thin text-[#7b5449]"
            key={sub.path}
            href={sub.path}
            onClick={() => {
              setIsOpen(false);
              setSubmenuOpen(false);
            }}
            style={{ transitionDelay: `${subIndex * 0.1 + 0.2}s` }}
          >
            {sub.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
