"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { Exercise, ExercisesData } from "../types";

function ExerciseList() {
  const router = useRouter();
  const params = useSearchParams();
  const part = params.get("part") ?? Cookies.get("bodyPart") ?? "";

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!part) { router.push("/"); return; }
    Cookies.set("bodyPart", part, { expires: 30 });

    fetch("/api/exercises")
      .then((r) => r.json())
      .then((data: ExercisesData) => {
        setExercises(data.exercises.filter((e) => e.bodyPart === part));
        setLoading(false);
      });
  }, [part, router]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
        <div className="text-slate-400 text-lg animate-pulse">불러오는 중...</div>
      </div>
    );

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 px-4 py-10">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/" className="text-slate-400 hover:text-slate-600 text-2xl">←</Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{part} 운동</h1>
            <p className="text-slate-500 text-sm">{exercises.length}개의 운동이 있어요</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {exercises.map((ex) => (
            <Link key={ex.id} href={`/exercise/${ex.id}`}>
              <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-4 hover:shadow-md active:scale-[0.98] transition-all cursor-pointer">
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-slate-800">{ex.name}</h2>
                  <p className="text-slate-500 text-sm mt-1 line-clamp-2">{ex.description}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">{ex.reps}회</span>
                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{ex.sets}세트</span>
                  </div>
                </div>
                <span className="text-slate-300 text-xl">›</span>
              </div>
            </Link>
          ))}
        </div>

        {exercises.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <div className="text-4xl mb-3">🔍</div>
            <p>등록된 운동이 없습니다.</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function ExercisesPage() {
  return (
    <Suspense>
      <ExerciseList />
    </Suspense>
  );
}
