"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Prescription, PrescriptionItem } from "../../types";

const supabase = createClient();

export default function PatientPrescriptionPage() {
  const params = useParams();
  const token = params.token as string; // UUID from URL
  const router = useRouter();
  
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPrescription = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Fetch prescription with items and nested exercise details in one go
    const { data, error: supabaseError } = await supabase
      .from("prescriptions")
      .select(`
        *,
        items:prescription_items(
          *,
          exercise:exercises(*)
        )
      `)
      .eq("id", token)
      .single();

    if (supabaseError) {
      console.error("Supabase error:", supabaseError);
      setError("처방전을 찾을 수 없거나 불러오는 중 오류가 발생했습니다.");
    } else {
      setPrescription(data as Prescription);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    if (token) {
      loadPrescription();
    }
  }, [token, loadPrescription]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-slate-400 font-medium">처방전 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (error || !prescription) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 px-4 text-center">
        <div>
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-xl font-bold text-slate-700 mb-2">처방전을 찾을 수 없습니다</h1>
          <p className="text-slate-500 text-sm mb-6">{error || "링크가 올바른지 확인해 주세요."}</p>
          <button 
            onClick={() => router.push("/")}
            className="px-6 py-2 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
          >
            홈으로 가기
          </button>
        </div>
      </div>
    );
  }

  const items = prescription.items || [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 px-4 py-10 pb-20">
      <div className="max-w-lg mx-auto">
        {/* 헤더 */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-3 shadow-sm">
            🛡️ 재활 가이드
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            {prescription.patient_name_input}님의 운동 처방
          </h1>
          {prescription.notes && (
            <div className="mt-3 bg-white/60 backdrop-blur-sm border border-blue-100 rounded-2xl px-5 py-4 shadow-sm">
              <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">치료사 한마디</p>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                {prescription.notes}
              </p>
            </div>
          )}
          <div className="flex items-center justify-between mt-4 px-1">
            <p className="text-xs text-slate-400">
              총 {items.length}개 운동 &nbsp;·&nbsp;{" "}
              {new Date(prescription.created_at).toLocaleDateString("ko-KR")} 처방
            </p>
            {prescription.is_claimed && (
              <span className="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-bold">수락됨</span>
            )}
          </div>
        </div>

        {/* 운동 목록 */}
        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-slate-200">
              <p className="text-slate-400 text-sm">처방된 운동이 없습니다.</p>
            </div>
          ) : (
            items.sort((a, b) => a.sort_order - b.sort_order).map((item) => {
              const ex = item.exercise;
              if (!ex) return null;

              return (
                <button
                  key={item.id}
                  onClick={() => router.push(`/exercise/${ex.id}?prescriptionId=${prescription.id}&back=/p/${token}`)}
                  className="group w-full bg-white rounded-3xl shadow-sm p-5 text-left hover:shadow-md hover:translate-y-[-2px] active:scale-[0.98] transition-all border border-slate-100"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] bg-blue-50 text-blue-600 px-2 py-1 rounded-lg font-bold uppercase tracking-tight">
                        {ex.body_part}
                      </span>
                      <span className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">
                        {ex.name}
                      </span>
                    </div>
                    <div className="text-slate-300 group-hover:text-blue-400 transition-colors">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  
                  <p className="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                    {item.item_notes || ex.description}
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl text-xs font-bold">
                      <span className="opacity-60">목표</span>
                      <span>{item.custom_reps || ex.default_reps}회 × {item.custom_sets || ex.default_sets}세트</span>
                    </div>
                    {ex.difficulty && (
                      <div className="flex items-center gap-1 bg-slate-50 text-slate-500 px-3 py-1.5 rounded-xl text-xs font-medium">
                        <span className="opacity-60">난이도</span>
                        <span className="text-amber-500">{"★".repeat(ex.difficulty)}</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* 푸터 안내 */}
        <div className="mt-10 text-center">
          <p className="text-xs text-slate-400">
            운동 중 통증이 발생하면 즉시 중단하고 치료사에게 문의하세요.
          </p>
        </div>
      </div>
    </main>
  );
}
