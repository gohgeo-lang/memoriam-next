import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  },
});

/**
 * 파일을 AWS S3 버킷에 업로드하고, 공개 URL을 반환합니다.
 * @param {File} file - 업로드할 File 객체입니다.
 * @param {string} pathPrefix - S3 버킷 내에서 파일을 저장할 폴더 경로 (예: 'memorial', 'profile').
 * @returns {Promise<string>} S3 객체의 공개 URL.
 */
export async function uploadFileToS3(file, pathPrefix = "uploads") {
  if (!process.env.AWS_S3_BUCKET_NAME || !process.env.AWS_S3_REGION) {
    throw new Error("AWS 환경 변수가 설정되지 않았습니다.");
  }

  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const bucketName = process.env.AWS_S3_BUCKET_NAME;

  const fileName = file.name || "untitled";
  const fileExtension = fileName.includes(".")
    ? fileName.substring(fileName.lastIndexOf("."))
    : "";
  const baseName = fileName
    .substring(0, fileName.lastIndexOf("."))
    .replace(/[\s\(\)]/g, "_");
  const uniqueKey =
    `${pathPrefix}/${Date.now()}_${baseName}${fileExtension}`.replace(
      /[\s\(\)]/g,
      "_"
    );

  const params = {
    Bucket: bucketName,
    Key: uniqueKey,
    Body: fileBuffer,
    ContentType: file.type,
    ACL: "public-read",
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  const fileUrl = `https://${bucketName}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${uniqueKey}`;
  return fileUrl;
}
