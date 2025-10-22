"use client";

import { useState } from "react";
import Section from "@/components/Section";
import MemorialCard from "./components/MemorialCard";
import MemorialModal from "./components/MemorialModal";
import MemorialForm from "./components/MemorialForm";

const initialStories = [
  {
    id: 1,
    petName: "댕청이",
    ownerName: "김집사",
    thumbnailUrl: "/image/pet.jpg",
    title: "내새깽이, 하늘의 별이 되다",
    content: `댕청아, 널 처음 만난 날을 기억해. 작고 하얀 솜뭉치 같던 네가 내게 와서 가족이 되었지.
    
너와 함께한 15년은 내 인생 가장 큰 선물이었어. 너의 발소리, 너의 꼬리치던 모습, 너의 따뜻한 체온... 모든 것이 아직도 선명해. 
    
하늘에서는 아프지 말고, 친구들이랑 신나게 뛰어놀아. 언젠가 다시 만날 날을 기다릴게. 사랑해.`,
    rememberCount: 128,
    comments: [
      { id: 1, author: "이웃주민", text: "좋은 곳으로 갔을 거예요. 힘내세요." },
      {
        id: 2,
        author: "친구",
        text: "함께한 기억은 영원할 거예요. 댕청이도 행복했을 겁니다.",
      },
    ],
  },
  {
    id: 2,
    petName: "야옹이",
    ownerName: "박애옹",
    // 예시용 플레이스홀더 이미지는 그대로 둡니다.
    thumbnailUrl: "https://placehold.co/600x400/a0a0a0/ffffff?text=Yaong",
    title: "무릎 위에서 잠들던 너",
    content:
      "우리 야옹이는 세상에서 가장 애교 많은 고양이였어요. 제 무릎은 항상 야옹이 차지였죠. 골골송을 불러주던 네가 너무 그립다.",
    rememberCount: 94,
    comments: [
      {
        id: 1,
        author: "랜선집사",
        text: "사진만 봐도 너무 사랑스럽네요. ㅠㅠ",
      },
    ],
  },
];

export default function MemorialPage() {
  const [stories, setStories] = useState(initialStories);
  const [selectedStory, setSelectedStory] = useState(null);
  const [isWriting, setIsWriting] = useState(false);

  const handleOpenModal = (story) => {
    setSelectedStory(story);
  };

  const handleCloseModal = () => {
    setSelectedStory(null);
  };

  const handleRememberClick = (storyId) => {
    setStories((prevStories) =>
      prevStories.map((story) =>
        story.id === storyId
          ? { ...story, rememberCount: story.rememberCount + 1 }
          : story
      )
    );
  };

  const handleCommentSubmit = (storyId, commentText) => {
    const newComment = {
      id: Date.now(),
      author: "방문자",
      text: commentText,
    };

    setStories((prevStories) =>
      prevStories.map((story) => {
        if (story.id === storyId) {
          const updatedStory = {
            ...story,
            comments: [...story.comments, newComment],
          };
          if (selectedStory && selectedStory.id === storyId) {
            setSelectedStory(updatedStory);
          }
          return updatedStory;
        }
        return story;
      })
    );
  };

  const handleStorySubmit = (newStory) => {
    // 임시 ID와 썸네일 등을 할당하여 새로운 스토리를 추가
    const storyWithDefaults = {
      ...newStory,
      id: Date.now(),
      thumbnailUrl: newStory.thumbnailUrl || "/image/dog-cat1.webp",
      rememberCount: 0,
      comments: [],
    };
    setStories((prevStories) => [storyWithDefaults, ...prevStories]);
    setIsWriting(false);
  };

  return (
    // Next.js App Router의 <main> 영역에 맞게 상단 padding 클래스 제거
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
                onClick={() => setIsWriting(true)}
                className="bg-[#7b5449] text-white px-4 py-2 rounded-md hover:bg-[#694237] transition-colors active:scale-95"
              >
                내 이야기 나누기
              </button>
            </div>
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
