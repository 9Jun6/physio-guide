import { NextResponse } from "next/server";
import { readPrescriptions, writePrescriptions } from "@/lib/storage";

type Prescription = { token: string; id: string };

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  const data = await readPrescriptions();

  // Public access: lookup by token
  if (token) {
    const prescription = (data.prescriptions as Prescription[]).find(
      (p) => p.token === token
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

  const data = await readPrescriptions();

  if (action === "add") {
    data.prescriptions.push(prescription);
  } else if (action === "delete") {
    data.prescriptions = (data.prescriptions as Prescription[]).filter(
      (p) => p.id !== prescription.id
    );
  } else {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  await writePrescriptions(data);
  return NextResponse.json({ ok: true });
}
