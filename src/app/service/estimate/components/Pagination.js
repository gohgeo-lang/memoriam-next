// components/Pagination.js
import Link from "next/link";

export default function Pagination({ currentPage, totalPages, baseUrl = "" }) {
  // 페이지 번호 배열 생성
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // 최대 표시할 페이지 번호 개수

    if (totalPages <= maxVisible) {
      // 전체 페이지가 5개 이하면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 현재 페이지 기준으로 앞뒤 2개씩 표시
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);

      // 첫 페이지
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push("...");
      }

      // 중간 페이지들
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // 마지막 페이지
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="flex justify-center mt-8">
      <nav className="flex items-center gap-1" aria-label="페이지네이션">
        {/* 처음으로 버튼 */}
        {currentPage > 1 && (
          <Link
            href={`${baseUrl}?page=1`}
            className="px-2 py-1 text-sm border rounded hover:bg-gray-400"
            aria-label="첫 페이지로"
          >
            ≪
          </Link>
        )}

        {/* 이전 버튼 */}
        {currentPage > 1 ? (
          <Link
            href={`${baseUrl}?page=${currentPage - 1}`}
            className="px-3 py-2 border rounded hover:bg-[#7b5449]"
            aria-label="이전 페이지"
          >
            이전
          </Link>
        ) : (
          <span className="px-3 py-2 border rounded bg-gray-200 text-gray-400 cursor-not-allowed">
            이전
          </span>
        )}

        {/* 페이지 번호들 */}
        <div className="flex gap-1 mx-2">
          {pageNumbers.map((pageNum, index) => {
            if (pageNum === "...") {
              return (
                <span key={`ellipsis-${index}`} className="px-2 py-2">
                  ...
                </span>
              );
            }

            const isActive = currentPage === pageNum;

            return (
              <Link
                key={pageNum}
                href={`${baseUrl}?page=${pageNum}`}
                className={`
                  min-w-[40px] px-3 py-2 border rounded text-center
                  ${
                    isActive
                      ? "bg-[#7b5449] text-white border-[#7b5449]"
                      : "hover:bg-[#7b5449]"
                  }
                `}
                aria-label={`페이지 ${pageNum}`}
                aria-current={isActive ? "page" : undefined}
              >
                {pageNum}
              </Link>
            );
          })}
        </div>

        {/* 다음 버튼 */}
        {currentPage < totalPages ? (
          <Link
            href={`${baseUrl}?page=${currentPage + 1}`}
            className="px-3 py-2 border rounded hover:bg-[#7b5449]"
            aria-label="다음 페이지"
          >
            다음
          </Link>
        ) : (
          <span className="px-3 py-2 border rounded bg-gray-200 text-gray-400 cursor-not-allowed">
            다음
          </span>
        )}

        {/* 마지막으로 버튼 */}
        {currentPage < totalPages && (
          <Link
            href={`${baseUrl}?page=${totalPages}`}
            className="px-2 py-1 text-sm border rounded hover:bg-gray-400"
            aria-label="마지막 페이지로"
          >
            ≫
          </Link>
        )}
      </nav>
    </div>
  );
}
