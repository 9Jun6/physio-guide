# Physio Guide

물리치료사가 환자에게 맞춤 운동 처방을 제공하고, 환자는 QR코드/링크를 통해 처방된 운동을 확인할 수 있는 웹 애플리케이션입니다.

## Features

- **환자용 화면** — 신체 부위별 운동 목록 조회 및 단계별 가이드 + 호흡 타이머
- **처방전 공유** — 고유 토큰 기반 URL로 환자 맞춤 처방전 공유 (QR코드 지원)
- **관리자 페이지** — 물리치료사가 운동 처방 생성·관리 (비밀번호 인증)
- **신체 부위 필터** — 목·어깨·허리·무릎 등 8개 부위별 운동 분류

## Tech Stack

| Category | Stack |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| State | React 19 (useState / useEffect) |
| Cookie | js-cookie |
| QR Code | qrcode.react |

## Project Structure

```
physio-guide/
├── app/
│   ├── admin/
│   │   ├── page.tsx          # 관리자 로그인
│   │   └── manage/page.tsx   # 처방 관리 (운동 추가·삭제·QR 발급)
│   ├── api/
│   │   ├── auth/route.ts     # 관리자 인증 API
│   │   ├── exercises/route.ts
│   │   └── prescriptions/route.ts
│   ├── components/
│   │   ├── BreathingTimer.tsx
│   │   └── ExerciseSVG.tsx
│   ├── exercise/[id]/page.tsx  # 운동 상세 (단계 + 호흡 가이드)
│   ├── exercises/page.tsx      # 부위별 운동 목록
│   ├── p/[token]/page.tsx      # 환자 처방전 페이지
│   └── page.tsx                # 신체 부위 선택 홈
├── data/
│   ├── exercises.json
│   └── prescriptions.json
└── public/
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm / bun

### Installation

```bash
git clone https://github.com/9Jun6/physio-guide.git
cd physio-guide
npm install
```

### Environment Variables

프로젝트 루트에 `.env.local` 파일을 생성하세요.

```env
ADMIN_PASSWORD=your_admin_password
```

### Run Development Server

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 열어 확인하세요.

### Build & Start

```bash
npm run build
npm start
```

## Usage

| Role | Path | Description |
|---|---|---|
| 환자 | `/` | 신체 부위 선택 후 운동 목록 확인 |
| 환자 | `/p/:token` | QR코드·링크로 처방전 확인 |
| 물리치료사 | `/admin` | 관리자 로그인 |
| 물리치료사 | `/admin/manage` | 운동 처방 생성 및 QR코드 발급 |

## License

MIT
