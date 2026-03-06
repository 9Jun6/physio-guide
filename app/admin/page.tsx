"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 이미 로그인되어 있는지 확인
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // 프로필 확인 후 관리자/치료사면 대시보드로 이동
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        
        if (profile && (profile.role === "admin" || profile.role === "therapist")) {
          router.push("/admin/manage");
        }
      }
    };
    checkUser();
  }, [router, supabase]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        // 1. 로그인
        const { error: loginErr } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (loginErr) throw loginErr;
      } else {
        // 2. 회원가입 (치료사 전용)
        const { data: authData, error: signupErr } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }
          }
        });
        
        if (signupErr) {
          throw new Error(`회원가입 실패: ${signupErr.message}`);
        }

        if (authData.user) {
          // profiles 테이블에 치료사로 등록
          const { error: profileErr } = await supabase
            .from("profiles")
            .upsert([{ // insert 대신 upsert 사용으로 안정성 확보
              id: authData.user.id,
              role: "therapist",
              full_name: fullName,
              email: email
            }]);
          
          if (profileErr) {
            console.error("Profile creation error:", profileErr);
            throw new Error(`프로필 생성 실패: ${profileErr.message}`);
          }
        }
        alert("회원가입이 성공했습니다! 이제 로그인해 주세요.");
        setIsLogin(true);
        setLoading(false);
        return;
      }

      router.push("/admin/manage");
    } catch (err: any) {
      setError(err.message || "인증에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🏥</div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">PhysioGuide</h1>
          <p className="text-slate-400 mt-2 font-medium">치료사 전용 관리 시스템</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">이름</label>
              <input
                type="text"
                required
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-200 text-slate-700 font-medium transition-all"
                placeholder="홍길동 치료사"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">이메일</label>
            <input
              type="email"
              required
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-200 text-slate-700 font-medium transition-all"
              placeholder="example@physio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">비밀번호</label>
            <input
              type="password"
              required
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-200 text-slate-700 font-medium transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 text-sm py-3 px-4 rounded-xl font-medium border border-red-100 animate-shake">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-slate-800 text-white font-bold text-lg hover:bg-slate-900 active:scale-[0.98] transition-all shadow-lg shadow-slate-200 disabled:opacity-50"
          >
            {loading ? "처리 중..." : isLogin ? "로그인" : "치료사 가입하기"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-bold text-blue-500 hover:text-blue-600 transition-colors"
          >
            {isLogin ? "처음이신가요? 치료사로 가입하기" : "이미 계정이 있나요? 로그인하기"}
          </button>
        </div>
      </div>
    </main>
  );
}
