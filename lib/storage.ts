/**
 * Storage abstraction:
 * - Local dev: reads/writes from data/*.json (file system)
 * - Production (Vercel): reads/writes via Vercel KV (Redis)
 *
 * Exercises are seeded from exercises.json into KV on first access.
 */

import path from "path";

const useKV = !!process.env.KV_REST_API_URL;

// ─── Prescriptions ──────────────────────────────────────────────

export async function readPrescriptions(): Promise<{ prescriptions: unknown[] }> {
  if (useKV) {
    const { kv } = await import("@vercel/kv");
    return (await kv.get<{ prescriptions: unknown[] }>("prescriptions")) ?? { prescriptions: [] };
  }
  const { readFileSync } = await import("fs");
  const dataPath = path.join(process.cwd(), "data", "prescriptions.json");
  return JSON.parse(readFileSync(dataPath, "utf-8"));
}

export async function writePrescriptions(data: unknown): Promise<void> {
  if (useKV) {
    const { kv } = await import("@vercel/kv");
    await kv.set("prescriptions", data);
    return;
  }
  const { writeFileSync } = await import("fs");
  const dataPath = path.join(process.cwd(), "data", "prescriptions.json");
  writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");
}

// ─── Therapists ──────────────────────────────────────────────────

export interface Therapist {
  id: string;
  name: string;
  passwordHash: string;
  role: "admin" | "therapist";
  createdAt: string;
}

export async function readTherapists(): Promise<{ therapists: Therapist[] }> {
  if (useKV) {
    const { kv } = await import("@vercel/kv");
    return (await kv.get<{ therapists: Therapist[] }>("therapists")) ?? { therapists: [] };
  }
  const { readFileSync } = await import("fs");
  const dataPath = path.join(process.cwd(), "data", "therapists.json");
  return JSON.parse(readFileSync(dataPath, "utf-8"));
}

export async function writeTherapists(data: { therapists: Therapist[] }): Promise<void> {
  if (useKV) {
    const { kv } = await import("@vercel/kv");
    await kv.set("therapists", data);
    return;
  }
  const { writeFileSync } = await import("fs");
  const dataPath = path.join(process.cwd(), "data", "therapists.json");
  writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");
}

// ─── Exercises ───────────────────────────────────────────────────

export async function readExercises(): Promise<{ bodyParts: string[]; exercises: unknown[] }> {
  if (useKV) {
    const { kv } = await import("@vercel/kv");
    let data = await kv.get<{ bodyParts: string[]; exercises: unknown[] }>("exercises");
    if (!data) {
      // Seed KV from bundled JSON on first access
      const { readFileSync } = await import("fs");
      const dataPath = path.join(process.cwd(), "data", "exercises.json");
      data = JSON.parse(readFileSync(dataPath, "utf-8"));
      await kv.set("exercises", data);
    }
    return data!;
  }
  const { readFileSync } = await import("fs");
  const dataPath = path.join(process.cwd(), "data", "exercises.json");
  return JSON.parse(readFileSync(dataPath, "utf-8"));
}

export async function writeExercises(data: unknown): Promise<void> {
  if (useKV) {
    const { kv } = await import("@vercel/kv");
    await kv.set("exercises", data);
    return;
  }
  const { writeFileSync } = await import("fs");
  const dataPath = path.join(process.cwd(), "data", "exercises.json");
  writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");
}
