import { NextResponse } from "next/server";
import { readTherapists, writeTherapists } from "@/lib/storage";
import { hashPassword, verifyPassword, signJWT } from "@/lib/auth";

// Auto-seed admin account from ADMIN_PASSWORD env var if no therapists exist yet
async function ensureAdminSeeded() {
  const data = await readTherapists();
  if (data.therapists.length > 0) return;
  const legacy = process.env.ADMIN_PASSWORD;
  if (!legacy) return;
  const passwordHash = await hashPassword(legacy);
  data.therapists.push({
    id: "admin",
    name: "관리자",
    passwordHash,
    role: "admin",
    createdAt: new Date().toISOString(),
  });
  await writeTherapists(data);
}

export async function POST(req: Request) {
  const { id, password } = await req.json();
  if (!id || !password) {
    return NextResponse.json({ error: "id와 비밀번호를 입력하세요." }, { status: 400 });
  }

  await ensureAdminSeeded();

  const data = await readTherapists();
  const therapist = data.therapists.find((t) => t.id === id);
  if (!therapist) {
    return NextResponse.json({ error: "아이디 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  const ok = await verifyPassword(password, therapist.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "아이디 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  const token = await signJWT({ sub: therapist.id, name: therapist.name, role: therapist.role });

  const res = NextResponse.json({ ok: true, name: therapist.name, role: therapist.role });
  res.cookies.set("auth_token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8h
  });
  return res;
}
