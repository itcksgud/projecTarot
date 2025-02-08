import bcrypt from 'bcryptjs';  // 비밀번호 해싱을 위한 라이브러리
import prisma from '@/lib/db';  // Prisma 클라이언트 import (경로를 프로젝트에 맞게 수정)



export async function POST(req) {
  const { name, email, password } = await req.json();  // 클라이언트에서 보낸 JSON 데이터 받기

  if (!name || !email || !password) {
    return new Response(
      JSON.stringify({ message: '모든 필드를 입력해야 합니다.' }),
      { status: 400 }
    );
  }

  try {
    // 이메일 중복 체크
    const existingUser = await prisma.User.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({ message: '이 이메일은 이미 사용 중입니다.' }),
        { status: 400 }
      );
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);
    // 사용자 등록
    const user = await prisma.User.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role:"user"
      },
    });

    return new Response(
      JSON.stringify({ message: '계정이 성공적으로 생성되었습니다!', user }),
      { status: 201 }
    );
  } catch (error) {
    console.debug(error.name);
    console.debug(error.message);
    console.debug(error.code)
    return new Response(
      JSON.stringify({ message: '서버 오류가 발생했습니다.' }),
      { status: 500 }
    );
    
  }
}
