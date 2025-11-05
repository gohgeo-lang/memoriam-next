import Link from "next/link";

export default function CompanyCard({ company }) {
  const path = "/service/estimate";

  return (
    <div className="rounded-xl border p-4 m-4 bg-[#fdf8f6] shadow hover:shadow-xl hover:bg-[#c5a79d] transition ">
      <div className="flex items-start justify-between">
        <h3 className="text-base font-semibold">{company.name}</h3>
        <div className="flex items-center gap-1 text-amber-600">
          <span className="text-sm font-medium">
            {company.rating.toFixed(1)}
          </span>
          <span className="text-xs text-gray-500">({company.reviews})</span>
        </div>
      </div>

      <div className="p-3 border rounded-lg shadow-sm text-sm text-gray-700">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-500">{company.state}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span>💰 {company.priceFrom.toLocaleString()}원</span>
          <span className="text-gray-300">•</span>
          <span className="w-30">
            🚗{" "}
            {isNaN(company.distanceKm)
              ? "정보없음"
              : `${company.distanceKm} km`}
          </span>
          <span className="text-gray-300">•</span>
          <span>
            📍 {company.city[0] || company.city[1] || "지역 정보 없음"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <span>🗓 인허가일자: {company.approvedDate || "-"}</span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2.5">
        {company.tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center rounded-full bg-[#7b5449] px-2 py-1 text-xs font-medium text-white"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <Link
          href={`/service/estimate/${company.id}`}
          className="rounded-lg border px-3 py-1.5 text-sm hover:bg-[#7b5449] hover:text-white active:scale-95"
        >
          상세보기
        </Link>
        <button className="rounded-lg border px-3 py-1.5 text-sm hover:bg-[#7b5449] hover:text-white active:scale-95">
          견적 요청
        </button>
      </div>
    </div>
  );
}
