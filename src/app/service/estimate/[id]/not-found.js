import Link from "next/link";

export default function NotFound() {
  return (
    <div className="rounded-xl border bg-white p-8 text-center">
      <p className="text-gray-700">해당 업체를 찾을 수 없어요</p>
      <Link
        href="/service/estimate"
        className="mt-3 inline-block text-sm text-blue-600 hover:underline"
      >
        목록으로 돌아가기
      </Link>
    </div>
  );
}
