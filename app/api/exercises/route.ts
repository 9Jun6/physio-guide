import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: exercises, error } = await supabase
    .from('exercises')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 기존 ExercisesData 형식에 맞춰 bodyParts 추출
  const bodyParts = Array.from(new Set(exercises.map(e => e.body_part)));
  
  return NextResponse.json({ 
    bodyParts, 
    exercises: exercises.map(ex => ({
      id: ex.id,
      name: ex.name,
      bodyPart: ex.body_part,
      description: ex.description,
      steps: ex.steps,
      breathing: ex.breathing,
      reps: ex.default_reps,
      sets: ex.default_sets,
      svgKey: ex.svg_key
    }))
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { adminPassword, action, exercise } = body;

  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createServerSupabaseClient();

  if (action === "add" || action === "update") {
    const { error } = await supabase
      .from('exercises')
      .upsert({
        id: exercise.id,
        name: exercise.name,
        body_part: exercise.bodyPart,
        description: exercise.description,
        steps: exercise.steps,
        breathing: exercise.breathing,
        default_reps: exercise.reps,
        default_sets: exercise.sets,
        svg_key: exercise.svgKey
      });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else if (action === "delete") {
    const { error } = await supabase
      .from('exercises')
      .delete()
      .eq('id', exercise.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
