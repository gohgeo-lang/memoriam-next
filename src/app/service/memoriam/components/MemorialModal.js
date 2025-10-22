"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function MemorialModal({ story, onClose, onCommentSubmit }) {
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      onCommentSubmit(story.id, commentText);
      setCommentText("");
    }
  };

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
          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-gray-900"
          >
            &times;
          </button>
        </header>

        <main className="p-6 overflow-y-auto">
          <div className="relative w-full h-64 rounded-md mb-4 overflow-hidden">
            <Image
              src={story.thumbnailUrl || "/image/dog-cat1.webp"}
              alt={story.petName}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <p className="text-gray-700 whitespace-pre-wrap">{story.content}</p>

          <div className="mt-8">
            <h4 className="font-bold mb-4">댓글</h4>
            <div className="space-y-4">
              {story.comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 p-3 rounded-md">
                  <p className="font-semibold text-sm">{comment.author}</p>
                  <p className="text-gray-600">{comment.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
              <input
                type="text"
                name="comment"
                placeholder="따뜻한 위로의 말을 남겨주세요."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-grow border rounded-md p-2 focus:ring-2 focus:ring-[#7b5449] focus:outline-none"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="bg-[#7b5449] text-white px-4 py-2 rounded-md hover:bg-[#694237] transition-colors disabled:bg-gray-400"
              >
                등록
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
