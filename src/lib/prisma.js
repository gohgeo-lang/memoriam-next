import { PrismaClient } from "@prisma/client";
let prisma;
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // 개발 중에는 핫 리로딩 때문에 여러 번 생성되는 것을 방지
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}
export default prisma;
