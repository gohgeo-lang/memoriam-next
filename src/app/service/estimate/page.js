// app/estimate/page.js
"use client";
import { useEffect, useMemo, useState } from "react";
import FilterBar from "./components/FilterBar";
import CompanyCard from "./components/CompanyCard";
import Pagination from "./components/Pagination";
import { loadCompanies } from "./lib/companiesCache";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const ITEMS_PER_PAGE = 12; // 한 페이지에 12개씩 보여주기

export default function EstimatePage() {
  const [companies, setCompanies] = useState([]);
  const [query, setQuery] = useState({
    keyword: "",
    city: "",
    tags: [],
    sort: "추천",
  });
  // 현재 페이지 번호 가져오기 (기본값: 1)
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const datas = await loadCompanies(latitude, longitude);
        setCompanies(datas);
      },
      async () => {
        const datas = await loadCompanies(); // 위치 정보 없을 때
        setCompanies(datas);
      }
    );
  }, []);

  const companyList = useMemo(() => {
    let data = companies.filter((company) => company.registered);

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
      data = data.filter((company) => company.city.includes(query.city));
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
        data.sort((a, b) => a.name.localeCompare(b.name, "ko"));
        break;
    }
    return data;
  }, [query, companies]);

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(companyList.length / ITEMS_PER_PAGE);

  // 현재 페이지에 보여줄 업체수 계산
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCompanies = companyList.slice(startIndex, endIndex);

  // 페이지 번호가 올바른 범위인지 확인
  if (companyList.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">등록된 업체가 없습니다</h1>
        <p>관리자에게 문의해주세요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FilterBar onChange={setQuery} />
      <div className="flex items-center justify-between mx-5 my-0">
        {/* 현재 페이지 정보 */}
        <div className="mb-4 p-3 bg-[#856056] rounded">
          <p className="text-sm text-white">
            전체 {companyList.length}개 중 {startIndex + 1}-
            {Math.min(endIndex, companyList.length)}번째 업체 (페이지{" "}
            {currentPage}/{totalPages})
          </p>
        </div>
        <button className="text-sm text-gray-500 hover:text-gray-800 active:scale-95">
          지도로 보기(준비중)
        </button>
      </div>
      {currentCompanies.length === 0 ? (
        <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
          조건에 맞는 업체가 없어요. 필터를 조정해보세요.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {currentCompanies.map(
            (company) =>
              company.registered && (
                <div key={company.id}>
                  <CompanyCard key={company.id} company={company} />
                </div>
              )
          )}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        baseUrl="/service/estimate"
      />
    </div>
  );
}
