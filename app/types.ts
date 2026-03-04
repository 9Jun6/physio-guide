export interface Breathing {
  inhale: number;
  hold: number;
  exhale: number;
}

export interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  description: string;
  steps: string[];
  breathing: Breathing;
  reps: number;
  sets: number;
  svgKey: string;
}

export interface ExercisesData {
  bodyParts: string[];
  exercises: Exercise[];
}
