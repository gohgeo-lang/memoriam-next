// app/estimate/page.js
"use client";
import { useEffect, useMemo, useState } from "react";
import FilterBar from "./components/FilterBar";
import CompanyCard from "./components/CompanyCard";
import Pagination from "./components/Pagination";
import { loadCompanies } from "./lib/companiesCache";
import { useSearchParams } from "next/navigation";
import CompareCompanies from "./components/Compare";

const ITEMS_PER_PAGE = 12; // 한 페이지에 12개씩 보여주기

export default function EstimatePage() {
  const [companies, setCompanies] = useState([]);
  const [query, setQuery] = useState({
    keyword: "",
    city: "",
    tags: [],
    sort: "추천",
  });

  const SortType = Object.freeze({
    Recommend: 1,
    Distance: 2,
    PriceLow: 3,
    PriceHigh: 4,
    RatingHigh: 5,
  });

  const roll_a = SortType.Recommend;
  console.log(roll_a);

  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const handleSelect = (company) => {
    setSelectedCompanies((prev) =>
      prev.find((c) => c.id === company.id)
        ? prev.filter((c) => c.id !== company.id)
        : [...prev, company]
    );
  };

  const handleOpenCompare = () => {
    if (selectedCompanies.length >= 2) setIsCompareOpen(true);
    else alert("2개 이상의 업체를 선택해주세요!");
  };

  const handleCloseCompare = () => setIsCompareOpen(false);

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
    <div className="space-y-2">
      <FilterBar onChange={setQuery} />
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6 px-2 py-2">
        {/* 현재 페이지 정보 */}
        <div className="bg-[#856056] px-4 py-2 rounded-md shadow-sm w-full sm:w-auto text-center sm:text-left">
          <p className="text-sm text-white whitespace-nowrap">
            전체 {companyList.length}개 중 {startIndex + 1}-
            {Math.min(endIndex, companyList.length)}번째 업체
            <span className="ml-1">
              (페이지 {currentPage}/{totalPages})
            </span>
          </p>
        </div>

        {/* 버튼 영역 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedCompanies([])}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 active:scale-95 transition"
          >
            선택 초기화
          </button>
          <button
            onClick={handleOpenCompare}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 active:scale-95 transition"
          >
            비교하기 ({selectedCompanies.length})
          </button>
        </div>

        {/* 비교 모달 */}
        {isCompareOpen && (
          <CompareCompanies
            companies={selectedCompanies}
            onClose={handleCloseCompare}
          />
        )}
      </div>
      {currentCompanies.length === 0 ? (
        <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
          조건에 맞는 업체가 없어요. 필터를 조정해보세요.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mx-2">
          {currentCompanies.map(
            (company) =>
              company.registered && (
                <div key={company.id}>
                  <CompanyCard
                    company={company}
                    isSelected={selectedCompanies.some(
                      (c) => c.id === company.id
                    )}
                    onSelect={() => handleSelect(company)}
                  />
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
