// app/api/auth/register/route.js
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // 입력값 확인
    if (!email || !password) {
      return NextResponse.json(
        { error: "이메일과 비밀번호는 필수입니다" },
        { status: 400 }
      );
    }

    // 이미 가입된 이메일인지 확인
    const exists = await prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      return NextResponse.json(
        { error: "이미 사용중인 이메일입니다" },
        { status: 400 }
      );
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // 비밀번호는 응답에서 제거
    const { password: _, ...result } = user;

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "회원가입 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
