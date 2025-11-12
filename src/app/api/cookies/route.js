// src/app/api/cookies/route.js
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const ALL_DAILY_QUESTS = [
  { type: "upload_photo", label: "오늘 반려동물 사진 업로드", reward: 1 },
  { type: "like_post", label: "게시글에 좋아요 남기기", reward: 1 },
  { type: "register_family", label: "새 가족 등록하기", reward: 1 },
  {
    type: "comment_support",
    label: "다른 사용자의 게시글에 댓글 남기기",
    reward: 1,
  },
  { type: "edit_profile", label: "프로필 이미지 변경", reward: 1 },
  { type: "check_notices", label: "알림센터 열기", reward: 1 },
  { type: "visit_family_page", label: "내 가족 페이지 방문하기", reward: 1 },
  { type: "read_recommend", label: "오늘의 추천글 읽기", reward: 1 },
  { type: "view_points", label: "내 포인트 페이지 방문하기", reward: 1 },
  { type: "bookmark_post", label: "게시글 북마크 추가", reward: 1 },
  { type: "open_faq", label: "서비스 가이드 읽기", reward: 1 },
  { type: "follow_user", label: "사용자 팔로우하기", reward: 1 },
  { type: "update_pet_name", label: "반려동물 이름 수정하기", reward: 1 },
  { type: "write_emotion", label: "감정 한 줄 기록 남기기", reward: 1 },
  { type: "modify_post", label: "내 게시물 수정하기", reward: 1 },
  { type: "react_comment", label: "댓글에 이모지 남기기", reward: 1 },
  { type: "view_my_post", label: "내 게시글 보기", reward: 1 },
  { type: "share_post", label: "게시글 SNS 공유하기", reward: 1 },
  { type: "add_pet_photo", label: "가족 프로필 사진 추가하기", reward: 1 },
  { type: "check_alerts", label: "알림 확인하기", reward: 1 },
  { type: "view_weekly", label: "최근 일주일 추억 보기", reward: 1 },
  { type: "submit_feedback", label: "서비스 피드백 남기기", reward: 1 },
  { type: "open_quote", label: "오늘의 반려동물 명언 보기", reward: 1 },
  { type: "view_cookie", label: "내 쿠키 페이지 방문하기", reward: 1 },
  { type: "visit_user", label: "추천 사용자 방문하기", reward: 1 },
  { type: "quest3_done", label: "퀘스트 3개 완료하기", reward: 1 },
  { type: "daily_reflection", label: "오늘의 추억 남기기", reward: 1 },
  { type: "read_post", label: "추억 게시글 읽기", reward: 1 },
  { type: "open_memorial", label: "추모관 방문하기", reward: 1 },
  { type: "visit_home", label: "홈 화면 방문하기", reward: 1 },
];

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session)
    return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });

  const userId = session.user.id;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await prisma.questProgress.findMany({
    where: { userId, date: { gte: today } },
  });

  if (existing.length === 0) {
    const randomFive = ALL_DAILY_QUESTS.sort(() => 0.5 - Math.random()).slice(
      0,
      5
    );
    await prisma.questProgress.createMany({
      data: randomFive.map((q) => ({ userId, type: q.type })),
    });
  }

  const quests = await prisma.questProgress.findMany({
    where: { userId, date: { gte: today } },
  });

  const merged = quests.map((q) => ({
    id: q.id,
    type: q.type,
    completed: q.completed,
    rewarded: q.rewarded,
    label: ALL_DAILY_QUESTS.find((a) => a.type === q.type)?.label || q.type,
    reward: ALL_DAILY_QUESTS.find((a) => a.type === q.type)?.reward || 1,
  }));

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { totalCookies: true },
  });

  return Response.json({
    quests: merged,
    totalCookies: user?.totalCookies || 0,
  });
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session)
    return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });

  const userId = session.user.id;
  const { type, bonus } = await req.json();

  // 광고 보너스 쿠키 처리
  if (bonus === true) {
    await prisma.$transaction([
      prisma.cookieHistory.create({
        data: { userId, type: "ad_bonus", amount: 1, description: "광고 보상" },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { totalCookies: { increment: 1 } },
      }),
    ]);
    return Response.json({ message: "광고 보상으로 쿠키 1개 획득 🍪" });
  }

  // 일반 퀘스트 보상 처리
  const quest = await prisma.questProgress.findFirst({
    where: { userId, type, completed: true, rewarded: false },
  });

  if (!quest)
    return Response.json(
      { message: "보상받을 수 없습니다 🐾" },
      { status: 400 }
    );

  await prisma.$transaction([
    prisma.cookieHistory.create({
      data: { userId, type, amount: 1, description: "퀘스트 보상" },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { totalCookies: { increment: 1 } },
    }),
    prisma.questProgress.update({
      where: { id: quest.id },
      data: { rewarded: true },
    }),
  ]);

  return Response.json({ message: "쿠키 1개를 획득했습니다 🍪" });
}
