import { NextResponse } from "next/server";

import { config } from "@/lib/config";

export async function POST(req: Request) {
  const { password } = await req.json();

  if (password === config.admin.password) {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Wrong password" }, { status: 401 });
}
