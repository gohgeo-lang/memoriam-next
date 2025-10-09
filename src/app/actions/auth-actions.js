"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function loginAction(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { success: false, message: "이메일 또는 비밀번호가 틀렸습니다." };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return { success: false, message: "이메일 또는 비밀번호가 틀렸습니다." };
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  cookies().set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    path: "/",
    sameSite: "lax",
  });

  return { success: true, message: "로그인 성공" };
}

export async function logoutAction() {
  await cookies().delete("token");
  return { success: true, message: "로그아웃 완료" };
}
