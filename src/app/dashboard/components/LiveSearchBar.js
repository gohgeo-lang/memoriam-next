// "use client";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useState, useEffect } from "react";

// export default function LiveSearchBar({ onSearch }) {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");
//   const [isSearching, setIsSearching] = useState(false);

//   // 디바운스: 사용자가 타이핑을 멈춘 후 0.5초 뒤에 검색 실행
//   useEffect(() => {
//     // 타이머 설정
//     const timer = setTimeout(() => {
//       if (searchInput !== searchParams.get("q")) {
//         setIsSearching(true);
//         const params = new URLSearchParams(searchParams);

//         if (searchInput) {
//           params.set("q", searchInput);
//         } else {
//           params.delete("q");
//         }

//         router.push(`/dashboard?${params.toString()}`);
//         setIsSearching(false);
//       }
//     }, 500); // 500ms = 0.5초

//     // 컴포넌트가 다시 렌더링되면 이전 타이머 취소
//     return () => clearTimeout(timer);
//   }, [searchInput, router, searchParams]);

//   return (
//     <div className="relative">
//       <input
//         type="text"
//         value={searchInput}
//         onChange={(e) => setSearchInput(e.target.value)}
//         placeholder="실시간 검색..."
//         className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//       />

//       {/* 검색 중 표시 */}
//       {isSearching && (
//         <div className="absolute right-3 top-3">
//           <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//         </div>
//       )}

//       {/* X 버튼 (검색어가 있을 때만 표시) */}
//       {searchInput && !isSearching && (
//         <button
//           onClick={() => setSearchInput("")}
//           className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
//         >
//           ✕
//         </button>
//       )}
//     </div>
//   );
// }
// LiveSearchBar.tsx
"use client";
import { useState, useEffect } from "react";

export default function LiveSearchBar({ onSearch }) {
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSearching(true);
      onSearch?.(searchInput.trim());
      setIsSearching(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, onSearch]);

  return (
    <div className="max-w-7xl mx-auto mt-4 px-8 relative">
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="업체 이름으로 검색..."
        className="w-full px-5 py-3 pr-12 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-700"
      />

      {/* 검색 중 로딩 스피너 */}
      {isSearching && (
        <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* X 버튼 */}
      {searchInput && !isSearching && (
        <button
          onClick={() => setSearchInput("")}
          className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      )}
    </div>
  );
}
