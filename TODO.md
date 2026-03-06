# Physio Guide — TODO

## Supabase 연동

- [ ] Supabase 프로젝트 생성 및 환경변수 설정 (`.env.local`에 `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` 추가)
- [ ] `exercises`, `prescriptions` 테이블 마이그레이션 (현재 JSON 파일 기반 → DB)
- [ ] Row Level Security (RLS) 활성화 — 처방전은 토큰 일치 시에만 조회 허용
- [ ] API route를 Supabase 클라이언트로 교체

## 환자 개인정보 보안

- [ ] 환자 이름 암호화 저장 구현 (`aes-256-cbc`, Node.js `crypto` 모듈)
  - `ENCRYPT_KEY` 환경변수 추가 (32바이트 hex)
  - 서버(API route)에서만 암호화/복호화 처리
  - DB에는 암호문만 저장, 클라이언트에는 복호화된 이름만 전달
- [ ] 처방전 토큰 강도 확인 — `crypto.randomUUID()` 또는 동급 이상 랜덤값 사용
- [ ] RLS 정책: `token` 컬럼 일치 시에만 `SELECT` 허용

## 참고

- `service_role key`는 서버(API route)에서만 사용, 클라이언트 노출 금지
- 환자 이름은 개인정보보호법 적용 대상 — 수집 목적 고지 필요
