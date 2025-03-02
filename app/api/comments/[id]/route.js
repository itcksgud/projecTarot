import prisma from '@/lib/db';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import nodemailer from 'nodemailer';

export async function GET(req, { params }) {
  const { id } = await params;

  const comments = await prisma.comment.findMany({
    where: { post_id: id },
    orderBy: { createdAt: 'asc' }, // 오래된 순 정렬
    include: {
      author: {
        select: { name: true } // ✅ 작성자 이름만 가져오기
      }
    }
  });
  
  // 결과 데이터 형태 예시
  const formattedComments = comments.map(comment => ({
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    author_name: comment.author?.name || "Unknown" // ✅ 작성자 이름 추가
  }));

  return new Response(JSON.stringify(formattedComments), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions); // 올바르게 세션 가져오기
  const { id } = await params;
  const { content } = await req.json();

  const user = await prisma.user.findUnique({
    where: {id: session.user.id}
  });

  if (!content) {
    return new Response('댓글 내용이 필요합니다.', { status: 400 });
  }

  console.log(session);
  const newComment = await prisma.comment.create({
    data: {
      author_id:session.user.id,
      post_id: id,
      content: content,
    },
  });

  if(user.role==='admin')
  {
    const tarotPost = await prisma.tarotPost.findUnique({
      where: { id: id}
    });

    const user = await prisma.user.findUnique({
      where: {id: tarotPost.author_id}
    });

    if (user) {
          // 3. 이메일 전송 설정
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,  // 환경변수로 설정된 이메일
              pass: process.env.EMAIL_PASS,  // 이메일 비밀번호
            },
          });
    
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'ProjecTarot 새로운 댓글.',
            text: `링크를 확인해주세요. New answer: ${process.env.NEXTAUTH_URL}/detail/${id}`,
          };
    
          // 4. 이메일 전송
          await transporter.sendMail(mailOptions);
        }
  }
  return new Response(JSON.stringify(newComment), {
    headers: { 'Content-Type': 'application/json' },
  });
}
