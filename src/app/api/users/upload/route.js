import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "profile_image" }, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      })
      .end(buffer);
  });

  const updated = await prisma.user.update({
    where: { email: session.user.email },
    data: { image: result.secure_url },
    select: { id: true, name: true, email: true, image: true, createdAt: true },
  });

  return NextResponse.json({
    message: "이미지 업로드 완료",
    url: result.secure_url,
  });
}
