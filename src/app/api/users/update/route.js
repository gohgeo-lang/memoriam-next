import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";
import { completeQuest } from "@/lib/completeQuest";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { cookieHistories: true },
    });
    if (!user)
      return NextResponse.json(
        { error: "사용자를 찾을 수 없습니다." },
        { status: 404 }
      );

    const formData = await req.formData();
    const name = formData.get("name");
    const password = formData.get("password");
    const file = formData.get("file");

    const updatedData = {};
    if (name) updatedData.name = name;

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadDir = path.join(process.cwd(), "public", "uploads");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `${Date.now()}_${file.name}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);

      updatedData.image = `/uploads/${fileName}`;
    }

    if (password) {
      const bcrypt = await import("bcryptjs");
      const hashed = await bcrypt.hash(password, 10);
      updatedData.password = hashed;
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updatedData,
      include: { cookieHistories: true },
    });

    const totalCookies = updatedUser.cookieHistories.reduce(
      (acc, c) => acc + c.amount,
      0
    );
    if (updatedData.image) {
      try {
        await completeQuest(user.id, "edit_profile");
      } catch (err) {
        console.warn("completeQuest 실패:", err);
      }
    }

    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      image: updatedUser.image,
      totalCookies,
      message: "프로필이 성공적으로 수정되었습니다.",
    });
  } catch (error) {
    console.error("프로필 수정 실패:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
