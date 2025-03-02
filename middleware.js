import { NextResponse } from "next/server";

/** @param {import("next/server").NextRequest} req */
export function middleware(req) {
  const isSecure = req.nextUrl.protocol === "https:"; // 현재 프로토콜 확인
  const sessionToken =
    req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("__Secure-next-auth.session-token")?.value;

  if (sessionToken) {
    const res = NextResponse.next();
    res.cookies.set("token", sessionToken, {
      httpOnly: true,
      secure: isSecure, // HTTP 환경에서는 secure: false
      sameSite: "Lax", // 앱에서 테스트할 때 Lax로 변경
      path: "/",
    });

    return res;
  }

  return NextResponse.next();
}
