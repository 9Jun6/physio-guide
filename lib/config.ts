/**
 * 프로젝트 전역 설정 및 환경 변수 중앙 관리
 * Next.js 브라우저 번들링을 위해 process.env.NEXT_PUBLIC_... 은 전체 문자열로 참조해야 합니다.
 */

export const config = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  admin: {
    password: process.env.ADMIN_PASSWORD,
  },
  site: {
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    name: "PhysioGuide",
  }
} as const;
