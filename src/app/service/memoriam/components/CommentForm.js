"use client";

import { useState, useEffect } from "react";

export default function CommentForm({
  onSubmit,
  onCancel,
  initialText = "",
  placeholder = "따뜻한 위로의 말을 남겨주세요.",
  submitLabel = "등록",
}) {
  const [text, setText] = useState(initialText);

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-grow border rounded-md p-2 text-sm focus:ring-2 focus:ring-[#7b5449] focus:outline-none"
        autoFocus={initialText.length > 0 || submitLabel === "답글"} // 수정 또는 답글 시 자동 포커스
      />
      <button
        type="submit"
        disabled={!text.trim()}
        className="bg-[#7b5449] text-white px-4 py-2 rounded-md text-sm hover:bg-[#694237] transition-colors disabled:bg-gray-400"
      >
        {submitLabel}
      </button>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-500 text-sm px-2"
        >
          취소
        </button>
      )}
    </form>
  );
}
