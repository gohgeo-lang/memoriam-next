import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { completeQuest } from "@/lib/completeQuest";

export const runtime = "nodejs";

// const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
// if (!allowedTypes.includes(file.type)) {
//   return NextResponse.json(
//     { error: "이미지 파일만 업로드 가능합니다." },
//     { status: 400 }
//   );
// }

export async function POST(req) {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: "이미지 파일만 업로드 가능합니다." },
      { status: 400 }
    );
  }
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file)
      return NextResponse.json({ error: "파일 없음" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}_${file.name}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);

    const fileUrl = `/uploads/${fileName}`;
    return NextResponse.json({ url: fileUrl });
  } catch (err) {
    console.error("파일 업로드 오류:", err);
    return NextResponse.json({ error: "업로드 실패" }, { status: 500 });
  }
}

// Vercel Deploy
// await completeQuest(userid, "upload_photo");
