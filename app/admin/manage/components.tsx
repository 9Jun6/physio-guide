"use client";

import { Exercise, Prescription, ExerciseLog } from "../../types";
import { QRCodeSVG } from "qrcode.react";

// ───── 탭 내비게이션 ─────
export function TabNav({ tab, setTab }: { tab: string, setTab: (t: any) => void }) {
  const tabs = [
    { id: "exercises", label: "운동 관리" },
    { id: "prescriptions", label: "처방전 관리" },
    { id: "logs", label: "진행 현황" }
  ];

  return (
    <div className="flex gap-1 bg-slate-200 rounded-xl p-1 mb-6">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => setTab(t.id)}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
            tab === t.id ? "bg-white text-slate-800 shadow" : "text-slate-500"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ───── 운동 카드 ─────
export function ExerciseCard({ 
  ex, 
  userRole, 
  onEdit, 
  onDelete 
}: { 
  ex: Exercise, 
  userRole: string | null, 
  onEdit: (ex: Exercise) => void, 
  onDelete: (ex: Exercise) => void 
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-tight">
          {ex.body_part}
        </span>
        <h3 className="font-bold text-slate-800 mt-1 truncate">{ex.name}</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          {ex.default_reps}회 × {ex.default_sets}세트
        </p>
      </div>
      {userRole === "admin" && (
        <div className="flex gap-2">
          <button onClick={() => onEdit(ex)} className="px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 text-xs font-bold hover:bg-blue-50 hover:text-blue-600 transition-colors">수정</button>
          <button onClick={() => onDelete(ex)} className="px-3 py-1.5 rounded-lg bg-slate-50 text-red-500 text-xs font-bold hover:bg-red-50 transition-colors">삭제</button>
        </div>
      )}
    </div>
  );
}

// ───── 처방전 카드 ─────
export function PrescriptionCard({ 
  p, 
  onShowQR, 
  onDelete 
}: { 
  p: Prescription, 
  onShowQR: (p: Prescription) => void, 
  onDelete: (p: Prescription) => void 
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800 text-lg">{p.patient_name_input}</span>
          <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-bold">
            {p.is_claimed ? "수락됨" : "대기중"}
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          운동 {(p.items || []).length}개 &nbsp;·&nbsp; {new Date(p.created_at).toLocaleDateString("ko-KR")} 처방
        </p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button onClick={() => onShowQR(p)} className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition-colors">QR</button>
        <button onClick={() => onDelete(p)} className="px-3 py-1.5 rounded-lg bg-slate-50 text-red-500 text-xs font-bold hover:bg-red-50 transition-colors">삭제</button>
      </div>
    </div>
  );
}

// ───── 수행 로그 카드 ─────
export function LogCard({ log }: { log: ExerciseLog }) {
  const painDiff = log.pain_score_after - log.pain_score_before;
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="font-bold text-slate-800">{log.prescription?.patient_name_input || "익명"}</span>
          <p className="text-[10px] text-slate-400">
            {new Date(log.created_at).toLocaleString("ko-KR", { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-bold uppercase">
          {log.exercise?.body_part}
        </span>
      </div>
      
      <div className="text-sm font-medium text-slate-700 mb-3">
        {log.exercise?.name} <span className="text-slate-400 font-normal ml-1">({log.completed_reps}회 × {log.completed_sets}세트)</span>
      </div>

      <div className="bg-slate-50 rounded-xl p-3 flex justify-around items-center text-center">
        <div>
          <p className="text-[10px] text-slate-400 font-bold mb-1 uppercase">Before</p>
          <p className="text-lg font-black text-slate-700">{log.pain_score_before}</p>
        </div>
        <div className="text-slate-300">→</div>
        <div>
          <p className="text-[10px] text-slate-400 font-bold mb-1 uppercase">After</p>
          <div className="flex items-center gap-1 justify-center">
            <p className="text-lg font-black text-slate-700">{log.pain_score_after}</p>
            {painDiff !== 0 && (
              <span className={`text-[10px] font-black ${painDiff < 0 ? "text-green-500" : "text-red-500"}`}>
                ({painDiff > 0 ? "+" : ""}{painDiff})
              </span>
            )}
          </div>
        </div>
      </div>
      
      {log.feedback && (
        <div className="mt-3 text-xs text-slate-500 italic bg-blue-50/30 p-2 rounded-lg border border-blue-50/50">
          "{log.feedback}"
        </div>
      )}
    </div>
  );
}

// ───── 공통 모달 프레임 ─────
export function AdminModal({ 
  title, 
  children, 
  onClose 
}: { 
  title: string, 
  children: React.ReactNode, 
  onClose: () => void 
}) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 px-4 py-6" onClick={onClose}>
      <div 
        className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-8 pt-8 pb-4">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h2>
        </div>
        <div className="px-8 pb-8 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
