"use client";

import { useEffect, useRef, useState } from "react";
import ExerciseSVG from "./ExerciseSVG";

interface FramePlayerProps {
  frames: string[];
  interval?: number; // ms per frame, default 1200
}

export default function FramePlayer({ frames, interval = 1200 }: FramePlayerProps) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const dirRef = useRef(1); // 1 = forward, -1 = backward (ping-pong)

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setIndex((prev) => {
        const next = prev + dirRef.current;
        if (next >= frames.length - 1) dirRef.current = -1;
        if (next <= 0) dirRef.current = 1;
        return Math.max(0, Math.min(frames.length - 1, next));
      });
    }, interval);
    return () => clearInterval(id);
  }, [playing, frames.length, interval]);

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <ExerciseSVG svgKey={frames[index]} className="w-52 h-52" />
      <div className="flex items-center gap-3">
        {frames.map((_, i) => (
          <button
            key={i}
            onClick={() => { setPlaying(false); setIndex(i); }}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              i === index ? "bg-blue-500" : "bg-slate-300"
            }`}
            aria-label={`프레임 ${i + 1}`}
          />
        ))}
        <button
          onClick={() => setPlaying((p) => !p)}
          className="ml-1 text-slate-500 hover:text-blue-500 transition-colors text-sm"
          aria-label={playing ? "정지" : "재생"}
        >
          {playing ? "⏸" : "▶"}
        </button>
      </div>
    </div>
  );
}
