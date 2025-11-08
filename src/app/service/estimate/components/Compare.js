"use client";
import { MdBackspace } from "react-icons/md";
import React from "react";

export default function CompareCompanies({ companies, onClose }) {
  if (!companies || companies.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl p-6 relative overflow-auto max-h-[90vh]">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <MdBackspace size="20" className="text-[#61443b] mb-3 mx-auto" />
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-center">
          업체 비교 견적
        </h2>

        {/* 비교 테이블 */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm text-center">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border px-3 py-2">항목</th>
                {companies.map((c) => (
                  <th key={c.id} className="border px-3 py-2 font-semibold">
                    {c.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* 주소 */}
              <tr>
                <td className="border px-3 py-2 font-medium bg-gray-50">
                  주소
                </td>
                {companies.map((c) => (
                  <td key={c.id} className="border px-3 py-2">
                    {c.contacts.addressRdn ||
                      c.contacts.addressSite ||
                      "정보 없음"}
                  </td>
                ))}
              </tr>

              {/* 전화번호 */}
              <tr>
                <td className="border px-3 py-2 font-medium bg-gray-50">
                  전화번호
                </td>
                {companies.map((c) => (
                  <td key={c.id} className="border px-3 py-2">
                    {c.contacts.phone || "-"}
                  </td>
                ))}
              </tr>

              {/* 영업시간 */}
              <tr>
                <td className="border px-3 py-2 font-medium bg-gray-50">
                  영업시간
                </td>
                {companies.map((c) => (
                  <td key={c.id} className="border px-3 py-2">
                    <div>
                      <div>평일: {c.hours.weekdays}</div>
                      <div>주말: {c.hours.weekend}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {c.hours.lastEntryNote}
                      </div>
                    </div>
                  </td>
                ))}
              </tr>

              {/* 가격표 */}
              <tr>
                <td className="border px-3 py-2 font-medium bg-gray-50">
                  가격표 (개별 / 합동)
                </td>
                {companies.map((c) => (
                  <td key={c.id} className="border px-3 py-2">
                    {c.priceTable.map((p) => (
                      <div key={p.weight} className="text-sm mb-1">
                        {p.weight}: {p.indiv.toLocaleString()} /{" "}
                        {p.group.toLocaleString()}원
                      </div>
                    ))}
                  </td>
                ))}
              </tr>

              {/* 옵션 */}
              <tr>
                <td className="border px-3 py-2 font-medium bg-gray-50">
                  제공 옵션
                </td>
                {companies.map((c) => (
                  <td key={c.id} className="border px-3 py-2">
                    {c.options.map((o, i) => (
                      <div key={i}>• {o}</div>
                    ))}
                  </td>
                ))}
              </tr>

              {/* 평점 / 리뷰 */}
              <tr>
                <td className="border px-3 py-2 font-medium bg-gray-50">
                  평점 / 리뷰
                </td>
                {companies.map((c) => (
                  <td key={c.id} className="border px-3 py-2">
                    ⭐ {c.rating}점 ({c.reviews}개)
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
