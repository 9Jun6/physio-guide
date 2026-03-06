"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Exercise, Prescription, ExerciseLog } from "../../types";
import * as actions from "../actions";

export function useAdminData() {
  const router = useRouter();
  const supabase = createClient();

  const [userRole, setUserRole] = useState<string | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [logs, setLogs] = useState<ExerciseLog[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // 데이터 로드 통합 함수
  const loadAllData = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/admin");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      
      setUserRole(profile?.role || "therapist");

      const [exs, prescs, lg] = await Promise.all([
        actions.getExercisesAction(),
        actions.getPrescriptionsAction(),
        actions.getLogsAction()
      ]);

      setExercises(exs as Exercise[]);
      setPrescriptions(prescs as Prescription[]);
      setLogs(lg as ExerciseLog[]);
    } catch (e: any) {
      setMsg(`오류: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, [router, supabase]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // 로그아웃
  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/admin");
  };

  // 운동 관련 액션
  const saveExercise = async (exercise: any, isNew: boolean) => {
    setSaving(true);
    try {
      await actions.saveExerciseAction(exercise);
      setMsg(isNew ? "운동이 추가되었습니다." : "수정되었습니다.");
      await loadAllData();
      return true;
    } catch (e: any) {
      setMsg(`오류: ${e.message}`);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteExercise = async (id: string) => {
    try {
      await actions.deleteExerciseAction(id);
      setMsg("삭제되었습니다.");
      await loadAllData();
    } catch (e: any) {
      setMsg(`오류: ${e.message}`);
    }
  };

  // 처방전 관련 액션
  const savePrescription = async (payload: any) => {
    setSaving(true);
    try {
      await actions.createPrescriptionAction(payload);
      setMsg("처방전이 발행되었습니다.");
      await loadAllData();
      return true;
    } catch (e: any) {
      setMsg(`오류: ${e.message}`);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deletePrescription = async (id: string) => {
    try {
      await actions.deletePrescriptionAction(id);
      setMsg("처방전이 삭제되었습니다.");
      await loadAllData();
    } catch (e: any) {
      setMsg(`오류: ${e.message}`);
    }
  };

  return {
    userRole,
    exercises,
    prescriptions,
    logs,
    loading,
    saving,
    msg,
    setMsg,
    logout,
    saveExercise,
    deleteExercise,
    savePrescription,
    deletePrescription,
    refresh: loadAllData
  };
}
