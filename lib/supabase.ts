import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 환경 변수가 없을 때 null 대신 빈 문자열이라도 넣어서 클라이언트를 생성합니다.
  // (실제 호출 시점에 Supabase가 에러를 뱉게 하여 디버깅을 돕습니다.)
  return createBrowserClient(
    supabaseUrl || '',
    supabaseKey || ''
  );
}
