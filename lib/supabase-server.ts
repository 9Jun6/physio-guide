import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { config } from './config'

// 1. 일반 사용자용 서버 클라이언트
export async function createServerSupabaseClient() {
  const url = config.supabase.url;
  const key = config.supabase.anonKey;

  if (!url || !key) {
    throw new Error("Missing Supabase environment variables for server client");
  }

  const cookieStore = await cookies()

  return createServerClient(
    url,
    key,
    {
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
    }
  )
}

// 2. 관리자용 전용 서버 클라이언트 (Service Role 사용)
export async function createAdminClient() {
  const url = config.supabase.url;
  const adminKey = config.supabase.serviceRoleKey;

  if (!url || !adminKey) {
    throw new Error("Missing Supabase Service Role Key for admin client");
  }

  return createServerClient(
    url,
    adminKey,
    {
      cookies: {
        getAll() { return [] },
        setAll() {}
      },
    }
  )
}
