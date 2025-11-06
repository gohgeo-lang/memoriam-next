"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Section from "@/components/Section";
import MemorialCard from "./components/MemorialCard";
import MemorialModal from "./components/MemorialModal";
import MemorialForm from "./components/MemorialForm";
import LoadingSpinner from "@/components/LoadingSpinner";

const mapStoryData = (post) => {
  const memorial = post.PostMemorial || post.Postmemorial; // (camelCase) 혼용 테스트
  const thumbnailUrl = memorial?.thumbnailUrl;

  return {
    id: post.id,
    title: post.title,
    content: post.content,

    petName: post.Postmemorial?.petName || "댕냥이",
    ownerName: post.Postmemorial?.ownerName || post.author?.name || "보호자",
    thumbnailUrl:
      thumbnailUrl && thumbnailUrl.trim()
        ? thumbnailUrl
        : "/image/dog-cat1.webp",
    rememberCount: post.Postmemorial?.rememberCount || 0,

    comments: (post.comments || []).map((comment) => ({
      id: comment.id,
      author: comment.author?.name || "방문자",
      text: comment.content,
    })),
  };
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

  const handleRememberClick = async (storyId) => {
    try {
      const res = await fetch(`/api/posts/${storyId}/remember`, {
        method: "POST",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "공감 처리 실패");
      }

      const data = await res.json();

      if (data.message === "이미 공감했습니다.") {
        alert("이미 공감하셨습니다.");
        return;
      }

      const newRememberCount = data.rememberCount;

      setStories((prevStories) =>
        prevStories.map((story) =>
          story.id === storyId
            ? { ...story, rememberCount: newRememberCount } // 👈 서버에서 받은 값으로 업데이트
            : story
        )
      );
    } catch (error) {
      console.error("Failed to update remember count:", error);
      alert(error.message || "공감 처리 중 오류가 발생했습니다.");
    }
  };

  const handleCommentSubmit = async (storyId, commentText) => {
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentText, postId: storyId }),
      });

      if (!res.ok) throw new Error("댓글 등록 실패");

      const newCommentFromDb = await res.json();

      const newCommentMapped = {
        id: newCommentFromDb.id,
        author:
          newCommentFromDb.author?.name || session?.user?.name || "방문자",
        text: newCommentFromDb.content,
      };

      setStories((prevStories) =>
        prevStories.map((story) => {
          if (story.id === storyId) {
            const updatedStory = {
              ...story,
              comments: [...story.comments, newCommentMapped],
            };

            if (selectedStory && selectedStory.id === storyId) {
              setSelectedStory(updatedStory);
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

  const handleStorySubmit = async (formData) => {
    if (!session) {
      alert("이야기 작성은 로그인이 필요하다멍!.");
      return;
    }

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("게시글 등록 실패다멍!");

      const newPostFromDb = await res.json();
      const newPostMapped = mapStoryData(newPostFromDb);

      setStories((prevStories) => [newPostMapped, ...prevStories]);
      setIsWriting(false);
    } catch (error) {
      console.error("Failed to submit story:", error);
      alert("이야기 등록 중 오류가 발생했다냥!");
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
            <div className="flex justify-between items-center mb-10 mx-5 sm:mx-0">
              <p className="text-gray-600">
                먼저 별로 여행을 간 아이들을 기억하고, 다시 만날 날 함께 할
                이야기를 나눠주세요
              </p>
              <button
                onClick={() => {
                  if (!session) {
                    alert("로그인이 필요합니다.");
                  } else {
                    setIsWriting(true);
                  }
                }}
                className="bg-[#7b5449] text-white px-4 py-2 rounded-md hover:bg-[#694237] transition-colors active:scale-95"
              >
                내 이야기 나누기
              </button>
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
          onClose={handleCloseModal}
          onCommentSubmit={handleCommentSubmit}
        />
      )}
    </div>
  );
}
