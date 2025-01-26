// app/detail/[id]/page.js
import prisma from '@/lib/db';
import Image from 'next/image';

let spread;

export default async function DetailPage({ params }) {
  const { id } = await params; // URL 파라미터에서 id를 가져옵니다.
  // DB에서 ObjectId로 데이터를 조회합니다. Prisma에서는 ObjectId를 String으로 처리합니다.
  const tarotPost = await prisma.tarotPost.findUnique({
    where: { id: id }, // id는 문자열로 그대로 처리
  });

  if (!tarotPost) {
    return <div>데이터를 찾을 수 없습니다.</div>;
  }

  if (tarotPost.spread_type==='celtic-cross')
  {
    spread = (
        <>
        <div className='card-container'>
            <div className='cross-cards'>
                <div className='edge-line'>
                    <Image
                        src={`/card_images/card_${tarotPost.selected_card_numbers[4]}.jpg`}
                        width={80}
                        height={140} 
                        alt="Tarot Card_4"
                    />
                </div>
                <div className='center-line'>
                    <Image
                        className='interference-card'
                        src={`/card_images/card_${tarotPost.selected_card_numbers[1]}.jpg`}
                        width={80}
                        height={140}
                        alt="Tarot Card_1"
                    />
                    <Image
                        src={`/card_images/card_${tarotPost.selected_card_numbers[3]}.jpg`}
                        width={80}
                        height={140}
                        alt="Tarot Card_3"
                    />
                    <Image
                        src={`/card_images/card_${tarotPost.selected_card_numbers[0]}.jpg`}
                        width={80}
                        height={140}
                        alt="Tarot Card_0"
                    />
                    <Image
                        src={`/card_images/card_${tarotPost.selected_card_numbers[5]}.jpg`}
                        width={80}
                        height={140}
                        alt="Tarot Card_5"
                    />
                </div>
                <div className='edge-line'>
                <Image
                    src={`/card_images/card_${tarotPost.selected_card_numbers[2]}.jpg`}
                    width={80}
                    height={140}
                    alt="Tarot Card_2"
                    />
                </div>
            </div>
            <div className='line-cards'>
                <Image
                    src={`/card_images/card_${tarotPost.selected_card_numbers[9]}.jpg`}
                    width={80}
                    height={140}
                    alt="Tarot Card_9"
                    />
                <Image
                    src={`/card_images/card_${tarotPost.selected_card_numbers[8]}.jpg`}
                    width={80}
                    height={140}
                    alt="Tarot Card_8"
                    />
                <Image
                    src={`/card_images/card_${tarotPost.selected_card_numbers[7]}.jpg`}
                    width={80}
                    height={140}
                    alt="Tarot Card_7"
                    />
                <Image
                    src={`/card_images/card_${tarotPost.selected_card_numbers[6]}.jpg`}
                    width={80}
                    height={140}
                    alt="Tarot Card_6"
                    />
            </div>
      </div>
        </>
    )
  } else if (tarotPost.spread_type==='a-or-b'){
    spread = (
        <>
            <div>
                <div className='third-floor'>
                    <Image
                        src={`/card_images/card_${tarotPost.selected_card_numbers[2]}.jpg`}
                        width={80}
                        height={140}
                        alt="Tarot Card_2"
                    />
                    <div style={{width:'80px', height:'140px', display:'inline-block', backgroundColor:'transparent'}}></div>
                    <Image
                        src={`/card_images/card_${tarotPost.selected_card_numbers[4]}.jpg`}
                        width={80}
                        height={140}
                        alt="Tarot Card_4"
                    />
                </div>
                <div className='second-floor'>
                    <Image
                        src={`/card_images/card_${tarotPost.selected_card_numbers[1]}.jpg`}
                        width={80}
                        height={140}
                        alt="Tarot Card_1"
                    />
                    <Image
                        src={`/card_images/card_${tarotPost.selected_card_numbers[3]}.jpg`}
                        width={80}
                        height={140}
                        alt="Tarot Card_3"
                    />
                </div>
                <div className='first-floor'>
                    <Image
                        src={`/card_images/card_${tarotPost.selected_card_numbers[0]}.jpg`}
                        width={80}
                        height={140}
                        alt="Tarot Card_0"
                    />
                </div>
            </div>
            
        </>
    )
  }

  return (
    <div className='detail-container'>
      <h1>{tarotPost.spread_type}</h1>
      <p>{tarotPost.date}</p>
      <p style={{  maxWidth: '600px', /* 원하는 가로 상한선 */
        maxHeight: '300px', /* 원하는 세로 상한선 */
        overflow: 'auto', /* 스크롤 가능 */
        whiteSpace: 'normal', /* 줄바꿈 허용 */
        wordWrap: 'break-word' /* 단어 줄바꿈 */
        }}>{tarotPost.content}
      </p>
      <span>{spread}</span>
      <p style={{  maxWidth: '600px', /* 원하는 가로 상한선 */
        maxHeight: '400px', /* 원하는 세로 상한선 */
        overflow: 'auto', /* 스크롤 가능 */
        whiteSpace: 'normal', /* 줄바꿈 허용 */
        wordWrap: 'break-word' /* 단어 줄바꿈 */
        }}>{tarotPost.answer}
      </p>
    </div>
  );
  
}
