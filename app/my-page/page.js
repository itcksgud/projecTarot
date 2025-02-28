"use client";

import { useEffect, useState } from "react";
import styles from "./mypage.module.css"; // module.css 사용
import Link from "next/link";

export default function MyPage() {
  const [posts, setPosts] = useState([]);
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/listTarotPosts`);
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    // 컴포넌트가 처음 렌더링될 때 fetchPosts 호출
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>내가 작성한 타로 게시글</h1>
      <ul className={styles.postList}>
        {posts.length > 0 ? (
          posts.map((post) => (
            
            <li key={post.id} className={styles.postItem} style={{background:post.answer?"#f4fff0":"#f0f4ff"}}>
              <Link href={`/detail/${post.id}`} legacyBehavior>
                <a className={styles.link}>
                  <h3 className={styles.author}>{post.author_name}</h3>
                  <p>{post.content} 💬{post.comment_count}</p>
                  <p className={styles.date}>{post.date}</p>
                </a>
              </Link>
            </li>
          ))
        ) : (
          <p>작성된 글이 없습니다.</p>
        )}
      </ul>
    </div>
  );
}
