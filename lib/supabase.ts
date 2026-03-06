import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Supabase environment variables are missing!");
  }

  // 자주 발생하는 .com 오타 자동 보정
  if (url.endsWith('.supabase.com')) {
    console.warn("Detected .com in Supabase URL. Correcting to .co");
    url = url.replace('.supabase.com', '.supabase.co');
  }

  return createBrowserClient(url, key);
}
