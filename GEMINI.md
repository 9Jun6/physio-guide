# GEMINI.md - PhysioGuide Project Context (Updated)

이 파일은 프로젝트의 핵심 맥락, 기술 스택, 보안 모델 및 진행 상태를 기록합니다.

## 1. 프로젝트 개요 (Overview)
- **이름**: PhysioGuide (물리치료사 맞춤형 운동 가이드 플랫폼)
- **목표**: 치료사가 환자에게 개별 맞춤형 운동을 처방하고, 환자는 QR 코드를 통해 가이드를 확인하며 수행 기록(통증 점수 등)을 남기는 O2O 서비스.

## 2. 기술 스택 및 아키텍처 (Tech Stack & Architecture)
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4.
- **Backend/DB**: Supabase (PostgreSQL, RLS).
- **Hybrid Security Model**:
  - **Therapist (Admin)**: `Server Actions` 기반. 서버에서 `ADMIN_PASSWORD`를 검증하며, `SUPABASE_SERVICE_ROLE_KEY`를 사용하여 RLS를 우회하고 관리 권한을 행사함. (보안성 높음)
  - **Patient (Public)**: `Client-side` 기반. 별도 로그인 없이 QR 토큰(UUID)을 통해 접근하며, Supabase `RLS Policy`를 통해 본인 처방전과 운동 정보만 읽기 가능.

## 3. 데이터베이스 권한 현황 (DB Permission Status)
현재 `supabase/setup.sql` 및 RLS 설정 상태:
- `exercises`: 모든 사용자 SELECT 허용 (`true` policy).
- `prescriptions`: 토큰(UUID) 기반 SELECT 허용 정책 필요 (현재는 개발 편의를 위해 `true` 설정 가능성 있음).
- `exercise_logs`: INSERT 허용 (환자가 운동 후 로그 저장).
- **관리 권한**: 모든 테이블에 대해 `service_role` 키를 가진 서버 액션만 쓰기/삭제 권한을 가짐.

## 4. 구현된 핵심 기능 (Implemented Features)
- [x] **관리자 대시보드**: 운동 목록 관리, 처방전 발행(QR 생성), 환자 수행 로그(통증 변화) 모니터링.
- [x] **환자용 처방 페이지**: QR 스캔 시 해당 환자의 맞춤형 운동 목록 및 치료사 메모 표시.
- [x] **운동 수행 가이드**: 호흡 타이머(BreathingTimer), 운동 단계 안내, 수행 후 통증 로그 저장 기능.
- [x] **서버 사이드 보안**: 치료사 전용 기능을 모두 `app/admin/actions.ts`로 이전 완료.

## 5. 현재 진행 상태 (Current Status)
- **완료**: 프로젝트 기초 설정, DB 스키마 설계, 핵심 UI/UX 구현, 서버 액션 보안 강화.
- **진행 중**: Vercel 배포 및 환경 변수(`SERVICE_ROLE_KEY`) 설정.
- **예정**: 통계 대시보드 고도화, 환자 본인 기록 확인 기능.

## 6. 개발 규칙 및 주의사항
- **비밀번호**: `ADMIN_PASSWORD`는 반드시 서버 액션에서만 검증할 것.
- **Supabase 클라이언트**: 
  - 브라우저용: `lib/supabase.ts` (createClient)
  - 서버용: `lib/supabase-server.ts` (createServerSupabaseClient, createAdminClient)
- **ID 전략**: 운동 ID는 기존 JSON 호환을 위해 문자열(`neck-1` 등)을 유지함.
