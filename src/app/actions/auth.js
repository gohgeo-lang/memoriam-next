"use server";

import { cookies } from "next/headers";
import { adminAuth } from "@/firebaseAdmin";

export async function loginAction(prevState, formData) {
  try {
    const idToken = formData.get("idToken");
    const expiresIn = 60 * 60 * 24 * 7 * 1000;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });

    cookies().set("__session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: expiresIn / 1000,
      path: "/",
    });

    return { message: "로그인 성공!", success: true };
  } catch (err) {
    return { message: "로그인 실패!", success: false };
  }
}

export async function logoutAction() {
  cookies().delete("__session");
  return { message: "로그아웃 되었습니다.", success: true };
}
