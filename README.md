# WEB APP KHẢO SÁT HỌC TẬP VÀ PHỐI HỢP TRONG LỚP

Ứng dụng web khảo sát sinh viên mobile-first, hoàn toàn miễn phí, triển khai trên **GitHub Pages** và sử dụng cơ sở dữ liệu **Supabase Free Tier**.

---

## 🎯 1. MỤC TIÊU VÀ NGUYÊN TẮC THIẾT KẾ

- **Tiêu đề trung tính:** *"Khảo sát cách học tập và phối hợp trong lớp"* — giúp sinh viên trả lời một cách tự nhiên, thoải mái, phản ánh thói quen thực tế mà không bị tâm lý đối phó hay tô hồng bản thân.
- **Hoàn thành nhanh chóng:** 100% câu hỏi trắc nghiệm, thời gian hoàn thành chỉ từ **5 – 8 phút**.
- **Không hỏi trực diện:** Tuyệt đối không hỏi các câu lộ liễu như *"Bạn có muốn làm lớp trưởng không?"* hay *"Bạn có khả năng lãnh đạo không?"*.
- **Đánh giá 6 chiều năng lực hành vi:**
  1. **Trách nhiệm (Conscientiousness):** Mức độ hoàn thành cam kết, giữ chữ tín, chịu trách nhiệm về công việc chung.
  2. **Chủ động (Proactivity):** Tinh thần tự khởi xướng, xung phong, tìm tòi khi chưa có chỉ dẫn chi tiết.
  3. **Tổ chức (Organization):** Lập kế hoạch, chia nhỏ công việc, quản lý mốc thời gian và tiến độ.
  4. **Giao tiếp & Phối hợp (Collaboration):** Lắng nghe tích cực, diễn đạt ý kiến, giải quyết bất đồng văn minh.
  5. **Giải quyết vấn đề (Problem Solving):** Tư duy phản biện, bình tĩnh phân tích nguyên nhân gốc rễ và tìm giải pháp.
  6. **Bình tĩnh & Thích ứng (Adaptability):** Kiểm soát cảm xúc dưới áp lực thời gian, linh hoạt khi có thay đổi đột xuất.
- **Bảo mật & Tôn trọng sinh viên:**
  - Sinh viên **không thấy điểm số** hay công thức tính toán. Sau khi Submit chỉ nhận được thông báo cảm ơn chân thành.
  - Sử dụng **Row Level Security (RLS)** trên Supabase: Người dùng ẩn danh (sinh viên) chỉ có quyền `INSERT` phiếu của mình, **tuyệt đối không thể đọc (`SELECT`)** dữ liệu của sinh viên khác.
  - Chống nộp trùng MSSV trong cùng một học kỳ/lớp học.
- **Nguyên tắc dành cho Giảng viên:**
  - Bộ lọc *"Sinh viên cần tìm hiểu thêm"* chỉ mang tính chất tham khảo, gợi ý những bạn có phong cách làm việc cân bằng hoặc có thế mạnh nổi bật.
  - Hệ thống **không tự động kết luận hay ấn định chức vụ** lớp trưởng/ban cán sự. Giảng viên kết hợp quan sát thực tế và phỏng vấn trực tiếp trước khi đưa ra quyết định.

---

## 📁 2. CẤU TRÚC THƯ MỤC

```text
student-survey-app/
├── index.html            # Giao diện khảo sát dành cho Sinh viên (Mobile-first, tiếng Việt)
├── admin.html            # Cổng đăng nhập & Bảng điều khiển dành cho Giảng viên
├── app.js                # Xử lý logic khảo sát sinh viên, xáo trộn câu hỏi, tính điểm ngầm
├── admin.js              # Xử lý logic Dashboard Admin, Auth, Biểu đồ Radar, Xuất CSV
├── questions.js          # File cấu hình 24 câu hỏi & 6 chiều đánh giá (Dễ dàng tùy biến)
├── questions.json        # Bản sao định dạng JSON chuẩn để đọc/sửa bằng các công cụ bên ngoài
├── config.js             # Cấu hình Supabase (URL, Anon Key), danh sách lớp, tiêu chí lọc
├── style.css             # Tùy biến giao diện, hiệu ứng chuyển động, responsive
├── supabase/
│   └── schema.sql        # Kịch bản tạo bảng CSDL, chỉ mục, bảo mật RLS và hàm RPC
└── README.md             # Hướng dẫn chi tiết cấu hình và triển khai
```

