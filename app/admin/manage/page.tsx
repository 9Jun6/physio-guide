"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { Exercise, ExercisesData } from "../../types";

const BODY_PARTS = ["목", "어깨", "허리", "무릎", "발목", "고관절", "팔꿈치", "손목"];

const emptyExercise = (): Omit<Exercise, "id"> => ({
  name: "",
  bodyPart: "목",
  description: "",
  steps: [""],
  breathing: { inhale: 4, hold: 2, exhale: 4 },
  reps: 10,
  sets: 3,
  svgKey: "",
});

interface Prescription {
  id: string;
  token: string;
  patientName: string;
  notes: string;
  exerciseIds: string[];
  createdAt: string;
  therapistId?: string;
}

interface Therapist {
  id: string;
  name: string;
  role: "admin" | "therapist";
  createdAt: string;
}

function generateToken() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 12);
}

export default function AdminManagePage() {
  const router = useRouter();
  const [tab, setTab] = useState<"exercises" | "prescriptions" | "accounts">("exercises");

  // Current user info (from first load)
  const [myName, setMyName] = useState("");
  const [myRole, setMyRole] = useState<"admin" | "therapist">("therapist");

  // Exercise state
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filterPart, setFilterPart] = useState("전체");
  const [editTarget, setEditTarget] = useState<Exercise | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState<Omit<Exercise, "id">>(emptyExercise());

  // Prescription state
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [prescModalOpen, setPrescModalOpen] = useState(false);
  const [prescForm, setPrescForm] = useState({ patientName: "", notes: "", exerciseIds: [] as string[] });
  const [qrTarget, setQrTarget] = useState<Prescription | null>(null);

  // Account management state (admin only)
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [accountForm, setAccountForm] = useState({ id: "", name: "", password: "", role: "therapist" as "admin" | "therapist" });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    // Verify session by loading prescriptions; if 401 → redirect to login
    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadInitialData = async () => {
    const [exRes, prescRes] = await Promise.all([
      fetch("/api/exercises"),
      fetch("/api/prescriptions"),
    ]);

    if (prescRes.status === 401) {
      router.push("/admin");
      return;
    }

    const exData: ExercisesData = await exRes.json();
    setExercises(exData.exercises);

    const prescData = await prescRes.json();
    if (prescData.prescriptions) setPrescriptions(prescData.prescriptions);

    // Extract name/role from cookie (JWT is httpOnly, so we call a lightweight endpoint)
    // We piggyback on the prescriptions response — instead, we'll call a /api/auth/me
    // For now read from a meta header approach: just load therapists if admin
    // Actually we need to know role. Let's add a /api/auth/me endpoint.
    // Instead, let's check if therapists API succeeds to determine role.
    const tRes = await fetch("/api/admin/therapists");
    if (tRes.ok) {
      setMyRole("admin");
      const tData = await tRes.json();
      setTherapists(tData.therapists);
    }
  };

  const loadExercises = () =>
    fetch("/api/exercises")
      .then((r) => r.json())
      .then((data: ExercisesData) => setExercises(data.exercises));

  const loadPrescriptions = () =>
    fetch("/api/prescriptions")
      .then((r) => r.json())
      .then((data) => {
        if (data.prescriptions) setPrescriptions(data.prescriptions);
      });

  const loadTherapists = () =>
    fetch("/api/admin/therapists")
      .then((r) => r.json())
      .then((data) => {
        if (data.therapists) setTherapists(data.therapists);
      });

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
  };

  // Exercise API
  const apiCall = async (action: string, exercise: Partial<Exercise>) => {
    setSaving(true);
    const res = await fetch("/api/exercises", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, exercise }),
    });
    setSaving(false);
    if (!res.ok) {
      const err = await res.json();
      setMsg(`오류: ${err.error}`);
      return false;
    }
    await loadExercises();
    return true;
  };

  const handleEdit = (ex: Exercise) => {
    setEditTarget(ex);
    setIsNew(false);
    setForm({ ...ex });
    setMsg("");
  };

  const handleNewOpen = () => {
    setEditTarget({ id: `custom-${Date.now()}` } as Exercise);
    setIsNew(true);
    setForm(emptyExercise());
    setMsg("");
  };

  const handleSave = async () => {
    if (!editTarget) return;
    const exercise = { ...form, id: editTarget.id };
    const ok = await apiCall(isNew ? "add" : "update", exercise);
    if (ok) {
      setMsg(isNew ? "운동이 추가되었습니다." : "수정되었습니다.");
      setEditTarget(null);
    }
  };

  const handleDelete = async (ex: Exercise) => {
    if (!confirm(`"${ex.name}"을(를) 삭제할까요?`)) return;
    const ok = await apiCall("delete", { id: ex.id });
    if (ok) setMsg("삭제되었습니다.");
  };

  const updateStep = (i: number, val: string) => {
    const steps = [...form.steps];
    steps[i] = val;
    setForm({ ...form, steps });
  };
  const addStep = () => setForm({ ...form, steps: [...form.steps, ""] });
  const removeStep = (i: number) =>
    setForm({ ...form, steps: form.steps.filter((_, idx) => idx !== i) });

  const filtered =
    filterPart === "전체" ? exercises : exercises.filter((e) => e.bodyPart === filterPart);

  // Prescription API
  const prescApiCall = async (action: string, prescription: Partial<Prescription>) => {
    setSaving(true);
    const res = await fetch("/api/prescriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, prescription }),
    });
    setSaving(false);
    if (!res.ok) {
      const err = await res.json();
      setMsg(`오류: ${err.error}`);
      return false;
    }
    await loadPrescriptions();
    return true;
  };

  const handlePrescSave = async () => {
    if (!prescForm.patientName) return;
    const prescription: Prescription = {
      id: `presc-${Date.now()}`,
      token: generateToken(),
      patientName: prescForm.patientName,
      notes: prescForm.notes,
      exerciseIds: prescForm.exerciseIds,
      createdAt: new Date().toISOString(),
    };
    const ok = await prescApiCall("add", prescription);
    if (ok) {
      setPrescModalOpen(false);
      setPrescForm({ patientName: "", notes: "", exerciseIds: [] });
      setMsg("처방전이 생성되었습니다.");
    }
  };

  const handlePrescDelete = async (p: Prescription) => {
    if (!confirm(`"${p.patientName}"의 처방전을 삭제할까요?`)) return;
    const ok = await prescApiCall("delete", { id: p.id });
    if (ok) setMsg("삭제되었습니다.");
  };

  const toggleExercise = (id: string) => {
    setPrescForm((prev) => ({
      ...prev,
      exerciseIds: prev.exerciseIds.includes(id)
        ? prev.exerciseIds.filter((e) => e !== id)
        : [...prev.exerciseIds, id],
    }));
  };

  const prescriptionUrl = (p: Prescription) =>
    typeof window !== "undefined"
      ? `${window.location.origin}/p/${p.token}`
      : `/p/${p.token}`;

  // Account management
  const handleAccountAdd = async () => {
    if (!accountForm.id || !accountForm.name || !accountForm.password) return;
    setSaving(true);
    const res = await fetch("/api/admin/therapists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add", ...accountForm }),
    });
    setSaving(false);
    if (!res.ok) {
      const err = await res.json();
      setMsg(`오류: ${err.error}`);
      return;
    }
    setAccountModalOpen(false);
    setAccountForm({ id: "", name: "", password: "", role: "therapist" });
    setMsg("계정이 추가되었습니다.");
    await loadTherapists();
  };

  const handleAccountDelete = async (t: Therapist) => {
    if (!confirm(`"${t.name}" 계정을 삭제할까요?`)) return;
    const res = await fetch("/api/admin/therapists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id: t.id }),
    });
    if (!res.ok) {
      const err = await res.json();
      setMsg(`오류: ${err.error}`);
      return;
    }
    setMsg("삭제되었습니다.");
    await loadTherapists();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-10">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">관리자</h1>
            {myName && <p className="text-xs text-slate-400 mt-0.5">{myName}</p>}
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-slate-200 text-slate-600 font-semibold hover:bg-slate-300 active:scale-95 transition-all"
          >
            로그아웃
          </button>
        </div>

        {/* 탭 */}
        <div className="flex gap-1 bg-slate-200 rounded-xl p-1 mb-6">
          <button
            onClick={() => { setTab("exercises"); setMsg(""); }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === "exercises" ? "bg-white text-slate-800 shadow" : "text-slate-500"
            }`}
          >
            운동 관리
          </button>
          <button
            onClick={() => { setTab("prescriptions"); setMsg(""); }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === "prescriptions" ? "bg-white text-slate-800 shadow" : "text-slate-500"
            }`}
          >
            처방전 관리
          </button>
          {myRole === "admin" && (
            <button
              onClick={() => { setTab("accounts"); setMsg(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === "accounts" ? "bg-white text-slate-800 shadow" : "text-slate-500"
              }`}
            >
              계정 관리
            </button>
          )}
        </div>

        {msg && (
          <div className={`mb-4 px-4 py-2 rounded-xl text-sm font-medium border ${
            msg.startsWith("오류:")
              ? "bg-red-50 text-red-700 border-red-200"
              : "bg-green-50 text-green-700 border-green-200"
          }`}>
            {msg}
          </div>
        )}

        {/* ───── 운동 관리 탭 ───── */}
        {tab === "exercises" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-500 text-sm">총 {exercises.length}개</p>
              <button
                onClick={handleNewOpen}
                className="px-4 py-2 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 active:scale-95 transition-all"
              >
                + 추가
              </button>
            </div>

            {/* 필터 */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
              {["전체", ...BODY_PARTS].map((p) => (
                <button
                  key={p}
                  onClick={() => setFilterPart(p)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    filterPart === p
                      ? "bg-blue-500 text-white"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* 운동 목록 */}
            <div className="space-y-3">
              {filtered.map((ex) => (
                <div key={ex.id} className="bg-white rounded-2xl shadow p-4 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                        {ex.bodyPart}
                      </span>
                      <span className="font-bold text-slate-800">{ex.name}</span>
                    </div>
                    <p className="text-slate-500 text-sm mt-1 truncate">{ex.description}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {ex.reps}회 × {ex.sets}세트 &nbsp;|&nbsp; 들숨{ex.breathing.inhale}s
                      {ex.breathing.hold > 0 ? ` 참기${ex.breathing.hold}s` : ""} 날숨{ex.breathing.exhale}s
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(ex)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(ex)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-sm font-medium hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ───── 처방전 관리 탭 ───── */}
        {tab === "prescriptions" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-500 text-sm">총 {prescriptions.length}개</p>
              <button
                onClick={() => { setPrescModalOpen(true); setPrescForm({ patientName: "", notes: "", exerciseIds: [] }); setMsg(""); }}
                className="px-4 py-2 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 active:scale-95 transition-all"
              >
                + 새 처방
              </button>
            </div>

            <div className="space-y-3">
              {prescriptions.length === 0 && (
                <div className="text-center py-16 text-slate-400">
                  <p className="text-4xl mb-3">📋</p>
                  <p>생성된 처방전이 없습니다.</p>
                </div>
              )}
              {prescriptions.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl shadow p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-slate-800">{p.patientName}</span>
                      <span className="text-slate-400 text-sm ml-2">{p.exerciseIds.length}개 운동</span>
                      {p.notes && (
                        <p className="text-xs text-slate-500 mt-0.5 truncate">{p.notes}</p>
                      )}
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(p.createdAt).toLocaleDateString("ko-KR")}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => setQrTarget(p)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        title="QR코드 & 링크"
                      >
                        QR
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(prescriptionUrl(p));
                          setMsg("링크가 복사되었습니다.");
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        링크 복사
                      </button>
                      <button
                        onClick={() => handlePrescDelete(p)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-sm font-medium hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ───── 계정 관리 탭 (admin only) ───── */}
        {tab === "accounts" && myRole === "admin" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-500 text-sm">총 {therapists.length}명</p>
              <button
                onClick={() => { setAccountModalOpen(true); setAccountForm({ id: "", name: "", password: "", role: "therapist" }); setMsg(""); }}
                className="px-4 py-2 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 active:scale-95 transition-all"
              >
                + 계정 추가
              </button>
            </div>

            <div className="space-y-3">
              {therapists.map((t) => (
                <div key={t.id} className="bg-white rounded-2xl shadow p-4 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        t.role === "admin"
                          ? "bg-purple-50 text-purple-600"
                          : "bg-blue-50 text-blue-600"
                      }`}>
                        {t.role === "admin" ? "관리자" : "치료사"}
                      </span>
                      <span className="font-bold text-slate-800">{t.name}</span>
                      <span className="text-slate-400 text-sm">@{t.id}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      가입일 {new Date(t.createdAt).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                  <button
                    onClick={() => handleAccountDelete(t)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-sm font-medium hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ───── 운동 편집 모달 ───── */}
      {editTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 px-4 py-6">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <h2 className="text-xl font-bold text-slate-800">
              {isNew ? "새 운동 추가" : "운동 수정"}
            </h2>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-600">운동 이름</label>
                <input
                  className="mt-1 w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:outline-none text-slate-800"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600">부위</label>
                <select
                  className="mt-1 w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:outline-none text-slate-800 bg-white"
                  value={form.bodyPart}
                  onChange={(e) => setForm({ ...form, bodyPart: e.target.value })}
                >
                  {BODY_PARTS.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600">설명</label>
                <textarea
                  className="mt-1 w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:outline-none text-slate-800 resize-none"
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600">운동 순서</label>
                {form.steps.map((step, i) => (
                  <div key={i} className="flex gap-2 mt-1">
                    <input
                      className="flex-1 px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:outline-none text-slate-800 text-sm"
                      value={step}
                      onChange={(e) => updateStep(i, e.target.value)}
                      placeholder={`${i + 1}번째 순서`}
                    />
                    <button
                      onClick={() => removeStep(i)}
                      className="px-2 py-1 rounded-lg bg-red-50 text-red-400 hover:bg-red-100"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button onClick={addStep} className="mt-2 text-sm text-blue-500 hover:underline">
                  + 순서 추가
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-slate-600">횟수</label>
                  <input
                    type="number"
                    className="mt-1 w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:outline-none text-slate-800"
                    value={form.reps}
                    onChange={(e) => setForm({ ...form, reps: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">세트</label>
                  <input
                    type="number"
                    className="mt-1 w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:outline-none text-slate-800"
                    value={form.sets}
                    onChange={(e) => setForm({ ...form, sets: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600">호흡 타이밍 (초)</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {(["inhale", "hold", "exhale"] as const).map((key) => (
                    <div key={key}>
                      <p className="text-xs text-slate-400 text-center mb-1">
                        {key === "inhale" ? "들숨" : key === "hold" ? "참기" : "날숨"}
                      </p>
                      <input
                        type="number"
                        min={0}
                        className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:outline-none text-slate-800 text-center"
                        value={form.breathing[key]}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            breathing: { ...form.breathing, [key]: Number(e.target.value) },
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setEditTarget(null)}
                className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200 active:scale-95 transition-all"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name}
                className="flex-1 py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 disabled:opacity-40 active:scale-95 transition-all"
              >
                {saving ? "저장 중..." : "저장"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───── 새 처방전 모달 ───── */}
      {prescModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 px-4 py-6">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <h2 className="text-xl font-bold text-slate-800">새 처방전</h2>

            <div>
              <label className="text-sm font-medium text-slate-600">환자 이름</label>
              <input
                className="mt-1 w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:outline-none text-slate-800"
                placeholder="홍길동"
                value={prescForm.patientName}
                onChange={(e) => setPrescForm({ ...prescForm, patientName: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600">메모</label>
              <textarea
                className="mt-1 w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:outline-none text-slate-800 resize-none"
                rows={2}
                placeholder="주 3회, 아침 실시"
                value={prescForm.notes}
                onChange={(e) => setPrescForm({ ...prescForm, notes: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600 block mb-2">
                운동 선택 ({prescForm.exerciseIds.length}개 선택됨)
              </label>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {BODY_PARTS.map((part) => {
                  const partExercises = exercises.filter((e) => e.bodyPart === part);
                  if (partExercises.length === 0) return null;
                  return (
                    <div key={part}>
                      <p className="text-xs font-semibold text-slate-400 uppercase mb-1">{part}</p>
                      {partExercises.map((ex) => (
                        <label
                          key={ex.id}
                          className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-slate-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="w-4 h-4 accent-blue-500"
                            checked={prescForm.exerciseIds.includes(ex.id)}
                            onChange={() => toggleExercise(ex.id)}
                          />
                          <span className="text-slate-700 text-sm">{ex.name}</span>
                          <span className="text-xs text-slate-400 ml-auto">
                            {ex.reps}회 × {ex.sets}세트
                          </span>
                        </label>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setPrescModalOpen(false)}
                className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200 active:scale-95 transition-all"
              >
                취소
              </button>
              <button
                onClick={handlePrescSave}
                disabled={saving || !prescForm.patientName || prescForm.exerciseIds.length === 0}
                className="flex-1 py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 disabled:opacity-40 active:scale-95 transition-all"
              >
                {saving ? "저장 중..." : "처방 생성"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───── 계정 추가 모달 ───── */}
      {accountModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 px-4 py-6">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-slate-800">새 계정 추가</h2>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-600">아이디</label>
                <input
                  className="mt-1 w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:outline-none text-slate-800"
                  placeholder="예: kim123"
                  value={accountForm.id}
                  onChange={(e) => setAccountForm({ ...accountForm, id: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">이름</label>
                <input
                  className="mt-1 w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:outline-none text-slate-800"
                  placeholder="예: 김치료사"
                  value={accountForm.name}
                  onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">비밀번호</label>
                <input
                  type="password"
                  className="mt-1 w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:outline-none text-slate-800"
                  placeholder="6자 이상"
                  value={accountForm.password}
                  onChange={(e) => setAccountForm({ ...accountForm, password: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">권한</label>
                <select
                  className="mt-1 w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:outline-none text-slate-800 bg-white"
                  value={accountForm.role}
                  onChange={(e) => setAccountForm({ ...accountForm, role: e.target.value as "admin" | "therapist" })}
                >
                  <option value="therapist">치료사</option>
                  <option value="admin">관리자</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setAccountModalOpen(false)}
                className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200 active:scale-95 transition-all"
              >
                취소
              </button>
              <button
                onClick={handleAccountAdd}
                disabled={saving || !accountForm.id || !accountForm.name || !accountForm.password}
                className="flex-1 py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 disabled:opacity-40 active:scale-95 transition-all"
              >
                {saving ? "추가 중..." : "추가"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───── QR코드 모달 ───── */}
      {qrTarget && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          onClick={() => setQrTarget(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl p-6 max-w-xs w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-slate-800 mb-1">{qrTarget.patientName}님</h2>
            <p className="text-xs text-slate-400 mb-4">QR코드를 스캔하거나 링크를 공유하세요</p>
            <div className="flex justify-center mb-4">
              <QRCodeSVG value={prescriptionUrl(qrTarget)} size={180} />
            </div>
            <p className="text-xs text-slate-500 break-all bg-slate-50 rounded-xl px-3 py-2 mb-4">
              {prescriptionUrl(qrTarget)}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(prescriptionUrl(qrTarget));
                  setMsg("링크가 복사되었습니다.");
                  setQrTarget(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 active:scale-95 transition-all"
              >
                링크 복사
              </button>
              <button
                onClick={() => setQrTarget(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-sm font-semibold hover:bg-slate-200 active:scale-95 transition-all"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
