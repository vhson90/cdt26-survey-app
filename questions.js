/**
 * BỘ CÂU HỎI KHẢO SÁT: CÁCH HỌC TẬP VÀ PHỐI HỢP TRONG LỚP
 * Giảng viên có thể tự do thêm, bớt hoặc chỉnh sửa nội dung trong file này.
 *
 * CÁC CHIỀU ĐÁNH GIÁ (DIMENSIONS):
 * 1. trach_nhiem: Trách nhiệm & Độ tin cậy
 * 2. chu_dong: Tinh thần chủ động & Khởi xướng
 * 3. to_chuc: Kỹ năng tổ chức & Quản lý tiến độ
 * 4. giao_tiep: Giao tiếp & Kết nối nhóm
 * 5. giai_quyet_van_de: Tư duy phân tích & Giải quyết vấn đề
 * 6. binh_tinh: Giữ bình tĩnh & Thích ứng trước áp lực
 *
 * CÁC LOẠI CÂU HỎI (TYPE):
 * - "likert": Thang đo 1-5 (1: Rất không đồng ý -> 5: Rất đồng ý). Có hỗ trợ `reverse: true` cho câu đảo chiều.
 * - "situational": Tình huống thực tế với 4 lựa chọn, mỗi lựa chọn có trọng số điểm tương ứng.
 * - "forced_choice": Lựa chọn ép buộc giữa 2 định hướng hành vi tích cực.
 */

window.SURVEY_DIMENSIONS = {
  trach_nhiem: {
    id: "trach_nhiem",
    name: "Trách nhiệm",
    description: "Mức độ tận tâm, giữ đúng cam kết, chịu trách nhiệm về kết quả công việc chung và cá nhân.",
    color: "#2563eb" // Blue
  },
  chu_dong: {
    id: "chu_dong",
    name: "Chủ động",
    description: "Xu hướng tự khởi xướng, chuẩn bị trước bài học, tích cực đóng góp khi nhóm chưa có định hướng.",
    color: "#16a34a" // Green
  },
  to_chuc: {
    id: "to_chuc",
    name: "Tổ chức & Kế hoạch",
    description: "Khả năng phân chia công việc, lập lịch trình, theo dõi tiến độ và tối ưu thời gian.",
    color: "#d97706" // Amber
  },
  giao_tiep: {
    id: "giao_tiep",
    name: "Giao tiếp & Phối hợp",
    description: "Kỹ năng truyền đạt thông tin, lắng nghe, kết nối thành viên và dung hòa sự khác biệt.",
    color: "#9333ea" // Purple
  },
  giai_quyet_van_de: {
    id: "giai_quyet_van_de",
    name: "Giải quyết vấn đề",
    description: "Khả năng tư duy phản biện, tìm nguyên nhân cốt lõi và tìm kiếm giải pháp thực tế khi gặp sự cố.",
    color: "#0891b2" // Cyan
  },
  binh_tinh: {
    id: "binh_tinh",
    name: "Bình tĩnh & Thích ứng",
    description: "Kiểm soát cảm xúc dưới áp lực deadline, linh hoạt ứng biến khi có sự cố phát sinh ngoài dự kiến.",
    color: "#e11d48" // Rose
  }
};

