export interface Breathing {
  inhale: number;
  hold: number;
  exhale: number;
}

export interface Exercise {
  id: string; // 'neck-1' 등
  name: string;
  body_part: string; // DB match
  description?: string;
  steps: string[]; // JSONB -> string[]
  breathing: Breathing; // JSONB -> Breathing
  default_reps: number;
  default_sets: number;
  svg_key: string;
  difficulty?: number;
  tags?: string[];
  caution?: string;
  created_at?: string;
}

export interface Prescription {
  id: string; // UUID (Token 역할)
  therapist_id?: string;
  patient_id?: string;
  patient_name_input: string;
  is_claimed: boolean;
  notes?: string;
  created_at: string;
  expires_at?: string;
  // Join 데이터 (처방전에 포함된 운동들)
  items?: PrescriptionItem[];
}

export interface PrescriptionItem {
  id: number;
  prescription_id: string;
  exercise_id: string;
  custom_reps?: number;
  custom_sets?: number;
  item_notes?: string;
  sort_order: number;
  // Join 데이터
  exercise?: Exercise;
}

export interface ExerciseLog {
  id: number;
  user_id: string;
  exercise_id: string;
  prescription_id?: string;
  completed_reps: number;
  completed_sets: number;
  pain_score_before: number;
  pain_score_after: number;
  feedback?: string;
  created_at: string;
}

export interface ExercisesData {
  bodyParts: string[];
  exercises: Exercise[];
}
