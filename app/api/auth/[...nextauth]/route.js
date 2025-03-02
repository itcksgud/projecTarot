import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";  // lib/auth.js에서 가져오기

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
