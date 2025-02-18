'use client'
import { useEffect, useState } from 'react';
import { useParams } from "next/navigation";
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import styles from './detail.module.css';

let spread;

export default function DetailPage() {
  const { post_id } = useParams();
  const [tarotPost, setTarotPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [zindex, setZindex] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false); // admin 확인 상태 변수
  const [newAnswer, setNewAnswer] = useState(tarotPost?.answer || '');

  // 데이터 로드 함수
  useEffect(() => {
    if (!post_id) return; // id가 없으면 데이터 로딩을 하지 않음

    async function fetchData() {
      const postResponse = await fetch(`/api/tarotPost/${post_id}`);
      const postData = await postResponse.json();
      setTarotPost(postData.tarotPost);

      if (postData.role === 'admin') {
        setIsAdmin(true); // admin 권한을 가진 유저일 경우
      }

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

  // answer 업데이트 함수
  const handleAnswerUpdate = async () => {
    if (!newAnswer.trim()) return;

    const response = await fetch(`/api/update-answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        post_id,
        answer: newAnswer }),
    });
    if (!response.ok) throw new Error("Failed to update answer");
    else if (response.ok) {
      const {updatedPost} = await response.json();
      setTarotPost(updatedPost);
    }
  };

  if (tarotPost.spread_type === 'celtic-cross') {
    spread = (
      <div className="card-container">
        <div className="cross-cards">
          <div className="edge-line">
            <Image
              src={`/card_images/card_${tarotPost.selected_card_numbers[4]}.jpg`}
              width={72}
              height={126}
              alt="Tarot Card_4"
            />
          </div>
          <div
            className="touch-layer"
            onClick={() => {
              const newZindex = zindex === 1 ? -1 : 1;
              setZindex(newZindex);
            }}
          />
          <div className="center-line">
            <Image
              className="interference-card"
              src={`/card_images/card_${tarotPost.selected_card_numbers[1]}.jpg`}
              width={72}
              height={126}
              alt="Tarot Card_1"
            />
            <Image
              src={`/card_images/card_${tarotPost.selected_card_numbers[3]}.jpg`}
              width={72}
              height={126}
              alt="Tarot Card_3"
            />
            <Image
              src={`/card_images/card_${tarotPost.selected_card_numbers[0]}.jpg`}
              width={72}
              height={126}
              alt="Tarot Card_0"
              priority
              style={{
                zIndex: zindex,
              }}
            />
            <Image
              src={`/card_images/card_${tarotPost.selected_card_numbers[5]}.jpg`}
              width={72}
              height={126}
              alt="Tarot Card_5"
            />
          </div>
          <div className="edge-line">
            <Image
              src={`/card_images/card_${tarotPost.selected_card_numbers[2]}.jpg`}
              width={72}
              height={126}
              alt="Tarot Card_2"
            />
          </div>
        </div>
        <div className="line-cards">
          <Image
            src={`/card_images/card_${tarotPost.selected_card_numbers[9]}.jpg`}
            width={72}
            height={126}
            alt="Tarot Card_9"
          />
          <Image
            src={`/card_images/card_${tarotPost.selected_card_numbers[8]}.jpg`}
            width={72}
            height={126}
            alt="Tarot Card_8"
          />
          <Image
            src={`/card_images/card_${tarotPost.selected_card_numbers[7]}.jpg`}
            width={72}
            height={126}
            alt="Tarot Card_7"
          />
          <Image
            src={`/card_images/card_${tarotPost.selected_card_numbers[6]}.jpg`}
            width={72}
            height={126}
            alt="Tarot Card_6"
          />
        </div>
      </div>
    );
  } else if (tarotPost.spread_type === 'a-or-b') {
    spread = (
      <div>
        <div className="third-floor">
          <Image
            src={`/card_images/card_${tarotPost.selected_card_numbers[2]}.jpg`}
            width={72}
            height={126}
            alt="Tarot Card_2"
          />
          <div
            style={{
              width: '80px',
              height: '140px',
              display: 'inline-block',
              backgroundColor: 'transparent',
            }}
          ></div>
          <Image
            src={`/card_images/card_${tarotPost.selected_card_numbers[4]}.jpg`}
            width={72}
            height={126}
            alt="Tarot Card_4"
          />
        </div>
        <div className="second-floor">
          <Image
            src={`/card_images/card_${tarotPost.selected_card_numbers[1]}.jpg`}
            width={72}
            height={126}
            alt="Tarot Card_1"
          />
          <Image
            src={`/card_images/card_${tarotPost.selected_card_numbers[3]}.jpg`}
            width={72}
            height={126}
            alt="Tarot Card_3"
          />
        </div>
        <div className="first-floor">
          <Image
            src={`/card_images/card_${tarotPost.selected_card_numbers[0]}.jpg`}
            width={72}
            height={126}
            alt="Tarot Card_0"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <h1>{tarotPost.spread_type}</h1>
      <p>{tarotPost.date}</p>
      <p
        style={{
          maxWidth: '600px',
          maxHeight: '300px',
          overflow: 'auto',
          whiteSpace: 'normal',
          wordWrap: 'break-word',
        }}
      >
        {tarotPost.content}
      </p>
      <span>{spread}</span>
      <p
        style={{
          maxWidth: '600px',
          maxHeight: '400px',
          overflow: 'auto',
          whiteSpace: 'normal',
          wordWrap: 'break-word',
        }}
      >
        {tarotPost.answer}
      </p>

      {/* 답변 수정 (admin만 가능) */}
      {isAdmin && (
        <form onSubmit={handleAnswerUpdate} className={styles.answerForm}>
        <textarea
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          placeholder="답변을 작성하세요..."
        />
        <button type="submit">답변 작성</button>
      </form>
      )}

      {/* 댓글 리스트 */}
      <div className={styles.comments}>
        {comments.map((comment) => (
          <div key={comment.id} className={styles.comment}>
            <p>{comment.content}</p>
            <p className={styles.commentDate}>
              {new Date(comment.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* 댓글 작성 폼 */}
      <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="댓글을 작성하세요..."
        />
        <button type="submit">댓글 작성</button>
      </form>

      
    </div>
  );
}
