// app/detail/[id]/page.js

'use client'
import { useEffect, useState } from 'react';
import { useParams } from "next/navigation";
import prisma from '@/lib/db';
import Image from 'next/image';
import styles from './Detail.module.css';

let spread;

export default function DetailPage() {
  const { post_id } = useParams();
  // DB에서 ObjectId로 데이터를 조회합니다. Prisma에서는 ObjectId를 String으로 처리합니다.

  // 상태 변수 선언
  const [tarotPost, setTarotPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');

  // 데이터 로드 함수
  useEffect(() => {
    if (!post_id) return; // id가 없으면 데이터 로딩을 하지 않음

    // tarotPost 데이터 가져오기
    async function fetchData() {
      const postResponse = await fetch(`/api/tarotPost/${post_id}`);
      const postData = await postResponse.json();
      setTarotPost(postData);

      // 댓글 데이터 가져오기
      const commentsResponse = await fetch(`/api/comments/${post_id}`);
      const commentsData = await commentsResponse.json();
      setComments(commentsData);
    }

    fetchData();
  }, [post_id]);

  if (!tarotPost) {
    return <div>데이터를 찾을 수 없습니다.</div>;
  }

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;

    // 댓글 제출 처리
    const response = await fetch(`/api/comments/${post_id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: comment }),
    });

    if (response.ok) {
      const newComment = await response.json();
      setComments([...comments, newComment]);
      setComment('');
    }
  };

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
        {/* 댓글 리스트 */}
        <div className={styles.comments}>
        {comments.map((comment) => (
          <div key={comment.id} className={styles.comment}>
            <p>{comment.content}</p>
            <p className={styles.commentDate}>{new Date(comment.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* 댓글 작성 폼 */}
      <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder='댓글을 작성하세요...'
        />
        <button type='submit'>댓글 작성</button>
      </form>
    </div>
  );
  
}
