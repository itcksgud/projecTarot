import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            throw new Error('User not found');
          }

          const isValidPassword = await bcryptjs.compare(credentials.password, user.password);
          if (!isValidPassword) {
            throw new Error('Invalid credentials');
          }

          console.log(user);
          return { id: user.id, name: user.name, email: user.email };
        } catch (error) {
          console.error('Authorization error:', error.message);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',  // 세션 대신 JWT 사용
    maxAge: 24 * 60 * 60,  // 24시간 유지
    updateAge: 12 * 60 * 60,  // 12시간마다 업데이트
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
