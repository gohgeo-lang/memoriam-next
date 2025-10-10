export default function FilterBar() {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
      <select className="p-2 border rounded">
        <option>지역 전체</option>
        <option>서울</option>
        <option>부산</option>
      </select>
      <select className="p-2 border rounded">
        <option>정렬: 기본</option>
        <option>가격 낮은순</option>
        <option>가격 높은순</option>
        <option>평점순</option>
      </select>
      <button className="ml-auto px-4 py-2 bg-blue-500 text-white rounded">
        필터 적용
      </button>
    </div>
  );
}
