"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Section from "@/components/Section";
import MemorialCard from "@/app/service/memoriam/components/MemorialCard";
import MemorialModal from "@/app/service/memoriam/components/MemorialModal";
import LoadingSpinner from "@/components/LoadingSpinner";

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

    comments: (post.comments || []).map((comment) => ({
      id: comment.id,
      author: comment.author?.name || "방문자",
      text: comment.content,
    })),
  };
};

export default function MyPostPage() {
  const { data: session } = useSession();
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    const fetchMyPosts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/users/posts");
        if (res.ok) {
          const data = await res.json();
          setStories(data.map(mapStoryData));
        }
      } catch (error) {
        console.error("내 게시글 불러오기 실패:", error);
      }
      setIsLoading(false);
    };

    fetchMyPosts();
  }, [session]);

  if (!session)
    return (
      <p className="text-center mt-10 text-gray-500">
        로그인 후 이용 가능한 페이지입니다.
      </p>
    );

  if (isLoading)
    return <LoadingSpinner text="내 게시글을 불러오는 중입니다..." />;

  if (stories.length === 0)
    return (
      <p className="text-center mt-10 text-gray-500">
        아직 작성한 게시글이 없습니다.
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-5">
      <Section title="내가 쓴 게시물">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-5 sm:px-0">
          {stories.map((story) => (
            <MemorialCard
              key={story.id}
              story={story}
              onOpenModal={() => setSelectedStory(story)}
              onREmember={() => {}}
            />
          ))}
        </div>
      </Section>

      {selectedStory && (
        <MemorialModal
          story={selectedStory}
          onClose={() => setSelectedStory(null)}
          onCommentSubmit={() => {}}
        />
      )}
    </div>
  );
}
