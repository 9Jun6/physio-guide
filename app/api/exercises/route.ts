import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "data", "exercises.json");

function readData() {
  const raw = readFileSync(dataPath, "utf-8");
  return JSON.parse(raw);
}

function writeData(data: unknown) {
  writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  const data = readData();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { adminPassword, action, exercise } = body;

  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = readData();

  if (action === "add") {
    data.exercises.push(exercise);
  } else if (action === "update") {
    const idx = data.exercises.findIndex((e: { id: string }) => e.id === exercise.id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    data.exercises[idx] = exercise;
  } else if (action === "delete") {
    data.exercises = data.exercises.filter((e: { id: string }) => e.id !== exercise.id);
  } else {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  writeData(data);
  return NextResponse.json({ ok: true });
}
