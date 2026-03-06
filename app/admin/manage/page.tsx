"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { createClient } from "@/lib/supabase";
import { Exercise, Prescription, ExerciseLog } from "../../types";
import * as actions from "../actions";
import { TabNav, ExerciseCard, PrescriptionCard, LogCard, AdminModal } from "./components";

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

type TabType = "exercises" | "prescriptions" | "logs";

export default function AdminManagePage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [tab, setTab] = useState<TabType>("exercises");
  const [userRole, setUserRole] = useState<string | null>(null);

  // States
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [logs, setLogs] = useState<ExerciseLog[]>([]);
  
  const [filterPart, setFilterPart] = useState("전체");
  const [editTarget, setEditTarget] = useState<Exercise | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [exerciseForm, setExerciseForm] = useState<Omit<Exercise, "id"> | Exercise>(emptyExercise());

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
      setLogs(lg as ExerciseLog[]);
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

  // ───── Exercise Actions ─────
  const handleSaveExercise = async () => {
    if (!editTarget) return;
    setSaving(true);
    try {
      const exerciseData = { ...exerciseForm, id: isNew ? undefined : editTarget.id };
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

  const handleDeleteExercise = async (ex: Exercise) => {
    if (!confirm(`"${ex.name}"을(를) 삭제할까요?`)) return;
    try {
      await actions.deleteExerciseAction(ex.id);
      setMsg("삭제되었습니다.");
      loadData();
    } catch (e: any) {
      setMsg(`오류: ${e.message}`);
    }
  };

  // ───── Prescription Actions ─────
  const handleSavePrescription = async () => {
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

  const handleDeletePrescription = async (p: Prescription) => {
    if (!confirm(`"${p.patient_name_input}"의 처방전을 삭제할까요?`)) return;
    try {
      await actions.deletePrescriptionAction(p.id);
      setMsg("삭제되었습니다.");
      loadData();
    } catch (e: any) {
      setMsg(`오류: ${e.message}`);
    }
  };

  // ───── UI Helpers ─────
  const filteredExercises = filterPart === "전체" ? exercises : exercises.filter((e) => e.body_part === filterPart);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400 font-bold">
      <div className="animate-pulse">PhysioGuide Loading...</div>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 pb-20">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">대시보드</h1>
            <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mt-1">
              {userRole === 'admin' ? "System Admin" : "Professional Therapist"}
            </p>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 rounded-xl bg-white text-slate-600 font-bold text-sm border border-slate-200 shadow-sm hover:bg-slate-50 active:scale-95 transition-all">
            로그아웃
          </button>
        </div>

        <TabNav tab={tab} setTab={setTab} />

        {msg && (
          <div className={`mb-6 px-5 py-3 rounded-2xl text-sm font-bold border animate-in fade-in slide-in-from-top-2 ${
            msg.startsWith("오류:") ? "bg-red-50 text-red-600 border-red-100" : "bg-green-50 text-green-600 border-green-100"
          }`}>
            {msg}
          </div>
        )}

        {/* ───── 운동 관리 탭 ───── */}
        {tab === "exercises" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Master Library ({exercises.length})</p>
              {userRole === "admin" && (
                <button 
                  onClick={() => { setEditTarget({ id: "new" } as Exercise); setIsNew(true); setExerciseForm(emptyExercise()); }}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 active:scale-95 transition-all"
                >
                  + 신규 등록
                </button>
              )}
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {["전체", ...BODY_PARTS].map((p) => (
                <button
                  key={p}
                  onClick={() => setFilterPart(p)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                    filterPart === p ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100" : "bg-white text-slate-500 border-slate-200"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-3">
              {filteredExercises.map((ex) => (
                <ExerciseCard 
                  key={ex.id} 
                  ex={ex} 
                  userRole={userRole} 
                  onEdit={(ex) => { setEditTarget(ex); setIsNew(false); setExerciseForm({ ...ex }); }} 
                  onDelete={handleDeleteExercise} 
                />
              ))}
            </div>
          </div>
        )}

        {/* ───── 처방전 관리 탭 ───── */}
        {tab === "prescriptions" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">My Prescriptions ({prescriptions.length})</p>
              <button 
                onClick={() => setPrescModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-100"
              >
                + 새 처방 발행
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {prescriptions.length === 0 && <p className="text-center py-20 text-slate-400 font-medium">아직 발행한 처방전이 없습니다.</p>}
              {prescriptions.map((p) => (
                <PrescriptionCard key={p.id} p={p} onShowQR={setQrTarget} onDelete={handleDeletePrescription} />
              ))}
            </div>
          </div>
        )}

        {/* ───── 진행 현황 탭 ───── */}
        {tab === "logs" && (
          <div className="space-y-6">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest px-2 text-center">Recent Activities</p>
            <div className="grid grid-cols-1 gap-4">
              {logs.length === 0 && <p className="text-center py-20 text-slate-400 font-medium">수행 데이터가 없습니다.</p>}
              {logs.map((log) => (
                <LogCard key={log.id} log={log} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ───── [모달] 운동 편집 ───── */}
      {editTarget && (
        <AdminModal title={isNew ? "신규 운동 등록" : "운동 정보 수정"} onClose={() => setEditTarget(null)}>
          <div className="space-y-5 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">운동 이름</label>
                <input className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-100 font-bold" value={exerciseForm.name} onChange={(e) => setExerciseForm({ ...exerciseForm, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">부위</label>
                <select className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-100 font-bold appearance-none" value={exerciseForm.body_part} onChange={(e) => setExerciseForm({ ...exerciseForm, body_part: e.target.value })}>
                  {BODY_PARTS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={() => setEditTarget(null)} className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-500 font-bold">취소</button>
              <button onClick={handleSaveExercise} disabled={saving} className="flex-1 py-4 rounded-2xl bg-slate-900 text-white font-bold disabled:opacity-50">{saving ? "저장 중..." : "확인"}</button>
            </div>
          </div>
        </AdminModal>
      )}

      {/* ───── [모달] 새 처방 발행 ───── */}
      {prescModalOpen && (
        <AdminModal title="새 처방전 발행" onClose={() => setPrescModalOpen(false)}>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">환자 성함</label>
              <input className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-100 font-bold" placeholder="홍길동" value={prescForm.patientName} onChange={(e) => setPrescForm({...prescForm, patientName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">운동 선택 ({prescForm.exerciseIds.length})</label>
              <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {exercises.map(ex => (
                  <label key={ex.id} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl hover:bg-blue-50 cursor-pointer transition-colors group">
                    <input type="checkbox" className="w-5 h-5 accent-blue-600 rounded-lg" checked={prescForm.exerciseIds.includes(ex.id)} onChange={() => setPrescForm(prev => ({ ...prev, exerciseIds: prev.exerciseIds.includes(ex.id) ? prev.exerciseIds.filter(id => id !== ex.id) : [...prev.exerciseIds, ex.id] }))} />
                    <span className="text-sm font-bold text-slate-700 group-hover:text-blue-700">{ex.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setPrescModalOpen(false)} className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-500 font-bold">취소</button>
              <button onClick={handleSavePrescription} disabled={saving || !prescForm.patientName || prescForm.exerciseIds.length === 0} className="flex-1 py-4 rounded-2xl bg-blue-600 text-white font-bold disabled:opacity-50">발행하기</button>
            </div>
          </div>
        </AdminModal>
      )}

      {/* ───── [모달] QR 코드 ───── */}
      {qrTarget && (
        <AdminModal title="환자용 QR 코드" onClose={() => setQrTarget(null)}>
          <div className="flex flex-col items-center py-6">
            <div className="p-6 bg-white rounded-[2.5rem] shadow-xl border border-slate-50 mb-6">
              <QRCodeSVG value={`${typeof window !== "undefined" ? window.location.origin : ""}/p/${qrTarget.id}`} size={220} />
            </div>
            <p className="text-sm font-bold text-slate-800 mb-1">{qrTarget.patient_name_input}님 처방전</p>
            <p className="text-[10px] text-slate-400 font-medium break-all text-center max-w-[200px] mb-8">
              이 코드를 스캔하면 즉시 운동 가이드로 연결됩니다.
            </p>
            <button onClick={() => setQrTarget(null)} className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold active:scale-[0.98] transition-all">닫기</button>
          </div>
        </AdminModal>
      )}
    </main>
  );
}
