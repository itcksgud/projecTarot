import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // next-auth 설정 가져오기

const prisma = new PrismaClient();

export async function GET(req) {

  const session = await getServerSession(authOptions); // 올바르게 세션 가져오기

  if (!session) {
    return NextResponse.json({ error: "author_id is required" }, { status: 400 });
  }
  console.log(session);
  const loginedUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  try {
    let posts;
    if (loginedUser.role === 'admin') {
      posts = await prisma.tarotPost.findMany({
        select: {
          id: true,
          spread_type: true,
          content: true,
          date: true,
          author: {
            select: {
              name: true,
            },
          },
        },
      });
    } else {
      // author_id로 필터링하여 게시글 가져오기
      posts = await prisma.tarotPost.findMany({
        where: { author_id: loginedUser.id },
        select: {
          id: true,
          spread_type: true,
          content: true,
          date: true,
          author: {
            select: {
              name: true,
            },
          },
        },
      });
    }

    const postsWithAuthorName = posts.map(post => ({
      ...post,
      author_name: post.author?.name || "Unknown",
    }));
    // date가 String이므로 JavaScript에서 정렬 (최신순)
    const sortedPosts = postsWithAuthorName.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return NextResponse.json(sortedPosts, { status: 200 });
  } catch (error) {
    console.error("Error fetching tarot posts:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
