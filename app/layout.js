// app/layout.js (서버 컴포넌트)
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./Header"; // Header 컴포넌트는 클라이언트에서 사용되므로 나중에 클라이언트 컴포넌트로 처리

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Tarot",
  description: "Get your tarot",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* 서버 컴포넌트에서는 SessionProvider로 감싸고 */}
          <Header /> {/* Header는 클라이언트에서 처리 */}
          {children}
      </body>
    </html>
  );
}
