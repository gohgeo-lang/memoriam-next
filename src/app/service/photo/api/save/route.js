// app/photo/api/save/route.js
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get("file");

    if (!file) {
      return NextResponse.json({ success: false, message: "파일 없음" });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // uploads 폴더 생성 (없으면 자동 생성)
    const uploadDir = path.join(process.cwd(), "public/uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    // 고유한 파일 이름 생성
    const filename = `photo-${Date.now()}.png`;
    const filepath = path.join(uploadDir, filename);

    // 파일 저장
    await fs.writeFile(filepath, buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`,
    });
  } catch (error) {
    console.error("저장 에러:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
