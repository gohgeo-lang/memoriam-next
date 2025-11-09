"use client";

import { useEffect } from "react";
import Image from "next/image";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";

export default function MemorialModal({
  story,
  session,
  onClose,
  onCommentSubmit,
  onCommentEdit,
  onCommentDelete,
  onStoryEdit,
  onStoryDelete,
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleNewCommentSubmit = (text) => {
    onCommentSubmit(story.id, text, null);
  };

  const isAuthor = session?.user?.id === String(story.authorId);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">{story.title}</h2>
          <div className="flex itmes-center gap-2">
            {isAuthor && (
              <>
                <button
                  onClick={() => onStoryEdit(story)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  수정
                </button>
                <button
                  onClick={() => onStoryDelete(story.id)}
                  className="text-sm text-read-600 hover:text-red-800"
                >
                  삭제
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="text-2xl text-gray-500 hover:text-gray-900"
            >
              &times;
            </button>
          </div>
        </header>

        <main className="p-6 overflow-y-auto">
          <div className="relative w-full rounded-md mb-4">
            <Image
              key={story.id}
              src={story.thumbnailUrl || "/image/dog-cat1.webp"}
              alt={story.petName}
              width={1200}
              height={1200}
              className="w-full h-auto roudned-md"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <p className="text-gray-700 whitespace-pre-wrap">{story.content}</p>

          <div className="mt-8">
            <h4 className="font-bold mb-4">댓글</h4>
            <div className="space-y-4">
              {story.comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  postId={story.id}
                  onCommentSubmit={onCommentSubmit}
                  onCommentEdit={onCommentEdit}
                  onCommentDelete={onCommentDelete}
                />
              ))}
            </div>

            <div className="mt-6">
              <CommentForm onSubmit={handleNewCommentSubmit} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
