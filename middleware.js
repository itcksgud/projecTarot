import { NextResponse } from "next/server";

export function middleware(req) {
  // NextAuth 세션 토큰 가져오기
  const sessionToken = req.cookies.get("next-auth.session-token") || req.cookies.get("__Secure-next-auth.session-token");

  if (sessionToken) {
    const res = NextResponse.next();

    // 새로운 쿠키 설정 (SameSite=None으로 설정하여 인앱 브라우저에서도 유지)
    res.cookies.set("token", sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
    });

    return res;
  }

  return NextResponse.next();
}
