"use client";
import Link from "next/link";
import { getCompanyById } from "../lib/companiesCache";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import {
  MdLocationOn,
  MdPhone,
  MdStar,
  MdAttachMoney,
  MdOutlineCategory,
  MdAccessTime,
  MdWeb,
} from "react-icons/md";

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  // 임시 로고 URL 생성 (Placehold.co)
  const getLogoUrl = (name) => {
    const encoded = encodeURIComponent(name);
    return `https://placehold.co/150x150/7b5449/ffffff?text=${encoded}`;
  };

  useEffect(() => {
    async function fetchCompany() {
      const found = await getCompanyById(params.id);
      if (!found) {
        router.push("/estimate");
      } else {
        setCompany(found);
      }
      setLoading(false);
    }
    fetchCompany();
  }, [params.id, router]);

  if (!company && !loading) notFound();
  if (loading) return <p className="p-4">로딩중...</p>;

  return (
    <div className="p-4 space-y-6 max-w-5xl mx-auto">
      {/* 상단 로고 + 기본 정보 */}
      <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6 bg-white p-4 rounded-xl shadow">
        <img
          src={getLogoUrl(company.name)}
          alt={`${company.name} 로고`}
          className="w-36 h-36 object-cover rounded-xl border"
        />
        <div className="mt-4 md:mt-0 flex-1">
          <h1 className="text-2xl md:text-3xl font-bold">{company.name}</h1>
          <p className="mt-2 text-gray-600">
            {company.city} • 최저 {company.priceFrom?.toLocaleString() ?? ""}원
            • 평점 {company.rating} ({company.reviews})
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {company.tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-full bg-[#7b5449] px-2.5 py-1 text-xs font-medium text-white"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <Link
          href="/service/estimate"
          className="mt-4 md:mt-0 text-sm text-gray-500 hover:text-gray-800"
        >
          목록으로
        </Link>
      </div>

      {/* 지도 */}
      {company.contacts?.addressRdn || company.contacts?.addressSite ? (
        <section className="bg-white rounded-xl shadow p-4">
          <h2 className="text-xl font-semibold mb-3">위치</h2>
          <div className="h-64 w-full rounded overflow-hidden">
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                company.contacts.addressRdn || company.contacts.addressSite
              )}&output=embed`}
              className="w-full h-full"
              loading="lazy"
            />
          </div>
        </section>
      ) : null}

      {/* 화장 방식 */}
      <section className="bg-white rounded-xl shadow p-4 print:shadow-none print:p-0">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 print:text-lg">
          <MdOutlineCategory /> 화장 방식
        </h2>
        <div className="grid gap-3 md:grid-cols-2 print:grid-cols-1">
          {company.cremationTypes.map((c) => (
            <div
              key={c.type}
              className="border-l-4 border-[#7b5449] p-3 rounded-lg hover:shadow-md transition flex flex-col gap-1 print:border-black print:p-2 print:shadow-none"
            >
              <p className="font-medium text-[#7b5449] print:text-black">
                {c.type}
              </p>
              <p className="text-sm text-gray-500 print:text-black">
                {c.description}
              </p>
              <p className="text-sm font-semibold text-[#61443b] print:text-black">
                기본가: {c.basePrice.toLocaleString()}원~
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 가격표 */}
      <section className="bg-white rounded-xl shadow p-4 print:shadow-none print:p-0">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 print:text-lg">
          <MdAttachMoney /> 가격표
        </h2>
        <div className="grid gap-3 md:grid-cols-2 print:grid-cols-1">
          {company.priceTable.map((row) => (
            <div
              key={row.weight}
              className="border-l-4 border-green-500 p-3 rounded-lg hover:shadow-md transition flex justify-between items-center print:border-black print:p-2 print:shadow-none"
            >
              <span className="font-medium">{row.weight}</span>
              <div className="flex gap-4 text-sm text-gray-700 print:text-black print:gap-2">
                <span className="text-green-600 print:text-black">
                  개별: {row.indiv.toLocaleString()}원
                </span>
                <span className="text-blue-600 print:text-black">
                  합동: {row.group.toLocaleString()}원
                </span>
              </div>
            </div>
          ))}
        </div>

        {company.options?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2 print:mt-2 print:flex-col print:gap-1">
            {company.options.map((o) => (
              <span
                key={o}
                className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700 print:bg-white print:text-black print:border print:px-1"
              >
                {o}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* 운영시간 */}
      <section className="bg-white rounded-xl shadow p-4 print:shadow-none print:p-0">
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 print:text-lg">
          <MdAccessTime /> 운영시간
        </h2>
        <div className="grid gap-2 text-sm text-gray-700 md:grid-cols-2 print:grid-cols-1 print:text-black">
          <p>평일: {company.hours.weekdays}</p>
          <p>주말/공휴일: {company.hours.weekend}</p>
          <p>야간/긴급: {company.hours.emergency}</p>
          <p className="text-gray-500 print:text-black">
            안내: {company.hours.lastEntryNote}
          </p>
        </div>
      </section>

      {/* 연락처 */}
      <section className="bg-white rounded-xl shadow p-4 print:shadow-none print:p-0">
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 print:text-lg">
          <MdPhone /> 연락처
        </h2>
        <div className="grid gap-2 md:grid-cols-2 text-sm text-gray-700 print:grid-cols-1 print:text-black">
          <p className="flex items-center gap-1">
            <MdPhone />{" "}
            <a
              href={`tel:${company.contacts.phone}`}
              className="text-blue-600 hover:underline print:text-black print:no-underline"
            >
              {company.contacts.phone}
            </a>
          </p>
          <p className="flex items-center gap-1">
            <MdLocationOn />{" "}
            {company.contacts.addressRdn || company.contacts.addressSite}
          </p>
          {company.contacts.site && (
            <p className="md:col-span-2 flex items-center gap-1">
              <MdWeb />{" "}
              <a
                href={company.contacts.site}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline print:text-black print:no-underline"
              >
                {company.contacts.site}
              </a>
            </p>
          )}
        </div>
      </section>

      {/* 리뷰 */}
      {company.reviewsList?.length > 0 && (
        <section className="bg-white rounded-xl shadow p-4 print:shadow-none print:p-0">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 print:text-lg">
            <MdStar /> 리뷰
          </h2>
          <div className="space-y-3 max-h-64 overflow-y-auto print:max-h-full print:overflow-visible">
            {company.reviewsList.map((r, idx) => (
              <div
                key={idx}
                className="border-l-4 border-yellow-400 rounded p-3 flex flex-col gap-1 hover:shadow-sm transition print:border-black print:p-2 print:shadow-none"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium print:text-black">
                    {r.author}
                  </span>
                  <span className="flex items-center gap-1 text-yellow-400 print:text-black">
                    <MdStar /> {r.rating.toFixed(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 print:text-black">
                  {r.content}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="flex justify-center print:hidden gap-x-2">
        <button className="rounded-lg bg-[#7b5449] px-6 py-2 min-w-35 text-white text-sm hover:scale-105 active:scale-95">
          견적 요청
        </button>
        <Link
          href="/service/estimate"
          className="inline-block rounded-lg bg-[#7b5449] px-6 py-2 min-w-[140px] text-white text-sm text-center hover:scale-105 active:scale-95 transition"
        >
          목록으로
        </Link>
      </div>
    </div>
  );
}
