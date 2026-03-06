/**
 * 프로젝트 전역 설정 및 환경 변수 중앙 관리
 */

export const config = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  },
  admin: {
    // 서버 사이드 전용 비밀번호 (인증용)
    password: process.env.ADMIN_PASSWORD || "",
  },
  site: {
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    name: "PhysioGuide",
  }
} as const;

// 필수 환경 변수 체크 (서버 사이드 런타임에서만 실행 권장)
export function validateConfig() {
  const required = [
    { name: "NEXT_PUBLIC_SUPABASE_URL", val: config.supabase.url },
    { name: "NEXT_PUBLIC_SUPABASE_ANON_KEY", val: config.supabase.anonKey },
  ];

  required.forEach(env => {
    if (!env.val) {
      console.error(`[Config Error] Missing environment variable: ${env.name}`);
    }
  });
}
