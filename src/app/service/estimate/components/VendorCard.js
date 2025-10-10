import Link from "next/link";

export default function VendorCard({ vendor }) {
  const path = "/service/estimate";
  console.log(path);
  return (
    <div className="rounded-xl border p-4 m-4 shadow hover:shadow-xl transition">
      <div className="flex items-start justify-between">
        <h3 className="text-base font-semibold">{vendor.name}</h3>
        <div className="flex items-center gap-1 text-amber-600">
          <span className="text-sm font-medium">
            {vendor.rating.toFixed(1)}
          </span>
          <span className="text-xs text-gray-500">({vendor.reviews})</span>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600">
        <span>최저 {vendor.priceFrom.toLocaleString()}원</span>
        <span className="text-gray-300">•</span>
        <span>{vendor.city}</span>
        <span className="text-gray-300">•</span>
        <span>{vendor.distanceKm}km</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2.5">
        {vendor.tags.map((t) => (
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
          href={`${path}/${vendor.id}`}
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