---

## 🚀 3. HƯỚNG DẪN THIẾT LẬP SUPABASE (MIỄN PHÍ)

Supabase cung cấp gói Free Tier hoàn hảo (gồm PostgreSQL Database, Authentication, API tự động, bảo mật RLS).

### Bước 3.1: Tạo Project Supabase
1. Truy cập [https://supabase.com](https://supabase.com) và đăng ký/đăng nhập (bằng tài khoản GitHub hoặc Google).
2. Nhấn **New Project**.
3. Điền các thông tin:
   - **Name:** `khao-sat-sinh-vien` (hoặc tên tùy thích).
   - **Database Password:** Đặt mật khẩu an toàn (ghi nhớ lại).
   - **Region:** Chọn khu vực gần Việt Nam nhất (ví dụ: `Singapore - ap-southeast-1`).
4. Nhấn **Create new project** và đợi khoảng 1-2 phút để Supabase khởi tạo.

### Bước 3.2: Chạy Database Schema & RLS
1. Tại thanh menu bên trái của Supabase Dashboard, chọn biểu tượng **SQL Editor**.
2. Nhấn nút **New query**.
3. Mở file `supabase/schema.sql` trong dự án này, copy toàn bộ nội dung và paste vào ô soạn thảo.
4. Nhấn nút **Run** (màu xanh lá) ở góc dưới bên phải.
5. Bạn sẽ thấy thông báo `Success. No rows returned`. Bảng `submissions`, các chỉ mục (indexes), chính sách RLS và hàm kiểm tra MSSV `check_mssv_submitted` đã được thiết lập tự động!

### Bước 3.3: Tạo tài khoản Admin cho Giảng viên
1. Tại menu bên trái, chọn mục **Authentication** -> **Users**.
2. Nhấn nút **Add user** -> chọn **Create user**.
3. Điền:
   - **Email:** Nhập email giảng viên (Ví dụ: `giangvien@university.edu.vn`).
   - **Password:** Đặt mật khẩu đăng nhập trang Admin.
   - Tích chọn **Auto Confirm User** (để không cần xác thực qua email).
4. Nhấn **Create user**. Đây chính là tài khoản dùng để đăng nhập vào trang `admin.html`.

### Bước 3.4: Lấy URL và Anon Public Key
1. Tại menu bên trái, nhấn vào biểu tượng bánh răng **Project Settings** -> chọn thẻ **API**.
2. Tại mục **Project URL**, copy chuỗi URL (dạng `https://xxxxxxxxxxxx.supabase.co`).
3. Tại mục **Project API keys**, copy khóa **anon / public** (chuỗi dài bắt đầu bằng `eyJhbGci...`).
   > *Lưu ý:* Tuyệt đối **không** dùng khóa `service_role` cho frontend. Khóa `anon` kết hợp chính sách RLS đã đủ an toàn tuyệt đối.

---

## ⚙️ 4. CẤU HÌNH KẾT NỐI ỨNG DỤNG

Mở file `config.js` trong thư mục dự án và dán thông tin vừa lấy ở Bước 3.4:

```javascript
window.APP_CONFIG = {
  // Điền URL và Anon Key của bạn vào đây:
  SUPABASE_URL: "https://xxxxxxxxxxxx.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",

  // Danh sách các lớp học phần mặc định hiển thị gợi ý cho sinh viên:
  DEFAULT_CLASSES: [
    "D21_TH01",
    "D21_TH02",
    "D22_CNTT01",
    "D22_CNTT02",
    "D23_PM01"
  ],
  ...
};
```

> **Mẹo hữu ích:** Nếu bạn chưa kịp sửa file `config.js`, khi mở trang `admin.html` lần đầu, bạn có thể bấm vào dòng chữ *"⚙️ Cài đặt cấu hình Supabase URL / Anon Key"* ở dưới màn hình đăng nhập để nhập trực tiếp từ trình duyệt. Cấu hình sẽ được lưu vào trình duyệt của bạn.

---

## 📝 5. HƯỚNG DẪN TÙY BIẾN BỘ CÂU HỎI

Tất cả câu hỏi được lưu độc lập tại file `questions.js` (và bản `questions.json`). Giảng viên có thể tự do sửa đổi từ ngữ, thêm bớt câu hỏi mà **không cần chỉnh sửa một dòng code xử lý nào**.

Mỗi câu hỏi có cấu trúc như sau:

### 1. Câu hỏi thang đo Likert 1–5 (Thuận chiều):
```javascript
{
  id: "q1",
  dimension: "trach_nhiem", // Thuộc 1 trong 6 chiều đánh giá
  type: "likert",
  reverse: false,           // 1: Rất không đồng ý -> 5: Rất đồng ý
  text: "Khi đã nhận một phần việc trong nhóm, tôi luôn nỗ lực hoàn thành đúng hạn."
}
```

### 2. Câu hỏi đảo chiều (Reverse-coded):
```javascript
{
  id: "q2",
  dimension: "trach_nhiem",
  type: "likert",
  reverse: true,            // Tự động đảo điểm (1 -> 5 điểm, 5 -> 1 điểm)
  text: "Nếu không thấy ai nhắc nhở, tôi thường để bài tập đến sát hạn chót mới làm."
}
```

### 3. Câu hỏi tình huống thực tế (Situational):
```javascript
{
  id: "q3",
  dimension: "giao_tiep",
  type: "situational",
  text: "Tình huống: Khi nhóm xảy ra mâu thuẫn tranh cãi gay gắt, bạn sẽ:",
  options: [
    { text: "Lắng nghe cả hai phía và đề xuất giải pháp dung hòa.", score: 5 },
    { text: "Đề nghị tạm dừng giải lao để cả hai bình tĩnh lại.", score: 4 },
    { text: "Đứng về phía quan điểm cá nhân thấy hợp lý hơn.", score: 3 },
    { text: "Không can thiệp, để hai bạn tự tranh luận.", score: 2 }
  ]
}
```

### 4. Câu hỏi lựa chọn bắt buộc (Forced-choice):
```javascript
{
  id: "q4",
  dimension: "to_chuc",
  type: "forced_choice",
  text: "Phong cách chuẩn bị cho kỳ thi của bạn gần với điều nào hơn?",
  options: [
    { text: "Lên kế hoạch ôn tập từng phần từ sớm để tránh dồn ứ.", score: 5 },
    { text: "Dồn năng lượng tập trung cao độ trong 1-2 ngày trước thi.", score: 2 }
  ]
}
```

---

## 🌐 6. HƯỚNG DẪN DEPLOY LÊN GITHUB PAGES TRONG 3 BƯỚC

GitHub Pages cho phép host website tĩnh hoàn toàn miễn phí, có sẵn HTTPS bảo mật.

### Bước 1: Khởi tạo Git và đẩy code lên GitHub
1. Đăng nhập [GitHub.com](https://github.com) và tạo một Repository mới (ví dụ đặt tên: `khao-sat-lop-hoc`, để chế độ **Public**).
2. Tại thư mục `student-survey-app` trên máy tính của bạn, mở terminal/PowerShell và thực hiện:
   ```bash
   git init
   git add .
   git commit -m "Khoi tao web app khao sat sinh vien"
   git branch -M main
   git remote add origin https://github.com/TEN_USER_CUA_BAN/khao-sat-lop-hoc.git
   git push -u origin main
   ```

### Bước 2: Bật tính năng GitHub Pages
1. Trên giao diện GitHub Repository của bạn, vào mục **Settings** (tab trên cùng).
2. Tại cột menu bên trái, tìm và nhấn vào **Pages**.
3. Tại phần **Build and deployment** -> **Source**: Chọn `Deploy from a branch`.
4. Tại mục **Branch**: Chọn `main`, thư mục để mặc định `/ (root)` và nhấn **Save**.

### Bước 3: Nhận đường link khảo sát
Sau khoảng 1 – 2 phút, GitHub sẽ hoàn tất build và hiển thị thông báo màu xanh:
- **Link khảo sát dành cho Sinh viên:**
  `https://TEN_USER_CUA_BAN.github.io/khao-sat-lop-hoc/`
- **Link Bảng điều khiển dành cho Giảng viên:**
  `https://TEN_USER_CUA_BAN.github.io/khao-sat-lop-hoc/admin.html`

Giảng viên chỉ cần gửi link trang chủ cho sinh viên (hoặc tạo mã QR code để chiếu trên slide lớp học).

---

## 📊 7. HƯỚNG DẪN SỬ DỤNG BẢNG ĐIỀU KHIỂN (ADMIN DASHBOARD)

1. **Đăng nhập an toàn:** Truy cập `admin.html`, nhập email & mật khẩu đã tạo ở Bước 3.3.
2. **Tổng quan lớp học:**
   - Xem tổng số phiếu đã nộp, số sinh viên cần tìm hiểu thêm, điểm trung bình toàn lớp và số lớp tham gia.
3. **Bộ lọc & Tìm kiếm:**
   - Lọc nhanh theo từng lớp học phần (ví dụ `D21_TH01`, `D22_CNTT01`...).
   - Tìm kiếm tức thì theo MSSV, Họ tên, Số điện thoại.
   - Nút bật/tắt ⭐ **"Cần tìm hiểu thêm"**: Chỉ lọc danh sách các bạn có profile hài hòa hoặc có các chiều nổi trội.
4. **Biểu đồ Radar 6 Chiều (Spider Chart):**
   - Bấm nút **"Chi tiết"** của bất kỳ sinh viên nào để mở modal.
   - Biểu đồ mạng nhện thể hiện trực quan 6 chiều của sinh viên (màu xanh dương) đặt cạnh đường nét đứt biểu thị **mức trung bình của cả lớp** (màu xám), giúp giảng viên nhìn ngay ra điểm vượt trội của sinh viên so với mặt bằng chung.
5. **Ghi chú giảng viên:**
   - Giảng viên có thể ghi chép nhận xét riêng cho từng sinh viên (ví dụ: *"Đã trao đổi thử, bạn rất có trách nhiệm, đề xuất phụ trách tổ chức hoạt động ngoại khóa"*). Ghi chú này được lưu trực tiếp vào cơ sở dữ liệu.
6. **Xuất file Excel/CSV tiếng Việt:**
   - Nhấn nút **"Xuất CSV"**.
   - File được định dạng chuẩn với tiền tố **UTF-8 BOM**, mở trực tiếp trên Microsoft Excel mà **không bao giờ bị lỗi font tiếng Việt**.

---

## 🛡️ 8. TÍNH NĂNG BẢO MẬT VÀ QUYỀN RIÊNG TƯ (RLS)

- **Ngăn chặn lộ thông tin cá nhân:**
  Dù mã nguồn frontend chạy trên trình duyệt của sinh viên có chứa `SUPABASE_ANON_KEY`, nhờ cơ chế **Row Level Security (RLS)** trên Supabase, bất kỳ lệnh `SELECT` nào từ phía sinh viên đều bị PostgreSQL chặn lại (`0 rows returned`). Sinh viên không thể xem được số điện thoại, email, hay câu trả lời của các bạn khác.
- **Chống nộp trùng MSSV:**
  Hệ thống thiết lập ràng buộc duy nhất `UNIQUE (mssv, session_code)` trong CSDL và cung cấp hàm RPC kiểm tra nhanh trước khi nộp, đảm bảo mỗi sinh viên chỉ được ghi nhận một phiếu hợp lệ.
