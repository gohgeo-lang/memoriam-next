import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "이메일과 비밀번호",
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        console.log("authorize() 실행:", credentials);

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        console.log("user 조회 결과:", user);

        const isPasswordValid =
          user && (await bcrypt.compare(credentials.password, user.password));
        console.log("비밀번호 일치:", isPasswordValid);

        if (!user || !isPasswordValid) {
          console.log("로그인 실패");
          return null;
        }

        console.log("로그인 성공:", user.email);
        return { id: String(user.id), email: user.email, name: user.name };
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) session.user.id = token.id;
      return session;
    },
  },

  pages: { signIn: "/login" },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
