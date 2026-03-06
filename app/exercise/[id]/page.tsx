"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Exercise, PrescriptionItem } from "../../types";
import ExerciseSVG from "../../components/ExerciseSVG";
import BreathingTimer from "../../components/BreathingTimer";

const supabase = createClient();

function ExerciseDetail() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [prescItem, setPrescItem] = useState<PrescriptionItem | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Log state
  const [showLogModal, setShowLogModal] = useState(false);
  const [painBefore, setPainBefore] = useState(3);
  const [painAfter, setPainAfter] = useState(3);
  const [feedback, setFeedback] = useState("");
  const [savingLog, setSavingLog] = useState(false);

  const prescriptionId = searchParams.get("prescriptionId");
  const backHref = searchParams.get("back") || "/exercises";

  const loadData = useCallback(async () => {
    setLoading(true);
    
    // 1. Fetch Exercise
    const { data: exData, error: exError } = await supabase
      .from("exercises")
      .select("*")
      .eq("id", id)
      .single();

    if (exError || !exData) {
      console.error("Exercise not found");
      router.push("/");
      return;
    }
    setExercise(exData as Exercise);

    // 2. Fetch Prescription Item if exists
    if (prescriptionId) {
      const { data: pItemData } = await supabase
        .from("prescription_items")
        .select("*")
        .eq("prescription_id", prescriptionId)
        .eq("exercise_id", id)
        .single();
      
      if (pItemData) {
        setPrescItem(pItemData as PrescriptionItem);
      }
    }
    
    setLoading(false);
  }, [id, prescriptionId, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleComplete = () => {
    setShowLogModal(true);
  };

  const saveLog = async () => {
    if (!exercise) return;
    setSavingLog(true);

    const { error } = await supabase.from("exercise_logs").insert([
      {
        exercise_id: exercise.id,
        prescription_id: prescriptionId || null,
        completed_reps: prescItem?.custom_reps || exercise.default_reps,
        completed_sets: prescItem?.custom_sets || exercise.default_sets,
        pain_score_before: painBefore,
        pain_score_after: painAfter,
        feedback: feedback,
      },
    ]);

    setSavingLog(false);
    if (error) {
      alert(`로그 저장 중 오류가 발생했습니다: ${error.message}`);
    } else {
      alert("운동 기록이 저장되었습니다!");
      router.push(backHref);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
        <div className="text-slate-400 animate-pulse font-medium">운동 정보를 불러오는 중...</div>
      </div>
    );
  }

  if (!exercise) return null;

  const reps = prescItem?.custom_reps || exercise.default_reps;
  const sets = prescItem?.custom_sets || exercise.default_sets;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 px-4 py-10 pb-24">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href={backHref}
            className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-slate-400 hover:text-slate-600 transition-colors"
          >
            ←
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-800 leading-tight">{exercise.name}</h1>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{exercise.body_part}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          {/* SVG 일러스트 */}
          <div className="bg-slate-50 p-8 flex justify-center border-b border-slate-50">
            <ExerciseSVG svgKey={exercise.svg_key} className="w-56 h-56 drop-shadow-md" />
          </div>

          <div className="p-6 space-y-8">
            {/* 정보 및 설명 */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-1.5">
                  <span className="opacity-60 text-[10px] uppercase">Reps</span>
                  {reps}회
                </div>
                <div className="bg-slate-50 text-slate-600 px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-1.5">
                  <span className="opacity-60 text-[10px] uppercase">Sets</span>
                  {sets}세트
                </div>
                {prescItem && (
                  <div className="bg-amber-50 text-amber-600 px-3 py-1.5 rounded-xl text-[11px] font-bold border border-amber-100">
                    맞춤 처방 적용됨
                  </div>
                )}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                {prescItem?.item_notes || exercise.description}
              </p>
            </div>

            {/* 운동 가이드 & 타이머 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-slate-800">운동 가이드</h2>
                <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Breathing Timer</span>
              </div>
              
              <BreathingTimer
                breathing={exercise.breathing}
                reps={reps}
                sets={sets}
                steps={exercise.steps}
              />
            </div>

            {/* 완료 버튼 (타이머와 별개로 수동 완료 가능하게) */}
            <button
              onClick={handleComplete}
              className="w-full py-4 rounded-2xl bg-slate-800 text-white font-bold hover:bg-slate-900 active:scale-[0.98] transition-all shadow-lg shadow-slate-200"
            >
              운동 완료 기록하기
            </button>
          </div>
        </div>
      </div>

      {/* ───── 로그 기록 모달 ───── */}
      {showLogModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 px-4 pb-10 sm:pb-0">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 space-y-6 animate-in slide-in-from-bottom-10 duration-300">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <h2 className="text-2xl font-bold text-slate-800">운동 어떠셨나요?</h2>
              <p className="text-slate-400 text-sm mt-1">오늘의 통증 정도와 피드백을 남겨주세요.</p>
            </div>

            <div className="space-y-6">
              {/* 통증 점수 (Before) */}
              <div>
                <label className="text-sm font-bold text-slate-700 flex justify-between mb-3">
                  <span>운동 전 통증</span>
                  <span className="text-blue-500">{painBefore}점</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  value={painBefore}
                  onChange={(e) => setPainBefore(Number(e.target.value))}
                />
                <div className="flex justify-between text-[10px] text-slate-300 font-bold mt-2 px-1">
                  <span>통증 없음 (0)</span>
                  <span>극심한 통증 (10)</span>
                </div>
              </div>

              {/* 통증 점수 (After) */}
              <div>
                <label className="text-sm font-bold text-slate-700 flex justify-between mb-3">
                  <span>운동 후 통증</span>
                  <span className="text-blue-500">{painAfter}점</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  value={painAfter}
                  onChange={(e) => setPainAfter(Number(e.target.value))}
                />
                <div className="flex justify-between text-[10px] text-slate-300 font-bold mt-2 px-1">
                  <span>통증 없음 (0)</span>
                  <span>극심한 통증 (10)</span>
                </div>
              </div>

              {/* 피드백 */}
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">치료사에게 남길 말</label>
                <textarea
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-100 text-slate-700 text-sm resize-none"
                  rows={3}
                  placeholder="예: 운동 중에 무릎에서 소리가 났어요."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowLogModal(false)}
                className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-500 font-bold hover:bg-slate-200 transition-colors"
              >
                취소
              </button>
              <button
                onClick={saveLog}
                disabled={savingLog}
                className="flex-1 py-4 rounded-2xl bg-blue-500 text-white font-bold hover:bg-blue-600 disabled:opacity-50 transition-colors shadow-lg shadow-blue-100"
              >
                {savingLog ? "저장 중..." : "기록 완료"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function ExerciseDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400">
        로딩 중...
      </div>
    }>
      <ExerciseDetail />
    </Suspense>
  );
}
