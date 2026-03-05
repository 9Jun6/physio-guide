import { NextResponse } from "next/server";
import { readExercises, writeExercises } from "@/lib/storage";

export async function GET() {
  const data = await readExercises();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { adminPassword, action, exercise } = body;

  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await readExercises();

  if (action === "add") {
    data.exercises.push(exercise);
  } else if (action === "update") {
    const idx = data.exercises.findIndex((e) => (e as { id: string }).id === exercise.id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    data.exercises[idx] = exercise;
  } else if (action === "delete") {
    data.exercises = data.exercises.filter((e) => (e as { id: string }).id !== exercise.id);
  } else {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  await writeExercises(data);
  return NextResponse.json({ ok: true });
}
