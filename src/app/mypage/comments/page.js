"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Section from "@/components/Section";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function MyCommentsPage() {
  const { data: session } = useState();
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
      <p className="text-center mt-10 text-gray-500">
        아직 작성한 댓글이 없습니다.
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-5">
      <Section title="내가 쓴 댓글">
        <div className="space-y-4">
          {comments.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition"
            >
              <p className="text-sm text-gray-700">{c.content}</p>
              <p className="text-xs text-gray-500 mt-1">
                게시물: {c.post?.title || "삭제된 게시물"}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                작성일: {new Date(c.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
