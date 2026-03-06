export interface Breathing {
  inhale: number;
  hold: number;
  exhale: number;
}

export interface Exercise {
  id: string;
  name: string;
  body_part: string;
  description?: string;
  steps: string[];
  breathing: Breathing;
  default_reps: number;
  default_sets: number;
  svg_key: string;
  difficulty?: number;
  tags?: string[];
  caution?: string;
  created_at?: string;
}

export interface Prescription {
  id: string;
  therapist_id?: string;
  patient_id?: string;
  patient_name_input: string;
  is_claimed: boolean;
  notes?: string;
  created_at: string;
  expires_at?: string;
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
  exercise?: Exercise; // Joined data
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
  // Joined data
  exercise?: {
    name: string;
    body_part: string;
  };
  prescription?: {
    patient_name_input: string;
    therapist_id: string;
  };
}

export interface ExercisesData {
  bodyParts: string[];
  exercises: Exercise[];
}
