"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-600 text-sm mt-16 px-5 py-10">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        <div className="text-center">
          <strong className="text-[#7b5449] font-bold text-base">
            메모리엄
          </strong>
          <p className="mt-1">대표: 홍길동 | 사업자등록번호: 123-45-67890</p>
          <p>주소: 서울특별시 ○○구 ○○로 123</p>
        </div>

        <div className="text-center">
          <p>
            고객센터:{" "}
            <a href="tel:15880000" className="text-[#7b5449] hover:underline">
              1588-0000
            </a>
          </p>
          <p>운영시간: 평일 09:00 ~ 18:00</p>
        </div>

        <div className="flex justify-center gap-6">
          <Link href="/privacy" className="hover:underline">
            개인정보 처리방침
          </Link>
          <Link href="/terms" className="hover:underline">
            이용약관
          </Link>
        </div>

        <div className="border-t border-gray-200 pt-3 text-center">
          <p>© 2025 Memoriam. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
