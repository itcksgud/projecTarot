"use client"; // 이 파일을 클라이언트 컴포넌트로 처리

import { SessionProvider, useSession, signOut } from "next-auth/react"; // SessionProvider 추가
import Link from "next/link";

export default function Header() {
  return (
    <SessionProvider>
      <Nav />
    </SessionProvider>
  );
}

function Nav() {
  const { data: session } = useSession();

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem",
        borderBottom: "1px solid #ccc",
      }}
    >
      <Link href="/" className="navbar-link">projecTarot</Link>
      <div>
        {session ? (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span>안녕하세요, {session.user.name}님!</span>
            <button
              onClick={() => signOut()}
              style={{
                padding: "0.5rem 1rem",
                border: "none",
                backgroundColor: "#f00",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link href="/login">
            <button className="loginButton">
              로그인
            </button>
          </Link>
        )}
      </div>
    </header>
  );
}
