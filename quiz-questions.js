/**
 * QUIZ-QUESTIONS.JS - NGÂN HÀNG 40 CÂU HỎI TRẮC NGHIỆM THỰC HÀNH HÀN (NGÀNH CƠ KHÍ)
 * Học phần: Thực hành Hàn - Bài 1 & Bài 2
 * Thời gian làm bài: 30 phút - Thang điểm: 10 (40 câu, mỗi câu 0.25 điểm)
 */

window.WELDING_QUIZ_QUESTIONS = [
  // =========================================================================
  // PHẦN 1: BÀI 1 - NHẬP MÔN THỰC HÀNH HÀN & AN TOÀN LAO ĐỘNG (CÂU 1 -> 20)
  // =========================================================================
  {
    id: 1,
    lesson: 1,
    topic: "Nội quy xưởng thực tập",
    question: "Thời gian có mặt tại xưởng thực tập hàn trước giờ học theo quy định là bao nhiêu?",
    options: [
      { key: "A", text: "Trước giờ học từ 5 – 10 phút để chuẩn bị trang phục và dụng cụ" },
      { key: "B", text: "Trước giờ học 30 phút" },
      { key: "C", text: "Đúng giờ bắt đầu là được, không cần đến sớm" },
      { key: "D", text: "Đến trễ tối đa 15 phút vẫn được chấp nhận" }
    ],
    correctAnswer: "A"
  },
  {
    id: 2,
    lesson: 1,
    topic: "Nội quy xưởng thực tập",
    question: "Theo nội quy xưởng, sinh viên đến trễ bao nhiêu phút sẽ KHÔNG được phép vào xưởng thực hành?",
    options: [
      { key: "A", text: "Trễ 5 phút" },
      { key: "B", text: "Trễ 10 phút" },
      { key: "C", text: "Trễ 15 phút" },
      { key: "D", text: "Trễ 30 phút" }
    ],
    correctAnswer: "C"
  },
  {
    id: 3,
    lesson: 1,
    topic: "Nội quy xưởng thực tập",
    question: "Khi nào sinh viên mới được phép bật cầu dao, khởi động máy hàn hoặc thay đổi thông số dòng điện?",
    options: [
      { key: "A", text: "Khi đã mang đủ găng tay và mặt nạ hàn" },
      { key: "B", text: "Chỉ khi có hiệu lệnh hoặc sự cho phép của giảng viên hướng dẫn" },
      { key: "C", text: "Khi bạn cùng nhóm thực hành yêu cầu khởi động" },
      { key: "D", text: "Bất cứ lúc nào sinh viên cảm thấy sẵn sàng thao tác" }
    ],
    correctAnswer: "B"
  },
  {
    id: 4,
    lesson: 1,
    topic: "An toàn phòng chống cháy nổ",
    question: "Khoảng cách an toàn tối thiểu để cách ly các vật liệu dễ cháy (giẻ lau dầu mỡ, sơn, dung môi) quanh vùng phát sinh tia lửa hàn là:",
    options: [
      { key: "A", text: "3 mét" },
      { key: "B", text: "5 mét" },
      { key: "C", text: "10 mét" },
      { key: "D", text: "15 mét" }
    ],
    correctAnswer: "C"
  },
  {
    id: 5,
    lesson: 1,
    topic: "Nội quy xưởng thực tập",
    question: "Quy tắc an toàn nào sau đây là ĐÚNG khi thao tác với phôi kim loại vừa mới hàn xong?",
    options: [
      { key: "A", text: "Dùng tay đeo găng vải mỏng để kiểm tra nhiệt độ" },
      { key: "B", text: "Luôn dùng kìm kẹp phôi để gắp chi tiết, không chạm trực tiếp vào phôi còn nhiệt" },
      { key: "C", text: "Dùng miệng thổi liên tục vào mối hàn để phôi mau nguội" },
      { key: "D", text: "Cầm tay trực tiếp vào góc phôi xa mối hàn nhất" }
    ],
    correctAnswer: "B"
  },
  {
    id: 6,
    lesson: 1,
    topic: "An toàn lao động xưởng hàn",
    question: "Để bảo vệ mắt cho bạn bè xung quanh trước khi gây hồ quang, người thợ hàn bắt buộc phải thực hiện thao tác nào?",
    options: [
      { key: "A", text: "Dùng tay che chắn phía trước hồ quang" },
      { key: "B", text: "Luôn hô báo trước khi gây hồ quang và hướng hồ quang vào góc khuất" },
      { key: "C", text: "Bật quạt thổi gió công suất lớn" },
      { key: "D", text: "Không cần thông báo nếu khoảng cách xa hơn 2 mét" }
    ],
    correctAnswer: "B"
  },
  {
    id: 7,
    lesson: 1,
    topic: "Quy trình 5S xưởng hàn",
    question: "Trong quy trình 5S kết thúc ca thực hành, việc xử lý các mẩu que hàn thừa được quy định như thế nào?",
    options: [
      { key: "A", text: "Vứt rải rác dưới sàn xưởng để quét dọn sau" },
      { key: "B", text: "Thu gom toàn bộ mẩu que hàn thừa bỏ vào xô phế liệu chuyên dụng" },
      { key: "C", text: "Để nguyên trên mặt bàn hàn cho nhóm ca sau sử dụng lại" },
      { key: "D", text: "Vứt vào sọt rác chứa giấy và giẻ lau chung" }
    ],
    correctAnswer: "B"
  },
  {
    id: 8,
    lesson: 1,
    topic: "Trang bị bảo hộ cá nhân (PPE)",
    question: "Quần áo bảo hộ chuyên dụng trong xưởng hàn bắt buộc phải được may từ chất liệu nào?",
    options: [
      { key: "A", text: "Vải sợi nilon tổng hợp" },
      { key: "B", text: "Vải kaki dày hoặc cotton 100% chống cháy" },
      { key: "C", text: "Vải lụa mỏng tạo cảm giác thoáng mát" },
      { key: "D", text: "Vải thun co giãn thể thao" }
    ],
    correctAnswer: "B"
  },
  {
    id: 9,
    lesson: 1,
    topic: "Trang bị bảo hộ cá nhân (PPE)",
    question: "Vì sao TUYỆT ĐỐI KHÔNG mặc quần áo bằng sợi tổng hợp hoặc nilon khi thực hành hàn?",
    options: [
      { key: "A", text: "Vì giá thành cao và khó giặt sạch vết bẩn" },
      { key: "B", text: "Vì khi gặp nhiệt độ cao hoặc xỉ hàn văng bắn, sợi nilon sẽ nóng chảy dính chặt vào da gây bỏng sâu và nguy hiểm" },
      { key: "C", text: "Vì vải sợi tổng hợp cản trở cử động cổ tay của thợ hàn" },
      { key: "D", text: "Vì dễ gây tĩnh điện cho thiết bị máy hàn" }
    ],
    correctAnswer: "B"
  },
  {
    id: 10,
    lesson: 1,
    topic: "Mặt nạ hàn & Bức xạ hồ quang",
    question: "Mặt nạ hàn có chức năng quan trọng nhất là bảo vệ người thợ hàn khỏi hai loại bức xạ nguy hại nào từ hồ quang?",
    options: [
      { key: "A", text: "Tia cực tím (UV) và tia hồng ngoại (IR)" },
      { key: "B", text: "Tia X và tia Gamma" },
      { key: "C", text: "Tia phóng xạ Alpha và Beta" },
      { key: "D", text: "Ánh sáng đơn sắc thông thường" }
    ],
    correctAnswer: "A"
  },
  {
    id: 11,
    lesson: 1,
    topic: "Mặt nạ hàn & Bức xạ hồ quang",
    question: "Bệnh lý nghề nghiệp 'đau mắt hàn' (viêm giác mạc cấp tính) phát sinh chủ yếu do mắt tiếp xúc trực tiếp với tia bức xạ nào?",
    options: [
      { key: "A", text: "Tia cực tím (UV - Ultraviolet)" },
      { key: "B", text: "Tia hồng ngoại (IR)" },
      { key: "C", text: "Tia sóng ngắn vô tuyến" },
      { key: "D", text: "Tia điện từ tần số thấp" }
    ],
    correctAnswer: "A"
  },
  {
    id: 12,
    lesson: 1,
    topic: "Trang bị bảo hộ cá nhân (PPE)",
    question: "Mũi giày bảo hộ dùng trong xưởng hàn có lót thép nhằm mục đích chính gì?",
    options: [
      { key: "A", text: "Tăng trọng lượng giúp bước đi vững chãi hơn" },
      { key: "B", text: "Bảo vệ ngón chân, chống lại nguy cơ bị vật nặng, phôi kim loại rơi đè dập" },
      { key: "C", text: "Giúp chống ẩm và cách nhiệt tốt hơn cho bàn chân" },
      { key: "D", text: "Trang trí theo quy chuẩn thẩm mỹ cơ khí" }
    ],
    correctAnswer: "B"
  },
  {
    id: 13,
    lesson: 1,
    topic: "Khói hàn độc hại",
    question: "Khói hàn phát sinh trong quá trình hồ quang cháy thường chứa các hạt mịn kim loại nguy hại nào?",
    options: [
      { key: "A", text: "Fe, Mn, Ni, Cr" },
      { key: "B", text: "Au, Ag, Cu, Pt" },
      { key: "C", text: "Na, K, Ca, Mg" },
      { key: "D", text: "Al, Sn, Pb, Zn" }
    ],
    correctAnswer: "A"
  },
  {
    id: 14,
    lesson: 1,
    topic: "Khói hàn độc hại",
    question: "Hiện tượng thợ hàn hít phải lượng lớn hạt khói kim loại độc hại trong thời gian dài có thể dẫn đến hội chứng bệnh lý nào?",
    options: [
      { key: "A", text: "Say sóng nhiệt" },
      { key: "B", text: "Sốt khói kim loại (Metal fume fever)" },
      { key: "C", text: "Cảm cúm thông thường" },
      { key: "D", text: "Viêm xoang cấp tính do lạnh" }
    ],
    correctAnswer: "B"
  },
  {
    id: 15,
    lesson: 1,
    topic: "Khói hàn và thông gió",
    question: "Để hạn chế tối đa việc hít phải khói độc, tư thế làm việc và thông gió chuẩn của người thợ hàn là gì?",
    options: [
      { key: "A", text: "Cúi sát mặt xuống mối hàn để quan sát rõ vũng hàn lỏng" },
      { key: "B", text: "Bật quạt hút thông gió cục bộ, giữ đầu ở vị trí đón gió và không cúi mặt trực diện vào luồng khói bốc lên" },
      { key: "C", text: "Chỉ cần đeo khẩu trang y tế mỏng và đóng kín cửa cabin" },
      { key: "D", text: "Thổi trực tiếp khói hàn sang phía cabin của bạn bên cạnh" }
    ],
    correctAnswer: "B"
  },
  {
    id: 16,
    lesson: 1,
    topic: "An toàn điện xưởng hàn",
    question: "Điện áp không tải (U0) của máy hàn que thông thường nằm trong dải giá trị nào, tiềm ẩn nguy cơ giật điện khi môi trường ẩm ướt?",
    options: [
      { key: "A", text: "12 – 24 V" },
      { key: "B", text: "50 – 80 V" },
      { key: "C", text: "110 – 150 V" },
      { key: "D", text: "220 – 380 V" }
    ],
    correctAnswer: "B"
  },
  {
    id: 17,
    lesson: 1,
    topic: "An toàn phòng cháy nổ",
    question: "Trước khi tiến hành hàn cắt trên các bồn, thùng rỗng từng chứa xăng dầu hoặc hóa chất dễ cháy, quy định an toàn bắt buộc là gì?",
    options: [
      { key: "A", text: "Chỉ cần mở hé nắp bồn và hàn thật nhanh" },
      { key: "B", text: "Bắt buộc phải qua súc rửa sạch sẽ, thử nồng độ khí và thông khí an toàn đúng quy trình" },
      { key: "C", text: "Đổ đầy cát vào thùng rồi tiến hành hàn ngay" },
      { key: "D", text: "Dùng quạt thổi gió vào trong 2 phút là có thể hàn" }
    ],
    correctAnswer: "B"
  },
  {
    id: 18,
    lesson: 1,
    topic: "Ứng phó sự cố khẩn cấp",
    question: "Khi phát hiện hỏa hoạn xảy ra do chập điện trong xưởng hàn, hành động xử lý ĐẦU TIÊN và quan trọng nhất là:",
    options: [
      { key: "A", text: "Cắt ngay cầu dao điện tổng của khu vực xưởng hàn" },
      { key: "B", text: "Dùng vòi nước xịt ngay vào gốc lửa" },
      { key: "C", text: "Thu dọn toàn bộ que hàn và dụng cụ cất vào tủ" },
      { key: "D", text: "Chạy ra ngoài và không thông báo cho ai" }
    ],
    correctAnswer: "A"
  },
  {
    id: 19,
    lesson: 1,
    topic: "Ứng phó sự cố khẩn cấp",
    question: "Vì sao TUYỆT ĐỐI KHÔNG dùng nước để dập các đám cháy do chập điện trong xưởng hàn?",
    options: [
      { key: "A", text: "Vì nước làm mối hàn bị giòn nứt" },
      { key: "B", text: "Vì nước dẫn điện, gây nguy cơ điện giật chết người cho người chữa cháy" },
      { key: "C", text: "Vì nước làm bốc hơi khí độc nhiều hơn" },
      { key: "D", text: "Vì nước làm biến dạng khung kết cấu máy hàn" }
    ],
    correctAnswer: "B"
  },
  {
    id: 20,
    lesson: 1,
    topic: "Kim loại học vùng mối hàn",
    question: "Vùng ảnh hưởng nhiệt (HAZ - Heat Affected Zone) trong liên kết hàn kim loại có đặc điểm nào sau đây?",
    options: [
      { key: "A", text: "Là phần kim loại bị nóng chảy hoàn toàn và kết tinh dạng đuôi gai" },
      { key: "B", text: "Không bị nóng chảy nhưng bị nhiệt cao làm biến đổi tổ chức tế vi (hạt thô to), là nơi dễ phát sinh nứt và biến dạng nhất" },
      { key: "C", text: "Là khu vực có cơ tính đồng đều và dẻo dai nhất mối hàn" },
      { key: "D", text: "Là lớp xỉ bảo vệ nằm phía trên bề mặt đường hàn" }
    ],
    correctAnswer: "B"
  },

  // =========================================================================
  // PHẦN 2: BÀI 2 - THIẾT BỊ HÀN, CỰC TÍNH, KÍNH HÀN & KÝ HIỆU (CÂU 21 -> 40)
  // =========================================================================
  {
    id: 21,
    lesson: 2,
    topic: "Nguồn hàn Inverter IGBT",
    question: "Nguồn hàn Inverter (IGBT) biến đổi dòng điện lưới AC 50/60 Hz thành dòng hàn DC ổn định thông qua khối linh kiện nào với dải tần số bao nhiêu?",
    options: [
      { key: "A", text: "Khối biến tần cao tần sử dụng IGBT với tần số 20 – 100 kHz" },
      { key: "B", text: "Khối tụ lọc điện dung lớn ở tần số 50 Hz" },
      { key: "C", text: "Khối chỉnh lưu Thyristor ở tần số 500 Hz" },
      { key: "D", text: "Khối cuộn cảm biến thiên ở tần số 10 kHz" }
    ],
    correctAnswer: "A"
  },
  {
    id: 22,
    lesson: 2,
    topic: "Vận hành máy hàn Inverter",
    question: "Đèn cảnh báo ký hiệu 'O.C' trên mặt máy hàn Inverter phát sáng báo hiệu tình trạng gì?",
    options: [
      { key: "A", text: "Máy đã sẵn sàng cấp dòng hàn (Operation Complete)" },
      { key: "B", text: "Máy bị quá tải hoặc quá nhiệt (Over Current / Over Temperature), cần dừng hàn để quạt làm mát giải nhiệt" },
      { key: "C", text: "Máy đã hàn hết một que hàn" },
      { key: "D", text: "Nguồn điện lưới AC đang ở trạng thái tối ưu" }
    ],
    correctAnswer: "B"
  },
  {
    id: 23,
    lesson: 2,
    topic: "Cực tính hàn DC",
    question: "Đấu nối cực tính thuận (DCEN / DC-) trong hàn hồ quang tay DC được thực hiện như thế nào?",
    options: [
      { key: "A", text: "Kìm hàn nối cực âm (-), kẹp mát nối cực dương (+)" },
      { key: "B", text: "Kìm hàn nối cực dương (+), kẹp mát nối cực âm (-)" },
      { key: "C", text: "Cả kìm hàn và kẹp mát cùng nối vào cực dương (+)" },
      { key: "D", text: "Đấu kìm hàn vào tiếp địa, kẹp mát vào cực âm (-)" }
    ],
    correctAnswer: "A"
  },
  {
    id: 24,
    lesson: 2,
    topic: "Đặc điểm cực tính thuận DCEN",
    question: "Đặc điểm của hồ quang và chiều sâu ngấu khi hàn ở cực tính thuận (DCEN) là gì?",
    options: [
      { key: "A", text: "Tốc độ nóng chảy que hàn nhanh, hồ quang êm, độ ngấu nông" },
      { key: "B", text: "Độ ngấu rất sâu, lực thổi hồ quang rất mạnh" },
      { key: "C", text: "Không có xỉ hàn hình thành" },
      { key: "D", text: "Mối hàn bị bắn tóe cực kỳ mạnh" }
    ],
    correctAnswer: "A"
  },
  {
    id: 25,
    lesson: 2,
    topic: "Ứng dụng cực tính thuận DCEN",
    question: "Cực tính thuận (DCEN / DC-) thường được ưu tiên ứng dụng trong trường hợp nào sau đây?",
    options: [
      { key: "A", text: "Hàn kết cấu dầm thép siêu dày chịu lực cao" },
      { key: "B", text: "Hàn các chi tiết tấm mỏng (chống cháy thủng) hoặc hàn đắp phục hồi bề mặt" },
      { key: "C", text: "Bắt buộc dùng khi hàn que bazơ E7018" },
      { key: "D", text: "Hàn bồn bể chứa áp lực dầu khí lớn" }
    ],
    correctAnswer: "B"
  },
  {
    id: 26,
    lesson: 2,
    topic: "Cực tính nghịch DCEP",
    question: "Đấu nối cực tính nghịch (DCEP / DC+) được định nghĩa chuẩn xác là:",
    options: [
      { key: "A", text: "Kìm hàn nối cực âm (-), kẹp mát nối cực dương (+)" },
      { key: "B", text: "Kìm hàn nối cực dương (+), kẹp mát nối cực âm (-)" },
      { key: "C", text: "Nối kìm hàn và kẹp mát qua biến trở phụ" },
      { key: "D", text: "Đấu luân phiên không cố định cực tính" }
    ],
    correctAnswer: "B"
  },
  {
    id: 27,
    lesson: 2,
    topic: "Ứng dụng cực tính nghịch DCEP",
    question: "Khi hàn thép dày đòi hỏi độ ngấu sâu, kết cấu chịu tải trọng chính, hoặc sử dụng que hàn E7018, ta bắt buộc sử dụng cực tính nào?",
    options: [
      { key: "A", text: "Cực tính thuận (DCEN / DC-)" },
      { key: "B", text: "Cực tính nghịch (DCEP / DC+)" },
      { key: "C", text: "Dòng xoay chiều AC tần số thấp 25 Hz" },
      { key: "D", text: "Cực tính nào cũng mang lại hiệu quả như nhau" }
    ],
    correctAnswer: "B"
  },
  {
    id: 28,
    lesson: 2,
    topic: "Dụng cụ nghề hàn",
    question: "Kìm hàn que chuyên dụng thường được thiết kế các rãnh kẹp định vị que hàn ở những góc độ tiêu chuẩn nào?",
    options: [
      { key: "A", text: "45°, 90°, 180°" },
      { key: "B", text: "30°, 60°, 120°" },
      { key: "C", text: "15°, 45°, 75°" },
      { key: "D", text: "0°, 30°, 90°" }
    ],
    correctAnswer: "A"
  },
  {
    id: 29,
    lesson: 2,
    topic: "Dụng cụ nghề hàn",
    question: "Búa gõ xỉ hàn được thiết kế hai đầu với công năng chuyên biệt là gì?",
    options: [
      { key: "A", text: "Hai đầu tròn bằng thép mềm để uốn nắn phôi hàn" },
      { key: "B", text: "Một đầu nhọn dùng gõ xỉ ở góc mối hàn, một đầu dẹt dùng cạo xỉ phẳng" },
      { key: "C", text: "Một đầu có lưỡi cắt dùng để chặt que hàn thừa" },
      { key: "D", text: "Một đầu gắn nam châm dùng để nhặt que hàn" }
    ],
    correctAnswer: "B"
  },
  {
    id: 30,
    lesson: 2,
    topic: "Dụng cụ nghề hàn",
    question: "Dụng cụ bàn chải sắt trong xưởng hàn có công dụng chính là gì?",
    options: [
      { key: "A", text: "Chà sạch gỉ sắt, dầu mỡ trước khi hàn và đánh bóng làm sạch xỉ bám sau khi hàn" },
      { key: "B", text: "Quét dọn bụi đất trên sàn xưởng" },
      { key: "C", text: "Kẹp giữ mép phôi khi gá đính" },
      { key: "D", text: "Làm nguội vũng hàn đang nóng chảy" }
    ],
    correctAnswer: "A"
  },
  {
    id: 31,
    lesson: 2,
    topic: "Mặt nạ hàn điện tử",
    question: "Tốc độ chuyển đổi từ trạng thái trong suốt (DIN 3-4) sang trạng thái sẫm màu (DIN 9-13) của mặt nạ hàn điện tử là khoảng:",
    options: [
      { key: "A", text: "1/25 giây" },
      { key: "B", text: "1/2.500 giây" },
      { key: "C", text: "1/25.000 giây" },
      { key: "D", text: "1 giây" }
    ],
    correctAnswer: "C"
  },
  {
    id: 32,
    lesson: 2,
    topic: "Độ tối kính hàn (DIN)",
    question: "Khi hàn que đường kính 2.5 – 3.2 mm với cường độ dòng hàn từ 80 – 120 A, độ tối kính lọc phù hợp theo chuẩn DIN là:",
    options: [
      { key: "A", text: "DIN 8" },
      { key: "B", text: "DIN 9" },
      { key: "C", text: "DIN 10" },
      { key: "D", text: "DIN 13" }
    ],
    correctAnswer: "C"
  },
  {
    id: 33,
    lesson: 2,
    topic: "Độ tối kính hàn (DIN)",
    question: "Khi tăng cường độ dòng hàn lên mức 180 – 250 A (dùng que hàn 4.0 – 5.0 mm), độ tối kính hàn bắt buộc lựa chọn là:",
    options: [
      { key: "A", text: "DIN 9" },
      { key: "B", text: "DIN 10" },
      { key: "C", text: "DIN 11" },
      { key: "D", text: "DIN 12" }
    ],
    correctAnswer: "D"
  },
  {
    id: 34,
    lesson: 2,
    topic: "Ký hiệu mối hàn AWS A2.4",
    question: "Cấu trúc cơ bản của tiêu chuẩn ký hiệu mối hàn trên bản vẽ kỹ thuật cơ khí theo AWS A2.4 / TCVN gồm 3 phần chính nào?",
    options: [
      { key: "A", text: "Đường mũi tên (Arrow line), Đường tham chiếu (Reference line) và Đuôi mũi tên (Tail)" },
      { key: "B", text: "Đường trục chính, Vòng tròn định vị và Bảng số liệu vật liệu" },
      { key: "C", text: "Khung tên, Hình chiếu đứng và Hình chiếu bằng" },
      { key: "D", text: "Đầu kẹp que, Dây cáp hàn và Thân kìm hàn" }
    ],
    correctAnswer: "A"
  },
  {
    id: 35,
    lesson: 2,
    topic: "Ký hiệu mối hàn AWS A2.4",
    question: "Theo tiêu chuẩn AWS A2.4, khi ký hiệu hình học mối hàn được đặt ở PHÍA DƯỚI đường tham chiếu, điều đó có nghĩa là:",
    options: [
      { key: "A", text: "Mối hàn được thực hiện ở phía mũi tên (Arrow Side)" },
      { key: "B", text: "Mối hàn được thực hiện ở phía đối diện (Other Side)" },
      { key: "C", text: "Mối hàn được thực hiện ở cả hai phía" },
      { key: "D", text: "Mối hàn thực hiện dưới đáy phôi" }
    ],
    correctAnswer: "A"
  },
  {
    id: 36,
    lesson: 2,
    topic: "Ký hiệu mối hàn AWS A2.4",
    question: "Khi ký hiệu hình học mối hàn được đặt ở PHÍA TRÊN đường tham chiếu (Reference line), mối hàn sẽ được thực hiện ở vị trí nào?",
    options: [
      { key: "A", text: "Phía mũi tên chỉ vào (Arrow Side)" },
      { key: "B", text: "Phía đối diện với phía mũi tên chỉ vào (Other Side)" },
      { key: "C", text: "Hàn quanh chu vi chi tiết" },
      { key: "D", text: "Hàn ngoài công trường" }
    ],
    correctAnswer: "B"
  },
  {
    id: 37,
    lesson: 2,
    topic: "Ký hiệu mối hàn bổ sung",
    question: "Ký hiệu 'Hình lá cờ' đặt tại điểm gấp khúc giữa đường mũi tên và đường tham chiếu thể hiện ý nghĩa gì?",
    options: [
      { key: "A", text: "Mối hàn có chất lượng đạt giải thưởng hội thi tay nghề" },
      { key: "B", text: "Mối hàn được thực hiện ngoài hiện trường / công trường lắp dựng (Field weld)" },
      { key: "C", text: "Mối hàn thực hiện tự động bằng robot" },
      { key: "D", text: "Mối hàn yêu cầu kiểm tra bằng siêu âm không phá hủy" }
    ],
    correctAnswer: "B"
  },
  {
    id: 38,
    lesson: 2,
    topic: "Tiêu chuẩn que hàn AWS A5.1",
    question: "Trong ký hiệu que hàn thép carbon 'E6013' theo tiêu chuẩn AWS A5.1, hai chữ số '60' biểu thị thông số kỹ thuật nào?",
    options: [
      { key: "A", text: "Đường kính que hàn là 6.0 mm" },
      { key: "B", text: "Giới hạn bền kéo tối thiểu của kim loại mối hàn là 60 ksi (tương đương 420 MPa)" },
      { key: "C", text: "Cường độ dòng hàn danh định của que là 60 Ampe" },
      { key: "D", text: "Độ giãn dài tương đối của kim loại đắp đạt 60%" }
    ],
    correctAnswer: "B"
  },
  {
    id: 39,
    lesson: 2,
    topic: "Tiêu chuẩn que hàn AWS A5.1",
    question: "Trong ký hiệu que hàn 'E6013', chữ số '1' đứng ở vị trí thứ ba thể hiện ý nghĩa gì về vị trí hàn?",
    options: [
      { key: "A", text: "Chỉ được phép hàn ở vị trí hàn bằng (1G, 1F)" },
      { key: "B", text: "Que hàn hàn được ở mọi vị trí không gian (bằng, ngang, đứng, trần)" },
      { key: "C", text: "Chỉ được phép hàn ở vị trí hàn đứng từ trên xuống" },
      { key: "D", text: "Chỉ dùng cho hàn giáp mối một lớp" }
    ],
    correctAnswer: "B"
  },
  {
    id: 40,
    lesson: 2,
    topic: "Bảo quản & Sấy que hàn",
    question: "Que hàn E6013 thuộc hệ thuốc bọc nào và có quy trình sấy bảo quản khi bị ẩm nhẹ như thế nào?",
    options: [
      { key: "A", text: "Hệ thuốc bọc Bazơ, bắt buộc sấy nhiệt độ cao 350 – 400°C trong 2 giờ" },
      { key: "B", text: "Hệ thuốc bọc Rutile (chứa titan oxit cao), ít hút ẩm, nếu ẩm nhẹ chỉ cần sấy ở 100 – 150°C trong 30 – 60 phút" },
      { key: "C", text: "Hệ thuốc bọc Xenlulo, tuyệt đối không được sấy vì làm cháy thuốc bọc" },
      { key: "D", text: "Hệ thuốc bọc Axit, chỉ cần phơi nắng tự nhiên ngoài trời" }
    ],
    correctAnswer: "B"
  }
];
