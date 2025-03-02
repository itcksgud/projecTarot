import prisma from '@/lib/db';
import seedrandom from 'seedrandom';  // seedrandom을 함수로 임포트
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function generateRandomArray(seed) {
  const array = Array.from({ length: 78 }, (_, i) => i); // 0~77
  // 랜덤으로 섞기 위한 시드 설정
  const rand = seedrandom(seed);  // seedrandom을 함수처럼 사용
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];  // 카드 배열 섞기
  }
  //console.log('Shuffled Array:', array); // 섞인 배열 출력
  return array;
}

export async function POST(request) {
  const session = await getServerSession(authOptions); // 올바르게 세션 가져오기
  try {
    // 클라이언트에서 보낸 JSON 데이터를 받음
    const data = await request.json();

    // 데이터 추출
    const { spread_type, selected_card_numbers, content, date } = data;
    let message = '';

    // date를 시드로 사용하여 랜덤 배열 생성
    const seed = String(date);  // date 값을 문자열로 변환하여 시드로 사용
    const randomArray = generateRandomArray(seed);  // 랜덤 배열 생성

    // date 값에 맞게 selected_card_numbers 랜덤으로 재설정
    const selectedCards = selected_card_numbers.map(cardIndex => randomArray[cardIndex]);
    
    // spread_type과 selected_card_numbers 길이에 따른 처리
    if (spread_type === 'pick-a-card' && selectedCards.length === 1) {
      // 'pick-a-card'일 때 한 장만 선택한 경우
      return new Response(
        JSON.stringify({ message: 'Data submitted successfully!', redirectUrl: '/detail/selectedCards[0]' }),
        { status: 200 }
      );
    } else if (
      (spread_type === 'a-or-b' && selectedCards.length === 5) ||
      (spread_type === 'celtic-cross' && selectedCards.length === 10)
    ) {
      if (!content) {
        message = '상담하고 싶은 주제를 명확하게 적어주세요.';
        return new Response(JSON.stringify({ message }), { status: 400 });
      }
      // 카드 개수가 맞는 경우 DB에 저장
      await prisma.TarotPost.create({
        data: {
          spread_type,
          selected_card_numbers: selectedCards,
          content,
          date: date, // 날짜로 저장
          answer: null,
          author_id: session.user.id
        },
      });

      return new Response(
        JSON.stringify({ message: 'Data submitted successfully!', redirectUrl: `/my-page` }),
        { status: 200 }
      );
    } else {
      // 카드가 덜 고른 경우 처리
      if (spread_type === 'pick-a-card' && selectedCards.length !== 1) {
        message = '카드를 한 장만 골라 주세요.';
      } else if (spread_type === 'a-or-b' && selectedCards.length !== 5) {
        message = '카드를 5장 골라 주세요.';
      } else if (spread_type === 'celtic-cross' && selectedCards.length !== 10) {
        message = '카드를 10장 골라 주세요.';
      }

      return new Response(JSON.stringify({ message }), { status: 400 });
    }
  } catch (error) {
    console.error('서버 오류:', error.message); // 에러 메시지만 출력하여 디버깅
    return new Response(
      JSON.stringify({ message: '서버에서 오류가 발생했습니다. 나중에 다시 시도해주세요.' }),
      { status: 500 }
    );
  }
}
