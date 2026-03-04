# Physio Guide — Project Context

## GitHub
- Repo: https://github.com/9Jun6/physio-guide
- Username: 9Jun6
- Branch: main

## Stack
- Next.js 16.1.6 (App Router, Turbopack)
- TypeScript, Tailwind CSS v4, React 19
- Dependencies: js-cookie, qrcode.react

## Project Structure
```
app/
  page.tsx                  # 홈 (신체 부위 선택)
  exercises/page.tsx        # 부위별 운동 목록
  exercise/[id]/page.tsx    # 운동 상세 + 통합 타이머
  admin/page.tsx            # 관리자 로그인
  admin/manage/page.tsx     # 운동/처방전 관리
  p/[token]/page.tsx        # 환자용 처방전 페이지
  components/
    BreathingTimer.tsx      # 단계별 운동 + 호흡 타이머 통합 컴포넌트
    ExerciseSVG.tsx
  api/
    auth/route.ts
    exercises/route.ts
    prescriptions/route.ts
data/
  exercises.json
  prescriptions.json
```

## Key Architecture Decisions

### BreathingTimer (통합 타이머)
- `steps`, `reps`, `sets`, `breathing` props를 받음
- 각 step마다 호흡 사이클(inhale→hold→exhale) 1회 진행 후 자동으로 다음 step으로 이동
- 흐름: Step 1 (breathing cycle) → Step 2 → ... → 1 rep 완료 → 반복
- 현재 step 하이라이트, 완료 step은 ✓ 표시
- progress bar는 현재 페이즈 기간 기준으로 계산 (`elapsed / currentPhaseDuration`)

### useSearchParams 패턴
- `useSearchParams()`를 쓰는 페이지는 반드시 Suspense로 감싸야 함 (안 그러면 Jest worker crash)
- 패턴: 내부 컴포넌트 분리 → 외부에서 `<Suspense><InnerComponent /></Suspense>` export
- 적용된 파일: `exercises/page.tsx`, `exercise/[id]/page.tsx`

## Environment
- .env.local 필요: `ADMIN_PASSWORD=...`
- dev 서버 포트: 3000 (사용 중이면 3003)
- 락 파일 문제 시: `rm -f .next/dev/lock` 후 재시작

## Dev Server 재시작 방법
```bash
cmd /c "taskkill /F /IM node.exe 2>nul"
rm -f .next/dev/lock
npm run dev
```
