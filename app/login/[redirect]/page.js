'use client'
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import styles from './login.module.css';
import {getServerSession} from '@/lib/auth';
import { useParams } from "next/navigation";

export default function Login() {

  const { redirect } = useParams(); // 동적 라우트 값 가져오기

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result.error) {
      setError('Invalid email or password');
    } else {
      if(redirect==='home') {
        window.location.href = '/'; // 로그인 성공 시 리다이렉트
      } else if (redirect==='celtic-cross') {
        window.location.href = '/card-select/celtic-cross';
      } else if (redirect==='a-or-b') {
        window.location.href = '/card-select/a-or-b';
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ProjecTarot</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>이메일</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>비밀번호</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.button}>로그인</button>
        <Link href="/register">
          <button type="button" className={`${styles.button} ${styles.registerButton}`}>
            회원가입
          </button>
        </Link>
      </form>
    </div>
  );
}
