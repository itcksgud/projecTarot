// app/layout.js
import ClientSessionProvider from "@/components/ClientSessionProvider";
import Header from "@/components/Header"; 
import { authOptions } from "@/lib/auth"; // next-auth 설정 가져오기
import { getServerSession } from "next-auth/next";
import "./globals.css";


export const metadata = {
  title: "Tarot",
  description: "Get your tarot",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <head>
        {/* Google Fonts에서 Nanum Gothic 폰트 추가 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Nanum+Gothic&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ClientSessionProvider session={session}>
          <Header/>
          {children}
        </ClientSessionProvider>
      </body>
    </html>
  );
}
