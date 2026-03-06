import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const exercises = [
    {
      id: "neck-1",
      name: "목 좌우 스트레칭",
      body_part: "목",
      description: "목 옆 근육의 긴장을 풀어주는 기본 스트레칭입니다.",
      steps: ["바르게 앉아 정면을 바라봅니다.", "천천히 오른쪽 귀를 오른쪽 어깨 방향으로 기울입니다.", "15~30초 유지 후 반대쪽도 반복합니다."],
      breathing: { "inhale": 4, "hold": 2, "exhale": 4 },
      default_reps: 5,
      default_sets: 2,
      svg_key: "neck-side"
    },
    {
      id: "shoulder-1",
      name: "어깨 돌리기",
      body_part: "어깨",
      description: "어깨 관절의 가동 범위를 넓히고 긴장을 풀어줍니다.",
      steps: ["팔을 자연스럽게 내린 상태로 섭니다.", "양 어깨를 앞에서 뒤로 천천히 크게 돌립니다.", "5회 반복 후 반대 방향으로도 돌립니다."],
      breathing: { "inhale": 4, "hold": 0, "exhale": 4 },
      default_reps: 10,
      default_sets: 2,
      svg_key: "shoulder-roll"
    },
    {
      id: "back-1",
      name: "무릎 가슴 당기기",
      body_part: "허리",
      description: "허리 근육을 이완시키고 하부 요통을 완화합니다.",
      steps: ["바닥에 등을 대고 눕습니다.", "양 무릎을 천천히 가슴 쪽으로 당깁니다.", "20~30초 유지 후 천천히 내립니다."],
      breathing: { "inhale": 4, "hold": 2, "exhale": 6 },
      default_reps: 5,
      default_sets: 2,
      svg_key: "back-knee-chest"
    }
    // ... 더 많은 데이터를 추가할 수 있지만, 일단 테스트로 3개만 먼저 넣습니다.
  ];

  try {
    const { data, error } = await supabase
      .from('exercises')
      .upsert(exercises, { onConflict: 'id' });

    if (error) throw error;

    return NextResponse.json({ success: true, message: "Seed data inserted!", count: exercises.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
