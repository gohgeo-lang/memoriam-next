"use client";
import { useState, useEffect } from "react";

export default function LiveSearchBar({ onSearch, activeTab }) {
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentTab, setCurrentTab] = useState("");

  if (currentTab !== activeTab) {
    setCurrentTab(activeTab);
    setSearchInput("");
  }

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
        placeholder="검색 내용을 입력해 주세요..."
        className="w-full px-5 py-3 pr-12 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-700"
      />

      {/* 검색 중 로딩 스피너 */}
      {isSearching && (
        <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* X 버튼 */}
      {/* {searchInput && !isSearching && (
        <button
          onClick={() => setSearchInput("")}
          className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          X
        </button>
      )} */}
    </div>
  );
}
