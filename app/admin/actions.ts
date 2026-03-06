"use server";

import { createServerSupabaseClient, createAdminClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

// 헬퍼: 현재 유저 정보 및 역할 확인
async function getAuthenticatedUser() {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) throw new Error("로그인이 필요합니다.");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || (profile.role !== "admin" && profile.role !== "therapist")) {
    throw new Error("권한이 없습니다.");
  }

  return { user, role: profile.role };
}

// ───── 운동 관리 Actions (Admin 전용) ─────

export async function getExercisesAction() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("exercises").select("*").order("created_at", { ascending: false });
  return data || [];
}

export async function saveExerciseAction(exercise: any) {
  const { role } = await getAuthenticatedUser();
  if (role !== "admin") throw new Error("운동 마스터 데이터는 관리자만 수정 가능합니다.");

  const admin = await createAdminClient(); // Service Role 사용
  const { error } = await admin.from("exercises").upsert(exercise);
  if (error) throw new Error(error.message);
  
  revalidatePath("/admin/manage");
  return { ok: true };
}

export async function deleteExerciseAction(id: string) {
  const { role } = await getAuthenticatedUser();
  if (role !== "admin") throw new Error("삭제 권한이 없습니다.");

  const admin = await createAdminClient();
  const { error } = await admin.from("exercises").delete().eq("id", id);
  if (error) throw new Error(error.message);
  
  revalidatePath("/admin/manage");
  return { ok: true };
}

// ───── 처방전 관리 Actions (치료사 본인 것만) ─────

export async function getPrescriptionsAction() {
  const { user, role } = await getAuthenticatedUser();
  const supabase = await createServerSupabaseClient();
  
  let query = supabase.from("prescriptions").select(`
    *,
    items:prescription_items(
      *,
      exercise:exercises(*)
    )
  `);

  // 관리자가 아니면 본인이 처방한 것만 조회
  if (role !== "admin") {
    query = query.eq("therapist_id", user.id);
  }

  const { data } = await query.order("created_at", { ascending: false });
  return data || [];
}

export async function createPrescriptionAction(payload: any) {
  const { user } = await getAuthenticatedUser();
  const admin = await createAdminClient();
  
  // 1. 처방전 생성 (therapist_id 할당)
  const { data: presc, error: pErr } = await admin.from("prescriptions").insert([{
    therapist_id: user.id,
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

  revalidatePath("/admin/manage");
  return { ok: true };
}

export async function deletePrescriptionAction(id: string) {
  const { user, role } = await getAuthenticatedUser();
  const admin = await createAdminClient();

  // 본인 것인지 확인 (관리자는 패스)
  if (role !== "admin") {
    const { data } = await admin.from("prescriptions").select("therapist_id").eq("id", id).single();
    if (data?.therapist_id !== user.id) throw new Error("본인의 처방전만 삭제 가능합니다.");
  }

  const { error } = await admin.from("prescriptions").delete().eq("id", id);
  if (error) throw new Error(error.message);
  
  revalidatePath("/admin/manage");
  return { ok: true };
}

// ───── 수행 로그 Actions ─────

export async function getLogsAction() {
  const { user, role } = await getAuthenticatedUser();
  const admin = await createAdminClient();
  
  let query = admin.from("exercise_logs").select(`
    *,
    exercise:exercises(name, body_part),
    prescription:prescriptions(patient_name_input, therapist_id)
  `);

  const { data } = await query.order("created_at", { ascending: false });
  
  // 서버 사이드 필터링: 치료사는 본인이 처방한 로그만 볼 수 있음
  if (role !== "admin") {
    return (data || []).filter(log => (log.prescription as any)?.therapist_id === user.id);
  }

  return data || [];
}
