"use client";
import React from "react";

export default function PostList({ data }) {
  if (!data?.length)
    return (
      <p className="text-center text-gray-500 mt-10">
        등록된 게시글이 없습니다.
      </p>
    );

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-2 py-2 sm:px-0">
        <div className="bg-gray-400 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 shadow-xl p-2 gap-2">
          {data.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1 p-6 flex flex-col"
            >
              {/* 제목 + 작성자 */}
              <h2 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                {post.title || "제목 없음"}
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                ✍️ {post.author?.name || "작성자 정보 없음"}
              </p>

              {/* 본문 */}
              <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                {post.content || "내용 정보 없음"}
              </p>

              {/* 댓글 */}
              <div className="bg-gray-100 rounded-lg p-3 text-sm text-gray-600 overflow-y-auto max-h-28">
                <p className="font-semibold mb-1">💬 댓글</p>
                {post.comments?.length > 0 ? (
                  post.comments.map((comment) => (
                    <p
                      key={comment.id}
                      className="border-b border-gray-200 py-1"
                    >
                      {comment.content || "댓글 없음"}{" "}
                      <span className="text-xs text-gray-400">
                        - {comment.author?.name || "익명"}
                      </span>
                    </p>
                  ))
                ) : (
                  <p className="text-gray-400">댓글이 없습니다.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
