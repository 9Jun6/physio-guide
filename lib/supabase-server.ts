import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// 1. 일반 사용자용 서버 클라이언트 (RLS 적용됨)
export async function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) return null as any;

  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() { return cookieStore.getAll() },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {}
      },
    },
  })
}

// 2. 관리자용 전용 서버 클라이언트 (RLS 우회 - SERVICE_ROLE_KEY 사용)
// 주의: 이 클라이언트는 오직 '서버 환경'에서만 호출되어야 하며, 반드시 비밀번호 검증 후에 사용해야 합니다.
export async function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // 브라우저 노출 금지!

  if (!supabaseUrl || !adminKey) return null as any;

  return createServerClient(supabaseUrl, adminKey, {
    cookies: {
      getAll() { return [] },
      setAll() {}
    },
  })
}
