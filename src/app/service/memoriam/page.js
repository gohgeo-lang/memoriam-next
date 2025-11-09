"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Section from "@/components/Section";
import MemorialCard from "./components/MemorialCard";
import MemorialModal from "./components/MemorialModal";
import MemorialForm from "./components/MemorialForm";
import LoadingSpinner from "@/components/LoadingSpinner";

// 🔽 재귀적으로 댓글을 매핑하는 헬퍼 함수
const mapCommentData = (comment) => ({
  id: comment.id,
  author: comment.author?.name || "방문자",
  authorId: comment.authorId, // 👈 권한 확인용
  text: comment.content,
  isDeleted: comment.isDeleted, // 👈 삭제 상태
  replies: (comment.replies || []).map(mapCommentData), // 👈 재귀 호출
});

const mapStoryData = (post) => {
  const memorial = post.PostMemorial;
  const thumbnailUrl = memorial?.thumbnailUrl;

  return {
    id: post.id,
    title: post.title,
    content: post.content,
    petName: memorial?.petName || "댕냥이",
    ownerName: memorial?.ownerName || post.author?.name || "보호자",
    thumbnailUrl:
      thumbnailUrl && thumbnailUrl.trim()
        ? thumbnailUrl
        : "/image/dog-cat1.webp",
    rememberCount: memorial?.rememberCount || 0,
    // 🔽 mapCommentData 헬퍼 함수 사용
    comments: (post.comments || []).map(mapCommentData),
  };
};

// 🔽 댓글 상태 업데이트를 위한 재귀 헬퍼 함수
/**
 * 불변성을 유지하며 중첩된 댓글/답글 상태를 업데이트합니다.
 * @param {Array} comments - 현재 댓글 배열
 * @param {Object} updatedComment - 갱신할 댓글 객체
 * @param {String} mode - 'update' 또는 'add-reply'
 * @returns {Array} 갱신된 댓글 배열
 */
const updateCommentInState = (comments, updatedComment, mode = "update") => {
  return comments.map((c) => {
    // 1. 답글 추가 모드
    if (mode === "add-reply" && c.id === updatedComment.parentId) {
      return { ...c, replies: [...c.replies, updatedComment] };
    }
    // 2. 댓글 수정 모드
    if (mode === "update" && c.id === updatedComment.id) {
      return { ...c, ...updatedComment }; // 갱신 (text, isDeleted 등)
    }
    // 3. 재귀 (답글의 답글... 처리)
    if (c.replies && c.replies.length > 0) {
      return {
        ...c,
        replies: updateCommentInState(c.replies, updatedComment, mode),
      };
    }
    return c;
  });
};

/**
 * 불변성을 유지하며 중첩된 댓글/답글을 삭제합니다.
 * @param {Array} comments - 현재 댓글 배열
 * @param {Number} commentId - 삭제할 댓글 ID
 * @returns {Array} 갱신된 댓글 배열
 */
const deleteCommentInState = (comments, commentId) => {
  return comments
    .map((c) => {
      if (c.id === commentId) return null; // 1. 일치하면 배열에서 제거
      // 2. 재귀 (답글 탐색)
      if (c.replies && c.replies.length > 0) {
        return { ...c, replies: deleteCommentInState(c.replies, commentId) };
      }
      return c;
    })
    .filter(Boolean); // null이 된 댓글 제거
};

