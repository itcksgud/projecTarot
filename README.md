# ProjecTarot - 온라인 타로 상담 사이트

> **직접 개발한 온라인 타로 상담 웹사이트입니다.**\
> 🌐 [projectarot.click](https://www.projectarot.click/)

## 🚀 프로젝트 소개

ProjecTarot은 사용자가 온라인에서 쉽고 편하게 타로 상담을 받을 수 있도록 개발된 웹사이트입니다. 사용자는 다양한 타로 스프레드를 통해 운세와 조언을 받을 수 있으며, 로그인 기능을 통해 개인화된 경험을 제공합니다.

---

## 📌 주요 기능

### 1. 타로 상담 기능

- '오늘의 운세'
- '어떤 선택을 할까?'
- 켈틱 크로스 기반의 개인 맞춤형 타로 스프레드

### 2. 로그인 기능

- Next-auth를 이용한 간편 로그인

### 3. 메일 알림 서비스

- Nodemailer를 통한 이메일 알림 기능 구현
- 사용자 활동과 연계된 이메일 전송 시스템

---

## 🛠️ 기술 스택

### Frontend

- Next.js
- React
- CSS Modules

### Backend

- Next.js API Routes
- Node.js
- Next-auth
- Nodemailer

### Database

- MongoDB Atlas
- Prisma ORM

### 배포

- Koyeb

---

## 🌱 데이터베이스 구조

```prisma
// schema.prisma
model TarotPost {
  id                    String  @id @default(auto()) @map("_id") @db.ObjectId
  spread_type           String
  selected_card_numbers Int[]
  content               String?
  date                  String
  answer                String?
  author_id             String
  author                User    @relation(fields: [author_id], references: [id])
  comments              Comment[]
}

model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  password  String
  name      String
  role      String
  createdAt DateTime @default(now())

  tarotPosts TarotPost[]
  comments   Comment[]
}

model Comment {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  author_id String
  post_id   String
  content   String
  createdAt DateTime @default(now())
  author    User     @relation(fields: [author_id], references: [id])
  post      TarotPost @relation(fields: [post_id], references: [id]) // TarotPost와 연결
}
```

---

## 📌 배포 환경

[Koyeb 배포 가이드](https://www.koyeb.com/docs/integrations/databases/mongodb-atlas)를 참고하여 MongoDB Atlas와 연동된 안정적인 서버 환경을 구축하였습니다.

---

## 📝 프로젝트 회고

- 프론트엔드부터 백엔드, 배포까지 전체 프로세스를 직접 경험하며 개발 역량 향상
- 실제 사용자에게 서비스를 제공하며 실무적인 문제 해결 능력 향상
- 다양한 기술 스택을 활용하여 복합적인 웹 개발 프로젝트 경험 축적

**추후 개선 사항**

- 사용자 인터페이스 및 경험(UI/UX) 향상
- 추가적인 타로 스프레드 기능 확장
- AI API를 사용한 간단 분석 기능
