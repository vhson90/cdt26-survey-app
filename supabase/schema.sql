-- ==============================================================================
-- DATABASE SCHEMA: KHẢO SÁT CÁCH HỌC TẬP VÀ PHỐI HỢP TRONG LỚP
-- Hệ quản trị CSDL: Supabase (PostgreSQL 15+)
-- Tương thích: Free Tier Supabase
-- ==============================================================================

-- 1. TẠO BẢNG DỮ LIỆU KHẢO SÁT (submissions)
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    
    -- Thông tin định danh sinh viên
    mssv VARCHAR(50) NOT NULL,
    ho_ten VARCHAR(150) NOT NULL,
    lop VARCHAR(100) NOT NULL,
    so_dien_thoai VARCHAR(25) NOT NULL,
    email VARCHAR(150) NOT NULL,
    kenh_lien_he VARCHAR(100) NOT NULL,
    session_code VARCHAR(50) NOT NULL DEFAULT '2026_HK1',
    
    -- Kết quả khảo sát
    answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    dimension_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
    overall_avg NUMERIC(4, 2) NOT NULL DEFAULT 0.00,
    
    -- Trường dành riêng cho Giảng viên (Admin)
    tagged_for_review BOOLEAN NOT NULL DEFAULT false,
    lecturer_notes TEXT DEFAULT NULL,
    
    -- Chống submit trùng lặp theo cặp (mssv, lop) hoặc (mssv, session_code)
    CONSTRAINT uq_student_submission UNIQUE (mssv, session_code)
);

-- 2. TẠO CHỈ MỤC (INDEXES) TỐI ƯU HÓA TÌM KIẾM
CREATE INDEX IF NOT EXISTS idx_submissions_mssv ON public.submissions (mssv);
CREATE INDEX IF NOT EXISTS idx_submissions_lop ON public.submissions (lop);
CREATE INDEX IF NOT EXISTS idx_submissions_session ON public.submissions (session_code);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON public.submissions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_tagged ON public.submissions (tagged_for_review);

-- 3. BẢO MẬT VỚI ROW LEVEL SECURITY (RLS)
-- Mục tiêu bảo mật:
-- Sinh viên (anon role) chỉ được phép INSERT (Gửi kết quả của mình).
-- Tuyệt đối KHÔNG cấp quyền SELECT (Đọc) cho anon role để ngăn chặn lộ lọt thông tin cá nhân của các bạn khác.
-- Giảng viên (authenticated role) có toàn quyền SELECT, UPDATE, DELETE.

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Xóa các policy cũ nếu có trước khi tạo lại
DROP POLICY IF EXISTS "Cho phep sinh vien insert ket qua" ON public.submissions;
DROP POLICY IF EXISTS "Cho phep giang vien quan ly toan quyen" ON public.submissions;

-- Chính sách 1: Khách vãng lai / Sinh viên (anon) ĐƯỢC INSERT
CREATE POLICY "Cho phep sinh vien insert ket qua" 
ON public.submissions 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- Chính sách 2: Người dùng đã đăng nhập (Giảng viên - authenticated) CÓ TOÀN QUYỀN
CREATE POLICY "Cho phep giang vien quan ly toan quyen" 
ON public.submissions 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- 4. HÀM RPC KIỂM TRA TRÙNG MSSV MỘT CÁCH AN TOÀN
-- Hàm này cho phép giao diện sinh viên kiểm tra nhanh xem MSSV đã nộp chưa
-- mà hoàn toàn không trả về bất kỳ dữ liệu cá nhân nào ra ngoài (chỉ trả về true/false).
CREATE OR REPLACE FUNCTION public.check_mssv_submitted(
    p_mssv TEXT,
    p_session TEXT DEFAULT '2026_HK1'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- Chạy với quyền của người tạo hàm để vượt qua RLS select
SET search_path = public
AS $$
DECLARE
    v_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 
        FROM public.submissions 
        WHERE LOWER(TRIM(mssv)) = LOWER(TRIM(p_mssv))
          AND session_code = p_session
    ) INTO v_exists;
    
    RETURN v_exists;
END;
$$;

-- Cấp quyền gọi hàm cho sinh viên
GRANT EXECUTE ON FUNCTION public.check_mssv_submitted(TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.check_mssv_submitted(TEXT, TEXT) TO authenticated;

-- ==============================================================================
-- HOÀN TẤT SCHEMA
-- ==============================================================================
