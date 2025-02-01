import prisma from '@/lib/db';
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route"; // next-auth 설정 가져오기

export async function GET(req, { params }) {
  const { id } = await params;

  const comments = await prisma.comment.findMany({
    where: { post_id: id },
    orderBy: { createdAt: 'asc' }, // 오래된 순으로 정렬
  });

  return new Response(JSON.stringify(comments), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions); // 올바르게 세션 가져오기
  const { id } = await params;
  const { content } = await req.json();

  if (!content) {
    return new Response('댓글 내용이 필요합니다.', { status: 400 });
  }

  console.log(session);
  const newComment = await prisma.comment.create({
    data: {
      author_id:session.user.id,
      author_name:session.user.name,
      post_id: id,
      content: content,
    },
  });

  return new Response(JSON.stringify(newComment), {
    headers: { 'Content-Type': 'application/json' },
  });
}
