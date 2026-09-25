/**
 * CẤU HÌNH ỨNG DỤNG KHẢO SÁT & KẾT NỐI SUPABASE
 * 
 * Hướng dẫn cho Giảng viên:
 * 1. Điền SUPABASE_URL và SUPABASE_ANON_KEY của dự án bạn vào đây trước khi deploy lên GitHub Pages.
 * 2. Hoặc khi mở trang Admin lần đầu, hệ thống sẽ cho phép nhập trực tiếp cấu hình này và lưu trên trình duyệt của bạn.
 */

window.APP_CONFIG = {
  // 1. Tùy chọn Firebase Realtime Database (Nhanh nhất, không cần tạo bảng SQL):
  // Chỉ cần dán link dạng: https://YOUR_PROJECT-default-rtdb.firebaseio.com
  FIREBASE_DB_URL: "",

  // 2. Tùy chọn Supabase (PostgreSQL + RLS):
  SUPABASE_URL: "https://YOUR_PROJECT_ID.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",

  // Tên khảo sát hiển thị trung tính
  SURVEY_TITLE: "Khảo sát cách học tập và phối hợp trong lớp",
  SURVEY_SUBTITLE: "Dành cho sinh viên tham gia học phần - Thời gian hoàn thành: 5 - 8 phút",
  SURVEY_NOTE: "Khảo sát này nhằm tìm hiểu phong cách làm việc nhóm, sở thích học tập và tương tác trong lớp để giảng viên tối ưu hóa phương pháp hỗ trợ lớp học. Khảo sát KHÔNG dùng để chấm điểm hay đánh giá xếp loại học tập của bạn.",

  // Danh sách gợi ý lớp (nếu sinh viên thuộc lớp khác vẫn có thể nhập)
  DEFAULT_CLASSES: [
    "D21_TH01",
    "D21_TH02",
    "D22_CNTT01",
    "D22_CNTT02",
    "D23_PM01",
    "Lớp khác"
  ],

  // Kênh liên hệ ưu tiên
  CONTACT_CHANNELS: [
    { id: "zalo", label: "Zalo (Ưu tiên)" },
    { id: "phone", label: "Gọi thoại / Tin nhắn SMS trực tiếp" },
    { id: "email", label: "Email trường / Email cá nhân" },
    { id: "messenger", label: "Facebook / Messenger" },
    { id: "telegram", label: "Telegram" }
  ],

  // Tiêu chí tham khảo "Sinh viên cần tìm hiểu thêm" (dành cho Admin):
  // Đây là ngưỡng hỗ trợ giảng viên phát hiện các sinh viên nổi bật hoặc toàn diện,
  // tuyệt đối KHÔNG tự động kết luận hay ấn định chức vụ.
  SHORTLIST_CRITERIA: {
    // Điểm trung bình tất cả 6 chiều đạt từ mức này trở lên (trên thang 5)
    MIN_OVERALL_AVERAGE: 4.0,
    // Hoặc có ít nhất 2 chiều thế mạnh đạt từ mức này trở lên
    HIGH_DIMENSION_THRESHOLD: 4.5,
    // Không có chiều nào rơi vào mức dưới
    MIN_SINGLE_DIMENSION: 3.2
  }
};

// Cho phép nạp cấu hình từ LocalStorage nếu giảng viên cấu hình qua giao diện UI Admin
(function initSupabaseConfig() {
  try {
    if (typeof localStorage !== "undefined") {
      const localFb = localStorage.getItem("APP_FIREBASE_URL");
      if (localFb) {
        window.APP_CONFIG.FIREBASE_DB_URL = localFb;
      }
      const localUrl = localStorage.getItem("APP_SUPABASE_URL");
      const localKey = localStorage.getItem("APP_SUPABASE_ANON_KEY");
      if (localUrl && localKey) {
        window.APP_CONFIG.SUPABASE_URL = localUrl;
        window.APP_CONFIG.SUPABASE_ANON_KEY = localKey;
      }
    }
  } catch (err) {
    console.warn("Không thể truy cập localStorage:", err);
  }
})();