export default function MemorialPage() {
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [isWriting, setIsWriting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchStories = async () => {
      setIsLoading(true);
      try {
        // 🔽 API 호출 시 답글까지 모두 가져오도록 확인
        const res = await fetch("/api/posts");
        if (res.ok) {
          const data = await res.json();
          setStories(data.map(mapStoryData));
        }
      } catch (error) {
        console.error("Failed to fetch stories:", error);
      }
      setIsLoading(false);
    };

    fetchStories();
  }, []);

  const handleOpenModal = (story) => {
    setSelectedStory(story);
  };

  const handleCloseModal = () => {
    setSelectedStory(null);
  };

  // ... (handleRememberClick, handleStorySubmit은 이전과 동일)
  const handleRememberClick = async (storyId) => {
    // ... (기존 로직 동일) ...
  };
  const handleStorySubmit = async (formData) => {
    // ... (기존 로직 동일) ...
  };

  // 🔽 댓글 제출 핸들러 (답글 포함)
  const handleCommentSubmit = async (storyId, commentText, parentId = null) => {
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: commentText,
          postId: storyId,
          parentId: parentId, // 👈 parentId 전달
        }),
      });

      if (!res.ok) throw new Error("댓글 등록 실패");

      const newCommentFromDb = await res.json();

      // 🔽 API에서 받은 데이터를 프론트엔드 형식으로 매핑
      const newCommentMapped = {
        id: newCommentFromDb.id,
        author:
          newCommentFromDb.author?.name || session?.user?.name || "방문자",
        authorId: newCommentFromDb.authorId,
        text: newCommentFromDb.content,
        isDeleted: newCommentFromDb.isDeleted,
        replies: [], // 새 댓글/답글은 항상 replies가 비어있음
        parentId: newCommentFromDb.parentId, // 👈 parentId 포함
      };

      setStories((prevStories) =>
        prevStories.map((story) => {
          if (story.id === storyId) {
            let updatedComments;
            if (parentId) {
              // 답글인 경우 (재귀 헬퍼 사용)
              updatedComments = updateCommentInState(
                story.comments,
                newCommentMapped,
                "add-reply"
              );
            } else {
              // 새 댓글인 경우
              updatedComments = [...story.comments, newCommentMapped];
            }

            const updatedStory = { ...story, comments: updatedComments };

            if (selectedStory && selectedStory.id === storyId) {
              setSelectedStory(updatedStory); // 모달 상태 갱신
            }
            return updatedStory;
          }
          return story;
        })
      );
    } catch (error) {
      console.error("Failed to submit comment:", error);
      alert("냥! 댓글 등록 중 오류가 발생했다냥!");
    }
  };

  // 🔽 [신규] 댓글 수정 핸들러
  const handleCommentEdit = async (commentId, newContent) => {
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newContent }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "댓글 수정 실패");
      }

      const updatedCommentApi = await res.json();

      // 🔽 프론트엔드 모델에 맞게 변환
      const updatedCommentMapped = {
        id: updatedCommentApi.id,
        author: updatedCommentApi.author?.name || "방문자",
        authorId: updatedCommentApi.authorId,
        text: updatedCommentApi.content,
        isDeleted: updatedCommentApi.isDeleted,
        // replies는 이 API로 수정되지 않으므로 기존 것을 유지해야 함
      };

      setStories((prevStories) =>
        prevStories.map((story) => {
          if (
            story.comments.some(
              (c) =>
                c.id === commentId || c.replies.some((r) => r.id === commentId)
            )
          ) {
            const updatedComments = story.comments.map((c) => {
              if (c.id === commentId) return { ...c, ...updatedCommentMapped };
              if (c.replies && c.replies.length > 0) {
                return {
                  ...c,
                  replies: c.replies.map((r) =>
                    r.id === commentId ? { ...r, ...updatedCommentMapped } : r
                  ),
                };
              }
              return c;
            });

            const updatedStory = { ...story, comments: updatedComments };
            if (selectedStory && selectedStory.id === story.id) {
              setSelectedStory(updatedStory); // 모달 상태 갱신
            }
            return updatedStory;
          }
          return story;
        })
      );
    } catch (error) {
      console.error("Failed to edit comment:", error);
      alert(`댓글 수정 중 오류 발생: ${error.message}`);
    }
  };

  // 🔽 [신규] 댓글 삭제 핸들러
  const handleCommentDelete = async (commentId) => {
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "댓글 삭제 실패");
      }

      const { status, ...deletedResult } = await res.json();

      let updateFn;
      if (status === "soft-deleted") {
        // 소프트 삭제: content와 isDeleted만 업데이트
        const updatedCommentMapped = {
          id: deletedResult.id,
          author: deletedResult.author?.name || "방문자",
          authorId: deletedResult.authorId,
          text: deletedResult.content,
          isDeleted: deletedResult.isDeleted,
        };
        updateFn = (comments) =>
          updateCommentInState(comments, updatedCommentMapped, "update");
      } else {
        // 하드 삭제: 배열에서 제거
        updateFn = (comments) => deleteCommentInState(comments, commentId);
      }

      setStories((prevStories) =>
        prevStories.map((story) => {
          const updatedStory = { ...story, comments: updateFn(story.comments) };
          if (selectedStory && selectedStory.id === story.id) {
            setSelectedStory(updatedStory); // 모달 상태 갱신
          }
          return updatedStory;
        })
      );
    } catch (error) {
      console.error("Failed to delete comment:", error);
      alert(`댓글 삭제 중 오류 발생: ${error.message}`);
    }
  };

  return (
    <div className="memoriam-page">
      <Section title="우리의 이야기">
        {isWriting ? (
          <MemorialForm
            onStorySubmit={handleStorySubmit}
            onCancel={() => setIsWriting(false)}
          />
        ) : (
          <>
            {/* ... (기존 UI) ... */}

            {isLoading ? (
              <LoadingSpinner text="이야기를 불러오는 중..." />
            ) : stories.length === 0 ? (
              <p className="text-center text-gray-500">
                아직 등록된 이야기가 없습니다냥!
              </p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-5 sm:px-0">
                {stories.map((story) => (
                  <MemorialCard
                    key={story.id}
                    story={story}
                    onOpenModal={handleOpenModal}
                    onRemember={handleRememberClick}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </Section>

      {selectedStory && (
        <MemorialModal
          story={selectedStory}
          onClose={handleCloseModal}
          onCommentSubmit={handleCommentSubmit}
          onCommentEdit={handleCommentEdit} // 👈 추가
          onCommentDelete={handleCommentDelete} // 👈 추가
        />
      )}
    </div>
  );
}
