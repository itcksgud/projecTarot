import { NextResponse } from "next/server";

export function middleware(req) {
  const res = NextResponse.next();

  res.cookies.set("token", "your_access_token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  return res;
}
