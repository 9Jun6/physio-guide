"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { createClient } from "@/lib/supabase";
import { Exercise, Prescription } from "../../types";
import * as actions from "../actions";

const BODY_PARTS = ["목", "어깨", "허리", "무릎", "발목", "고관절", "팔꿈치", "손목"];

const emptyExercise = (): Omit<Exercise, "id"> => ({
  name: "",
  body_part: "목",
  description: "",
  steps: [""],
  breathing: { inhale: 4, hold: 2, exhale: 4 },
  default_reps: 10,
  default_sets: 3,
  svg_key: "",
});

export default function AdminManagePage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [tab, setTab] = useState<"exercises" | "prescriptions" | "logs">("exercises");
  const [userRole, setUserRole] = useState<string | null>(null);

  // States
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  
  const [filterPart, setFilterPart] = useState("전체");
  const [editTarget, setEditTarget] = useState<Exercise | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState<Omit<Exercise, "id">>(emptyExercise());

  const [prescModalOpen, setPrescModalOpen] = useState(false);
  const [prescForm, setPrescForm] = useState({ patientName: "", notes: "", exerciseIds: [] as string[] });
  const [qrTarget, setQrTarget] = useState<Prescription | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const loadData = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/admin"); return; }

      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      setUserRole(profile?.role || "therapist");

      const [exs, prescs, lg] = await Promise.all([
        actions.getExercisesAction(),
        actions.getPrescriptionsAction(),
        actions.getLogsAction()
      ]);

      setExercises(exs as Exercise[]);
      setPrescriptions(prescs as Prescription[]);
      setLogs(lg);
    } catch (e: any) {
      setMsg(`오류: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, [router, supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin");
  };

  // Exercise Actions
  const handleSave = async () => {
    if (!editTarget) return;
    setSaving(true);
    try {
      const exerciseData = { ...form, id: isNew ? undefined : editTarget.id };
      await actions.saveExerciseAction(exerciseData);
      setMsg(isNew ? "운동이 추가되었습니다." : "수정되었습니다.");
      setEditTarget(null);
      loadData();
    } catch (e: any) {
      setMsg(`오류: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (ex: Exercise) => {
    if (!confirm(`"${ex.name}"을(를) 삭제할까요?`)) return;
    setSaving(true);
    try {
      await actions.deleteExerciseAction(ex.id);
      setMsg("삭제되었습니다.");
      loadData();
    } catch (e: any) {
      setMsg(`오류: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Prescription Actions
  const handlePrescSave = async () => {
    if (!prescForm.patientName || prescForm.exerciseIds.length === 0) return;
    setSaving(true);
    try {
      await actions.createPrescriptionAction(prescForm);
      setPrescModalOpen(false);
      setPrescForm({ patientName: "", notes: "", exerciseIds: [] });
      setMsg("처방전이 생성되었습니다.");
      loadData();
    } catch (e: any) {
      setMsg(`오류: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handlePrescDelete = async (p: Prescription) => {
    if (!confirm(`"${p.patient_name_input}"의 처방전을 삭제할까요?`)) return;
    setSaving(true);
    try {
      await actions.deletePrescriptionAction(p.id);
      setMsg("삭제되었습니다.");
      loadData();
    } catch (e: any) {
      setMsg(`오류: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  const filtered =
    filterPart === "전체" ? exercises : exercises.filter((e) => e.body_part === filterPart);

  const prescriptionUrl = (p: Prescription) =>
    typeof window !== "undefined"
      ? `${window.location.origin}/p/${p.id}`
      : `/p/${p.id}`;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400">
        데이터 로딩 중...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">관리자 대시보드</h1>
            <p className="text-xs text-slate-400 font-medium">{userRole === 'admin' ? "사이트 관리자 모드" : "치료사 모드"}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-white text-slate-600 font-semibold border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all shadow-sm"
          >
            로그아웃
          </button>
        </div>

        <div className="flex gap-1 bg-slate-200 rounded-xl p-1 mb-6">
          <button onClick={() => setTab("exercises")} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "exercises" ? "bg-white text-slate-800 shadow" : "text-slate-500"}`}>운동 관리</button>
          <button onClick={() => setTab("prescriptions")} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "prescriptions" ? "bg-white text-slate-800 shadow" : "text-slate-500"}`}>처방전 관리</button>
          <button onClick={() => setTab("logs")} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "logs" ? "bg-white text-slate-800 shadow" : "text-slate-500"}`}>진행 현황</button>
        </div>

        {msg && (
          <div className={`mb-4 px-4 py-2 rounded-xl text-sm font-medium border ${msg.startsWith("오류:") ? "bg-red-50 text-red-700 border-red-200" : "bg-green-50 text-green-700 border-green-200"}`}>
            {msg}
          </div>
        )}

        {/* ───── 운동 관리 탭 ───── */}
        {tab === "exercises" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-500 text-sm">총 {exercises.length}개</p>
              {userRole === "admin" && (
                <button onClick={() => { setEditTarget({ id: "new" } as Exercise); setIsNew(true); setForm(emptyExercise()); }} className="px-4 py-2 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 active:scale-95 transition-all">+ 추가</button>
              )}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
              {["전체", ...BODY_PARTS].map((p) => (
                <button key={p} onClick={() => setFilterPart(p)} className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${filterPart === p ? "bg-blue-500 text-white" : "bg-white text-slate-600 border border-slate-200"}`}>{p}</button>
              ))}
            </div>
            <div className="space-y-3">
              {filtered.map((ex) => (
                <div key={ex.id} className="bg-white rounded-2xl shadow p-4 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase">{ex.body_part}</span>
                    <h3 className="font-bold text-slate-800 mt-1">{ex.name}</h3>
                    <p className="text-xs text-slate-400">{ex.default_reps}회 × {ex.default_sets}세트</p>
                  </div>
                  {userRole === "admin" && (
                    <div className="flex gap-2">
                      <button onClick={() => { setEditTarget(ex); setIsNew(false); setForm({ ...ex }); }} className="px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 text-xs font-bold">수정</button>
                      <button onClick={() => handleDelete(ex)} className="px-3 py-1.5 rounded-lg bg-slate-50 text-red-500 text-xs font-bold">삭제</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* ───── 처방전 관리 탭 ───── */}
        {tab === "prescriptions" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-500 text-sm">내 처방 {prescriptions.length}개</p>
              <button onClick={() => { setPrescModalOpen(true); setPrescForm({ patientName: "", notes: "", exerciseIds: [] }); }} className="px-4 py-2 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 active:scale-95 transition-all">+ 새 처방</button>
            </div>
            <div className="space-y-3">
              {prescriptions.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl shadow p-4 flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-slate-800">{p.patient_name_input}</span>
                    <p className="text-xs text-slate-400 mt-1">운동 {(p.items || []).length}개 &nbsp;·&nbsp; {new Date(p.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => setQrTarget(p)} className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold">QR</button>
                    <button onClick={() => handlePrescDelete(p)} className="px-3 py-1.5 rounded-lg bg-slate-50 text-red-500 text-xs font-bold">삭제</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ───── 진행 현황 탭 ───── */}
        {tab === "logs" && (
          <div className="space-y-4">
            {logs.length === 0 && <p className="text-center py-20 text-slate-400">데이터가 없습니다.</p>}
            {logs.map((log) => {
              const painDiff = log.pain_score_after - log.pain_score_before;
              return (
                <div key={log.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold text-slate-800">{log.prescription?.patient_name_input || "익명"}</span>
                    <span className="text-slate-400 text-xs">{new Date(log.created_at).toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-slate-600 mb-3">{log.exercise?.name} ({log.completed_reps}회 × {log.completed_sets}세트)</div>
                  <div className="bg-slate-50 rounded-xl p-3 flex justify-between items-center text-center">
                    <div><p className="text-[10px] text-slate-400 mb-1">전</p><p className="font-bold">{log.pain_score_before}</p></div>
                    <div className="text-slate-300">→</div>
                    <div><p className="text-[10px] text-slate-400 mb-1">후</p><p className="font-bold">{log.pain_score_after} {painDiff !== 0 && <span className={`text-[10px] ${painDiff < 0 ? "text-green-500" : "text-red-500"}`}>({painDiff > 0 ? "+" : ""}{painDiff})</span>}</p></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ───── 모달: QR 코드 ───── */}
      {qrTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" onClick={() => setQrTarget(null)}>
          <div className="bg-white rounded-3xl p-8 max-w-xs w-full text-center" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-slate-800 mb-4">{qrTarget.patient_name_input}님 QR코드</h2>
            <div className="flex justify-center mb-6"><QRCodeSVG value={prescriptionUrl(qrTarget)} size={200} /></div>
            <button onClick={() => setQrTarget(null)} className="w-full py-3 rounded-xl bg-slate-100 text-slate-600 font-bold">닫기</button>
          </div>
        </div>
      )}

      {/* ───── 모달: 새 처방 (간략화) ───── */}
      {prescModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 space-y-4">
            <h2 className="text-xl font-bold">새 처방전</h2>
            <input className="w-full p-3 bg-slate-50 rounded-xl" placeholder="환자 이름" value={prescForm.patientName} onChange={(e) => setPrescForm({...prescForm, patientName: e.target.value})} />
            <div className="max-h-60 overflow-y-auto space-y-2">
              {exercises.map(ex => (
                <label key={ex.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg">
                  <input type="checkbox" checked={prescForm.exerciseIds.includes(ex.id)} onChange={() => setPrescForm(prev => ({ ...prev, exerciseIds: prev.exerciseIds.includes(ex.id) ? prev.exerciseIds.filter(id => id !== ex.id) : [...prev.exerciseIds, ex.id] }))} />
                  <span className="text-sm">{ex.name}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setPrescModalOpen(false)} className="flex-1 py-3 rounded-xl bg-slate-100">취소</button>
              <button onClick={handlePrescSave} disabled={saving} className="flex-1 py-3 rounded-xl bg-blue-500 text-white font-bold">생성</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
