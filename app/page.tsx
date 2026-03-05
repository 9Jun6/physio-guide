"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const BODY_PARTS = ["목", "어깨", "허리", "무릎", "발목", "고관절", "팔꿈치", "손목"];

const BODY_PART_ICONS: Record<string, string> = {
  목: "🔵",
  어깨: "🟣",
  허리: "🟠",
  무릎: "🟢",
  발목: "🔴",
  고관절: "🟡",
  팔꿈치: "🔷",
  손목: "🔸",
};

export default function HomePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const saved = Cookies.get("bodyPart");
    if (saved) setSelected(saved);
  }, []);

  const handleSelect = (part: string) => {
    setSelected(part);
    Cookies.set("bodyPart", part, { expires: 30 });
  };

  const handleStart = () => {
    if (selected) router.push(`/exercises?part=${encodeURIComponent(selected)}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏥</div>
          <h1 className="text-3xl font-bold text-slate-800">Physio Guide</h1>
          <p className="text-slate-500 mt-2">불편한 부위를 선택하면<br />맞춤 운동을 안내해 드려요.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6">
          <p className="text-sm font-semibold text-slate-500 mb-4 text-center">어느 부위가 불편하신가요?</p>
          <div className="grid grid-cols-2 gap-3">
            {BODY_PARTS.map((part) => (
              <button
                key={part}
                onClick={() => handleSelect(part)}
                className={`py-4 rounded-2xl text-base font-semibold transition-all active:scale-95 border-2 ${
                  selected === part
                    ? "bg-blue-500 text-white border-blue-500 shadow-md"
                    : "bg-slate-50 text-slate-700 border-slate-100 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                <span className="text-xl block mb-1">{BODY_PART_ICONS[part]}</span>
                {part}
              </button>
            ))}
          </div>

          <button
            onClick={handleStart}
            disabled={!selected}
            className="w-full mt-6 py-4 rounded-2xl bg-blue-500 text-white text-lg font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-600 active:scale-95 transition-all shadow"
          >
            {selected ? `${selected} 운동 보기 →` : "부위를 선택하세요"}
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          선택 정보는 이 기기에만 저장되며 30일 후 자동 삭제됩니다.
        </p>

        <div className="text-center mt-6">
          <a
            href="/admin"
            className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors"
          >
            물리치료사 관리자 페이지
          </a>
        </div>
      </div>
    </main>
  );
}
