import { NextResponse } from "next/server";

/** @param {import("next/server").NextRequest} req */
export function middleware(req) {
  const cookieHeader = req.headers.get("cookie") || "";
  const cookies = new Map(
    cookieHeader
      .split("; ")
      .map((cookie) => cookie.split("="))
      .map(([key, ...value]) => [key, value.join("=")])
  );

  const sessionToken =
    cookies.get("next-auth.session-token") ||
    cookies.get("__Secure-next-auth.session-token");

  if (sessionToken) {
    const res = NextResponse.next();
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

// // 특정 경로에서만 미들웨어 실행 (예: /api/* 경로)
// export const config = {
//   matcher: "/api/:path*",
// };
