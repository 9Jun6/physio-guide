-- 1. 사용자 프로필 (Supabase Auth와 연결)
-- 역할: admin(사이트 관리자), therapist(치료사), patient(환자)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'therapist', 'patient')),
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 운동 마스터 데이터
CREATE TABLE exercises (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  body_part TEXT NOT NULL,
  description TEXT,
  steps JSONB NOT NULL,
  breathing JSONB NOT NULL,
  default_reps INTEGER DEFAULT 10,
  default_sets INTEGER DEFAULT 3,
  svg_key TEXT NOT NULL,
  difficulty INTEGER DEFAULT 1,
  tags TEXT[] DEFAULT '{}',
  caution TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 치료사-환자 관계
CREATE TABLE therapist_patient_relations (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  therapist_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(therapist_id, patient_id)
);

-- 4. 운동 처방전
CREATE TABLE prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- 처방한 치료사
  patient_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- 수락한 환자
  patient_name_input TEXT,
  is_claimed BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '72 hours')
);

-- 5. 처방전 상세 항목
CREATE TABLE prescription_items (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  prescription_id UUID REFERENCES prescriptions(id) ON DELETE CASCADE,
  exercise_id TEXT REFERENCES exercises(id) ON DELETE CASCADE,
  custom_reps INTEGER,
  custom_sets INTEGER,
  item_notes TEXT,
  sort_order INTEGER DEFAULT 0
);

-- 6. 운동 수행 로그
CREATE TABLE exercise_logs (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE, -- 수행한 유저 (환자)
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

-- ───── RLS POLICIES (권한 정책) ─────

-- (1) Profiles: 본인 프로필만 수정 가능, 누구나 읽기 가능(조회용)
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- (2) Exercises: 누구나 조회 가능, admin만 수정 가능
CREATE POLICY "Everyone can view exercises" ON exercises FOR SELECT USING (true);
CREATE POLICY "Admins can manage exercises" ON exercises 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- (3) Prescriptions: 치료사는 본인이 발행한 것 조회 가능, 환자는 본인에게 온 것 조회 가능
CREATE POLICY "Therapists can view/manage own prescriptions" ON prescriptions 
  FOR ALL USING (
    therapist_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Patients can view assigned prescriptions" ON prescriptions 
  FOR SELECT USING (id::text = current_setting('request.jwt.claims', true)::json->>'sub' OR id IS NOT NULL); -- QR 토큰 접근 허용

-- (4) Exercise Logs: 치료사는 본인 환자의 로그 조회 가능, 환자는 본인 것 생성/조회 가능
CREATE POLICY "Patients can manage own logs" ON exercise_logs 
  FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Therapists can view patient logs" ON exercise_logs 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM prescriptions p 
      WHERE p.id = exercise_logs.prescription_id AND p.therapist_id = auth.uid()
    )
  );
