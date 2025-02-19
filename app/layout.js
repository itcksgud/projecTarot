// app/layout.js
import "./globals.css";
import Header from "./Header"; // Header 컴포넌트는 클라이언트에서 사용되므로 나중에 클라이언트 컴포넌트로 처리

export const metadata = {
  title: "Tarot",
  description: "Get your tarot",
};

export default function RootLayout({ children }) {
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
        <Header /> {/* Header는 클라이언트에서 처리 */}
        {children}
      </body>
    </html>
  );
}
