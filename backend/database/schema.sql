-- ============================================
-- UKURKOMPETEN DATABASE SCHEMA
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    location VARCHAR(100),
    target_role VARCHAR(200),
    is_email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- PACKAGES TABLE
-- ============================================
CREATE TABLE packages (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    package_type VARCHAR(50) NOT NULL, -- 'B2C' or 'B2B'
    price DECIMAL(12, 2) NOT NULL,
    features JSONB NOT NULL, -- ['module_1', 'module_2', ...]
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Insert default packages
INSERT INTO packages (name, package_type, price, features) VALUES
('Free Starter', 'B2C', 0, '["module_1_basic"]'),
('Essential', 'B2C', 149000, '["module_1", "module_2", "module_3"]'),
('Complete', 'B2C', 299000, '["module_1", "module_2", "module_3", "module_4", "module_5"]');

-- ============================================
-- USER PACKAGES (SUBSCRIPTIONS)
-- ============================================
CREATE TABLE user_packages (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    package_id BIGINT REFERENCES packages(id),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, expired, cancelled
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_packages_user ON user_packages(user_id);

-- ============================================
-- MODULES TABLE
-- ============================================
CREATE TABLE modules (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    time_limit INTEGER, -- minutes, NULL = unlimited
    scoring_rules JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Insert default modules
INSERT INTO modules (id, name, description, time_limit, scoring_rules) VALUES
('module_1', 'Career Interest & Personality', 'Holland Code (RIASEC) + Big Five Personality Assessment', 15, '{"holland": {"weight": 0.6, "questions": 60}, "big5": {"weight": 0.4, "questions": 44}}'),
('module_2', 'Transferable Skills Assessment', 'Skills Inventory + Soft Skills Rubric', 20, '{"skills": {"weight": 0.7}, "evidence": {"weight": 0.3}}'),
('module_3', 'Work Values & Motivators', 'Work Values Inventory + Motivational Appraisal', 15, '{"values": {"weight": 0.8}, "motivators": {"weight": 0.2}}'),
('module_4', 'Career Readiness Competency', 'NACE 8 Competencies Self-Rating', 15, '{"competencies": {"weight": 1.0}}'),
('module_5', 'Career Transition Readiness', 'Career Transition Inventory (CTI) + Personal SWOT', 15, '{"cti": {"weight": 0.7}, "swot": {"weight": 0.3}}');

-- ============================================
-- ASSESSMENTS TABLE
-- ============================================
CREATE TABLE assessments (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    module_id VARCHAR(50) REFERENCES modules(id),
    status VARCHAR(50) NOT NULL DEFAULT 'in_progress', -- in_progress, completed, abandoned
    started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ,
    total_score DECIMAL(5, 2),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_assessments_user ON assessments(user_id);
CREATE INDEX idx_assessments_module ON assessments(module_id);

-- ============================================
-- ASSESSMENT ITEMS (QUESTIONS)
-- ============================================
CREATE TABLE assessment_items (
    id BIGSERIAL PRIMARY KEY,
    module_id VARCHAR(50) REFERENCES modules(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL, -- multiple_choice, likert, ranking, text
    options JSONB, -- ["Option A", "Option B", "Option C"]
    correct_answer VARCHAR(500), -- for scoring
    order_index INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_assessment_items_module ON assessment_items(module_id);

-- ============================================
-- ASSESSMENT ANSWERS
-- ============================================
CREATE TABLE assessment_answers (
    id BIGSERIAL PRIMARY KEY,
    assessment_id BIGINT REFERENCES assessments(id) ON DELETE CASCADE,
    item_id BIGINT REFERENCES assessment_items(id) ON DELETE CASCADE,
    user_answer TEXT NOT NULL,
    time_spent INTEGER, -- seconds
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_assessment_answers_assessment ON assessment_answers(assessment_id);
CREATE INDEX idx_assessment_answers_item ON assessment_answers(item_id);

-- ============================================
-- ASSESSMENT RESULTS
-- ============================================
CREATE TABLE assessment_results (
    id BIGSERIAL PRIMARY KEY,
    assessment_id BIGINT REFERENCES assessments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    module_id VARCHAR(50) REFERENCES modules(id),
    dimension VARCHAR(100) NOT NULL, -- holland_R, holland_I, big5_O, etc.
    raw_score DECIMAL(5, 2) NOT NULL,
    normalized_score DECIMAL(5, 2) NOT NULL, -- 0-100
    percentile DECIMAL(5, 2), -- 0-100
    interpretation TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_assessment_results_user ON assessment_results(user_id);
CREATE INDEX idx_assessment_results_module ON assessment_results(module_id);

-- ============================================
-- TRANSACTIONS TABLE
-- ============================================
CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    package_id BIGINT REFERENCES packages(id),
    amount DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(50), -- credit_card, bank_transfer, gopay, ovo, dana
    payment_status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, success, failed, refunded
    payment_gateway_tx_id VARCHAR(200),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_user ON transactions(user_id);

-- ============================================
-- TRIGGER FOR updated_at
-- ============================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- ============================================
-- SEED DATA: MODULE 1 QUESTIONS (HOLLAND CODE)
-- ============================================

-- Holland Code Questions (60 questions, 10 per dimension)
-- R = Realistic, I = Investigative, A = Artistic, S = Social, E = Enterprising, C = Conventional

INSERT INTO assessment_items (module_id, question_text, question_type, options, order_index) VALUES
-- Realistic (R) - Questions 1-10
('module_1', 'Saya senang bekerja dengan mesin dan peralatan', 'likert', '["Strongly Dislike", "Dislike", "Neutral", "Like", "Strongly Like"]', 1),
('module_1', 'Saya lebih suka bekerja di luar ruangan daripada di dalam ruangan', 'likert', '["Strongly Dislike", "Dislike", "Neutral", "Like", "Strongly Like"]', 2),
('module_1', 'Saya senang memperbaiki barang-barang yang rusak', 'likert', '["Strongly Dislike", "Dislike", "Neutral", "Like", "Strongly Like"]', 3),
('module_1', 'Saya tertarik dengan pekerjaan yang melibatkan aktivitas fisik', 'likert', '["Strongly Dislike", "Dislike", "Neutral", "Like", "Strongly Like"]', 4),
('module_1', 'Saya senang menggunakan alat-alat teknis', 'likert', '["Strongly Dislike", "Dislike", "Neutral", "Like", "Strongly Like"]', 5),
('module_1', 'Saya lebih suka bekerja dengan benda daripada dengan orang', 'likert', '["Strongly Dislike", "Dislike", "Neutral", "Like", "Strongly Like"]', 6),
('module_1', 'Saya tertarik dengan pekerjaan konstruksi atau bangunan', 'likert', '["Strongly Dislike", "Dislike", "Neutral", "Like", "Strongly Like"]', 7),
('module_1', 'Saya senang bekerja dengan tangan saya', 'likert', '["Strongly Dislike", "Dislike", "Neutral", "Like", "Strongly Like"]', 8),
('module_1', 'Saya tertarik dengan pekerjaan di bidang pertanian atau perikanan', 'likert', '["Strongly Dislike", "Dislike", "Neutral", "Like", "Strongly Like"]', 9),
('module_1', 'Saya senang mengoperasikan kendaraan atau mesin berat', 'likert', '["Strongly Dislike", "Dislike", "Neutral", "Like", "Strongly Like"]', 10),

-- Investigative (I) - Questions 11-20
('module_1', 'Saya senang memecahkan masalah matematika atau logika', 'likert', '["Strongly Dislike", "Dislike", "Neutral", "Like", "Strongly Like"]', 11),
('module_1', 'Saya tertarik dengan penelitian ilmiah', 'likert', '["Strongly Dislike", "Dislike", "Neutral", "Like", "Strongly Like"]', 12),
('module_1', 'Saya senang menganalisis data dan informasi', 'likert', '["Strongly Dislike", "Dislike", "Neutral", "Like", "Strongly Like"]', 13),
('module_1', 'Saya lebih suka bekerja sendiri dalam proyek penelitian', 'likert', '["Strongly Dislike", "Dislike", "Neutral", "Like", "Strongly Like"]', 14),
('module_1', 'Saya tertarik dengan pekerjaan di bidang teknologi atau sains', 'likert', '["Strongly Dislike", "Dislike", "Neutral", "Like", "Strongly Like"]', 15),
('module_1', 'Saya senang membaca jurnal atau artikel ilmiah', 'likert', '["Strongly Dislike", "Dislike", "Neutral", "Like", "Strongly Like"]', 16),
('module_1', 'Saya tertarik dengan eksperimen dan pengujian hipotesis', 'likert', '["Strongly Dislike", "Dislike", "Neutral", "Like", "Strongly Like"]', 17),
('module_1', 'Saya senang mempelajari teori dan konsep abstrak', 'likert', '["Strongly Dislike", "Dislike", "Neutral", "Like", "Strongly Like"]', 18),
('module_1', 'Saya tertarik dengan pekerjaan yang memerlukan pemikiran kritis', 'likert', '["Strongly Dislike", "Dislike", "Neutral", "Like", "Strongly Like"]', 19),
('module_1', 'Saya senang menggunakan komputer untuk analisis data', 'likert', '["Strongly Dislike", "Dislike", "Neutral", "Like", "Strongly Like"]', 20);

-- NOTE: Add 40 more questions for Holland Code (A, S, E, C dimensions)
-- Then add 44 questions for Big Five (OCEAN)
-- Total: 104 questions for Module 1

-- ============================================
-- VIEW: USER ASSESSMENT SUMMARY
-- ============================================
CREATE OR REPLACE VIEW user_assessment_summary AS
SELECT 
    u.id as user_id,
    u.email,
    u.full_name,
    COUNT(a.id) as total_assessments,
    COUNT(CASE WHEN a.status = 'completed' THEN 1 END) as completed_assessments,
    MAX(a.completed_at) as last_assessment_date
FROM users u
LEFT JOIN assessments a ON u.id = a.user_id
GROUP BY u.id, u.email, u.full_name;

-- ============================================
-- VIEW: MODULE STATISTICS
-- ============================================
CREATE OR REPLACE VIEW module_statistics AS
SELECT 
    m.id as module_id,
    m.name as module_name,
    COUNT(a.id) as total_assessments,
    COUNT(CASE WHEN a.status = 'completed' THEN 1 END) as completed_assessments,
    ROUND(AVG(a.total_score), 2) as average_score,
    ROUND((COUNT(CASE WHEN a.status = 'completed' THEN 1 END)::DECIMAL / COUNT(a.id)::DECIMAL) * 100, 2) as completion_rate
FROM modules m
LEFT JOIN assessments a ON m.id = a.module_id
GROUP BY m.id, m.name;

-- ============================================
-- END OF SCHEMA
-- ============================================
