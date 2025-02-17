"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "./myPage.module.css"; // module.css 사용
import Link from "next/link";

export default function MyPage() {
  const { user_id } = useParams();
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    if (!user_id) return;

    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/tarotposts?author_id=${user_id}`);
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [user_id]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}> 내가 작성한 타로 게시글</h1>
      <ul className={styles.postList}>
        {posts.length > 0 ? (
          posts.map((post) => (
            <li key={post.id} className={styles.postItem}>
                <Link href={`/detail/${post.id}`} className={styles.link}>
                <h3>{post.spread_type}</h3>
                <p>{post.content}</p>
                <p className={styles.date}>{new Date(post.date).toLocaleDateString()}</p>
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
