import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { Exercise } from "../../types";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const exercises = (data || []) as Exercise[];
  const bodyParts = Array.from(new Set(exercises.map((e: Exercise) => e.body_part)));
  
  return NextResponse.json({ 
    bodyParts, 
    exercises
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
      .upsert(exercise);
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
