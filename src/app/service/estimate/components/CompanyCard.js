import Link from "next/link";

export default function CompanyCard({ company, isSelected, onSelect }) {
  const rating =
    company.reviews.reduce((acc, cur) => acc + cur.rating, 0) /
    company.reviews.length;
  const reviews = company.reviews.length;
  return (
    <div
      className={`border rounded-xl p-5 shadow-sm relative cursor-pointer transition
    ${
      isSelected
        ? "border-[#61443b] bg-[#f7ece8]"
        : "border-gray-200 bg-white hover:shadow-md"
    }
  `}
      onClick={onSelect}
    >
      {/* 헤더 */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-[#3d2a25]">{company.name}</h3>
        <div className="flex items-center gap-1 text-amber-600">
          <span className="font-semibold">{rating.toFixed(1)}</span>
          <span className="text-xs text-gray-500">({reviews})</span>
        </div>
      </div>

      {/* 본문 */}
      <div className="text-sm text-gray-700 space-y-1 mb-3">
        <div className="flex flex-wrap items-center gap-2">
          <span>💰 {company.priceFrom.toLocaleString()}원~</span>
          <span className="text-gray-300">•</span>
          <span>
            🚗{" "}
            {isNaN(company.distanceKm)
              ? "정보없음"
              : `${company.distanceKm} km`}
          </span>
          <span className="text-gray-300">•</span>
          <span>📍 {company.city || "지역 정보 없음"}</span>
        </div>
        <div className="text-xs text-gray-500">
          🗓 인허가일자: {company.approvedDate || "-"}
        </div>
      </div>

      {/* 태그 */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {company.tags.slice(0, 5).map((t) => (
          <span
            key={t}
            className="inline-flex items-center rounded-full bg-[#7b5449] px-2 py-0.5 text-xs text-white"
          >
            {t}
          </span>
        ))}
        {company.tags.length > 5 && (
          <span className="text-xs text-gray-400">
            +{company.tags.length - 5}
          </span>
        )}
      </div>

      {/* 푸터 */}
      <div className="flex items-center justify-between">
        <Link
          href={`/service/estimate/${company.id}`}
          onClick={(e) => e.stopPropagation()} // 이벤트 버블 방지
          className="rounded-lg border px-3 py-1.5 text-sm hover:bg-[#7b5449] hover:text-white transition"
        >
          상세보기
        </Link>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className={`rounded-lg border px-3 py-1.5 text-sm transition ${
            isSelected
              ? "bg-[#7b5449] text-white border-[#7b5449]"
              : "hover:bg-[#f3eae8]"
          }`}
        >
          {isSelected ? "비교 제거" : "비교 선택"}
        </button>
      </div>
    </div>
  );
}
