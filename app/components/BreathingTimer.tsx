"use client";

import { useEffect, useState, useCallback } from "react";
import { Breathing } from "../types";

type Phase = "inhale" | "hold" | "exhale" | "ready";

const phaseLabel: Record<Phase, string> = {
  ready: "준비",
  inhale: "숨을 들이쉬세요",
  hold: "참으세요",
  exhale: "천천히 내쉬세요",
};

const phaseColor: Record<Phase, string> = {
  ready: "text-slate-400",
  inhale: "text-blue-500",
  hold: "text-amber-500",
  exhale: "text-emerald-500",
};

const phaseBg: Record<Phase, string> = {
  ready: "bg-slate-100",
  inhale: "bg-blue-50 border-blue-200",
  hold: "bg-amber-50 border-amber-200",
  exhale: "bg-emerald-50 border-emerald-200",
};

export default function BreathingTimer({
  breathing,
  reps,
  sets,
}: {
  breathing: Breathing;
  reps: number;
  sets: number;
}) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [countdown, setCountdown] = useState(0);
  const [currentRep, setCurrentRep] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);

  const totalDuration = breathing.inhale + breathing.hold + breathing.exhale;

  const getSequence = useCallback((): Array<{ phase: Phase; duration: number }> => {
    const seq: Array<{ phase: Phase; duration: number }> = [
      { phase: "inhale", duration: breathing.inhale },
    ];
    if (breathing.hold > 0) seq.push({ phase: "hold", duration: breathing.hold });
    seq.push({ phase: "exhale", duration: breathing.exhale });
    return seq;
  }, [breathing]);

  useEffect(() => {
    if (!running) return;

    const sequence = getSequence();
    let seqIdx = 0;
    let timeLeft = sequence[0].duration;
    let rep = 1;
    let set = currentSet;

    setPhase(sequence[0].phase);
    setCountdown(timeLeft);
    setProgress(0);

    const tick = setInterval(() => {
      timeLeft -= 1;

      const elapsed =
        sequence.slice(0, seqIdx).reduce((a, b) => a + b.duration, 0) +
        (sequence[seqIdx].duration - timeLeft);
      setProgress((elapsed / totalDuration) * 100);
      setCountdown(timeLeft);

      if (timeLeft <= 0) {
        seqIdx++;
        if (seqIdx >= sequence.length) {
          seqIdx = 0;
          rep++;
          setCurrentRep(rep - 1);

          if (rep > reps) {
            if (set >= sets) {
              clearInterval(tick);
              setRunning(false);
              setDone(true);
              setPhase("ready");
              return;
            }
            set++;
            setCurrentSet(set);
            rep = 1;
          }
        }
        setPhase(sequence[seqIdx].phase);
        timeLeft = sequence[seqIdx].duration;
        setCountdown(timeLeft);
        setProgress(0);
      }
    }, 1000);

    return () => clearInterval(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const handleStart = () => {
    setDone(false);
    setCurrentRep(0);
    setCurrentSet(1);
    setRunning(true);
  };

  const handleStop = () => {
    setRunning(false);
    setPhase("ready");
    setCountdown(0);
    setProgress(0);
    setCurrentRep(0);
    setCurrentSet(1);
  };

  return (
    <div className="mt-6 space-y-4">
      <div
        className={`rounded-2xl border-2 p-6 text-center transition-all duration-500 ${phaseBg[phase]}`}
      >
        <div className={`text-2xl font-bold mb-2 transition-all duration-300 ${phaseColor[phase]}`}>
          {done ? "운동 완료! 수고하셨습니다 🎉" : phaseLabel[phase]}
        </div>

        {running && !done && (
          <>
            <div className={`text-6xl font-black mb-3 ${phaseColor[phase]}`}>{countdown}</div>
            <div className="w-full bg-slate-200 rounded-full h-3 mb-3">
              <div
                className={`h-3 rounded-full transition-all duration-1000 ${
                  phase === "inhale"
                    ? "bg-blue-400"
                    : phase === "hold"
                    ? "bg-amber-400"
                    : "bg-emerald-400"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-sm text-slate-500">
              {currentSet}세트 / {sets}세트 &nbsp;·&nbsp; {currentRep + 1}회 / {reps}회
            </div>
          </>
        )}

        {!running && !done && phase === "ready" && (
          <p className="text-slate-400 text-sm">
            들숨 {breathing.inhale}초
            {breathing.hold > 0 ? ` → 참기 ${breathing.hold}초` : ""} → 날숨{" "}
            {breathing.exhale}초
          </p>
        )}
      </div>

      <div className="flex gap-3">
        {!running ? (
          <button
            onClick={handleStart}
            className="flex-1 py-3 rounded-xl bg-blue-500 text-white font-semibold text-lg hover:bg-blue-600 active:scale-95 transition-all"
          >
            {done ? "다시 시작" : "시작"}
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="flex-1 py-3 rounded-xl bg-slate-200 text-slate-700 font-semibold text-lg hover:bg-slate-300 active:scale-95 transition-all"
          >
            중지
          </button>
        )}
      </div>
    </div>
  );
}
