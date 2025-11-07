import { NextResponse } from "next/server";
import { uploadFileToS3 } from "@/lib/s3Upload.mjs";

// Node.js 환경에서 AWS SDK를 사용하도록 런타임 명시
export const runtime = "nodejs";

// 클라이언트가 호출할 공용 업로드 API
export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    // 클라이언트에서 전송받은 S3 폴더 경로 접두사 (예: 'memorial', 'profile')
    const pathPrefix = formData.get("pathPrefix") || "uploads";

    if (!file) {
      return NextResponse.json({ error: "파일 없음" }, { status: 400 });
    }

    // 공용 유틸리티 함수 호출
    const url = await uploadFileToS3(file, pathPrefix);

    return NextResponse.json({ url });
  } catch (err) {
    console.error("범용 S3 업로드 오류:", err);
    // [중요] SignatureDoesNotMatch 오류가 발생하면 이 메시지가 출력됩니다.
    return NextResponse.json(
      { error: "S3 이미지 업로드에 실패했습니다. (인증 및 권한 확인 필요)" },
      { status: 500 }
    );
  }
}
