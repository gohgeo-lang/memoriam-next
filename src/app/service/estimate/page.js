// app/estimate/page.js
"use client";
import { useMemo, useState } from "react";
import { TEST_VENDORS } from "./lib/vendors";
import VendorCard from "./components/VendorCard";
import FilterBar from "./components/FilterBar";

export default function EstimatePage() {
  const [query, setQuery] = useState({
    keyword: "",
    city: "",
    tags: [],
    sort: "추천",
  });

  const list = useMemo(() => {
    let data = [...TEST_VENDORS];

    if (query.keyword) {
      const kw = query.keyword.trim();
      data = data.filter(
        (v) =>
          v.name.includes(kw) ||
          v.tags.some((t) => t.includes(kw)) ||
          v.city.includes(kw)
      );
    }

    if (query.city) data = data.filter((v) => v.city === query.city);
    if (query.tags.length)
      data = data.filter((v) => query.tags.every((t) => v.tags.includes(t)));

    switch (query.sort) {
      case "거리순":
        data.sort((a, b) => a.distanceKm - b.distanceKm);
        break;
      case "낮은가격":
        data.sort((a, b) => a.priceFrom - b.priceFrom);
        break;
      case "높은평점":
        data.sort((a, b) => b.rating - a.rating);
        break;
      case "추천":
      default:
        data.sort(
          (a, b) =>
            b.rating * 2 +
            Math.min(b.reviews, 200) / 100 -
            b.distanceKm * 0.05 -
            (a.rating * 2 +
              Math.min(a.reviews, 200) / 100 -
              a.distanceKm * 0.05)
        );
        break;
    }
    return data;
  }, [query]);

  return (
    <div className="space-y-6">
      <FilterBar onChange={setQuery} />
      <div className="flex items-center justify-between mx-5 my-0">
        <h2 className="text-sm text-gray-600">총 {list.length}곳</h2>
        <button className="text-sm text-gray-500 hover:text-gray-800 active:scale-95">
          지도로 보기(준비중)
        </button>
      </div>
      {list.length === 0 ? (
        <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
          조건에 맞는 업체가 없어요. 필터를 조정해보세요.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((v) => (
            <VendorCard key={v.id} vendor={v} />
          ))}
        </div>
      )}
    </div>
  );
}
