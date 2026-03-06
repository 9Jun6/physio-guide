import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100">
      {/* ───── Hero Section: 핵심 가치 전달 ───── */}
      <section className="pt-24 pb-20 px-6 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-slate-900">
            물리치료사의 처방을 <br />
            환자의 스마트폰으로 직접 전송하세요.
          </h1>
          
          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
            복잡한 설명 대신 QR 코드로 운동 가이드를 전달하고, <br className="hidden md:block" />
            환자의 운동 수행 여부와 통증 변화를 데이터로 확인합니다.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link 
              href="/admin" 
              className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
            >
              치료사 대시보드 시작
            </Link>
            
            <Link 
              href="/exercises" 
              className="w-full sm:w-auto px-10 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all"
            >
              운동 라이브러리 조회
            </Link>
          </div>
        </div>
      </section>

      {/* ───── 실무 중심 기능 안내 ───── */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 기능 1 */}
            <div className="space-y-4">
              <div className="text-blue-600 font-black text-xl italic tracking-tighter">01.</div>
              <h3 className="text-xl font-bold text-slate-800">즉시 생성되는 QR 처방</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                운동 종목과 횟수를 선택하면 고유 QR 코드가 생성됩니다. 환자는 별도의 앱 설치 없이 웹에서 바로 가이드를 확인합니다.
              </p>
            </div>

            {/* 기능 2 */}
            <div className="space-y-4">
              <div className="text-blue-600 font-black text-xl italic tracking-tighter">02.</div>
              <h3 className="text-xl font-bold text-slate-800">정밀한 홈 가이드</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                단계별 설명과 실시간 호흡 타이머를 제공하여, 환자가 병원 밖에서도 치료사의 지시대로 정확하게 운동하게 돕습니다.
              </p>
            </div>

            {/* 기능 3 */}
            <div className="space-y-4">
              <div className="text-blue-600 font-black text-xl italic tracking-tighter">03.</div>
              <h3 className="text-xl font-bold text-slate-800">객관적인 경과 모니터링</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                환자가 입력한 운동 전/후 통증 점수(VAS)와 피드백을 대시보드에서 확인하여 다음 치료 계획에 반영할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───── 시스템 구조 (Grounded) ───── */}
      <section className="px-6 py-20 bg-slate-900 text-white rounded-t-[3rem]">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">환자 관리에만 <br />집중할 수 있는 환경.</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-400">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  <span className="text-sm font-medium text-slate-300">치료사별 개별 계정 및 환자 데이터 격리</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  <span className="text-sm font-medium text-slate-300">클라우드 기반 실시간 로그 동기화</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  <span className="text-sm font-medium text-slate-300">맞춤형 횟수, 세트, 주의사항 전달</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm">
              <div className="text-[10px] uppercase font-bold text-blue-400 mb-2 tracking-widest">Management System</div>
              <p className="text-xl font-medium leading-snug">
                종이 유인물 소모 비용과 <br />
                설명 시간을 70% 이상 <br />
                단축합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Footer ───── */}
      <footer className="px-6 py-10 text-center bg-slate-900 border-t border-white/5">
        <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">
          PhysioGuide Professional Patient Management System
        </p>
      </footer>
    </main>
  );
}
