"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import CommentForm from "./CommentForm";

export default function CommentItem({
  comment,
  postId,
  onCommentSubmit,
  onCommentEdit,
  onCommentDelete,
}) {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id
    ? parseInt(session.user.id, 10)
    : null;
  const isAuthor = comment.authorId === currentUserId;

  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleReplySubmit = (text) => {
    onCommentSubmit(postId, text, comment.id); // parentId로 자신의 ID 전달
    setIsReplying(false);
  };

  const handleEditSubmit = (text) => {
    onCommentEdit(comment.id, text);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onCommentDelete(comment.id);
  };

  return (
    <div className="bg-gray-50 p-3 rounded-md">
      {isEditing ? (
        <CommentForm
          initialText={comment.text}
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditing(false)}
          submitLabel="저장"
        />
      ) : (
        <>
          <p className="font-semibold text-sm">
            {comment.author || "방문자"}
            {comment.isDeleted && (
              <span className="text-gray-400 font-normal"> (삭제됨)</span>
            )}
          </p>
          <p
            className="text-gray-600 whitespace-pre-wrap"
            style={
              comment.isDeleted ? { color: "#9ca3af", fontStyle: "italic" } : {}
            }
          >
            {comment.text}
          </p>
          <div className="flex gap-4 mt-1 text-xs text-gray-500">
            {!comment.isDeleted && (
              <button
                onClick={() => setIsReplying(true)}
                className="hover:underline"
              >
                답글 달기
              </button>
            )}
            {isAuthor && !comment.isDeleted && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="hover:underline"
                >
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  className="text-red-500 hover:underline"
                >
                  삭제
                </button>
              </>
            )}
          </div>
        </>
      )}

      {isReplying && (
        <div className="mt-3">
          <CommentForm
            onSubmit={handleReplySubmit}
            onCancel={() => setIsReplying(false)}
            placeholder={`${comment.author || "방문자"}님에게 답글`}
            submitLabel="답글"
          />
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-5 mt-3 space-y-3 border-l-2 border-[#7b5449] pl-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              onCommentSubmit={onCommentSubmit}
              onCommentEdit={onCommentEdit}
              onCommentDelete={onCommentDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
