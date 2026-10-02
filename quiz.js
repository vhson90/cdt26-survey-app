/**
 * QUIZ.JS - ĐIỀU KHIỂN BÀI THI TRẮC NGHIỆM THỰC HÀNH HÀN (40 CÂU - 30 PHÚT)
 */

(function () {
  "use strict";

  // 1. Cấu hình & Biến toàn cục
  const config = window.APP_CONFIG || {};
  const REQUIRED_PASSCODE = (config.QUIZ_PASSCODE || "0210CDT3").trim().toUpperCase();
  const DURATION_SECONDS = (config.QUIZ_DURATION_MINUTES || 30) * 60; // 30 phút = 1800s

  let supabase = null;
  let currentStudent = null;
  let remainingSeconds = DURATION_SECONDS;
  let timerInterval = null;
  const studentAnswers = {}; // { 1: "A", 2: "C", ... }
  let isSubmitting = false;

  // 2. Khởi tạo Supabase Client
  function getSupabaseClient() {
    if (!supabase && window.supabase && config.SUPABASE_URL && config.SUPABASE_ANON_KEY) {
      try {
        supabase = window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);
      } catch (err) {
        console.error("Không thể khởi tạo Supabase:", err);
      }
    }
    return supabase;
  }

  // 3. Khởi tạo danh sách lớp gợi ý
  function initClassSuggestions() {
    const dataList = document.getElementById("quiz-class-list");
    if (dataList && config.DEFAULT_CLASSES) {
      config.DEFAULT_CLASSES.forEach(cls => {
        const opt = document.createElement("option");
        opt.value = cls;
        dataList.appendChild(opt);
      });
    }
  }

  // 4. Kiểm tra mã số sinh viên đã thi hay chưa
  async function checkMSSVSubmitted(mssv) {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client
          .from("quiz_submissions")
          .select("id")
          .eq("mssv", mssv)
          .limit(1);

        if (!error && data && data.length > 0) {
          return true;
        }
      } catch (err) {
        console.warn("Lỗi kiểm tra Supabase, kiểm tra LocalStorage:", err);
      }
    }

    // Kiểm tra trong LocalStorage
    const local = JSON.parse(localStorage.getItem("DEMO_QUIZ_SUBMISSIONS") || "[]");
    return local.some(s => s.mssv.toUpperCase() === mssv);
  }

  // 5. Xử lý Form đăng nhập dự thi
  async function handleAuthSubmit(e) {
    e.preventDefault();
    const errorBox = document.getElementById("auth-error");
    errorBox.classList.add("hidden");
    errorBox.textContent = "";

    const mssvInput = document.getElementById("student-mssv");
    const nameInput = document.getElementById("student-name");
    const classInput = document.getElementById("student-class");
    const passcodeInput = document.getElementById("quiz-passcode");
    const startBtn = document.getElementById("start-quiz-btn");
    const btnText = document.getElementById("start-btn-text");
    const btnSpinner = document.getElementById("start-btn-spinner");

    const mssv = mssvInput.value.trim().toUpperCase();
    const hoTen = nameInput.value.trim();
    const lop = classInput.value.trim().toUpperCase();
    const inputPasscode = passcodeInput.value.trim().toUpperCase();

    // 5.1 Kiểm tra thông tin bắt buộc
    if (!mssv || !hoTen || !lop) {
      showAuthError("Vui lòng điền đầy đủ Mã số sinh viên, Họ và tên và Lớp học!");
      return;
    }

    // 5.2 Kiểm tra Mật mã 8 ký tự bí mật
    if (inputPasscode !== REQUIRED_PASSCODE) {
      showAuthError("Mật mã phòng thi không chính xác! Vui lòng hỏi lại Giảng viên tại lớp (mã 8 ký tự).");
      passcodeInput.focus();
      return;
    }

    // Bật hiệu ứng loading
    startBtn.disabled = true;
    btnText.textContent = "Đang kiểm tra...";
    btnSpinner.classList.remove("hidden");

    try {
      // 5.3 Kiểm tra trùng lặp bài thi
      const alreadySubmitted = await checkMSSVSubmitted(mssv);
      if (alreadySubmitted) {
        showAuthError(`Mã số sinh viên ${mssv} đã hoàn thành bài thi này trước đó! Mỗi sinh viên chỉ được làm bài 01 lần.`);
        startBtn.disabled = false;
        btnText.textContent = "Bắt đầu làm bài kiểm tra";
        btnSpinner.classList.add("hidden");
        return;
      }

      // Lưu thông tin thí sinh hiện tại
      currentStudent = {
        mssv: mssv,
        hoTen: hoTen,
        lop: lop,
        startTime: Date.now()
      };

      // Chuyển sang màn hình thi
      startQuizSession();

    } catch (err) {
      console.error(err);
      showAuthError("Có lỗi xảy ra khi xác thực. Vui lòng thử lại!");
      startBtn.disabled = false;
      btnText.textContent = "Bắt đầu làm bài kiểm tra";
      btnSpinner.classList.add("hidden");
    }
  }

  function showAuthError(msg) {
    const errorBox = document.getElementById("auth-error");
    errorBox.textContent = msg;
    errorBox.classList.remove("hidden");
  }

  // 6. Khởi động bài thi & Kích hoạt đếm ngược 30 phút
  function startQuizSession() {
    document.getElementById("auth-section").classList.add("hidden");
    document.getElementById("quiz-section").classList.remove("hidden");
    document.getElementById("header-timer-container").classList.remove("hidden");
    document.getElementById("header-progress-wrap").classList.remove("hidden");

    // Hiển thị thông tin thí sinh trên thanh điều hướng
    document.getElementById("display-student-name").textContent = currentStudent.hoTen;
    document.getElementById("display-student-mssv").textContent = currentStudent.mssv;
    document.getElementById("display-student-class").textContent = currentStudent.lop;

    // Render danh sách câu hỏi & Palette bảng chọn
    renderQuizQuestions();
    renderPalette();

    // Bắt đầu đếm ngược thời gian
    remainingSeconds = DURATION_SECONDS;
    updateTimerDisplay();
    timerInterval = setInterval(handleTimerTick, 1000);

    // Cuộn lên đầu trang bài thi
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // 7. Đồng hồ đếm ngược 30 phút
  function handleTimerTick() {
    remainingSeconds--;

    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      remainingSeconds = 0;
      updateTimerDisplay();
      alert("HẾT GIỜ LÀM BÀI (30 PHÚT)!\nHệ thống sẽ tự động thu bài và chấm điểm bài làm của bạn.");
      submitQuiz(true); // Auto submit
      return;
    }

    updateTimerDisplay();

    // Cảnh báo 5 phút cuối
    const timerEl = document.getElementById("countdown-timer");
    if (remainingSeconds <= 300) { // dưới 5 phút
      timerEl.classList.remove("text-blue-600");
      timerEl.classList.add("text-rose-600", "animate-pulse");
    }
  }

  function updateTimerDisplay() {
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    const str = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

    const timerEl = document.getElementById("countdown-timer");
    if (timerEl) timerEl.textContent = str;

    const progressBar = document.getElementById("timer-progress-bar");
    if (progressBar) {
      const pct = (remainingSeconds / DURATION_SECONDS) * 100;
      progressBar.style.width = `${pct}%`;
      if (pct < 15) {
        progressBar.classList.replace("bg-blue-600", "bg-rose-500");
      }
    }
  }

  // 8. Render 40 câu hỏi trắc nghiệm
  function renderQuizQuestions() {
    const container = document.getElementById("questions-list-container");
    const questions = window.WELDING_QUIZ_QUESTIONS || [];
    container.innerHTML = "";

    questions.forEach((q, index) => {
      const qNum = index + 1;
      const card = document.createElement("div");
      card.className = "p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4 transition-all";
      card.id = `q-card-${q.id}`;

      // Header câu hỏi
      const header = document.createElement("div");
      header.className = "flex items-start justify-between gap-3";
      header.innerHTML = `
        <div class="flex items-start space-x-3">
          <span class="inline-flex items-center justify-center min-w-[32px] h-[32px] rounded-xl bg-blue-50 text-blue-700 font-extrabold text-sm border border-blue-200 shrink-0">
            ${qNum}
          </span>
          <p class="text-sm sm:text-base font-semibold text-slate-800 leading-snug">
            ${q.question}
          </p>
        </div>
        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 shrink-0">
          Bài ${q.lesson}
        </span>
      `;
      card.appendChild(header);

      // 4 Lựa chọn A, B, C, D
      const optionsWrap = document.createElement("div");
      optionsWrap.className = "space-y-2.5 pt-1";

      q.options.forEach(opt => {
        const label = document.createElement("label");
        label.className = `flex items-center space-x-3.5 p-3 sm:p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 cursor-pointer transition-all option-label-${q.id}`;
        label.id = `opt-label-${q.id}-${opt.key}`;

        label.innerHTML = `
          <input 
            type="radio" 
            name="q_${q.id}" 
            value="${opt.key}" 
            data-qid="${q.id}" 
            class="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
          >
          <span class="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0 border border-slate-200">
            ${opt.key}
          </span>
          <span class="text-xs sm:text-sm text-slate-700 leading-snug font-medium">
            ${opt.text}
          </span>
        `;
        optionsWrap.appendChild(label);
      });

      card.appendChild(optionsWrap);
      container.appendChild(card);
    });

    // Lắng nghe sự kiện chọn đáp án
    container.addEventListener("change", handleAnswerSelect);
  }

  // 9. Render Palette bảng chọn 40 câu hỏi nhanh
  function renderPalette() {
    const grid = document.getElementById("palette-grid");
    const questions = window.WELDING_QUIZ_QUESTIONS || [];
    grid.innerHTML = "";

    questions.forEach((q, index) => {
      const qNum = index + 1;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.id = `palette-btn-${q.id}`;
      btn.className = "palette-btn w-full h-8 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-100 text-slate-700 font-bold text-xs flex items-center justify-center transition-all";
      btn.textContent = qNum;
      btn.title = `Chuyển tới câu ${qNum}`;

      btn.addEventListener("click", () => {
        const card = document.getElementById(`q-card-${q.id}`);
        if (card) {
          card.scrollIntoView({ behavior: "smooth", block: "center" });
          // Highlight tạm thời câu đang chọn
          card.classList.add("ring-2", "ring-blue-500");
          setTimeout(() => card.classList.remove("ring-2", "ring-blue-500"), 1200);
        }
      });

      grid.appendChild(btn);
    });
  }

  // 10. Xử lý khi sinh viên tick chọn đáp án
  function handleAnswerSelect(e) {
    const target = e.target;
    if (!target || target.type !== "radio") return;

    const qid = Number(target.dataset.qid);
    const selectedKey = target.value;

    // Lưu đáp án
    studentAnswers[qid] = selectedKey;

    // Cập nhật giao diện radio label (active state)
    document.querySelectorAll(`.option-label-${qid}`).forEach(el => {
      el.classList.remove("border-blue-600", "bg-blue-50", "ring-1", "ring-blue-600");
    });
    const currentLabel = document.getElementById(`opt-label-${qid}-${selectedKey}`);
    if (currentLabel) {
      currentLabel.classList.add("border-blue-600", "bg-blue-50", "ring-1", "ring-blue-600");
    }

    // Cập nhật nút trên Palette sang màu xanh
    const palBtn = document.getElementById(`palette-btn-${qid}`);
    if (palBtn) {
      palBtn.classList.add("active");
    }

    // Cập nhật bộ đếm câu đã làm
    updateProgressCounter();
  }

  function updateProgressCounter() {
    const total = (window.WELDING_QUIZ_QUESTIONS || []).length;
    const answered = Object.keys(studentAnswers).length;
    const counterEl = document.getElementById("answered-counter");
    if (counterEl) {
      counterEl.textContent = `${answered} / ${total} câu`;
    }

    const warningBox = document.getElementById("submit-warning");
    const countText = document.getElementById("unanswered-count-text");
    const remaining = total - answered;
    if (remaining > 0) {
      if (warningBox) warningBox.classList.remove("hidden");
      if (countText) countText.textContent = remaining;
    } else {
      if (warningBox) warningBox.classList.add("hidden");
    }
  }

  // 11. Xử lý trước khi nộp bài (Confirmation Modal)
  function setupSubmitTriggers() {
    const finishBtn = document.getElementById("finish-quiz-btn");
    if (finishBtn) {
      finishBtn.addEventListener("click", () => {
        const total = (window.WELDING_QUIZ_QUESTIONS || []).length;
        const answered = Object.keys(studentAnswers).length;
        const remaining = total - answered;

        const modal = document.getElementById("confirm-submit-modal");
        const warningText = document.getElementById("modal-warning-text");

        if (remaining > 0) {
          warningText.innerHTML = `Bạn hiện vẫn còn <strong class="text-rose-600 font-bold">${remaining} câu chưa trả lời</strong>.<br>Hệ thống sẽ tính 0 điểm cho các câu bỏ trống. Bạn có chắc chắn muốn nộp bài ngay bây giờ?`;
        } else {
          warningText.innerHTML = `Bạn đã hoàn thành đầy đủ <strong>40/40 câu hỏi</strong>.<br>Bạn có muốn gửi bài kiểm tra để chấm điểm ngay?`;
        }

        modal.classList.remove("hidden");
      });
    }

    const confirmActionBtn = document.getElementById("confirm-submit-action-btn");
    if (confirmActionBtn) {
      confirmActionBtn.addEventListener("click", () => {
        closeConfirmModal();
        submitQuiz(false);
      });
    }
  }

  window.closeConfirmModal = function () {
    const modal = document.getElementById("confirm-submit-modal");
    if (modal) modal.classList.add("hidden");
  };

  // 12. Chấm điểm & Nộp bài vào CSDL
  async function submitQuiz(isAuto = false) {
    if (isSubmitting) return;
    isSubmitting = true;

    // Dừng đồng hồ đếm ngược
    if (timerInterval) clearInterval(timerInterval);

    const submitBtn = document.getElementById("finish-quiz-btn");
    const btnText = document.getElementById("submit-btn-text");
    const btnSpinner = document.getElementById("submit-btn-spinner");

    if (submitBtn) submitBtn.disabled = true;
    if (btnText) btnText.textContent = "Đang chấm điểm & nộp bài...";
    if (btnSpinner) btnSpinner.classList.remove("hidden");

    // Tính điểm số
    const questions = window.WELDING_QUIZ_QUESTIONS || [];
    let correctCount = 0;

    questions.forEach(q => {
      const userAns = studentAnswers[q.id];
      if (userAns && userAns.toUpperCase() === q.correctAnswer.toUpperCase()) {
        correctCount++;
      }
    });

    const totalQuestions = questions.length; // 40
    // Điểm thang 10: mỗi câu 0.25đ -> correctCount * 0.25
    const finalScore = Math.round((correctCount / totalQuestions) * 10 * 100) / 100;
    const timeSpentSeconds = DURATION_SECONDS - remainingSeconds;
    const minutesSpent = Math.floor(timeSpentSeconds / 60);
    const secondsSpent = timeSpentSeconds % 60;

    // Chuẩn bị payload nộp lên CSDL
    const payload = {
      mssv: currentStudent.mssv,
      ho_ten: currentStudent.hoTen,
      lop: currentStudent.lop,
      score: finalScore,
      correct_count: correctCount,
      total_questions: totalQuestions,
      time_spent_seconds: timeSpentSeconds,
      answers: studentAnswers,
      created_at: new Date().toISOString()
    };

    // 12.1 Lưu vào Supabase
    const client = getSupabaseClient();
    if (client) {
      try {
        const { error: insertErr } = await client
          .from("quiz_submissions")
          .insert([payload]);

        if (insertErr) {
          console.error("Lỗi lưu Supabase:", insertErr);
          if (insertErr.code === "23505") {
            alert(`Mã số sinh viên ${currentStudent.mssv} đã hoàn thành bài thi trước đó!`);
          }
        } else {
          console.log("Đã lưu kết quả thi lên Supabase thành công!");
        }
      } catch (err) {
        console.error("Lỗi ngoại lệ gửi Supabase:", err);
      }
    }

    // 12.2 Luôn lưu bản sao dự phòng vào LocalStorage
    try {
      const localList = JSON.parse(localStorage.getItem("DEMO_QUIZ_SUBMISSIONS") || "[]");
      localList.push(payload);
      localStorage.setItem("DEMO_QUIZ_SUBMISSIONS", JSON.stringify(localList));
    } catch (err) {
      console.warn("Không thể ghi vào localStorage:", err);
    }

    // 12.3 Hiển thị màn hình kết quả (CHỈ HIỂN THỊ ĐIỂM SỐ)
    showResultScreen({
      name: currentStudent.hoTen,
      mssv: currentStudent.mssv,
      lop: currentStudent.lop,
      score: finalScore,
      correct: correctCount,
      total: totalQuestions,
      timeStr: `${minutesSpent} phút ${secondsSpent} giây`
    });
  }

  // 13. Hiển thị màn hình kết quả bảo mật (Không lộ đáp án)
  function showResultScreen(res) {
    document.getElementById("quiz-section").classList.add("hidden");
    document.getElementById("header-timer-container").classList.add("hidden");
    document.getElementById("header-progress-wrap").classList.add("hidden");
    document.getElementById("result-section").classList.remove("hidden");

    // Điền dữ liệu
    document.getElementById("res-student-name").textContent = res.name;
    document.getElementById("res-student-mssv").textContent = res.mssv;
    document.getElementById("res-student-class").textContent = res.lop;
    document.getElementById("res-time-spent").textContent = res.timeStr;

    document.getElementById("res-final-score").textContent = res.score.toFixed(1);
    document.getElementById("res-correct-count").textContent = res.correct;
    const pct = Math.round((res.correct / res.total) * 100);
    document.getElementById("res-percent").textContent = `${pct}%`;

    // Phân loại xếp hạng
    const rankEl = document.getElementById("res-rank-text");
    const rankBox = document.getElementById("res-ranking-box");

    if (res.score >= 9.0) {
      rankEl.textContent = "Xuất sắc (Nắm rất vững lý thuyết & an toàn xưởng)";
      rankBox.className = "p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-6";
    } else if (res.score >= 8.0) {
      rankEl.textContent = "Giỏi (Hiểu rõ quy trình và thiết bị hàn)";
      rankBox.className = "p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold mb-6";
    } else if (res.score >= 6.5) {
      rankEl.textContent = "Khá (Cần rèn luyện thêm một số ký hiệu & quy chuẩn)";
      rankBox.className = "p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold mb-6";
    } else if (res.score >= 5.0) {
      rankEl.textContent = "Trung bình (Đạt chuẩn tối thiểu, cần đọc kỹ lại quy chế an toàn)";
      rankBox.className = "p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-6";
    } else {
      rankEl.textContent = "Chưa đạt (Cần ôn tập kỹ nội quy xưởng và kiểm tra lại)";
      rankBox.className = "p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold mb-6";
    }

    // Cuộn lên đầu trang kết quả
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // 14. Khởi chạy khi DOM sẵn sàng
  document.addEventListener("DOMContentLoaded", () => {
    initClassSuggestions();

    const authForm = document.getElementById("quiz-auth-form");
    if (authForm) {
      authForm.addEventListener("submit", handleAuthSubmit);
    }

    setupSubmitTriggers();
  });

})();
