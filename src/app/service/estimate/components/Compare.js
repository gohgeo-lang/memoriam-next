"use client";
import { MdClose } from "react-icons/md";
import React from "react";

export default function CompareCompanies({ companies, onClose }) {
  if (!companies || companies.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-90 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl p-10 relative border border-gray-300 print:shadow-none print:border-none print:p-4">
        {/* 닫기 버튼 (인쇄시 숨김) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black print:hidden"
        >
          <MdClose size="24" />
        </button>

        {/* 헤더 */}
        <header className="text-center border-b-2 border-gray-300 pb-4 mb-6">
          <h1 className="text-3xl font-bold text-[#4A3F35]">업체 비교</h1>
          <p className="text-gray-500 text-sm mt-1">
            업체 간 서비스 및 가격 비교 내역
          </p>
        </header>

        {/* 테이블 */}
        <section>
          <table className="w-full border-collapse text-sm text-center">
            <thead>
              <tr className="bg-[#f8f8f8] border-y-2 border-gray-300">
                <th className="py-3 px-4 text-left font-semibold border-r">
                  항목
                </th>
                {companies.map((c) => (
                  <th key={c.id} className="py-3 px-4 font-semibold border-r">
                    {c.name}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {/* 주소 */}
              <tr className="border-b border-gray-200">
                <td className="py-2 px-4 font-medium text-left bg-gray-50">
                  주소
                </td>
                {companies.map((c) => (
                  <td key={c.id} className="py-2 px-4 border-l">
                    {c.contacts.addressRdn || c.contacts.addressSite || "-"}
                  </td>
                ))}
              </tr>

              {/* 전화번호 */}
              <tr className="border-b border-gray-200">
                <td className="py-2 px-4 font-medium text-left bg-gray-50">
                  전화번호
                </td>
                {companies.map((c) => (
                  <td key={c.id} className="py-2 px-4 border-l">
                    {c.contacts.phone || "-"}
                  </td>
                ))}
              </tr>

              {/* 영업시간 */}
              <tr className="border-b border-gray-200">
                <td className="py-2 px-4 font-medium text-left bg-gray-50">
                  영업시간
                </td>
                {companies.map((c) => (
                  <td key={c.id} className="py-2 px-4 border-l leading-5">
                    <div>평일: {c.hours.weekdays}</div>
                    <div>주말: {c.hours.weekend}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {c.hours.lastEntryNote}
                    </div>
                  </td>
                ))}
              </tr>

              {/* 가격표 */}
              <tr className="border-b border-gray-200 align-top">
                <td className="py-2 px-4 font-medium text-left bg-gray-50">
                  가격표 (개별 / 합동)
                </td>
                {companies.map((c) => (
                  <td key={c.id} className="py-2 px-4 border-l">
                    {c.priceTable.map((p) => (
                      <div key={p.weight} className="text-sm mb-1">
                        {p.weight}:{" "}
                        <span className="font-semibold text-[#61443b]">
                          {p.indiv.toLocaleString()} /{" "}
                          {p.group.toLocaleString()}원
                        </span>
                      </div>
                    ))}
                  </td>
                ))}
              </tr>

              {/* 옵션 */}
              <tr className="border-b border-gray-200 align-top">
                <td className="py-2 px-4 font-medium text-left bg-gray-50">
                  제공 옵션
                </td>
                {companies.map((c) => (
                  <td key={c.id} className="py-2 px-4 border-l">
                    {c.options.map((o, i) => (
                      <div key={i}>• {o}</div>
                    ))}
                  </td>
                ))}
              </tr>

              {/* 평점 / 리뷰 */}
              <tr className="border-t-2 border-gray-300">
                <td className="py-3 px-4 font-medium text-left bg-gray-50">
                  평점 / 리뷰
                </td>
                {companies.map((c) => (
                  <td
                    key={c.id}
                    className="py-3 px-4 border-l font-semibold text-[#61443b]"
                  >
                    ⭐ {c.rating}점 ({c.reviews}개)
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </section>

        {/* 인쇄 버튼 */}
        <div className="mt-8 text-right print:hidden">
          <button
            onClick={() => window.print()}
            className="px-5 py-2 bg-[#61443b] text-white rounded-lg hover:bg-[#4e352e] transition"
          >
            인쇄 / 저장
          </button>
        </div>
      </div>
    </div>
  );
}
