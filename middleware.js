import { NextResponse } from "next/server";

export function middleware(req) {
  // NextAuth 세션 토큰 가져오기
  const sessionToken = req.cookies.get("next-auth.session-token") || req.cookies.get("__Secure-next-auth.session-token");

  if (sessionToken) {
    const res = NextResponse.next();

    // 쿠키를 올바른 문자열로 저장
    res.cookies.set("token", String(sessionToken), {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
    });

    return res;
  }

  return NextResponse.next();
}