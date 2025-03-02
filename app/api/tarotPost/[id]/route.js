import prisma from '@/lib/db';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req, { params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions); // 올바르게 세션 가져오기

  const tarotPost = await prisma.tarotPost.findUnique({
    where: { id: id },
  });


  if (!tarotPost) {
    return new Response('데이터를 찾을 수 없습니다.', { status: 404 });
  }

  const loginedUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (tarotPost.author_id===loginedUser.id || loginedUser.role==='admin')
  {
    return new Response(
      JSON.stringify({
      tarotPost,
      role: loginedUser.role,
      }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } else {
    return new Response('잘못된 접근 입니다. 올바른 아이디로 로그인해주세요.', { status: 401 });
  }
  
}
