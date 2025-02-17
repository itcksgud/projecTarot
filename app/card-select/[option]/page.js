'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import styles from './cardSelect.module.css';

const cards = Array.from({ length: 78 }, (_, index) => index);

export default function CardSelect() {
  const radius = 120; // 카드들이 배치될 원의 반지름
  const totalCards = cards.length + 3;
  const { option } = useParams();
  const [isClient, setIsClient] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // 카드 펼침 여부
  const [clickTime, setClickTime] = useState(null); // 클릭한 시간 저장
  const [selectedCard, setSelectedCard] = useState([]); // 선택된 카드 목록

  useEffect(() => {
    setIsClient(true); // 클라이언트에서만 실행하도록 설정
  }, []);

  if (!isClient) {
    return null; // 클라이언트에서만 로딩할 수 있도록 반환
  }

  let content,title,subtitle,holder;
  let cardCnt = 0;
  // selectedCard가 배열로 설정되어 있을 때만 length를 출력
  const selectedCardCount = Array.isArray(selectedCard) ? selectedCard.length : 0;

  if (option === 'pick-a-card') {
    cardCnt = 1;
    title='오늘의 운세';
    subtitle='카드 한 장을 뽑아 오늘의 운세를 점쳐 보세요!';
    holder=null;
  } else if (option === 'a-or-b') {
    cardCnt = 5;
    title='어떤 선택을 할까?';
    subtitle='현재의 나를 생각하면서 1장,\n1번 선택지를 생각하면서 2장,\n2번 선택지를 생각하면서 2장을 뽑아주세요!';
    holder='주제와 선택지들에 대해 명확하게 알려주세요.';
  } else if (option === 'celtic-cross') {
    cardCnt = 10;
    title='심층 분석';
    subtitle=`심층 분석할 대상(사람, 사건, 운)을 생각하면서\n10장을 뽑아주세요!`;
    holder='심층 분석할 주제를 명확하게 알려주세요. 대상의 과거, 현재, 미래 등을 뽑아 자세히 분석해드립니다!';
  } else {
    content = <div>선택 없음</div>;
  }


  const handleClick = (item) => {
    if (!isExpanded) {
      const date=new Date(Date.now());
      setClickTime(date.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })); // 한국 시간으로 변환
    } else {
      // 카드가 펼쳐져 있을 때 클릭한 카드를 selectedCard 배열에 추가하거나 제거
      setSelectedCard((prevSelectedCard) => {
        if (prevSelectedCard.includes(item)) {
          // 이미 선택된 카드가 클릭되면 제거
          return prevSelectedCard.filter((card) => card !== item);
        } else {
          if (selectedCard.length !== cardCnt) {
            // 선택되지 않은 카드가 클릭되면 추가
            return [...prevSelectedCard, item];
          }
        }
        return prevSelectedCard;
      });
    }
    setIsExpanded(true); // 클릭 시 원 형태로 펼쳐짐
  };

  const handleSubmit = async () => {
    const data = {
      spread_type: option,
      selected_card_numbers: selectedCard,
      content: document.querySelector('textarea').value, // 텍스트박스 내용
      date: clickTime,
    };

    console.log(clickTime);
    const response = await fetch('/api/submit-post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // 데이터를 JSON 형태로 전송
    });

    const result = await response.json();

    if (response.status === 200) {
      // 성공적으로 제출되었으면 mypage로 리디렉션
      window.location.href = result.redirectUrl;
    } else {
      // 실패 시 메시지 출력
      alert(result.message);
    }
  };

  return (
    <div className={styles.cardSelectContainer}>
      <div className={styles.cardSelectTitle}>{title}</div>
      <div className="card-select-subtitle">{subtitle}</div>

      <textarea className={styles.cardSelectTextarea} placeholder={holder}></textarea>

      <div className={`card-circle ${isExpanded ? 'expanded' : ''}`}>
        <div style={{display:`${isExpanded ? 'block':'none'}`}}>
          <div className="card-select-status">{`${cardCnt}/${selectedCardCount}`}</div>
          <button className={styles.cardSelectButton} onClick={handleSubmit}>Submit</button>
        </div>
        
        {cards.map((item, index) => {
          const angle = (item / totalCards) * 360; // 카드의 위치 각도
          const x = radius * Math.cos((angle * Math.PI) / 180 - Math.PI / 2); // X좌표
          const y = radius * Math.sin((angle * Math.PI) / 180 - Math.PI / 2); // Y좌표

          return (
            <div
              key={item}
              className={`card ${selectedCard.includes(item) ? 'selected' : ''}`}
              style={{
                transform: isExpanded
                  ? `translate(${x}px, ${y}px) rotate(${angle}deg)`
                  : 'translate(0, 0)', // 클릭 시 위치 이동
                zIndex: index,
              }}
            >
              <Image
                className="card-image"
                src={`/card_images/card_78.jpg`}
                alt={`Card ${item}`}
                width={40}
                height={70}
                onClick={() => handleClick(item)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
