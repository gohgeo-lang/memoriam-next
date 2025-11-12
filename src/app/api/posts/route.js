import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { markQuestComplete } from "@/lib/quests";

const MEMORIAL_CATEGORY_NAME = "MEMORIAL";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get("sort") || "latest";

    const orderBy =
      sort === "remember"
        ? { PostMemorial: { rememberCount: "desc" } }
        : { createdAt: "desc" };

    const posts = await prisma.post.findMany({
      where: {
        category: {
          name: MEMORIAL_CATEGORY_NAME,
        },
      },
      orderBy: orderBy,
      include: {
        author: true,
        comments: {
          where: { parentId: null },
          include: {
            author: true,
            replies: {
              include: { author: true },
              orderBy: { createdAt: "asc" },
            },
          },
          orderBy: { createdAt: "asc" },
        },
        PostMemorial: true,
      },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Posts GET Error", error);
    return NextResponse.json(
      { error: "게시글을 가져오는 데 실패했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, content, petName, ownerName, thumbnailUrl } = body;
    const userEmail = session.user.email;

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        published: true,
        author: {
          connect: { email: userEmail },
        },

        category: {
          connectOrCreate: {
            where: { name: MEMORIAL_CATEGORY_NAME },
            create: { name: MEMORIAL_CATEGORY_NAME },
          },
        },

        PostMemorial: {
          create: {
            petName: petName,
            ownerName: ownerName,
            thumbnailUrl: thumbnailUrl || "/image/dog-cat1.webp",
            rememberCount: 0,
          },
        },
      },

      include: {
        author: true,
        PostMemorial: true,
        comments: true,
      },
    });

    await markQuestComplete("post");

    return NextResponse.json(newPost);
  } catch (error) {
    console.error("Posts POST Error", error);
    return NextResponse.json(
      { error: "게시글을 생성하는 데 실패했습니다" },
      { status: 500 }
    );
  }
}
