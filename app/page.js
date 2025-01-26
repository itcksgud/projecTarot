'use client';  // 클라이언트 컴포넌트로 지정
export default function Home() {
  const handleRedirect = async (spread_type) => {
    const data = {
      spread_type: spread_type,
    };

    const response = await fetch('/api/redirect-post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // 데이터를 JSON 형태로 전송
    });

    const result = await response.json();

    if (response.status === 200) {
      // 성공적으로 제출되었으면 mypage로 리디렉션
      window.location.href = result.redirect;  // 수정된 부분: result.redirect
    } else {
      // 실패 시 메시지 출력
      alert(result.message);
    }
  };

  return (
    <div className="main-container">
      <button
        className="main-container-button"
        onClick={() => handleRedirect('a-or-b')}
      >
        어떤 선택을 할까?
      </button>
      <button
        className="main-container-button"
        onClick={() => handleRedirect('celtic-cross')}
      >
        심층 분석
      </button>
    </div>
  );
}
