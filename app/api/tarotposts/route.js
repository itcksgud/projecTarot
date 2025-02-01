import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // next-auth 설정 가져오기

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const authorId = searchParams.get("author_id");
  const session = await getServerSession(authOptions); // 올바르게 세션 가져오기

  if (!authorId) {
    return NextResponse.json({ error: "author_id is required" }, { status: 400 });
  }
  console.log(authorId);

  const loginedUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  try {
    let posts;

    // author_id가 'all'이면 모든 게시글 가져오기
    if (authorId === 'all' && loginedUser.role === 'admin') {
      posts = await prisma.tarotPost.findMany({
        select: {
          id: true,
          spread_type: true,
          content: true,
          date: true,
        },
      });
    } else {
      // author_id로 필터링하여 게시글 가져오기
      posts = await prisma.tarotPost.findMany({
        where: { author_id: authorId },
        select: {
          id: true,
          spread_type: true,
          content: true,
          date: true,
        },
      });
    }

    // date가 String이므로 JavaScript에서 정렬 (최신순)
    const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return NextResponse.json(sortedPosts, { status: 200 });
  } catch (error) {
    console.error("Error fetching tarot posts:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
