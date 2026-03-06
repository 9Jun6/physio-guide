import { createBrowserClient } from '@supabase/ssr'
import { config } from './config'

export function createClient() {
  // config 객체를 사용하여 중앙 집중식 관리
  return createBrowserClient(
    config.supabase.url,
    config.supabase.anonKey
  );
}
