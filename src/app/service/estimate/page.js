"use client";
import {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useDeferredValue,
} from "react";
import FilterBar from "./components/FilterBar";
import CompanyCard from "./components/CompanyCard";
import Pagination from "./components/Pagination";
import CompareCompanies from "./components/Compare";
import LoadingSpinner from "@/components/LoadingSpinner";
import { loadCompanies } from "./lib/companiesCache";
import { useSearchParams } from "next/navigation";

const ITEMS_PER_PAGE = 12;

export default function EstimatePage() {
  const [companies, setCompanies] = useState([]);
  const [query, setQuery] = useState({
    keyword: "",
    city: "",
    tags: [],
    sort: "추천",
  });
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  /** 🔹 데이터 로드 (지연 + 에러 방지) */
  useEffect(() => {
    let isMounted = true;
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const getData = async (lat, lon) => {
          const data = await loadCompanies(lat, lon);
          if (isMounted) setCompanies(data);
        };

        navigator.geolocation.getCurrentPosition(
          (pos) => getData(pos.coords.latitude, pos.coords.longitude),
          () => getData() // 위치 정보 실패 시 기본 데이터
        );
      } catch (err) {
        console.error("업체 데이터 로드 오류:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchCompanies();
    return () => {
      isMounted = false;
    };
  }, []);

  // 🔹 query가 바뀔 때 선택한 업체 초기화
  useEffect(() => {
    setSelectedCompanies([]);
  }, [query]);

  /** 🔹 필터 입력에 따른 렌더링 부하 줄이기 */
  const deferredQuery = useDeferredValue(query);

  /** 🔹 필터 + 정렬 */
  const companyList = useMemo(() => {
    if (!companies.length) return [];

    let data = companies.filter((c) => c.registered);

    const { keyword, city, tags, sort } = deferredQuery;
    const kw = keyword.trim();

    if (kw) {
      data = data.filter(
        (c) =>
          c.name.includes(kw) ||
          c.tags.some((t) => t.includes(kw)) ||
          c.city.includes(kw)
      );
    }

    if (city) data = data.filter((c) => c.city.includes(city));
    if (tags.length)
      data = data.filter((c) => tags.every((t) => c.tags.includes(t)));

    switch (sort) {
      case "거리순":
        data.sort((a, b) => a.distanceKm - b.distanceKm);
        break;
      case "낮은가격":
        data.sort((a, b) => a.priceFrom - b.priceFrom);
        break;
      case "높은평점":
        data.sort((a, b) => b.rating - a.rating);
        break;
      default:
        data.sort((a, b) => a.name.localeCompare(b.name, "ko"));
        break;
    }

    return data;
  }, [deferredQuery, companies]);

  /** 🔹 Pagination 계산 */
  const totalPages = Math.ceil(companyList.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentCompanies = useMemo(
    () => companyList.slice(startIndex, startIndex + ITEMS_PER_PAGE),
    [companyList, currentPage]
  );

  /** 🔹 선택 관련 핸들러 메모이제이션 */
  const handleSelect = useCallback((company) => {
    setSelectedCompanies((prev) =>
      prev.find((c) => c.id === company.id)
        ? prev.filter((c) => c.id !== company.id)
        : [...prev, company]
    );
  }, []);

  const handleOpenCompare = useCallback(() => {
    if (selectedCompanies.length >= 2) setIsCompareOpen(true);
    else alert("2개 이상의 업체를 선택해주세요!");
  }, [selectedCompanies.length]);

  const handleCloseCompare = useCallback(() => setIsCompareOpen(false), []);

  /** 🔹 잘못된 페이지 방어 */
  if (
    !loading &&
    totalPages > 0 &&
    (currentPage < 1 || currentPage > totalPages)
  ) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">잘못된 페이지입니다</h1>
        <p>요청하신 페이지가 존재하지 않습니다.</p>
        <a href="/estimate" className="text-blue-500 underline">
          첫 페이지로 돌아가기
        </a>
      </div>
    );
  }

  /** 🔹 로딩 처리 */
  if (loading) return <LoadingSpinner />;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f5f5]">
      <div className="relative z-10 space-y-3">
        <FilterBar onChange={setQuery} />

        <div className="flex flex-col sm:flex-row sm:items-center justify-left gap-3 flex-wrap px-2 py-2">
          <div className="bg-[rgb(133,96,86)] px-4 py-2 rounded-md shadow-sm w-full sm:w-auto text-center sm:text-left">
            <p className="text-sm text-white whitespace-nowrap">
              전체 {companyList.length}개 중 {startIndex + 1}-
              {Math.min(startIndex + ITEMS_PER_PAGE, companyList.length)}번째
              업체
              <span className="ml-1">
                (페이지 {currentPage}/{totalPages})
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedCompanies([])}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium transition ${
                selectedCompanies.length
                  ? "bg-[#7b5449] text-white hover:bg-[#61443b]"
                  : "border-gray-300 bg-white text-gray-700"
              }`}
            >
              선택 초기화
            </button>

            <button
              onClick={handleOpenCompare}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium transition ${
                selectedCompanies.length >= 2
                  ? "bg-[#7b5449] text-white hover:bg-[#61443b]"
                  : "border-gray-300 bg-white text-gray-700"
              }`}
            >
              비교하기 ({selectedCompanies.length})
            </button>
          </div>
        </div>

        {isCompareOpen && (
          <CompareCompanies
            companies={selectedCompanies}
            onClose={handleCloseCompare}
          />
        )}

        {currentCompanies.length === 0 ? (
          <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
            조건에 맞는 업체가 없어요. 필터를 조정해보세요.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mx-2">
            {currentCompanies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                isSelected={selectedCompanies.some((c) => c.id === company.id)}
                onSelect={() => handleSelect(company)}
              />
            ))}
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl="/service/estimate"
        />
      </div>
    </div>
  );
}
