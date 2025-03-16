import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginedUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!loginedUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    let posts = [];

    if (loginedUser.role === "admin") {
      posts = await prisma.tarotPost.findMany({
        select: {
          id: true,
          spread_type: true,
          content: true,
          date: true,
          answer: true,
          author: {
            select: { name: true },
          },
        },
      });
    } else {
      posts = await prisma.tarotPost.findMany({
        where: { author_id: loginedUser.id },
        select: {
          id: true,
          spread_type: true,
          content: true,
          date: true,
          answer: true,
          author: {
            select: { name: true },
          },
        },
      });
    }

    // 각 post에 대해 댓글 개수를 가져오는 부분
    const postsWithComments = await Promise.all(posts.map(async (post) => {
      const commentCount = await prisma.comment.count({
        where: { post_id: post.id },
      });

      return {
        ...post,
        author_name: post.author?.name || "Unknown",
        comment_count: commentCount,
      };
    }));

    const sortedPosts = postsWithComments.sort(
      (a, b) => new Date(a.date || 0) - new Date(b.date || 0)
    );

    return NextResponse.json(sortedPosts, { status: 200 });
  } catch (error) {
    console.error("Error fetching tarot posts:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
