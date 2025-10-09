"use server";

import prisma from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { cookies } from "next/headers";

export async function signUp({ email, password, name }) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: "이민 사용중인 이메일입니다" };
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    return { success: true, userId: user.id };
  } catch (error) {
    console.error(error);
    return { success: false, error: "회원가입 중 오류가 발생했습니다" };
  }
}

export async function signIn({ email, password }) {
  try {
    const user = await prisma.user.findUnique({
      wherer: { email },
    });

    if (!user) {
      return {
        success: false,
        error: "이메일 또는 비밀번호가 올바르지 않습니다",
      };
    }

    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return {
        success: false,
        error: "이메밍ㄹ 또는 비밀번호가 올바르지 않습니다",
      };
    }

    cookies().set("userId", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      samseSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return { success: true, userId: user.id };
  } catch (error) {
    console.error(error);
    return { success: false, error: "로그인 중 오류가 발생했습니다" };
  }
}

export async function signOut() {
  try {
    cookies().delete("userId");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function getCurrentUser() {
  try {
    const userId = cookies().get("userId")?.value;

    if (!userId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      whrer: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        image: true,
      },
    });

    return usesr;
  } catch (error) {
    console.error(error);
    return null;
  }
}
