import { NextResponse } from "next/server";
import { readTherapists, writeTherapists } from "@/lib/storage";
import { hashPassword } from "@/lib/auth";
import { getAuth } from "@/lib/auth";

export async function GET(req: Request) {
  const auth = await getAuth(req);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await readTherapists();
  // Never return passwordHash
  const therapists = data.therapists.map(({ id, name, role, createdAt }) => ({
    id,
    name,
    role,
    createdAt,
  }));
  return NextResponse.json({ therapists });
}

export async function POST(req: Request) {
  const auth = await getAuth(req);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { action } = body;
  const data = await readTherapists();

  if (action === "add") {
    const { id, name, password, role } = body;
    if (!id || !name || !password) {
      return NextResponse.json({ error: "id, name, password 필수" }, { status: 400 });
    }
    if (data.therapists.find((t) => t.id === id)) {
      return NextResponse.json({ error: "이미 존재하는 아이디입니다." }, { status: 409 });
    }
    const passwordHash = await hashPassword(password);
    data.therapists.push({
      id,
      name,
      passwordHash,
      role: role === "admin" ? "admin" : "therapist",
      createdAt: new Date().toISOString(),
    });
    await writeTherapists(data);
    return NextResponse.json({ ok: true });
  }

  if (action === "delete") {
    const { id } = body;
    if (id === auth.sub) {
      return NextResponse.json({ error: "자기 자신은 삭제할 수 없습니다." }, { status: 400 });
    }
    data.therapists = data.therapists.filter((t) => t.id !== id);
    await writeTherapists(data);
    return NextResponse.json({ ok: true });
  }

  if (action === "changePassword") {
    const { id, newPassword } = body;
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "비밀번호는 6자 이상이어야 합니다." }, { status: 400 });
    }
    const idx = data.therapists.findIndex((t) => t.id === id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    data.therapists[idx].passwordHash = await hashPassword(newPassword);
    await writeTherapists(data);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
