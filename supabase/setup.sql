-- 1. 사용자 프로필 (Supabase Auth와 연결)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('therapist', 'patient')),
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 운동 마스터 데이터 (기존 JSON 데이터 이관용)
CREATE TABLE exercises (
  id TEXT PRIMARY KEY, -- 'neck-1' 같은 기존 ID 유지 가능
  name TEXT NOT NULL,
  body_part TEXT NOT NULL,
  description TEXT,
  steps JSONB NOT NULL, -- ["단계1", "단계2"]
  breathing JSONB NOT NULL, -- {inhale: 4, hold: 2, exhale: 4}
  default_reps INTEGER DEFAULT 10,
  default_sets INTEGER DEFAULT 3,
  svg_key TEXT NOT NULL,
  difficulty INTEGER DEFAULT 1,
  tags TEXT[] DEFAULT '{}',
  caution TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 치료사-환자 관계 (n:n 관계)
CREATE TABLE therapist_patient_relations (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  therapist_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(therapist_id, patient_id)
);

-- 4. 운동 처방전 (O2O의 핵심)
CREATE TABLE prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- QR코드용 고유 토큰
  therapist_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  patient_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- 초기엔 NULL 가능
  patient_name_input TEXT, -- 매칭 전 치료사가 입력한 이름
  is_claimed BOOLEAN DEFAULT FALSE, -- 환자가 수락했는지 여부
  notes TEXT, -- 치료사가 남기는 전체 코멘트
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '72 hours') -- 3일 후 만료 예시
);

-- 5. 처방전 상세 항목 (하나의 처방전에 여러 운동 포함)
CREATE TABLE prescription_items (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  prescription_id UUID REFERENCES prescriptions(id) ON DELETE CASCADE,
  exercise_id TEXT REFERENCES exercises(id) ON DELETE CASCADE,
  custom_reps INTEGER, -- 환자 맞춤형 횟수 (기본값 무시 가능)
  custom_sets INTEGER, -- 환자 맞춤형 세트
  item_notes TEXT, -- 개별 운동별 지시사항
  sort_order INTEGER DEFAULT 0
);

-- 6. 운동 수행 로그
CREATE TABLE exercise_logs (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_id TEXT REFERENCES exercises(id),
  prescription_id UUID REFERENCES prescriptions(id),
  completed_reps INTEGER,
  completed_sets INTEGER,
  pain_score_before INTEGER CHECK (pain_score_before BETWEEN 0 AND 10),
  pain_score_after INTEGER CHECK (pain_score_after BETWEEN 0 AND 10),
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 보안 설정 (Row Level Security - RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapist_patient_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescription_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_logs ENABLE ROW LEVEL SECURITY;

-- 누구나 운동 마스터 데이터를 읽을 수 있게 허용
CREATE POLICY "Everyone can view exercises" ON exercises FOR SELECT USING (true);
