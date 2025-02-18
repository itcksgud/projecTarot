//C:\Users\kingc\Desktop\study\Nextjs\project-tarot\app\api\update-answer\route.js
import prisma from '@/lib/db';  // Prisma 클라이언트 import
import nodemailer from 'nodemailer';

export async function POST(req) {
  const { post_id, answer } = await req.json();  // 클라이언트에서 보낸 데이터를 파싱

  try {
    // 1. TarotPost 업데이트
    const updatedPost = await prisma.tarotPost.update({
      where: { id: post_id },
      data: { answer },
    });

    // 2. 이메일 주소 가져오기
    const user = await prisma.user.findUnique({
      where: { id: updatedPost.author_id },
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
        subject: 'ProjecTarot 답변완료.',
        text: `링크를 확인해주세요. New answer: ${process.env.URL}/detail/${post_id}`,
      };

      // 4. 이메일 전송
      await transporter.sendMail(mailOptions);

      return new Response(JSON.stringify({ 
        message: 'Post updated and email sent.',
        updatedPost
       }), {
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ message: 'User not found.' }), {
        status: 404,
      });
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
