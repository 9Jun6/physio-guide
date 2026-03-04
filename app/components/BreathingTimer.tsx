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

const phaseBarColor: Record<Phase, string> = {
  ready: "bg-slate-300",
  inhale: "bg-blue-400",
  hold: "bg-amber-400",
  exhale: "bg-emerald-400",
};

const stepBorderColor: Record<Phase, string> = {
  ready: "border-blue-300 bg-blue-50",
  inhale: "border-blue-400 bg-blue-50",
  hold: "border-amber-400 bg-amber-50",
  exhale: "border-emerald-400 bg-emerald-50",
};

const phaseBg: Record<Phase, string> = {
  ready: "bg-slate-50 border-slate-200",
  inhale: "bg-blue-50 border-blue-200",
  hold: "bg-amber-50 border-amber-200",
  exhale: "bg-emerald-50 border-emerald-200",
};

const stepNumColor: Record<Phase, string> = {
  ready: "bg-blue-100 text-blue-600",
  inhale: "bg-blue-100 text-blue-600",
  hold: "bg-amber-100 text-amber-600",
  exhale: "bg-emerald-100 text-emerald-600",
};

export default function BreathingTimer({
  breathing,
  reps,
  sets,
  steps = [],
}: {
  breathing: Breathing;
  reps: number;
  sets: number;
  steps?: string[];
}) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [countdown, setCountdown] = useState(0);
  const [currentRep, setCurrentRep] = useState(1);
  const [currentSet, setCurrentSet] = useState(1);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);

  const stepCount = steps.length || 1;

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
    let set = 1;
    let stepIdx = 0;

    setPhase(sequence[0].phase);
    setCountdown(timeLeft);
    setProgress(0);
    setCurrentRep(1);
    setCurrentSet(1);
    setCurrentStepIdx(0);

    const tick = setInterval(() => {
      timeLeft -= 1;

      const elapsed = sequence[seqIdx].duration - timeLeft;
      setProgress((elapsed / sequence[seqIdx].duration) * 100);
      setCountdown(timeLeft);

      if (timeLeft <= 0) {
        seqIdx++;

        if (seqIdx >= sequence.length) {
          // 호흡 사이클 1회 완료 = 현재 스텝 완료
          seqIdx = 0;
          stepIdx++;

          if (stepIdx >= stepCount) {
            // 모든 스텝 완료 = 1회(rep) 완료
            stepIdx = 0;
            rep++;

            if (rep > reps) {
              // 모든 회 완료 = 1세트 완료
              if (set >= sets) {
                clearInterval(tick);
                setRunning(false);
                setDone(true);
                setPhase("ready");
                setCurrentStepIdx(0);
                return;
              }
              set++;
              setCurrentSet(set);
              rep = 1;
            }
            setCurrentRep(rep);
          }

          setCurrentStepIdx(stepIdx);
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
    setCurrentRep(1);
    setCurrentSet(1);
    setCurrentStepIdx(0);
    setPhase("ready");
    setRunning(true);
  };

  const handleStop = () => {
    setRunning(false);
    setPhase("ready");
    setCountdown(0);
    setProgress(0);
    setCurrentRep(1);
    setCurrentSet(1);
    setCurrentStepIdx(0);
  };

  return (
    <div className="space-y-4">
      {/* 단계별 진행 목록 */}
      {steps.length > 0 && (
        <ol className="space-y-2">
          {steps.map((step, i) => {
            const isActive = running && i === currentStepIdx;
            const isDone = running
              ? i < currentStepIdx
              : done
              ? true
              : false;

            return (
              <li
                key={i}
                className={`flex gap-3 rounded-xl border-2 px-4 py-3 transition-all duration-500 ${
                  isActive
                    ? stepBorderColor[phase]
                    : isDone
                    ? "border-slate-200 bg-slate-50 opacity-50"
                    : "border-transparent bg-white"
                }`}
              >
                <span
                  className={`flex-shrink-0 w-6 h-6 rounded-full text-sm font-bold flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? stepNumColor[phase]
                      : isDone
                      ? "bg-slate-200 text-slate-400"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {isDone ? "✓" : i + 1}
                </span>
                <span
                  className={`text-sm leading-relaxed pt-0.5 transition-all duration-300 ${
                    isActive ? "font-semibold text-slate-800" : "text-slate-500"
                  }`}
                >
                  {step}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      {/* 호흡 안내 */}
      <div
        className={`rounded-2xl border-2 p-5 text-center transition-all duration-500 ${
          done
            ? "bg-emerald-50 border-emerald-200"
            : running
            ? phaseBg[phase]
            : "bg-slate-50 border-slate-200"
        }`}
      >
        {done ? (
          <div className="text-xl font-bold text-emerald-600">운동 완료! 수고하셨습니다 🎉</div>
        ) : running ? (
          <>
            <div className={`text-lg font-bold mb-1 transition-all duration-300 ${phaseColor[phase]}`}>
              {phaseLabel[phase]}
            </div>
            <div className={`text-5xl font-black mb-3 ${phaseColor[phase]}`}>{countdown}</div>
            <div className="w-full bg-slate-200 rounded-full h-2.5 mb-3">
              <div
                className={`h-2.5 rounded-full transition-all duration-1000 ${phaseBarColor[phase]}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs text-slate-500">
              {currentSet}세트 / {sets}세트 &nbsp;·&nbsp; {currentRep}회 / {reps}회
              {steps.length > 0 && (
                <>&nbsp;·&nbsp; 단계 {currentStepIdx + 1} / {stepCount}</>
              )}
            </div>
          </>
        ) : (
          <p className="text-slate-400 text-sm">
            들숨 {breathing.inhale}초
            {breathing.hold > 0 ? ` → 참기 ${breathing.hold}초` : ""} → 날숨 {breathing.exhale}초
          </p>
        )}
      </div>

      {/* 버튼 */}
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
