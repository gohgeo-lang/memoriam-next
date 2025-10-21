// app/estimate/page.js
"use client";
import { useEffect, useMemo, useState } from "react";
import { TEST_VENDORS } from "./lib/vendors";
import getCompanies from "./lib/companies";
import VendorCard from "./components/VendorCard";
import FilterBar from "./components/FilterBar";
import CompanyCard from "./components/CompanyCard";

export default function EstimatePage() {
  const [companies, setCompanies] = useState([]);
  const [query, setQuery] = useState({
    keyword: "",
    city: "",
    tags: [],
    sort: "추천",
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const datas = await getCompanies(latitude, longitude);
        setCompanies(datas);
      },
      async () => {
        const datas = await getCompanies(); // 위치 정보 없을 때
        setCompanies(datas);
      }
    );
  }, []);

  const companyList = useMemo(() => {
    let data = [...companies];

    if (query.keyword) {
      const kw = query.keyword.trim();
      data = data.filter(
        (company) =>
          company.name.includes(kw) ||
          company.tags.some((t) => t.includes(kw)) ||
          company.city.includes(kw)
      );
    }

    if (query.city)
      data = data.filter(
        (company) =>
          company.city[0].includes(query.city) ||
          company.city[1].includes(query.city)
      );
    if (query.tags.length)
      data = data.filter((company) =>
        query.tags.every((t) => company.tags.includes(t))
      );

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
  }, [query, companies]);

  return (
    <div className="space-y-6">
      <FilterBar onChange={setQuery} />
      <div className="flex items-center justify-between mx-5 my-0">
        <h2 className="text-sm text-gray-600">총 {companyList.length}곳</h2>
        <button className="text-sm text-gray-500 hover:text-gray-800 active:scale-95">
          지도로 보기(준비중)
        </button>
      </div>
      {companyList.length === 0 ? (
        <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
          조건에 맞는 업체가 없어요. 필터를 조정해보세요.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {companyList.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}
    </div>
  );
}
