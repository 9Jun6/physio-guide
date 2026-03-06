"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { Exercise, ExercisesData } from "../../types";
import ExerciseSVG from "../../components/ExerciseSVG";
import BreathingTimer from "../../components/BreathingTimer";
import dynamic from "next/dynamic";

const KneeChest3D = dynamic(() => import("../../components/KneeChest3D"), { ssr: false });

function ExerciseDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);

  const backParam = searchParams.get("back");
  const part = Cookies.get("bodyPart") ?? "";
  const backHref = backParam ?? `/exercises?part=${encodeURIComponent(part)}`;

  useEffect(() => {
    fetch("/api/exercises")
      .then((r) => r.json())
      .then((data: ExercisesData) => {
        const found = data.exercises.find((e) => e.id === id);
        if (!found) { router.push("/"); return; }
        setExercise(found);
        setLoading(false);
      });
  }, [id, router]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
        <div className="text-slate-400 animate-pulse">불러오는 중...</div>
      </div>
    );

  if (!exercise) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 px-4 py-10">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href={backHref}
            className="text-slate-400 hover:text-slate-600 text-2xl"
          >
            ←
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">{exercise.name}</h1>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6 space-y-6">
          {/* 운동 일러스트 */}
          <div className="bg-slate-50 rounded-2xl p-4 flex justify-center">
            {exercise.id === "back-1" ? (
              <KneeChest3D />
            ) : (
              <ExerciseSVG svgKey={exercise.svgKey} className="w-52 h-52" />
            )}
          </div>

          {/* 설명 */}
          <div>
            <p className="text-slate-600 leading-relaxed">{exercise.description}</p>
            <div className="flex gap-2 mt-3">
              <span className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
                {exercise.reps}회
              </span>
              <span className="text-sm bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                {exercise.sets}세트
              </span>
              <span className="text-sm bg-amber-50 text-amber-600 px-3 py-1 rounded-full">
                {exercise.bodyPart}
              </span>
            </div>
          </div>

          {/* 단계별 운동 + 호흡 타이머 통합 */}
          <div>
            <h2 className="font-bold text-slate-700 mb-1">운동 가이드</h2>
            <p className="text-xs text-slate-400 mb-3">
              시작하면 각 단계마다 호흡에 맞춰 자동으로 안내해 드려요.
            </p>
            <BreathingTimer
              breathing={exercise.breathing}
              reps={exercise.reps}
              sets={exercise.sets}
              steps={exercise.steps}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ExerciseDetailPage() {
  return (
    <Suspense>
      <ExerciseDetail />
    </Suspense>
  );
}
