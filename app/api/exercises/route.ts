import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { Exercise } from "../../types";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: exercises, error } = await supabase
    .from('exercises')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const bodyParts = Array.from(new Set(exercises.map(e => e.body_part)));
  
  return NextResponse.json({ 
    bodyParts, 
    exercises: exercises as Exercise[]
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
      .upsert(exercise); // Exercise 타입 데이터를 그대로 전송
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
