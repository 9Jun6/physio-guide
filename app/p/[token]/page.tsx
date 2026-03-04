"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Exercise } from "../../types";

interface Prescription {
  id: string;
  token: string;
  patientName: string;
  notes: string;
  exerciseIds: string[];
  createdAt: string;
}

export default function PatientPrescriptionPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/prescriptions?token=${token}`).then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      }),
      fetch("/api/exercises").then((r) => r.json()),
    ])
      .then(([presc, exData]) => {
        setPrescription(presc);
        const prescribed = exData.exercises.filter((e: Exercise) =>
          presc.exerciseIds.includes(e.id)
        );
        setExercises(prescribed);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
        <div className="text-slate-400 animate-pulse">불러오는 중...</div>
      </div>
    );
  }

  if (notFound || !prescription) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">404</div>
          <h1 className="text-xl font-bold text-slate-700 mb-2">처방전을 찾을 수 없습니다</h1>
          <p className="text-slate-500 text-sm">링크가 올바른지 확인해 주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 px-4 py-10">
      <div className="max-w-lg mx-auto">
        {/* 헤더 */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            물리치료 처방전
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            {prescription.patientName}님의 운동 처방
          </h1>
          {prescription.notes && (
            <p className="mt-2 text-sm text-slate-500 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
              {prescription.notes}
            </p>
          )}
          <p className="text-xs text-slate-400 mt-2">
            총 {exercises.length}개 운동 &nbsp;·&nbsp;{" "}
            {new Date(prescription.createdAt).toLocaleDateString("ko-KR")} 처방
          </p>
        </div>

        {/* 운동 목록 */}
        <div className="space-y-3">
          {exercises.map((ex) => (
            <button
              key={ex.id}
              onClick={() => router.push(`/exercise/${ex.id}?back=/p/${token}`)}
              className="w-full bg-white rounded-2xl shadow p-4 text-left hover:shadow-md active:scale-[0.99] transition-all"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                  {ex.bodyPart}
                </span>
                <span className="font-bold text-slate-800">{ex.name}</span>
              </div>
              <p className="text-slate-500 text-sm truncate">{ex.description}</p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                  {ex.reps}회
                </span>
                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                  {ex.sets}세트
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
