"use client";

import { useEffect, useState } from "react";
import styles from "./adminpage.module.css"; // module.css 사용
import Link from "next/link";

export default function MyPage() {
  const [posts, setPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null); // 선택된 포스트 ID
  const [answer, setAnswer] = useState(""); // 답변 상태
  const [showModal, setShowModal] = useState(false); // 모달 창 표시 여부

  // fetchPosts 함수 정의
  const fetchPosts = async () => {
    try {
      const res = await fetch(`/api/tarotposts?author_id=all`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();  // 컴포넌트가 처음 렌더링될 때 posts 데이터를 가져옵니다.
  }, []);  // 빈 배열을 넣어 컴포넌트가 처음 렌더링될 때만 실행되게 합니다.

  const handleAnswerSubmit = async () => {
    try {
      const res = await fetch('/api/update-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: selectedPostId,
          answer,
        }),
      });
      if (!res.ok) throw new Error("Failed to update answer");

      const data = await res.json();
      console.log(data.message);
      setShowModal(false); // 모달 닫기
      setAnswer(""); // 답변 초기화

      fetchPosts();  // 답변 제출 후 게시글 목록을 다시 가져옵니다.
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h1>타로 게시글</h1>
      <ul className={styles.postList}>
        {posts.length > 0 ? (
          posts.map((post) => (
            <li key={post.id} className={styles.postItem}>
              <Link href={`/detail/${post.id}`} className={styles.link}>
                <h3>{post.spread_type}</h3>
                <p>{post.content}</p>
                <p className={styles.date}>{new Date(post.date).toLocaleDateString()}</p>
              </Link>
              {/* 답변 입력 버튼 추가 */}
              <button
                className={styles.answerButton}
                onClick={() => {
                  setSelectedPostId(post.id);
                  setShowModal(true);
                }}
              >
                답변 입력
              </button>
            </li>
          ))
        ) : (
          <p>작성된 글이 없습니다.</p>
        )}
      </ul>

      {/* 모달 창 */}
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>답변 입력</h2>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="답변을 입력하세요"
            />
            <div className={styles.modalActions}>
              <button onClick={() => setShowModal(false)} className={styles.closeButton}>닫기</button>
              <button onClick={handleAnswerSubmit} className={styles.submitButton}>답변 제출</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
