import { NextResponse } from "next/server";
import { readPrescriptions, writePrescriptions } from "@/lib/storage";
import { getAuth } from "@/lib/auth";

type Prescription = {
  token: string;
  id: string;
  therapistId?: string;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  const data = await readPrescriptions();

  // Public access: lookup by token (no auth required)
  if (token) {
    const prescription = (data.prescriptions as Prescription[]).find(
      (p) => p.token === token
    );
    if (!prescription) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(prescription);
  }

  // Admin access: require JWT
  const auth = await getAuth(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Filter by therapistId — admin sees all, therapists see only their own
  // Prescriptions without therapistId are treated as belonging to "admin" (legacy data)
  const all = data.prescriptions as Prescription[];
  const filtered =
    auth.role === "admin"
      ? all
      : all.filter((p) => (p.therapistId ?? "admin") === auth.sub);

  return NextResponse.json({ prescriptions: filtered });
}

export async function POST(req: Request) {
  const auth = await getAuth(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { action, prescription } = body;

  const data = await readPrescriptions();

  if (action === "add") {
    // Stamp therapistId from JWT
    data.prescriptions.push({ ...prescription, therapistId: auth.sub });
  } else if (action === "delete") {
    const target = (data.prescriptions as Prescription[]).find(
      (p) => p.id === prescription.id
    );
    if (!target) return NextResponse.json({ error: "Not found" }, { status: 404 });
    // Only owner or admin can delete
    if (auth.role !== "admin" && (target.therapistId ?? "admin") !== auth.sub) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    data.prescriptions = (data.prescriptions as Prescription[]).filter(
      (p) => p.id !== prescription.id
    );
  } else {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  await writePrescriptions(data);
  return NextResponse.json({ ok: true });
}
