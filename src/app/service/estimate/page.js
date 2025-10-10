import FilterBar from "./components/FilterBar";
import QuoteList from "./components/QuoteList";
import ComparisonTable from "./components/ComparisonTable";
import EmptyState from "./components/EmptyState";

export default function ComparePage() {
  // 임시 데이터 (추후 API 연결 예정)
  const quotes = [
    { id: 1, name: "행복 펫 장례", price: 350000, rating: 4.5 },
    { id: 2, name: "펫엔젤 서비스", price: 420000, rating: 4.7 },
  ];

  const selected = [quotes[0]]; // 선택된 업체 상태 (추후 useState로 관리)

  return (
    <div className="p-6 space-y-6">
      <FilterBar />

      {quotes.length > 0 ? (
        <QuoteList quotes={quotes} />
      ) : (
        <EmptyState message="아직 등록된 견적이 없습니다." />
      )}

      {selected.length > 0 && <ComparisonTable selected={selected} />}
    </div>
  );
}