window.SURVEY_QUESTIONS = [
  // --- NHÓM 1: TRÁCH NHIỆM (4 câu) ---
  {
    id: "q1",
    dimension: "trach_nhiem",
    type: "likert",
    reverse: false,
    text: "Khi đã nhận một phần việc trong nhóm, tôi luôn nỗ lực hoàn thành đúng hạn dù có việc bận cá nhân phát sinh."
  },
  {
    id: "q2",
    dimension: "trach_nhiem",
    type: "likert",
    reverse: true, // Câu đảo chiều (5 -> 1 điểm)
    text: "Nếu không thấy ai nhắc nhở hoặc kiểm tra, tôi có xu hướng để bài tập đến sát hạn chót mới bắt đầu làm."
  },
  {
    id: "q3",
    dimension: "trach_nhiem",
    type: "situational",
    text: "Tình huống: Khi phần bài nhóm của bạn có một lỗi sai sót nhỏ khiến điểm cả nhóm bị ảnh hưởng, phản ứng thông thường của bạn là:",
    options: [
      { text: "Chủ động nhận phần trách nhiệm của mình trước nhóm, phân tích lý do và đề xuất cách sửa đổi ngay.", score: 5 },
      { text: "Cùng nhóm ngồi lại xem xét lại toàn bộ quy trình kiểm tra bài xem lỗ hổng nằm ở khâu nào.", score: 4 },
      { text: "Lặng lẽ rà soát lại phần việc của mình để lần sau không lặp lại lỗi đó.", score: 3 },
      { text: "Nghĩ rằng đây là rủi ro chung của bài nhóm và chỉ cần rút kinh nghiệm cho lần sau.", score: 2 }
    ]
  },
  {
    id: "q4",
    dimension: "trach_nhiem",
    type: "forced_choice",
    text: "Trong một dự án học tập, bạn thường thiên về phương châm nào hơn?",
    options: [
      { text: "Ưu tiên hoàn thành đúng cam kết và hạn chót với nhóm, dù phải hy sinh thời gian giải trí cá nhân.", score: 5 },
      { text: "Ưu tiên giữ nhịp làm việc thoải mái, cân bằng sở thích cá nhân trước rồi bù đắp sau.", score: 2 }
    ]
  },

  // --- NHÓM 2: CHỦ ĐỘNG (4 câu) ---
  {
    id: "q5",
    dimension: "chu_dong",
    type: "likert",
    reverse: false,
    text: "Trong các buổi thảo luận chung, tôi thường là người mở lời gợi ý ý tưởng đầu tiên khi cả nhóm còn đang im lặng."
  },
  {
    id: "q6",
    dimension: "chu_dong",
    type: "likert",
    reverse: true, // Câu đảo chiều
    text: "Khi làm việc nhóm, tôi cảm thấy thoải mái hơn khi chờ người khác phân công cụ thể từng việc thay vì tự xung phong."
  },
  {
    id: "q7",
    dimension: "chu_dong",
    type: "situational",
    text: "Tình huống: Giảng viên ra một chủ đề nghiên cứu khá mới lạ và chưa có hướng dẫn chi tiết. Bạn sẽ:",
    options: [
      { text: "Tự tìm tài liệu/giáo trình mở rộng, phác thảo khung dàn ý sơ bộ rồi chia sẻ để xin ý kiến nhóm/giảng viên.", score: 5 },
      { text: "Đăng câu hỏi lên nhóm để mọi người cùng bàn xem nên làm từ đâu.", score: 4 },
      { text: "Đợi giảng viên giải thích thêm ở buổi học tiếp theo rồi mới bắt đầu triển khai.", score: 3 },
      { text: "Chờ xem các nhóm khác trong lớp làm thế nào để tham khảo và làm theo.", score: 2 }
    ]
  },
  {
    id: "q8",
    dimension: "chu_dong",
    type: "forced_choice",
    text: "Khi nhận thấy trong lớp hoặc trong nhóm có một việc chung chưa ai làm (như tạo nhóm trao đổi, lập file tổng hợp), bạn thường:",
    options: [
      { text: "Tự tay tạo và gửi link cho mọi người cùng vào sử dụng ngay.", score: 5 },
      { text: "Chờ người có trách nhiệm hoặc bạn khác đứng ra lập rồi mình tham gia.", score: 2 }
    ]
  },

  // --- NHÓM 3: TỔ CHỨC & KẾ HOẠCH (4 câu) ---
  {
    id: "q9",
    dimension: "to_chuc",
    type: "likert",
    reverse: false,
    text: "Tôi có thói quen chia nhỏ một dự án/bài tập lớn thành các cột mốc cụ thể và phân bổ thời gian rõ ràng."
  },
  {
    id: "q10",
    dimension: "to_chuc",
    type: "likert",
    reverse: true, // Câu đảo chiều
    text: "Tôi thường làm việc theo cảm hứng, ít khi lập thời gian biểu chi tiết cho việc học trong tuần."
  },
  {
    id: "q11",
    dimension: "to_chuc",
    type: "situational",
    text: "Tình huống: Nhóm bạn có 5 thành viên chuẩn bị làm tiểu luận trong 4 tuần. Bạn sẽ đề xuất quy trình nào?",
    options: [
      { text: "Tạo bảng theo dõi (Trello/Google Sheets), phân chia đầu mục, đặt mốc duyệt từng tuần và deadline dự phòng 3 ngày.", score: 5 },
      { text: "Thảo luận chia việc cho từng người và hẹn ngày nộp trước buổi báo cáo 2 ngày.", score: 4 },
      { text: "Để mọi người tự chọn phần mình thích, ai làm xong phần nào thì gửi vào nhóm phần đó.", score: 3 },
      { text: "Cứ làm từ từ, tuần cuối cùng nhóm sẽ họp lại làm chung cho nhanh.", score: 1 }
    ]
  },
  {
    id: "q12",
    dimension: "to_chuc",
    type: "forced_choice",
    text: "Phong cách chuẩn bị cho một kỳ thi hoặc bài tập lớn của bạn gần với điều nào hơn?",
    options: [
      { text: "Lên kế hoạch ôn tập/chuẩn bị từng phần từ sớm để tránh bị dồn ứ ở giai đoạn cuối.", score: 5 },
      { text: "Dồn năng lượng tập trung cao độ giải quyết nhanh chóng trong 1-2 ngày trước hạn nộp.", score: 2 }
    ]
  },

  // --- NHÓM 4: GIAO TIẾP & PHỐI HỢP (4 câu) ---
  {
    id: "q13",
    dimension: "giao_tiep",
    type: "likert",
    reverse: false,
    text: "Tôi tự tin có thể diễn đạt ý kiến của mình một cách mạch lạc, đồng thời tôn trọng và lắng nghe góc nhìn trái chiều của bạn bè."
  },
  {
    id: "q14",
    dimension: "giao_tiep",
    type: "likert",
    reverse: true, // Câu đảo chiều
    text: "Khi nhóm xảy ra tranh cãi bất đồng quan điểm, tôi thường im lặng hoặc né tránh để không làm không khí căng thẳng."
  },
  {
    id: "q15",
    dimension: "giao_tiep",
    type: "situational",
    text: "Tình huống: Trong nhóm có 2 thành viên tranh luận gay gắt về hướng giải quyết một câu hỏi và không ai chịu nhường ai. Bạn sẽ:",
    options: [
      { text: "Lắng nghe lý lẽ cả hai phía, tóm tắt các điểm chung và đề xuất giải pháp dung hòa hoặc biểu quyết văn minh.", score: 5 },
      { text: "Đề nghị tạm dừng giải lao 5 phút để cả hai bình tĩnh lại rồi cùng phân tích tiếp.", score: 4 },
      { text: "Đứng về phía quan điểm mà cá nhân mình cảm thấy hợp lý hơn.", score: 3 },
      { text: "Không can thiệp, chờ xem ai thuyết phục được ai thì theo phía đó.", score: 2 }
    ]
  },
  {
    id: "q16",
    dimension: "giao_tiep",
    type: "forced_choice",
    text: "Khi làm việc chung, bạn thấy vai trò nào giúp nhóm vận hành tốt nhất?",
    options: [
      { text: "Lắng nghe, kết nối các ý kiến khác nhau và gắn kết tinh thần đồng đội.", score: 5 },
      { text: "Bảo vệ quan điểm cá nhân để bài làm có sự đồng nhất theo một hướng riêng.", score: 2 }
    ]
  },

  // --- NHÓM 5: GIẢI QUYẾT VẤN ĐỀ (4 câu) ---
  {
    id: "q17",
    dimension: "giai_quyet_van_de",
    type: "likert",
    reverse: false,
    text: "Khi gặp một bài tập hoặc tình huống học tập phức tạp chưa có tiền lệ, tôi thích tự phân tích và tìm kiếm nhiều phương án thử nghiệm."
  },
  {
    id: "q18",
    dimension: "giai_quyet_van_de",
    type: "likert",
    reverse: true, // Câu đảo chiều
    text: "Khi kế hoạch học tập hoặc bài tập gặp trục trặc, tôi thường cảm thấy lúng túng và mất nhiều thời gian mới biết bắt đầu lại từ đâu."
  },
  {
    id: "q19",
    dimension: "giai_quyet_van_de",
    type: "situational",
    text: "Tình huống: Trước buổi thuyết trình 3 tiếng, nhóm phát hiện số liệu phân tích trong slide có sự sai lệch lớn. Bạn sẽ:",
    options: [
      { text: "Bình tĩnh khoanh vùng nguồn dữ liệu sai, cùng người phụ trách chỉnh sửa phần cốt lõi và điều chỉnh phần trình bày cho hợp lý.", score: 5 },
      { text: "Thông báo cho nhóm biết và đề xuất phương án giải trình tình huống với giảng viên nếu không sửa kịp.", score: 4 },
      { text: "Cố gắng giấu lỗi đó đi và hy vọng giảng viên không để ý đến slide này.", score: 1 },
      { text: "Trách người chịu trách nhiệm phần dữ liệu vì đã bất cẩn.", score: 1 }
    ]
  },
  {
    id: "q20",
    dimension: "giai_quyet_van_de",
    type: "forced_choice",
    text: "Khi đối mặt với một vấn đề khó trong học tập, bạn thường:",
    options: [
      { text: "Phân tích nguyên nhân cốt lõi và tìm kiếm giải pháp mang tính bền vững.", score: 5 },
      { text: "Chọn giải pháp tạm thời nhanh nhất có thể để vượt qua tình huống trước mắt.", score: 2 }
    ]
  },

  // --- NHÓM 6: BÌNH TĨNH & THÍCH ỨNG (4 câu) ---
  {
    id: "q21",
    dimension: "binh_tinh",
    type: "likert",
    reverse: false,
    text: "Dù trong tuần cao điểm có nhiều bài tập và thi cử dồn dập, tôi vẫn giữ được tinh thần lạc quan và tập trung làm từng việc một."
  },
  {
    id: "q22",
    dimension: "binh_tinh",
    type: "likert",
    reverse: true, // Câu đảo chiều
    text: "Tôi rất dễ bực bội hoặc mất bình tĩnh nếu kế hoạch cá nhân/nhóm bị thay đổi đột ngột vào phút chót."
  },
  {
    id: "q23",
    dimension: "binh_tinh",
    type: "situational",
    text: "Tình huống: Giảng viên thông báo thay đổi thể lệ và yêu cầu bài nộp vào ngày hôm sau, khiến một nửa công sức đã làm phải làm lại. Phản ứng của bạn:",
    options: [
      { text: "Xem xét kỹ yêu cầu mới, xác định những phần còn tái sử dụng được và nhanh chóng phối hợp thực hiện theo hướng mới.", score: 5 },
      { text: "Hơi thất vọng một chút nhưng sau đó nhanh chóng bắt tay vào làm việc cùng các bạn.", score: 4 },
      { text: "Bày tỏ thắc mắc hoặc phàn nàn nhưng vẫn phải làm theo.", score: 3 },
      { text: "Cảm thấy chán nản và muốn bỏ mặc phần việc còn lại cho người khác lo.", score: 1 }
    ]
  },
  {
    id: "q24",
    dimension: "binh_tinh",
    type: "forced_choice",
    text: "Khi nhóm phải làm việc dưới áp lực thời gian rất gấp gáp, điều bạn thường thể hiện ra là:",
    options: [
      { text: "Giữ thái độ bình tĩnh, tích cực động viên tinh thần mọi người cùng vượt qua.", score: 5 },
      { text: "Tập trung cao độ vào phần của mình, hạn chế giao tiếp để tránh mất tập trung.", score: 3 }
    ]
  }
];
