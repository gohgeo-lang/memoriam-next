"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Section from "@/components/Section";
import MemorialCard from "./components/MemorialCard";
import MemorialModal from "./components/MemorialModal";
import MemorialForm from "./components/MemorialForm";
import LoadingSpinner from "@/components/LoadingSpinner";

const mapCommentData = (comment) => ({
  id: comment.id,
  author: comment.author?.name || "방문자",
  authorId: comment.authorId,
  text: comment.content,
  isDeleted: comment.isDeleted,
  replies: (comment.replies || []).map(mapCommentData),
});

const mapStoryData = (post) => {
  const memorial = post.PostMemorial;
  const thumbnailUrl = memorial?.thumbnailUrl;

  return {
    id: post.id,
    authorId: post.authorId,
    title: post.title,
    content: post.content,
    petName: memorial?.petName || "댕냥이",
    ownerName: memorial?.ownerName || post.author?.name || "보호자",
    thumbnailUrl:
      thumbnailUrl && thumbnailUrl.trim()
        ? thumbnailUrl
        : "/image/dog-cat1.webp",
    rememberCount: memorial?.rememberCount || 0,
    comments: (post.comments || []).map(mapCommentData),
  };
};

/**
 * 불변성을 유지하며 중첩된 댓글/답글 상태를 업데이트합니다.
 * @param {Array} comments - 현재 댓글 배열
 * @param {Object} updatedComment - 갱신할 댓글 객체
 * @param {String} mode - 'update' 또는 'add-reply'
 * @returns {Array} 갱신된 댓글 배열
 */

