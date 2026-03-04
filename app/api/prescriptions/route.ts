import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "data", "prescriptions.json");

function readData() {
  const raw = readFileSync(dataPath, "utf-8");
  return JSON.parse(raw);
}

function writeData(data: unknown) {
  writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  const data = readData();

  // Public access: lookup by token
  if (token) {
    const prescription = data.prescriptions.find(
      (p: { token: string }) => p.token === token
    );
    if (!prescription) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(prescription);
  }

  // Admin access: return all
  const adminPassword = searchParams.get("adminPassword");
  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { adminPassword, action, prescription } = body;

  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = readData();

  if (action === "add") {
    data.prescriptions.push(prescription);
  } else if (action === "delete") {
    data.prescriptions = data.prescriptions.filter(
      (p: { id: string }) => p.id !== prescription.id
    );
  } else {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  writeData(data);
  return NextResponse.json({ ok: true });
}
