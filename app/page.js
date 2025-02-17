'use client';  // 클라이언트 컴포넌트로 지정
export default function Home() {
  const handleRedirect = async (redirectUrl, loginUrl) => {
    const data = {
      redirectUrl: redirectUrl,
      loginUrl: loginUrl,
    };

    const response = await fetch('/api/redirect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // 데이터를 JSON 형태로 전송
    });

    const result = await response.json();

    if (response.status === 200) {
      window.location.href = result.redirect;
    } else {
      if (response.status == 401)
      {
        window.location.href = result.redirect;
      }
      else {
        alert(result.message);
      }
    }
  };

  return (
    <div className="main-container">
      <button
        className="main-container-button"
        onClick={() => handleRedirect('/card-select/celtic-cross','/login/celtic-cross')}
      >
        심층 분석
      </button>
      <button
        className="main-container-button"
        onClick={() => handleRedirect('/card-select/a-or-b','/login/a-or-b')}
      >
        어떤 선택을 할까?
      </button>
    </div>
  );
}
