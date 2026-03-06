import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  try {
    // 1. 기존 JSON 파일 읽기
    const dataPath = path.join(process.cwd(), 'data', 'exercises.json');
    if (!fs.existsSync(dataPath)) {
      throw new Error(`Data file not found at ${dataPath}`);
    }
    const fileContent = fs.readFileSync(dataPath, 'utf8');
    const { exercises } = JSON.parse(fileContent);

    // 2. Supabase DB로 데이터 이관
    const { data, error } = await supabase
      .from('exercises')
      .upsert(
        exercises.map((ex: any) => ({
          id: ex.id,
          name: ex.name,
          body_part: ex.bodyPart,
          description: ex.description,
          steps: ex.steps, 
          breathing: ex.breathing, 
          default_reps: ex.reps,
          default_sets: ex.sets,
          svg_key: ex.svgKey,
          difficulty: 1,
          tags: [],
        })),
        { onConflict: 'id' }
      );

    if (error) {
      console.error('Supabase Error:', error);
      throw error;
    }

    return NextResponse.json({ 
      success: true, 
      count: exercises.length, 
      message: 'Migration successful!' 
    });

  } catch (error: any) {
    console.error('Migration Catch Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
