import { NextResponse } from "next/server";

export async function GET(req) {
  const cookies = req.cookies.getAll(); // 모든 쿠키 가져오기
  return NextResponse.json({ cookies });
}
