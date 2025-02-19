'use client';  // 클라이언트 컴포넌트로 지정
import { useState } from "react";
export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달의 열림/닫힘 상태
  const [modalContent, setModalContent] = useState(""); // 모달에 보여줄 텍스트

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

  const openModal = () => {
    setModalContent(`안녕하세요, 타로 상담을 진행하는 운영자입니다.

이곳에서는 Celtic Cross 또는 A or B 배열법을 이용하여 상담 주제와 타로 카드를 통해 이야기를 만들어드립니다.

타로 카드는 여러분의 현재 상황과 흐름을 해석하는 도구일 뿐, 미래를 확정적으로 예측하는 것은 아닙니다. 하지만, 여러분이 가진 고민을 새로운 시각에서 바라볼 수 있도록 돕는 역할을 할 수 있다고 생각합니다.

어떤 고민이든 한 가지 주제를 명확하게 정해 주세요.

단순히 “연애운”처럼 포괄적인 질문도 가능하지만, 예를 들어 “좋아하는 사람이 있는데, 그 사람은 나를 어떻게 생각할까?” 또는 “취업 준비를 하고 있는데, 앞으로의 방향이 어떻게 될까?”처럼 구체적으로 작성해 주시면 더욱 풍성한 해석이 가능합니다.

⚠️ 여러 개의 질문을 한 번에 하면 상담이 어려워요!
예를 들어, “3월 연애운이 궁금해요. A와 썸을 타고 있는데 잘 될까요? B가 저를 좋아하는데 이 사람하고 잘 될까요?”처럼 여러 가지 질문을 동시에 하면 상담 주제가 명확하지 않아 정확한 해석을 제공하기 어렵습니다. 한 번에 하나의 질문만 해 주세요!

그리고 상담을 통해 나온 이야기는 어디까지나 하나의 가능성일 뿐입니다. 좋은 이야기가 나온다면 기분 좋게 받아들이고, 만약 원하지 않는 결과가 나온다면 그럴 수도 있겠구나 하고 가볍게 넘겨주세요. 타로는 여러분이 스스로를 돌아보고 방향을 정하는 데 도움을 주는 도구이지, 정해진 운명을 알려주는 것이 아닙니다. 😊

상담 후 추가로 더 궁금한 점이 있다면 댓글로 남겨 주세요!
더 궁금한 사항이 있다면 projectarot@gmail.com으로 문의해 주세요.

여러분의 고민이 조금이나마 가벼워지는 시간이 되길 바랍니다. 🙏

`);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
      <button
        className="main-container-button-readme"
        onClick={openModal}
      >
        READ ME
      </button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={closeModal}>X</button>
            <p className="modal-text">{modalContent}</p>
          </div>
        </div>
      )}
    </div>
  );
}
