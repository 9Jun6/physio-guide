"use client";

import { ReactElement } from "react";

// B: 몸체, H: 강조 부위, A: 화살표, HF: 강조 채우기
const B = "#334155";
const H = "#2563EB";
const A = "#D97706";
const HF = "#DBEAFE";

const svgMap: Record<string, ReactElement> = {

  /* ── 목 ───────────────────────────────────────── */

  "neck-side": (
    <svg viewBox="0 0 200 210" className="w-full h-full" fill="none">
      {/* 상체 */}
      <line x1="58" y1="118" x2="142" y2="118" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="100" y1="104" x2="100" y2="172" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="58" y1="118" x2="40" y2="160" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="142" y1="118" x2="160" y2="160" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 관절 */}
      <circle cx="40" cy="160" r="3" fill={B}/>
      <circle cx="160" cy="160" r="3" fill={B}/>
      {/* 목 (오른쪽으로 기울어짐) */}
      <line x1="114" y1="82" x2="100" y2="104" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 머리 - 오른쪽 기울기 */}
      <circle cx="120" cy="62" r="21" stroke={B} strokeWidth="2.5" fill="white"/>
      {/* 오른쪽 목 스트레칭 강조선 */}
      <path d="M100 104 Q92 93 102 80" stroke={H} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeDasharray="5 3"/>
      {/* 방향 화살표 */}
      <path d="M150 44 Q166 66 155 88" stroke={A} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M149 86 L155 92 L161 85" stroke={A} strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  ),

  "neck-front-back": (
    <svg viewBox="0 0 200 210" className="w-full h-full" fill="none">
      {/* 상체 - 측면 */}
      <line x1="82" y1="118" x2="128" y2="118" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="96" y1="104" x2="96" y2="172" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="82" y1="118" x2="68" y2="160" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="128" y1="118" x2="138" y2="160" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 목 - 앞으로 숙임 */}
      <line x1="84" y1="86" x2="96" y2="104" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 머리 - 앞으로 기울어짐 */}
      <circle cx="76" cy="68" r="21" stroke={B} strokeWidth="2.5" fill="white"/>
      {/* 코 (측면 표시) */}
      <path d="M95 67 L102 71 L95 74" stroke={B} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* 목 앞쪽 강조 */}
      <path d="M84 86 Q78 78 76 66" stroke={H} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeDasharray="5 3"/>
      {/* 아래 화살표 */}
      <path d="M55 46 Q44 62 52 80" stroke={A} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M49 78 L52 86 L58 80" stroke={A} strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  ),

  "neck-rotate": (
    <svg viewBox="0 0 200 210" className="w-full h-full" fill="none">
      {/* 상체 */}
      <line x1="58" y1="118" x2="142" y2="118" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="100" y1="104" x2="100" y2="172" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="58" y1="118" x2="40" y2="160" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="142" y1="118" x2="160" y2="160" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 목 */}
      <line x1="100" y1="84" x2="100" y2="104" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 머리 - 옆을 향함 (타원) */}
      <ellipse cx="110" cy="63" rx="22" ry="20" stroke={B} strokeWidth="2.5" fill="white"/>
      {/* 코 방향 (오른쪽) */}
      <line x1="130" y1="63" x2="138" y2="63" stroke={B} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="138" cy="63" r="2" fill={B}/>
      {/* 회전 화살표 */}
      <path d="M74 40 Q100 26 128 40" stroke={A} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M124 36 L130 42 L122 46" stroke={A} strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  ),

  /* ── 어깨 ─────────────────────────────────────── */

  "shoulder-roll": (
    <svg viewBox="0 0 200 210" className="w-full h-full" fill="none">
      {/* 전신 */}
      <circle cx="100" cy="28" r="20" stroke={B} strokeWidth="2.5" fill="white"/>
      <line x1="100" y1="48" x2="100" y2="60" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="62" y1="70" x2="138" y2="70" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="100" y1="60" x2="100" y2="128" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="62" y1="70" x2="44" y2="115" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="138" y1="70" x2="156" y2="115" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="100" y1="128" x2="84" y2="185" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="100" y1="128" x2="116" y2="185" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="84" cy="185" r="3" fill={B}/>
      <circle cx="116" cy="185" r="3" fill={B}/>
      {/* 어깨 관절 강조 */}
      <circle cx="62" cy="70" r="7" stroke={H} strokeWidth="2.5" fill={HF}/>
      <circle cx="138" cy="70" r="7" stroke={H} strokeWidth="2.5" fill={HF}/>
      {/* 왼쪽 어깨 원형 화살표 */}
      <path d="M46 52 Q26 70 36 92" stroke={A} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M34 90 L36 98 L43 93" stroke={A} strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* 오른쪽 어깨 원형 화살표 */}
      <path d="M154 52 Q174 70 164 92" stroke={A} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M162 90 L164 98 L171 93" stroke={A} strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  ),

  "shoulder-cross": (
    <svg viewBox="0 0 200 210" className="w-full h-full" fill="none">
      {/* 전신 */}
      <circle cx="100" cy="28" r="20" stroke={B} strokeWidth="2.5" fill="white"/>
      <line x1="100" y1="48" x2="100" y2="60" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="62" y1="70" x2="138" y2="70" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="100" y1="60" x2="100" y2="145" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="100" y1="145" x2="86" y2="195" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="100" y1="145" x2="114" y2="195" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 왼팔 - 오른팔 잡아당기기 */}
      <line x1="62" y1="70" x2="44" y2="108" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="44" y1="108" x2="58" y2="108" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="44" cy="108" r="3" fill={B}/>
      {/* 오른팔 - 가슴 앞으로 뻗음 */}
      <line x1="138" y1="70" x2="58" y2="105" stroke={B} strokeWidth="3" strokeLinecap="round"/>
      <circle cx="138" cy="70" r="3" fill={B}/>
      {/* 오른쪽 어깨 강조 */}
      <circle cx="138" cy="70" r="8" stroke={H} strokeWidth="2.5" fill={HF}/>
      {/* 당기는 화살표 */}
      <path d="M52 94 Q42 98 40 110" stroke={A} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M37 108 L40 116 L46 110" stroke={A} strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  ),

  "shoulder-wall": (
    <svg viewBox="0 0 200 210" className="w-full h-full" fill="none">
      {/* 벽 */}
      <rect x="165" y="15" width="18" height="190" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" rx="2"/>
      {/* 전신 측면 */}
      <circle cx="86" cy="36" r="19" stroke={B} strokeWidth="2.5" fill="white"/>
      {/* 코 측면 */}
      <path d="M104 35 L111 39 L104 42" stroke={B} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <line x1="86" y1="55" x2="86" y2="67" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="72" y1="76" x2="115" y2="76" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="86" y1="67" x2="86" y2="138" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="72" y1="76" x2="58" y2="118" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="86" y1="138" x2="74" y2="195" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="86" y1="138" x2="98" y2="195" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 오른팔 - 벽에 뻗음 */}
      <line x1="115" y1="76" x2="148" y2="92" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="148" y1="92" x2="165" y2="90" stroke={B} strokeWidth="3" strokeLinecap="round"/>
      <circle cx="148" cy="92" r="3" fill={B}/>
      {/* 어깨 강조 */}
      <circle cx="115" cy="76" r="7" stroke={H} strokeWidth="2.5" fill={HF}/>
      {/* 밀기 화살표 */}
      <path d="M148 82 L156 90 L148 98" stroke={A} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    </svg>
  ),

  /* ── 허리 ─────────────────────────────────────── */

  "back-knee-chest": (
    <svg viewBox="0 0 200 175" className="w-full h-full" fill="none">
      {/* 바닥 */}
      <line x1="8" y1="155" x2="192" y2="155" stroke="#CBD5E1" strokeWidth="2.5"/>
      {/* 누운 몸통 */}
      <line x1="32" y1="132" x2="128" y2="132" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 머리 */}
      <circle cx="18" cy="120" r="17" stroke={B} strokeWidth="2.5" fill="white"/>
      <line x1="30" y1="126" x2="35" y2="132" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 양 다리 - 무릎 구부려 가슴으로 */}
      <line x1="122" y1="132" x2="148" y2="105" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="148" cy="105" r="4" stroke={H} strokeWidth="2" fill={HF}/>
      <line x1="148" y1="105" x2="130" y2="83" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="128" y1="136" x2="156" y2="110" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="156" cy="110" r="4" stroke={H} strokeWidth="2" fill={HF}/>
      <line x1="156" y1="110" x2="138" y2="88" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 손 - 무릎 감싸기 */}
      <path d="M58 128 Q90 100 130 84" stroke={B} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M58 136 Q90 110 138 90" stroke={B} strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="4 2"/>
      {/* 허리 강조 */}
      <path d="M78 132 Q103 127 122 132" stroke={H} strokeWidth="3" fill="none" strokeLinecap="round"/>
    </svg>
  ),

  "back-cat-cow": (
    <svg viewBox="0 0 200 190" className="w-full h-full" fill="none">
      {/* 바닥 */}
      <line x1="8" y1="172" x2="192" y2="172" stroke="#CBD5E1" strokeWidth="2.5"/>
      {/* 왼쪽 손 */}
      <line x1="34" y1="148" x2="34" y2="172" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="34" cy="148" r="4" fill={B}/>
      {/* 오른쪽 무릎 */}
      <line x1="158" y1="148" x2="158" y2="172" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="158" cy="148" r="4" fill={B}/>
      {/* 팔 */}
      <line x1="34" y1="148" x2="66" y2="112" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 허벅지 */}
      <line x1="158" y1="148" x2="128" y2="112" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 등 - 위로 아치 강조 (고양이) */}
      <path d="M66 112 Q100 76 128 112" stroke={H} strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* 등 관절점 */}
      <circle cx="66" cy="112" r="4" fill={B}/>
      <circle cx="128" cy="112" r="4" fill={B}/>
      {/* 머리 숙임 */}
      <line x1="66" y1="112" x2="46" y2="132" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="36" cy="144" r="16" stroke={B} strokeWidth="2.5" fill="white"/>
      {/* 위쪽 화살표 */}
      <path d="M100 76 L100 60" stroke={A} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M95 65 L100 58 L105 65" stroke={A} strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  ),

  "back-pelvic-tilt": (
    <svg viewBox="0 0 200 175" className="w-full h-full" fill="none">
      {/* 바닥 */}
      <line x1="8" y1="158" x2="192" y2="158" stroke="#CBD5E1" strokeWidth="2.5"/>
      {/* 누운 몸통 */}
      <line x1="30" y1="138" x2="122" y2="138" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 머리 */}
      <circle cx="17" cy="126" r="16" stroke={B} strokeWidth="2.5" fill="white"/>
      <line x1="28" y1="132" x2="32" y2="138" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 왼쪽 다리 - 무릎 구부림 */}
      <line x1="118" y1="138" x2="150" y2="112" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="150" cy="112" r="4" fill={B}/>
      <line x1="150" y1="112" x2="156" y2="158" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 오른쪽 다리 */}
      <line x1="124" y1="142" x2="158" y2="118" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="158" cy="118" r="4" fill={B}/>
      <line x1="158" y1="118" x2="164" y2="158" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 허리/골반 강조 */}
      <path d="M74 138 Q98 133 118 138" stroke={H} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      {/* 아래 화살표 (바닥으로) */}
      <path d="M96 130 L96 144" stroke={A} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M91 141 L96 148 L101 141" stroke={A} strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  ),

  /* ── 무릎 ─────────────────────────────────────── */

  "knee-quad-stretch": (
    <svg viewBox="0 0 200 210" className="w-full h-full" fill="none">
      {/* 바닥 */}
      <line x1="8" y1="196" x2="192" y2="196" stroke="#CBD5E1" strokeWidth="2.5"/>
      {/* 전신 측면 */}
      <circle cx="92" cy="26" r="19" stroke={B} strokeWidth="2.5" fill="white"/>
      <path d="M110 25 L117 29 L110 32" stroke={B} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <line x1="92" y1="45" x2="92" y2="57" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="76" y1="66" x2="118" y2="66" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="92" y1="57" x2="92" y2="120" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 팔 - 뒤로 뻗어 발 잡기 */}
      <line x1="76" y1="66" x2="60" y2="104" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="60" y1="104" x2="75" y2="158" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="60" cy="104" r="3" fill={B}/>
      {/* 왼쪽 다리 - 지지 다리 */}
      <line x1="86" y1="120" x2="80" y2="165" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="80" y1="165" x2="76" y2="196" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="80" cy="165" r="3" fill={B}/>
      {/* 오른쪽 다리 - 뒤로 구부림 */}
      <line x1="98" y1="120" x2="120" y2="148" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="120" cy="148" r="6" stroke={H} strokeWidth="2.5" fill={HF}/>
      <line x1="120" y1="148" x2="105" y2="110" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 손-발 연결 */}
      <path d="M75 158 Q90 154 105 158" stroke={B} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* 대퇴 앞쪽 강조 */}
      <path d="M98 120 Q114 136 120 148" stroke={H} strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* 오른팔 */}
      <line x1="118" y1="66" x2="135" y2="106" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="135" cy="106" r="3" fill={B}/>
    </svg>
  ),

  "knee-extension": (
    <svg viewBox="0 0 200 210" className="w-full h-full" fill="none">
      {/* 의자 */}
      <rect x="42" y="108" width="90" height="10" rx="3" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2"/>
      <line x1="52" y1="118" x2="50" y2="195" stroke="#CBD5E1" strokeWidth="2"/>
      <line x1="122" y1="118" x2="124" y2="195" stroke="#CBD5E1" strokeWidth="2"/>
      <line x1="42" y1="62" x2="42" y2="118" stroke="#CBD5E1" strokeWidth="2"/>
      {/* 전신 */}
      <circle cx="82" cy="34" r="19" stroke={B} strokeWidth="2.5" fill="white"/>
      <line x1="82" y1="53" x2="82" y2="65" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="65" y1="74" x2="112" y2="74" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="82" y1="65" x2="82" y2="118" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="65" y1="74" x2="50" y2="116" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="112" y1="74" x2="126" y2="116" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 왼쪽 다리 - 내려짐 */}
      <line x1="76" y1="118" x2="70" y2="158" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="70" cy="158" r="3" fill={B}/>
      <line x1="70" y1="158" x2="64" y2="195" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 오른쪽 다리 - 수평 뻗음 */}
      <line x1="88" y1="118" x2="94" y2="158" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="94" cy="158" r="7" stroke={H} strokeWidth="2.5" fill={HF}/>
      <line x1="94" y1="158" x2="175" y2="152" stroke={H} strokeWidth="3" strokeLinecap="round"/>
      {/* 화살표 */}
      <path d="M166 143 L175 151 L166 160" stroke={A} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    </svg>
  ),

  "knee-hamstring": (
    <svg viewBox="0 0 200 185" className="w-full h-full" fill="none">
      {/* 바닥 */}
      <line x1="8" y1="172" x2="192" y2="172" stroke="#CBD5E1" strokeWidth="2.5"/>
      {/* 상체 - 앞으로 숙임 측면 */}
      <circle cx="36" cy="68" r="19" stroke={B} strokeWidth="2.5" fill="white"/>
      <path d="M54 67 L61 71 L54 74" stroke={B} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <line x1="36" y1="87" x2="36" y2="100" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 앞으로 숙인 상체 */}
      <path d="M36 100 Q80 118 132 132" stroke={B} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* 팔 뻗음 */}
      <line x1="60" y1="108" x2="158" y2="144" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="60" cy="108" r="3" fill={B}/>
      <circle cx="158" cy="144" r="3" fill={B}/>
      {/* 뻗은 다리 */}
      <line x1="36" y1="138" x2="182" y2="138" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="36" y1="148" x2="182" y2="148" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 발 */}
      <path d="M182 138 Q188 143 184 150" stroke={B} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* 햄스트링 강조 */}
      <path d="M82 143 Q128 145 168 143" stroke={H} strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* 무릎 뒤쪽 강조 */}
      <circle cx="130" cy="143" r="6" stroke={H} strokeWidth="2.5" fill={HF}/>
    </svg>
  ),

  /* ── 발목 ─────────────────────────────────────── */

  "ankle-circle": (
    <svg viewBox="0 0 200 210" className="w-full h-full" fill="none">
      {/* 의자 */}
      <rect x="32" y="108" width="90" height="10" rx="3" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2"/>
      <line x1="42" y1="118" x2="40" y2="195" stroke="#CBD5E1" strokeWidth="2"/>
      <line x1="112" y1="118" x2="114" y2="195" stroke="#CBD5E1" strokeWidth="2"/>
      {/* 전신 */}
      <circle cx="80" cy="30" r="18" stroke={B} strokeWidth="2.5" fill="white"/>
      <line x1="80" y1="48" x2="80" y2="60" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="63" y1="69" x2="106" y2="69" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="80" y1="60" x2="80" y2="118" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="63" y1="69" x2="48" y2="110" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="106" y1="69" x2="118" y2="110" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 바닥 짚는 다리 */}
      <line x1="73" y1="118" x2="66" y2="158" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="66" cy="158" r="3" fill={B}/>
      <line x1="66" y1="158" x2="60" y2="195" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 들어올린 다리 */}
      <line x1="87" y1="118" x2="96" y2="152" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="96" cy="152" r="3" fill={B}/>
      <line x1="96" y1="152" x2="118" y2="158" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 발목 강조 */}
      <circle cx="118" cy="158" r="7" stroke={H} strokeWidth="2.5" fill={HF}/>
      {/* 발 */}
      <line x1="118" y1="158" x2="144" y2="164" stroke={B} strokeWidth="2" strokeLinecap="round"/>
      {/* 원형 화살표 */}
      <path d="M132 143 Q156 156 144 178 Q134 194 116 186" stroke={A} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M119 187 L115 194 L110 187" stroke={A} strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  ),

  "ankle-pump": (
    <svg viewBox="0 0 200 210" className="w-full h-full" fill="none">
      {/* 의자 */}
      <rect x="18" y="110" width="88" height="10" rx="3" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2"/>
      <line x1="28" y1="120" x2="26" y2="195" stroke="#CBD5E1" strokeWidth="2"/>
      <line x1="96" y1="120" x2="98" y2="195" stroke="#CBD5E1" strokeWidth="2"/>
      {/* 상체 */}
      <circle cx="62" cy="30" r="18" stroke={B} strokeWidth="2.5" fill="white"/>
      <line x1="62" y1="48" x2="62" y2="60" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="45" y1="69" x2="88" y2="69" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="62" y1="60" x2="62" y2="118" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="45" y1="69" x2="30" y2="112" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="88" y1="69" x2="100" y2="112" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 왼쪽 다리 - 발 위로 당김 (배경) */}
      <line x1="55" y1="118" x2="48" y2="160" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="48" cy="160" r="6" stroke={H} strokeWidth="2.5" fill={HF}/>
      <path d="M48 160 Q38 168 30 160" stroke={B} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* 오른쪽 다리 - 발 아래로 */}
      <line x1="70" y1="118" x2="76" y2="160" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="76" cy="160" r="6" stroke={H} strokeWidth="2.5" fill={HF}/>
      <path d="M76 160 Q90 170 100 162" stroke={B} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* 위 화살표 */}
      <path d="M26 150 L26 136" stroke={A} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M21 140 L26 134 L31 140" stroke={A} strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* 아래 화살표 */}
      <path d="M104 150 L104 166" stroke={A} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M99 162 L104 169 L109 162" stroke={A} strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  ),

  "ankle-raise": (
    <svg viewBox="0 0 200 210" className="w-full h-full" fill="none">
      {/* 바닥 */}
      <line x1="8" y1="196" x2="192" y2="196" stroke="#CBD5E1" strokeWidth="2.5"/>
      {/* 벽 */}
      <rect x="166" y="20" width="16" height="176" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" rx="2"/>
      {/* 전신 측면 */}
      <circle cx="88" cy="28" r="19" stroke={B} strokeWidth="2.5" fill="white"/>
      <path d="M106 27 L113 31 L106 34" stroke={B} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <line x1="88" y1="47" x2="88" y2="59" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="72" y1="68" x2="116" y2="68" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="88" y1="59" x2="88" y2="130" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="72" y1="68" x2="56" y2="110" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 벽 짚는 팔 */}
      <line x1="116" y1="68" x2="150" y2="86" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="150" y1="86" x2="166" y2="84" stroke={B} strokeWidth="3" strokeLinecap="round"/>
      <circle cx="150" cy="86" r="3" fill={B}/>
      {/* 다리 - 까치발 */}
      <line x1="81" y1="130" x2="76" y2="170" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="95" y1="130" x2="100" y2="170" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 발꿈치 들림 */}
      <path d="M76 170 Q80 180 92 184" stroke={B} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M100 170 Q104 180 116 184" stroke={B} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* 발목 강조 */}
      <circle cx="76" cy="170" r="6" stroke={H} strokeWidth="2.5" fill={HF}/>
      <circle cx="100" cy="170" r="6" stroke={H} strokeWidth="2.5" fill={HF}/>
      {/* 위 화살표 */}
      <path d="M88 164 L88 148" stroke={A} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M83 153 L88 146 L93 153" stroke={A} strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  ),

  /* ── 고관절 ───────────────────────────────────── */

  "hip-flexor": (
    <svg viewBox="0 0 200 210" className="w-full h-full" fill="none">
      {/* 바닥 */}
      <line x1="8" y1="196" x2="192" y2="196" stroke="#CBD5E1" strokeWidth="2.5"/>
      {/* 전신 측면 */}
      <circle cx="88" cy="26" r="19" stroke={B} strokeWidth="2.5" fill="white"/>
      <path d="M106 25 L113 29 L106 32" stroke={B} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <line x1="88" y1="45" x2="88" y2="57" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="72" y1="66" x2="115" y2="66" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="88" y1="57" x2="88" y2="116" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="72" y1="66" x2="56" y2="108" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="115" y1="66" x2="128" y2="108" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 앞 다리 */}
      <line x1="82" y1="116" x2="52" y2="152" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="52" cy="152" r="4" fill={B}/>
      <line x1="52" y1="152" x2="40" y2="196" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 뒤 다리 - 무릎 바닥 */}
      <line x1="94" y1="116" x2="144" y2="140" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="144" cy="140" r="5" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2"/>
      <line x1="144" y1="140" x2="156" y2="196" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 고관절 강조 */}
      <circle cx="88" cy="116" r="9" stroke={H} strokeWidth="2.5" fill={HF}/>
      {/* 앞으로 미는 화살표 */}
      <path d="M88 104 Q76 110 80 120" stroke={A} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M77 118 L80 126 L86 120" stroke={A} strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  ),

  "hip-clam": (
    <svg viewBox="0 0 200 185" className="w-full h-full" fill="none">
      {/* 바닥 */}
      <line x1="8" y1="170" x2="192" y2="170" stroke="#CBD5E1" strokeWidth="2.5"/>
      {/* 옆으로 누운 자세 */}
      <line x1="24" y1="115" x2="114" y2="115" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 머리 */}
      <circle cx="16" cy="102" r="17" stroke={B} strokeWidth="2.5" fill="white"/>
      <line x1="28" y1="108" x2="32" y2="115" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 팔 - 머리 받침 */}
      <line x1="24" y1="115" x2="10" y2="148" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="10" cy="148" r="3" fill={B}/>
      {/* 아래쪽 다리 */}
      <line x1="114" y1="115" x2="150" y2="136" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="150" cy="136" r="4" fill={B}/>
      <line x1="150" y1="136" x2="162" y2="170" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 위쪽 다리 - 들어올림 */}
      <line x1="112" y1="112" x2="148" y2="122" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="148" cy="122" r="4" fill={B}/>
      <line x1="148" y1="122" x2="154" y2="155" stroke={H} strokeWidth="3" strokeLinecap="round"/>
      {/* 고관절 강조 */}
      <circle cx="114" cy="115" r="9" stroke={H} strokeWidth="2.5" fill={HF}/>
      {/* 들어올리는 화살표 */}
      <path d="M162 144 Q172 130 165 114" stroke={A} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M163 116 L165 108 L170 115" stroke={A} strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  ),

  /* ── 팔꿈치 ───────────────────────────────────── */

  "elbow-flex": (
    <svg viewBox="0 0 200 210" className="w-full h-full" fill="none">
      {/* 전신 측면 */}
      <circle cx="86" cy="26" r="19" stroke={B} strokeWidth="2.5" fill="white"/>
      <path d="M104 25 L111 29 L104 32" stroke={B} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <line x1="86" y1="45" x2="86" y2="57" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="70" y1="66" x2="115" y2="66" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="86" y1="57" x2="86" y2="135" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="86" y1="135" x2="76" y2="195" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="86" y1="135" x2="96" y2="195" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="76" cy="195" r="3" fill={B}/>
      <circle cx="96" cy="195" r="3" fill={B}/>
      {/* 왼팔 */}
      <line x1="70" y1="66" x2="52" y2="108" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="52" cy="108" r="3" fill={B}/>
      <line x1="52" y1="108" x2="44" y2="150" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 오른팔 - 구부림 */}
      <line x1="115" y1="66" x2="142" y2="108" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 팔꿈치 강조 */}
      <circle cx="142" cy="108" r="8" stroke={H} strokeWidth="2.5" fill={HF}/>
      {/* 전완 - 구부려 올림 */}
      <line x1="142" y1="108" x2="120" y2="70" stroke={H} strokeWidth="3" strokeLinecap="round"/>
      <circle cx="120" cy="70" r="4" fill={H}/>
      {/* 구부리는 화살표 */}
      <path d="M150 96 Q164 106 154 122" stroke={A} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M150 120 L154 128 L159 122" stroke={A} strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  ),

  "elbow-rotation": (
    <svg viewBox="0 0 200 210" className="w-full h-full" fill="none">
      {/* 전신 정면 */}
      <circle cx="100" cy="28" r="19" stroke={B} strokeWidth="2.5" fill="white"/>
      <line x1="100" y1="47" x2="100" y2="59" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="66" y1="68" x2="134" y2="68" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="100" y1="59" x2="100" y2="145" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="100" y1="145" x2="88" y2="195" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="100" y1="145" x2="112" y2="195" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 왼팔 */}
      <line x1="66" y1="68" x2="40" y2="110" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="40" cy="110" r="3" fill={B}/>
      <line x1="40" y1="110" x2="34" y2="152" stroke={B} strokeWidth="2" strokeLinecap="round" strokeDasharray="5 3"/>
      {/* 오른팔 - 팔꿈치 90도 */}
      <line x1="134" y1="68" x2="160" y2="110" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 팔꿈치 강조 */}
      <circle cx="160" cy="110" r="8" stroke={H} strokeWidth="2.5" fill={HF}/>
      {/* 전완 수직 */}
      <line x1="160" y1="110" x2="160" y2="152" stroke={H} strokeWidth="3" strokeLinecap="round"/>
      {/* 손 */}
      <circle cx="160" cy="155" r="6" stroke={B} strokeWidth="2" fill="white"/>
      {/* 회전 화살표 */}
      <path d="M144 120 Q136 140 148 152 Q160 162 172 152" stroke={A} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M169 150 L173 158 L178 151" stroke={A} strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  ),

  /* ── 손목 ─────────────────────────────────────── */

  "wrist-flex": (
    <svg viewBox="0 0 200 210" className="w-full h-full" fill="none">
      {/* 전신 */}
      <circle cx="68" cy="28" r="19" stroke={B} strokeWidth="2.5" fill="white"/>
      <line x1="68" y1="47" x2="68" y2="59" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="52" y1="68" x2="96" y2="68" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="68" y1="59" x2="68" y2="145" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="52" y1="68" x2="38" y2="112" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="38" cy="112" r="3" fill={B}/>
      <line x1="38" y1="112" x2="32" y2="155" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="68" y1="145" x2="58" y2="195" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="68" y1="145" x2="78" y2="195" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 오른팔 - 앞으로 뻗음 */}
      <line x1="96" y1="68" x2="132" y2="88" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="132" cy="88" r="3" fill={B}/>
      <line x1="132" y1="88" x2="174" y2="88" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 손목 강조 */}
      <circle cx="174" cy="88" r="7" stroke={H} strokeWidth="2.5" fill={HF}/>
      {/* 손 - 위로 젖힘 */}
      <path d="M174 88 Q178 74 186 70" stroke={H} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M174 88 Q180 82 188 80" stroke={B} strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M174 88 Q182 86 190 88" stroke={B} strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M174 88 Q181 92 188 97" stroke={B} strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* 화살표 */}
      <path d="M166 72 Q174 62 182 66" stroke={A} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M179 63 L184 69 L177 71" stroke={A} strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  ),

  "wrist-circle": (
    <svg viewBox="0 0 200 210" className="w-full h-full" fill="none">
      {/* 전신 */}
      <circle cx="100" cy="28" r="19" stroke={B} strokeWidth="2.5" fill="white"/>
      <line x1="100" y1="47" x2="100" y2="59" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="66" y1="68" x2="134" y2="68" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="100" y1="59" x2="100" y2="148" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="100" y1="148" x2="88" y2="195" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="100" y1="148" x2="112" y2="195" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 양팔 - 앞으로 뻗음 */}
      <line x1="66" y1="68" x2="40" y2="112" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="40" cy="112" r="3" fill={B}/>
      <line x1="40" y1="112" x2="32" y2="156" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="134" y1="68" x2="160" y2="112" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="160" cy="112" r="3" fill={B}/>
      <line x1="160" y1="112" x2="168" y2="156" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>
      {/* 손목 강조 */}
      <circle cx="32" cy="156" r="7" stroke={H} strokeWidth="2.5" fill={HF}/>
      <circle cx="168" cy="156" r="7" stroke={H} strokeWidth="2.5" fill={HF}/>
      {/* 왼쪽 손목 원형 화살표 */}
      <path d="M16 148 Q10 160 18 170 Q26 178 38 170" stroke={A} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M36 169 L40 176 L44 169" stroke={A} strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* 오른쪽 손목 원형 화살표 */}
      <path d="M184 148 Q190 160 182 170 Q174 178 162 170" stroke={A} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M164 169 L160 176 L156 169" stroke={A} strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  ),
};

export default function ExerciseSVG({ svgKey, className }: { svgKey: string; className?: string }) {
  return (
    <div className={className ?? "w-full h-full"}>
      {svgMap[svgKey] ?? (
        <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
          <circle cx="100" cy="100" r="60" stroke="#CBD5E1" strokeWidth="3" fill="#F8FAFC"/>
          <text x="100" y="108" textAnchor="middle" fontSize="14" fill="#94A3B8">운동 이미지</text>
        </svg>
      )}
    </div>
  );
}
