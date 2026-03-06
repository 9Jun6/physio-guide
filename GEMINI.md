# GEMINI.md - PhysioGuide Project Context

이 파일은 Gemini CLI가 프로젝트의 핵심 맥락, 기술 스택, 그리고 코딩 규칙을 이해하도록 돕는 가이드라인입니다. 모든 작업 시 이 내용을 최우선으로 참고하세요.

## 1. 프로젝트 개요 (Overview)
- **이름**: PhysioGuide (물리치료사 맞춤형 운동 가이드 플랫폼)
- **목표**: 치료사가 환자에게 개별 맞춤형 운동(횟수/세트/주의사항)을 처방하고, 환자는 QR 코드를 통해 즉시 가이드를 확인하며 수행 기록을 남기는 O2O 서비스.
- **핵심 흐름**: [치료사] 운동 선택 및 처방 발행 -> [QR 생성] -> [환자] QR 스캔 및 운동 수행 -> [데이터] 수행 로그 저장 및 치료사 확인.

## 2. 기술 스택 (Tech Stack)
- **Frontend**: Next.js 16.x (App Router), React 19.x, TypeScript
- **Styling**: Tailwind CSS v4 (PostCSS 기반)
- **Backend/DB**: Supabase (Auth, PostgreSQL, RLS)
- **State/Caching**: Vercel KV (임시 처방 토큰 등 필요시 활용)
- **Libraries**: `@supabase/ssr`, `qrcode.react`

## 3. 데이터베이스 스키마 (Database Schema)
`supabase/setup.sql`에 정의된 핵심 테이블:
1. `profiles`: 사용자 계정 (therapist / patient 역할 구분)
2. `exercises`: 운동 마스터 데이터 (ID, 이름, 부위, 단계, 호흡법 등)
3. `prescriptions`: 처방전 메인 (ID는 QR용 고유 토큰 역할)
4. `prescription_items`: 처방된 세부 운동 항목 (맞춤형 횟수/세트 포함)
5. `therapist_patient_relations`: 치료사-환자 관계 관리
6. `exercise_logs`: 운동 수행 결과 및 통증 수치 피드백

## 4. 코딩 가이드라인 (Coding Standards)
- **Next.js 16**: Server Components를 기본으로 사용하고, 상호작용이 필요한 부분만 `'use client'`로 분리.
- **Tailwind v4**: 최신 v4 문법을 준수하며, 가독성을 위해 복잡한 클래스는 컴포넌트로 추상화.
- **Supabase**: 모든 쿼리는 `lib/supabase.ts`를 통해 수행하며, RLS 정책을 준수할 것.
- **ID 전략**: 기존 `data/exercises.json`과의 호환성을 위해 `exercises` 테이블의 ID는 문자열(예: 'neck-1')을 허용함.

## 5. 현재 진행 상황 (Current Status)
- [x] 프로젝트 기초 구조 (Next.js 16 초기화)
- [x] DB 스키마 설계 (`setup.sql` 작성 완료)
- [x] 초기 데이터 마이그레이션 (`app/api/migrate/route.ts` 실행 완료)
- [ ] 치료사용 처방 발행 UI (Admin/Manage 페이지)
- [ ] 환자용 QR 상세 페이지 (`app/p/[token]/page.tsx`)

## 6. 특별 주의사항
- **보안**: API 키나 DB 비밀번호는 절대 노출하지 말 것.
- **아이콘**: 별도 라이브러리 설치 전에는 `app/components/ExerciseSVG.tsx` 등의 커스텀 SVG를 우선 활용.
- **UI/UX**: 재활 치료 도구이므로 깔끔하고 직관적인 UI(모바일 우선) 지향.
