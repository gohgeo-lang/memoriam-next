import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

const QUESTS = [
  { type: "login", label: "오늘 로그인하기", reward: 1 },
  { type: "post", label: "게시글 작성하기", reward: 1 },
  { type: "comment", label: "댓글 남기기", reward: 1 },
  { type: "ad", label: "광고 보기", reward: 1 },
  { type: "profile", label: "내 정보 수정하기", reward: 1 },
  { type: "address", label: "주소 등록하기", reward: 1 },
  { type: "family", label: "가족(반려동물) 등록하기", reward: 1 },
  { type: "payment", label: "결제수단 추가하기", reward: 1 },
  { type: "visit", label: "게시물 방문하기", reward: 1 },
  { type: "remember", label: "추모 남기기", reward: 1 },
  { type: "faq", label: "FAQ 작성하기", reward: 1 },
  { type: "react", label: "게시물 좋아요 누르기", reward: 1 },
  { type: "share", label: "링크 공유하기", reward: 1 },
  { type: "daily", label: "하루 첫 접속", reward: 1 },
];

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const progresses = await prisma.questProgress.findMany({
    where: { userId: user.id },
  });

  const cookies = await prisma.cookieHistory.findMany({
    where: { userId: user.id },
  });

  const totalCookies = cookies.reduce((acc, c) => acc + c.amount, 0);

  const quests = QUESTS.map((q) => {
    const progress = progresses.find((p) => p.type === q.type);
    const completed = !!progress?.completed;
    const rewarded = cookies.some((c) => c.type === q.type);
    return {
      ...q,
      completed,
      rewarded,
    };
  });

  return NextResponse.json({ totalCookies, quests });
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { type } = await req.json();
  const quest = QUESTS.find((q) => q.type === type);
  if (!quest)
    return NextResponse.json({ error: "Invalid quest" }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  // 진행 확인
  const progress = await prisma.questProgress.findFirst({
    where: { userId: user.id, type },
  });

  if (!progress || !progress.completed)
    return NextResponse.json(
      {
        error: "퀘스트 미완료",
        message: "아직 이 퀘스트를 완료하지 않았어요!",
      },
      { status: 400 }
    );

  const alreadyRewarded = await prisma.cookieHistory.findFirst({
    where: { userId: user.id, type },
  });
  if (alreadyRewarded)
    return NextResponse.json(
      { message: "이미 보상을 받았어요 🍪" },
      { status: 200 }
    );

  await prisma.cookieHistory.create({
    data: {
      userId: user.id,
      type,
      amount: quest.reward,
      description: `${quest.label} 보상`,
    },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { totalCookies: { increment: quest.reward } },
  });

  return NextResponse.json({
    message: `${quest.label} 완료! 쿠키 ${quest.reward}개 획득 🍪`,
  });
}