const updateCommentInState = (comments, updatedComment, mode = "update") => {
  return comments.map((c) => {
    if (mode === "add-reply" && c.id === updatedComment.parentId) {
      return { ...c, replies: [...c.replies, updatedComment] };
    }

    if (mode === "update" && c.id === updatedComment.id) {
      return { ...c, ...updatedComment };
    }

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
  //미션로직(selectedStory 변경 감지하는 훅)
  useEffect(() => {
    if (selectedStory) {
      fetch("/api/quests/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "view_memorial" }),
      });
    }
  }, [selectedStory]);

  const [isWriting, setIsWriting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingStory, setEditingStory] = useState(null);
  const [sortOrder, setSortOrder] = useState("latest"); // 👈 [신규] 정렬 상태
  const { data: session } = useSession();

  useEffect(() => {
    fetch("/api/quests/trigger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "visit_memorial_page" }),
    });
  }, []);

  useEffect(() => {
    const fetchStories = async () => {
      setIsLoading(true);
      try {
        // 🔽 [수정] API 호출 시 sortOrder 파라미터 추가
        const res = await fetch(`/api/posts?sort=${sortOrder}`);
        if (res.ok) {
          const data = await res.json();
          setStories(data.map(mapStoryData));
        } else {
          // API 에러 시 빈 배열 처리
          setStories([]);
        }
      } catch (error) {
        console.error("Failed to fetch stories:", error);
        setStories([]);
      }
      setIsLoading(false);
    };

    fetchStories();
  }, [sortOrder]); // 👈 [수정] sortOrder가 변경될 때마다 fetchStories 실행

  const handleOpenModal = (story) => {
    setSelectedStory(story);
  };

  const handleCloseModal = () => {
    setSelectedStory(null);
  };

  const handleRememberClick = async (storyId) => {
    if (!session) {
      alert("로그인이 필요합니다냥!");
      return;
    }

    try {
      const res = await fetch(`/api/posts/${storyId}/remember`, {
        method: "POST",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "공감에 실패했다냥!");
      }

      const data = await res.json();

      if (data.message === "이미 공감했습니다.") {
        alert("이미 공감한 이야기입니다냥!");
        return;
      }

      const updatedRememberCount = data.rememberCount;

      setStories((prevStories) =>
        prevStories.map((story) =>
          story.id === storyId
            ? { ...story, rememberCount: updatedRememberCount }
            : story
        )
      );

      // 공감순 정렬 상태일 때, 공감 클릭 시 즉시 재정렬 (선택 사항)
      if (sortOrder === "remember") {
        setStories((prevStories) =>
          [...prevStories].sort((a, b) => b.rememberCount - a.rememberCount)
        );
      }

      if (selectedStory && selectedStory.id === storyId) {
        setSelectedStory((prev) => ({
          ...prev,
          rememberCount: updatedRememberCount,
        }));
      }
      //쿠키페이지 미션트리거용 코드임다(공감 시 미션완료)
      await fetch("/api/quests/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "remember_post" }),
      });
    } catch (error) {
      console.error("Failed to remember story:", error);
      alert(error.message);
    }
  };

  const handleStorySubmit = async (formData) => {
    const isEditing = !!editingStory;
    const url = isEditing ? `/api/posts/${editingStory.id}` : "/api/posts";
    const method = isEditing ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "이야기 등록에 실패했습니다.");
      }

      const newPostFromDb = await res.json();
      const newStoryMapped = mapStoryData(newPostFromDb);

      //여기 if문은 쿠키페이지 미션트리거용 코드에요.(게시물 작성 시 미션 완료 트리거)
      if (!isEditing) {
        await fetch("/api/quests/trigger", {
          method: "POST",
          headers: { "Content-Typse": "application/json" },
          body: JSON.stringify({ type: "write_post" }),
        });
      }
      if (isEditing) {
        setStories((prevStories) =>
          prevStories.map((story) =>
            story.id === newStoryMapped.id ? newStoryMapped : story
          )
        );
      } else {
        // [수정] 새 글 등록 시, '최신순'이 아니면 '최신순'으로 변경
        if (sortOrder !== "latest") {
          setSortOrder("latest");
        } else {
          setStories((prevStories) => [newStoryMapped, ...prevStories]);
        }
      }

      setIsWriting(false);
      setEditingStory(null);
    } catch (error) {
      console.error("Failed to submit story:", error);
      alert(`이야기 등록 중 오류 발생: ${error.message}`);
    }
  };

  const handleStartEdit = (story) => {
    setEditingStory(story);
    setIsWriting(true);
    setSelectedStory(null);
  };

  const handleStoryDelete = async (storyId) => {
    if (!confirm("정말 이 이야기를 삭제하겠습니까?")) {
      return;
    }

    try {
      const res = await fetch(`/api/posts/${storyId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "이야기 삭제에 실패했습니다.");
      }

      setStories((prevStories) =>
        prevStories.filter((story) => story.id !== storyId)
      );

      setSelectedStory(null);
    } catch (error) {
      console.error("Failed to delete Story:", error);
      alert(`삭제 중 오류 발생 : ${error.message}  `);
    }
  };

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

      //쿠키 페이지 미션 트리거용 코드에요.(댓글 작성시 미션 완료되는 거)
      const triggerType = parentId ? "write_reply" : "write_comment";

      await fetch("/api/quests/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: triggerType }),
      });

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
            initialData={editingStory}
            onStorySubmit={handleStorySubmit}
            onCancel={() => {
              setIsWriting(false);
              setEditingStory(null);
            }}
          />
        ) : (
          <>
            {/* 🔽 [수정] 정렬 버튼 디자인 간소화 및 좌측 정렬 */}
            <div className="flex justify-between items-center mb-4 px-5 sm:px-0">
              {/* [신규] 정렬 버튼 (간소화된 텍스트 디자인) */}
              <div className="flex items-center gap-2 text-sm">
                <button
                  onClick={() => setSortOrder("latest")}
                  className={`font-medium transition-colors ${
                    sortOrder === "latest"
                      ? "text-[#7b5449] font-bold" // 활성
                      : "text-gray-500 hover:text-gray-800" // 비활성
                  }`}
                >
                  최신순
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => setSortOrder("remember")}
                  className={`font-medium transition-colors ${
                    sortOrder === "remember"
                      ? "text-[#7b5449] font-bold" // 활성
                      : "text-gray-500 hover:text-gray-800" // 비활성
                  }`}
                >
                  공감순
                </button>
              </div>

              {/* '이야기 등록하기' 버튼 */}
              {session && (
                <button
                  onClick={() => setIsWriting(true)}
                  className="bg-[#7b5449] text-white px-4 py-2 rounded-md hover:bg-[#5a3e35] transition-colors"
                >
                  이야기 등록하기
                </button>
              )}
            </div>

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
          session={session}
          onClose={handleCloseModal}
          onCommentSubmit={handleCommentSubmit}
          onCommentEdit={handleCommentEdit}
          onCommentDelete={handleCommentDelete}
          onStoryEdit={handleStartEdit}
          onStoryDelete={handleStoryDelete}
        />
      )}
    </div>
  );
}
