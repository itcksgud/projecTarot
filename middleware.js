export function middleware(req) {
    const sessionToken =
      req.cookies.get("next-auth.session-token")?.value ||
      req.cookies.get("__Secure-next-auth.session-token")?.value;
  
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
  