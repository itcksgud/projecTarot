"use client";  // 클라이언트 컴포넌트 선언

import { SessionProvider } from "next-auth/react";

export default function ClientSessionProvider({ session, children }) {
  return <SessionProvider session={session} >{children}</SessionProvider>;
}
