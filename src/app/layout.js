import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "./providers";
import ChatBotWrapper from "./guide/components/ChatBotWrapper";
export const metadata = {
  title: "Memoriam",
  description: "반려동물 메모리얼 플랫폼",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="bg-white text-gray-900">
        <Providers>
          <Header />
          <main className="pt-14">{children}</main>
          <ChatBotWrapper />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
