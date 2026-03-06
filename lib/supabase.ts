import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 빌드 시 환경 변수가 없을 경우 에러 방지
  if (!supabaseUrl || !supabaseKey) {
    return null as any; 
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
