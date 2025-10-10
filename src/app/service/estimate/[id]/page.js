// app/estimate/[id]/page.js
import Link from "next/link";
import { notFound } from "next/navigation";
import { TEST_VENDORS } from "../lib/vendors";

function findVendor(id) {
  return TEST_VENDORS.find((v) => v.id === id);
}

export default function VendorDetailPage({ params }) {
  const vendor = findVendor(params.id);

  console.log(vendor);
  if (!vendor) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{vendor.name}</h1>
          <p className="mt-1 text-sm text-gray-600">
            {vendor.city} • 최저 {vendor.priceFrom.toLocaleString()}원 • 평점{" "}
            {vendor.rating} ({vendor.reviews})
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {vendor.tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <Link
          href="/service/estimate"
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          목록으로
        </Link>
      </div>

      {/* 화장 방식 */}
      <section className="rounded-xl border bg-white p-4">
        <h2 className="text-base font-semibold">화장 방식</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {vendor.cremationTypes.map((c) => (
            <div key={c.type} className="rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <p className="font-medium">{c.type}</p>
                <p className="text-sm text-gray-600">
                  기본가 {c.basePrice.toLocaleString()}원~
                </p>
              </div>
              <p className="mt-1 text-sm text-gray-600">{c.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 가격표 */}
      <section className="rounded-xl border bg-white p-4">
        <h2 className="text-base font-semibold">가격표</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="py-2">체중</th>
                <th className="py-2">개별 화장</th>
                <th className="py-2">합동 화장</th>
              </tr>
            </thead>
            <tbody>
              {vendor.priceTable.map((row) => (
                <tr key={row.weight} className="border-t">
                  <td className="py-2">{row.weight}</td>
                  <td className="py-2">{row.indiv.toLocaleString()}원</td>
                  <td className="py-2">{row.group.toLocaleString()}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {vendor.options?.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {vendor.options.map((o) => (
              <span
                key={o}
                className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700"
              >
                {o}
              </span>
            ))}
          </div>
        ) : null}
      </section>

      {/* 운영시간 */}
      <section className="rounded-xl border bg-white p-4">
        <h2 className="text-base font-semibold">운영시간</h2>
        <div className="mt-2 grid gap-2 text-sm text-gray-700 md:grid-cols-2">
          <p>평일: {vendor.hours.weekdays}</p>
          <p>주말/공휴일: {vendor.hours.weekend}</p>
          <p>야간/긴급: {vendor.hours.emergency}</p>
          <p className="text-gray-600">안내: {vendor.hours.lastEntryNote}</p>
        </div>
      </section>

      {/* 연락처/위치 */}
      <section className="rounded-xl border bg-white p-4">
        <h2 className="text-base font-semibold">연락처 · 위치</h2>
        <div className="mt-2 grid gap-2 text-sm text-gray-700 md:grid-cols-2">
          <p>
            전화:{" "}
            <a
              href={`tel:${vendor.contacts.phone}`}
              className="text-blue-600 hover:underline"
            >
              {vendor.contacts.phone}
            </a>
          </p>
          <p>주소: {vendor.contacts.address}</p>
          <p className="md:col-span-2">
            웹사이트:{" "}
            <a
              href={vendor.contacts.site}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {vendor.contacts.site}
            </a>
          </p>
        </div>
        <div className="mt-3">
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
            견적 요청
          </button>
        </div>
      </section>
    </div>
  );
}
