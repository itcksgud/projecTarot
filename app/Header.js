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
  const handleSubmit = async (redirectUrl, loginUrl) => {

    const data = {
      redirectUrl: redirectUrl,
      loginUrl: loginUrl,
    };

    const response = await fetch('/api/redirect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json()
    console.log(result);
    if(response.status === 200)
    {
      window.location.href= result.redirect;
    }
  }
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.5rem",
        borderBottom: "1px solid #ccc",
      }}
    >
      <Link href="/" className="navbar-link">projecTarot</Link>
      <div>
        {session ? (
        <div className="layout-container">
          <span className="greeting-text">
            안녕하세요, {session.user.name}님!
          </span>
          <div className="button-container">
            <button
              onClick={() => handleSubmit('/my-page/','/login/home')}
              className="button my-page-button"
            >
              my page
            </button>
            
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="button logout-button"
            >
              Logout
            </button>
          </div>
        </div>
        
        ) : (
          <Link href="/login/home">
            <button className="loginButton">
              로그인
            </button>
          </Link>
        )}
      </div>
    </header>
  );
}
