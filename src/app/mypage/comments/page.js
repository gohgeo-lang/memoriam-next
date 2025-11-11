"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Section from "@/components/Section";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function MyCommentsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    const fetchMyComments = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/users/comments");
        if (res.ok) setComments(await res.json());
      } catch (error) {
        console.error("댓글 조회 실패:", error);
      }
      setIsLoading(false);
    };
    fetchMyComments();
  }, [session]);

  if (!session)
    return (
      <p className="text-center mt-10 text-gray-500">
        로그인 후 이용 가능한 페이지입니다.
      </p>
    );

  if (isLoading) return <LoadingSpinner text="댓글을 불러오는 중..." />;

  if (comments.length === 0)
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-5 flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-6">아직 작성한 댓글이 없습니다.</p>
        <Link
          href="/mypage"
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition"
        >
          돌아가기
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-5">
      <Section title="내가 쓴 댓글">
        <div className="overflow-x-auto">
          <table className="min-w-full border-t border-gray-200 bg-white rounded-xl shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-sm text-gray-600">
                <th className="py-3 px-4 text-left w-[60%]">내용</th>
                <th className="py-3 px-4 text-left">게시물</th>
                <th className="py-3 px-4 text-left">작성일</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => {
                    if (c.post?.id) {
                      // ✅ 404 안 나게 안전한 이동 (메모리엄 페이지로만 이동)
                      router.push(`/service/memoriam?highlight=${c.post.id}`);
                    } else {
                      alert("삭제된 게시물입니다.");
                    }
                  }}
                  className="border-t text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition"
                >
                  <td className="py-3 px-4 truncate max-w-xs">{c.content}</td>
                  <td className="py-3 px-4 text-[#7b5449]">
                    {c.post?.title || "삭제된 게시물"}
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs">
                    {new Date(c.createdAt).toLocaleDateString("ko-KR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/mypage"
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition"
          >
            돌아가기
          </Link>
        </div>
      </Section>
    </div>
  );
}
