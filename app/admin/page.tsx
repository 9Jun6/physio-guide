"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin/manage");
    } else {
      const data = await res.json();
      setError(data.error ?? "로그인에 실패했습니다.");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-2">🔐</div>
            <h1 className="text-2xl font-bold text-slate-800">관리자 로그인</h1>
            <p className="text-slate-500 text-sm mt-1">물리치료사 전용 페이지</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="text"
              placeholder="아이디"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:outline-none text-slate-800"
              autoFocus
              autoComplete="username"
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:outline-none text-slate-800"
              autoComplete="current-password"
            />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading || !id || !password}
              className="w-full py-3 rounded-xl bg-blue-500 text-white font-bold text-lg hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
            >
              {loading ? "확인 중..." : "로그인"}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors"
          >
            ← 일반 사용자 화면으로
          </a>
        </div>
      </div>
    </main>
  );
}
