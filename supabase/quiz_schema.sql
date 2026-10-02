-- ==============================================================================
-- DATABASE SCHEMA: BÀI KIỂM TRA TRẮC NGHIỆM THỰC HÀNH HÀN (40 CÂU - 30 PHÚT)
-- Bảng: quiz_submissions
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.quiz_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    
    -- Thông tin định danh sinh viên
    mssv VARCHAR(50) NOT NULL,
    ho_ten VARCHAR(150) NOT NULL,
    lop VARCHAR(100) NOT NULL,
    
    -- Kết quả bài kiểm tra
    score NUMERIC(4, 2) NOT NULL DEFAULT 0.00,        -- Điểm thang 10 (VD: 8.75)
    correct_count INT NOT NULL DEFAULT 0,              -- Số câu đúng (VD: 35)
    total_questions INT NOT NULL DEFAULT 40,           -- Tổng số câu (40)
    time_spent_seconds INT NOT NULL DEFAULT 0,         -- Thời gian làm bài (giây)
    answers JSONB NOT NULL DEFAULT '{}'::jsonb,        -- Chi tiết các câu đã chọn
    
    -- Mỗi sinh viên chỉ được nộp bài 1 lần duy nhất
    CONSTRAINT uq_quiz_student_submission UNIQUE (mssv)
);

-- Chỉ mục tối ưu tìm kiếm và xuất điểm
CREATE INDEX IF NOT EXISTS idx_quiz_mssv ON public.quiz_submissions (mssv);
CREATE INDEX IF NOT EXISTS idx_quiz_lop ON public.quiz_submissions (lop);
CREATE INDEX IF NOT EXISTS idx_quiz_score ON public.quiz_submissions (score DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_created_at ON public.quiz_submissions (created_at DESC);

-- BẢO MẬT VỚI RLS (Row Level Security)
ALTER TABLE public.quiz_submissions ENABLE ROW LEVEL SECURITY;

-- 1. Cho phép sinh viên (anon) được INSERT nộp bài của mình
DROP POLICY IF EXISTS "Cho phep sinh vien nop bai thi" ON public.quiz_submissions;
CREATE POLICY "Cho phep sinh vien nop bai thi" 
ON public.quiz_submissions 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- 2. Giảng viên (authenticated) có toàn quyền xem, sửa, xuất báo cáo điểm
DROP POLICY IF EXISTS "Cho phep giang vien quan ly diem thi" ON public.quiz_submissions;
CREATE POLICY "Cho phep giang vien quan ly diem thi" 
ON public.quiz_submissions 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
