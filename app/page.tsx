import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 overflow-hidden">
      {/* ───── Hero Section ───── */}
      <section className="relative pt-20 pb-32 px-6">
        {/* 배경 장식 (힙한 느낌의 추상적인 그라데이션) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent rounded-full blur-3xl -z-10" />
        
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-4 shadow-xl shadow-blue-900/20 animate-bounce">
            The Future of Rehabilitation
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9]">
            재활의 기준을 <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">새로고침</span> 하다.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            종이 처방전은 이제 그만. <br className="md:hidden" /> 
            QR 하나로 연결되는 스마트 재활 가이드, **PhysioGuide**와 함께하세요.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/admin" 
              className="group relative px-8 py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-slate-200"
            >
              <span className="relative z-10 flex items-center gap-2">
                치료사로 시작하기
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            
            <Link 
              href="/exercises" 
              className="px-8 py-5 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all hover:border-slate-200 active:scale-95"
            >
              운동 라이브러리 보기
            </Link>
          </div>
        </div>
      </section>

      {/* ───── Feature Grid ───── */}
      <section className="px-6 py-24 bg-slate-50/50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-inner">
              📱
            </div>
            <h3 className="text-xl font-bold mb-3">스마트 QR 처방</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              더 이상 환자에게 말로 설명하지 마세요. 클릭 몇 번으로 생성된 QR 코드가 완벽한 가이드를 전달합니다.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-inner">
              ⏱️
            </div>
            <h3 className="text-xl font-bold mb-3">실시간 호흡 타이머</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              환자가 집에서도 정확한 템포로 운동할 수 있도록 시각적, 청각적 가이드를 실시간으로 제공합니다.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-inner">
              📊
            </div>
            <h3 className="text-xl font-bold mb-3">데이터 기반 모니터링</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              환자의 통증 지수와 피드백을 실시간으로 확인하고, 데이터에 기반한 정밀한 치료 계획을 수립하세요.
            </p>
          </div>
        </div>
      </section>

      {/* ───── "Superiority" Section ───── */}
      <section className="px-6 py-32 overflow-hidden">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-6">
            <h2 className="text-4xl md:text-5xl font-black leading-tight text-slate-900">
              전문가를 위한 <br />
              압도적인 디테일.
            </h2>
            <ul className="space-y-4">
              {[
                "개별 맞춤형 횟수 및 세트 설정",
                "부위별 고해상도 운동 애니메이션",
                "치료사-환자간 다이렉트 피드백 루프",
                "클라우드 기반 처방 이력 관리"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 font-bold text-slate-600">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 relative">
            {/* 힙한 느낌의 인터페이스 프리뷰 (추상적인 디자인) */}
            <div className="w-full aspect-square bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] shadow-3xl shadow-blue-200 flex items-center justify-center p-8 rotate-3 transition-transform hover:rotate-0 duration-700">
              <div className="w-full h-full bg-white/10 backdrop-blur-md rounded-[2rem] border border-white/20 flex flex-col items-center justify-center text-white text-center p-6">
                <div className="text-6xl mb-4">🏆</div>
                <div className="text-2xl font-black mb-2">PhysioGuide Pro</div>
                <div className="text-sm font-medium opacity-80">Built for Professionals</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Footer ───── */}
      <footer className="px-6 py-12 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-sm font-bold tracking-widest uppercase">
          © 2026 PhysioGuide. All Rights Reserved.
        </p>
      </footer>
    </main>
  );
}
