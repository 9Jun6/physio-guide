"use server";

import { createAdminClient } from "@/lib/supabase-server";
import { Exercise, Prescription } from "../types";

// 비밀번호 검증 헬퍼
async function verifyAdmin(password: string) {
  return password === process.env.ADMIN_PASSWORD;
}

// ───── 운동 관리 Actions ─────

export async function getExercisesAction() {
  const admin = await createAdminClient();
  const { data } = await admin.from("exercises").select("*").order("created_at", { ascending: false });
  return data || [];
}

export async function saveExerciseAction(password: string, exercise: any) {
  if (!(await verifyAdmin(password))) throw new Error("Unauthorized");

  const admin = await createAdminClient();
  const { error } = await admin.from("exercises").upsert(exercise);
  if (error) throw new Error(error.message);
  return { ok: true };
}

export async function deleteExerciseAction(password: string, id: string) {
  if (!(await verifyAdmin(password))) throw new Error("Unauthorized");

  const admin = await createAdminClient();
  const { error } = await admin.from("exercises").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { ok: true };
}

// ───── 처방전 관리 Actions ─────

export async function getPrescriptionsAction() {
  const admin = await createAdminClient();
  const { data } = await admin.from("prescriptions").select(`
    *,
    items:prescription_items(
      *,
      exercise:exercises(*)
    )
  `).order("created_at", { ascending: false });
  return data || [];
}

export async function createPrescriptionAction(password: string, payload: any) {
  if (!(await verifyAdmin(password))) throw new Error("Unauthorized");

  const admin = await createAdminClient();
  
  // 1. 처방전 메인 생성
  const { data: presc, error: pErr } = await admin.from("prescriptions").insert([{
    patient_name_input: payload.patientName,
    notes: payload.notes,
    is_claimed: false
  }]).select().single();

  if (pErr) throw new Error(pErr.message);

  // 2. 항목 생성
  const items = payload.exerciseIds.map((exId: string, idx: number) => ({
    prescription_id: presc.id,
    exercise_id: exId,
    sort_order: idx
  }));

  const { error: iErr } = await admin.from("prescription_items").insert(items);
  if (iErr) throw new Error(iErr.message);

  return { ok: true };
}

export async function deletePrescriptionAction(password: string, id: string) {
  if (!(await verifyAdmin(password))) throw new Error("Unauthorized");

  const admin = await createAdminClient();
  const { error } = await admin.from("prescriptions").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { ok: true };
}

// ───── 수행 로그 Actions ─────

export async function getLogsAction() {
  const admin = await createAdminClient();
  const { data } = await admin.from("exercise_logs").select(`
    *,
    exercise:exercises(name, body_part),
    prescription:prescriptions(patient_name_input)
  `).order("created_at", { ascending: false });
  return data || [];
}
