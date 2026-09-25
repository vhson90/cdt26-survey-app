/**
 * APP.JS - QUẢN LÝ GIAO DIỆN & TƯƠNG TÁC KHẢO SÁT SINH VIÊN
 */

(function () {
  "use strict";

  // 1. Khởi tạo Supabase Client
  let supabase = null;
  const config = window.APP_CONFIG || {};

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

  // Danh sách câu hỏi đã được trộn thứ tự
  let shuffledQuestions = [];
  const studentAnswers = {};

  // 2. Thuật toán Fisher-Yates xáo trộn câu hỏi
  function shuffleArray(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  // 3. Khởi tạo danh sách kênh liên hệ và gợi ý lớp
  function initFormFields() {
    // Kênh liên hệ
    const channelSelect = document.getElementById("kenh_lien_he");
    if (channelSelect && config.CONTACT_CHANNELS) {
      config.CONTACT_CHANNELS.forEach(ch => {
        const opt = document.createElement("option");
        opt.value = ch.label;
        opt.textContent = ch.label;
        channelSelect.appendChild(opt);
      });
    }

    // Gợi ý lớp học
    const classDatalist = document.getElementById("class-suggestions");
    if (classDatalist && config.DEFAULT_CLASSES) {
      config.DEFAULT_CLASSES.forEach(cls => {
        const opt = document.createElement("option");
        opt.value = cls;
        classDatalist.appendChild(opt);
      });
    }
  }

  // 4. Render các câu hỏi ra giao diện HTML
  function renderQuestions() {
    const container = document.getElementById("questions-container");
    if (!container) return;

    const rawQuestions = window.SURVEY_QUESTIONS || [];
    if (!rawQuestions.length) {
      container.innerHTML = '<p class="text-rose-500 text-sm">Không tìm thấy bộ câu hỏi khảo sát.</p>';
      return;
    }

    // Xáo trộn thứ tự 24 câu hỏi
    shuffledQuestions = shuffleArray(rawQuestions);
    container.innerHTML = "";

    shuffledQuestions.forEach((q, index) => {
      const qNum = index + 1;
      const qCard = document.createElement("div");
      qCard.className = "p-4 sm:p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-3.5";
      qCard.id = `q-card-${q.id}`;

      // Tiêu đề câu hỏi (hoàn toàn trung tính, không lộ chiều đo)
      const qHeader = document.createElement("div");
      qHeader.className = "flex items-start space-x-2.5";
      qHeader.innerHTML = `
        <span class="inline-flex items-center justify-center min-w-[26px] h-[26px] rounded-lg bg-slate-100 text-slate-700 font-bold text-xs shrink-0 mt-0.5">
          ${qNum}
        </span>
        <p class="text-sm sm:text-base font-medium text-slate-800 leading-snug">
          ${q.text}
        </p>
      `;
      qCard.appendChild(qHeader);

      // Thân câu hỏi theo từng loại
      const bodyWrapper = document.createElement("div");

      if (q.type === "likert") {
        // Thang đo Likert 1-5
        const likertLabels = [
          { val: 1, text: "Rất không đồng ý" },
          { val: 2, text: "Không đồng ý" },
          { val: 3, text: "Trung lập / Phân vân" },
          { val: 4, text: "Đồng ý" },
          { val: 5, text: "Rất đồng ý" }
        ];

        let likertHtml = `
          <div class="grid grid-cols-5 gap-1.5 sm:gap-2 pt-2">
        `;

        likertLabels.forEach(lbl => {
          likertHtml += `
            <label class="likert-btn relative text-center">
              <input 
                type="radio" 
                name="answer_${q.id}" 
                value="${lbl.val}" 
                data-qid="${q.id}" 
                class="peer sr-only"
                required
              >
              <div class="likert-btn-content flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-all h-full">
                <span class="text-sm sm:text-base font-bold mb-0.5">${lbl.val}</span>
                <span class="text-[10px] leading-tight text-center hidden sm:block">${lbl.text}</span>
              </div>
            </label>
          `;
        });

        likertHtml += `
          </div>
          <div class="flex justify-between items-center text-[10px] sm:hidden text-slate-400 px-1 pt-1.5 font-medium">
            <span>1: Rất không đồng ý</span>
            <span>5: Rất đồng ý</span>
          </div>
        `;

        bodyWrapper.innerHTML = likertHtml;
      } 
      else if (q.type === "situational" || q.type === "forced_choice") {
        // Tình huống hoặc Lựa chọn bắt buộc
        const optionsList = q.options || [];
        let choiceHtml = `<div class="space-y-2 pt-1">`;

        optionsList.forEach((opt, optIndex) => {
          const letter = String.fromCharCode(65 + optIndex); // A, B, C, D
          choiceHtml += `
            <label class="choice-card block relative rounded-xl overflow-hidden">
              <input 
                type="radio" 
                name="answer_${q.id}" 
                value="${optIndex}" 
                data-score="${opt.score}" 
                data-qid="${q.id}" 
                class="peer sr-only"
                required
              >
              <div class="choice-card-content flex items-start p-3 sm:p-3.5 space-x-3 rounded-xl border border-slate-200 bg-white transition-all">
                <span class="choice-indicator w-6 h-6 rounded-lg border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0 mt-0.5">
                  ${letter}
                </span>
                <span class="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  ${opt.text}
                </span>
              </div>
            </label>
          `;
        });

        choiceHtml += `</div>`;
        bodyWrapper.innerHTML = choiceHtml;
      }

      qCard.appendChild(bodyWrapper);
      container.appendChild(qCard);
    });

    // Lắng nghe sự kiện thay đổi đáp án để cập nhật thanh tiến độ
    container.addEventListener("change", handleAnswerChange);
  }

  // 5. Cập nhật tiến độ hoàn thành
  function handleAnswerChange(e) {
    const target = e.target;
    if (!target || !target.dataset || !target.dataset.qid) return;

    const qid = target.dataset.qid;
    studentAnswers[qid] = {
      val: target.value,
      score: target.dataset.score ? Number(target.dataset.score) : Number(target.value)
    };

    // Xóa viền đỏ nếu câu này trước đó bị bỏ sót
    const card = document.getElementById(`q-card-${qid}`);
    if (card) {
      card.classList.remove("border-rose-400", "bg-rose-50/20");
    }

    updateProgress();
  }

  function updateProgress() {
    const total = shuffledQuestions.length;
    const answeredCount = Object.keys(studentAnswers).length;
    const percent = total > 0 ? Math.round((answeredCount / total) * 100) : 0;

    const pText = document.getElementById("progress-text");
    const pPercent = document.getElementById("progress-percent");
    const pBar = document.getElementById("progress-bar");

    if (pText) pText.textContent = `${answeredCount}/${total} câu`;
    if (pPercent) pPercent.textContent = `${percent}%`;
    if (pBar) pBar.style.width = `${percent}%`;
  }

  // 6. Tính toán điểm từng chiều đánh giá một cách an toàn & bảo mật
  function calculateDimensionScores() {
    const dimensions = window.SURVEY_DIMENSIONS || {};
    const dimMap = {};

    // Khởi tạo các chiều
    Object.keys(dimensions).forEach(k => {
      dimMap[k] = { total: 0, count: 0, score: 0 };
    });

    // Duyệt qua từng câu hỏi
    shuffledQuestions.forEach(q => {
      const ansObj = studentAnswers[q.id];
      if (!ansObj) return;

      const dim = q.dimension;
      if (!dimMap[dim]) dimMap[dim] = { total: 0, count: 0, score: 0 };

      let scoreVal = 0;
      if (q.type === "likert") {
        const raw = Number(ansObj.val);
        // Nếu là câu đảo chiều: 1->5, 2->4, 3->3, 4->2, 5->1
        scoreVal = q.reverse ? (6 - raw) : raw;
      } else {
        // Tình huống hoặc Forced-choice
        scoreVal = Number(ansObj.score);
      }

      dimMap[dim].total += scoreVal;
      dimMap[dim].count += 1;
    });

    // Tính điểm trung bình của từng chiều (thang 5.0)
    const resultScores = {};
    let sumAllDims = 0;
    let validDimCount = 0;

    Object.keys(dimMap).forEach(k => {
      const d = dimMap[k];
      const avg = d.count > 0 ? Number((d.total / d.count).toFixed(2)) : 0;
      resultScores[k] = avg;
      if (d.count > 0) {
        sumAllDims += avg;
        validDimCount += 1;
      }
    });

    const overallAvg = validDimCount > 0 ? Number((sumAllDims / validDimCount).toFixed(2)) : 0;

    // Đánh giá sơ bộ xem có thuộc diện "Cần tìm hiểu thêm" theo tiêu chí gợi ý
    const criteria = config.SHORTLIST_CRITERIA || { MIN_OVERALL_AVERAGE: 4.0, HIGH_DIMENSION_THRESHOLD: 4.5, MIN_SINGLE_DIMENSION: 3.2 };
    let highCount = 0;
    let hasLowDim = false;

    Object.values(resultScores).forEach(sc => {
      if (sc >= criteria.HIGH_DIMENSION_THRESHOLD) highCount++;
      if (sc < criteria.MIN_SINGLE_DIMENSION) hasLowDim = true;
    });

    // Điều kiện gợi ý xem xét thêm:
    // (Điểm TB >= 4.0 VÀ không có chiều nào quá thấp) HOẶC (Có ít nhất 2 chiều nổi bật >= 4.5)
    const taggedForReview = (overallAvg >= criteria.MIN_OVERALL_AVERAGE && !hasLowDim) || (highCount >= 2 && !hasLowDim);

    return {
      scores: resultScores,
      overallAvg: overallAvg,
      taggedForReview: taggedForReview
    };
  }

  // 7. Xử lý gửi biểu mẫu (Submit)
  async function handleSubmit(e) {
    e.preventDefault();

    const form = document.getElementById("survey-form");
    const mssvInput = document.getElementById("mssv");
    const hoTenInput = document.getElementById("ho_ten");
    const lopInput = document.getElementById("lop");
    const sdtInput = document.getElementById("so_dien_thoai");
    const emailInput = document.getElementById("email");
    const kenhInput = document.getElementById("kenh_lien_he");
    const unansweredWarning = document.getElementById("unanswered-warning");

    const submitBtn = document.getElementById("submit-btn");
    const btnText = document.getElementById("btn-text");
    const btnSpinner = document.getElementById("btn-spinner");

    // Kiểm tra đã trả lời đủ 24 câu chưa
    const unansweredList = [];
    shuffledQuestions.forEach(q => {
      if (!studentAnswers[q.id]) {
        unansweredList.push(q.id);
        const card = document.getElementById(`q-card-${q.id}`);
        if (card) {
          card.classList.add("border-rose-400", "bg-rose-50/20");
        }
      }
    });

    if (unansweredList.length > 0) {
      if (unansweredWarning) unansweredWarning.classList.remove("hidden");
      const firstCard = document.getElementById(`q-card-${unansweredList[0]}`);
      if (firstCard) {
        firstCard.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    } else {
      if (unansweredWarning) unansweredWarning.classList.add("hidden");
    }

    // Chuẩn bị dữ liệu sinh viên
    const mssvVal = mssvInput.value.trim().toUpperCase();
    const hoTenVal = hoTenInput.value.trim();
    const lopVal = lopInput.value.trim().toUpperCase();
    const sdtVal = sdtInput.value.trim();
    const emailVal = emailInput.value.trim().toLowerCase();
    const kenhVal = kenhInput.value;
    const sessionCode = "2026_HK1";

    // Kiểm tra cấu hình Supabase
    const isSupabaseConfigured = client && config.SUPABASE_URL && !config.SUPABASE_URL.includes("YOUR_PROJECT_ID");

    // Bật trạng thái Loading
    submitBtn.disabled = true;
    btnText.textContent = "Đang gửi dữ liệu...";
    btnSpinner.classList.remove("hidden");

    try {
      // 7.1 Kiểm tra chống trùng lặp MSSV
      if (isSupabaseConfigured) {
        const { data: alreadySubmitted, error: checkErr } = await client.rpc("check_mssv_submitted", {
          p_mssv: mssvVal,
          p_session: sessionCode
        });

        if (!checkErr && alreadySubmitted === true) {
          alert(`Mã số sinh viên ${mssvVal} đã hoàn thành khảo sát trong học kỳ này.\nNếu bạn cần thay đổi hoặc cập nhật thông tin, vui lòng liên hệ trực tiếp giảng viên.`);
          submitBtn.disabled = false;
          btnText.textContent = "Gửi phiếu khảo sát";
          btnSpinner.classList.add("hidden");
          return;
        }
      } else {
        // Kiểm tra trong LocalStorage nếu đang chạy Demo/Local Mode
        const localList = JSON.parse(localStorage.getItem("DEMO_SUBMISSIONS") || "[]");
        const exists = localList.some(s => s.mssv.toUpperCase() === mssvVal);
        if (exists) {
          alert(`Mã số sinh viên ${mssvVal} đã hoàn thành khảo sát trước đó.`);
          submitBtn.disabled = false;
          btnText.textContent = "Gửi phiếu khảo sát";
          btnSpinner.classList.add("hidden");
          return;
        }
      }

      // 7.2 Tính điểm và đánh giá ngầm (không hiển thị ra giao diện)
      const calcResult = calculateDimensionScores();

      // Rút gọn định dạng lưu câu trả lời: { q1: 5, q2: 4, ... }
      const compactAnswers = {};
      Object.keys(studentAnswers).forEach(qid => {
        compactAnswers[qid] = studentAnswers[qid].val;
      });

      // 7.3 Chuẩn bị payload
      const payload = {
        mssv: mssvVal,
        ho_ten: hoTenVal,
        lop: lopVal,
        so_dien_thoai: sdtVal,
        email: emailVal,
        kenh_lien_he: kenhVal,
        session_code: sessionCode,
        answers: compactAnswers,
        dimension_scores: calcResult.scores,
        overall_avg: calcResult.overallAvg,
        tagged_for_review: calcResult.taggedForReview,
        created_at: new Date().toISOString()
      };

      if (config.FIREBASE_DB_URL) {
        // Gửi trực tiếp lên Firebase Realtime Database
        try {
          const fbUrl = config.FIREBASE_DB_URL.replace(/\/$/, "");
          const fbRes = await fetch(`${fbUrl}/submissions.json`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          if (!fbRes.ok) throw new Error("Lỗi lưu Firebase: " + fbRes.statusText);
        } catch (fbErr) {
          console.error("Lỗi Firebase:", fbErr);
          saveToLocalStorage(payload);
        }
      } else if (isSupabaseConfigured) {
        const { error: insertErr } = await client
          .from("submissions")
          .insert([payload]);

        if (insertErr) {
          if (insertErr.code === "23505") {
            alert(`Mã số sinh viên ${mssvVal} đã được nộp trước đó.`);
          } else {
            console.error("Lỗi Supabase:", insertErr);
            // Lưu dự phòng vào local nếu Supabase gặp sự cố mạng
            saveToLocalStorage(payload);
          }
        }
      } else {
        // Lưu vào LocalStorage khi chưa kết nối database đám mây
        saveToLocalStorage(payload);
      }

      // 7.4 Hoàn thành thành công -> Ẩn form, hiển thị màn hình cảm ơn
      form.classList.add("hidden");
      const introCard = document.getElementById("intro-card");
      if (introCard) introCard.classList.add("hidden");

      const thankYouCard = document.getElementById("thankyou-card");
      const submittedTime = document.getElementById("submitted-time");
      if (submittedTime) {
        submittedTime.textContent = new Date().toLocaleString("vi-VN");
      }
      if (thankYouCard) {
        thankYouCard.classList.remove("hidden");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

    } catch (err) {
      console.error("Lỗi bất ngờ:", err);
      alert("Đã xảy ra sự cố kết nối. Vui lòng kiểm tra mạng internet và thử lại!");
      submitBtn.disabled = false;
      btnText.textContent = "Gửi phiếu khảo sát";
      btnSpinner.classList.add("hidden");
    }
  }

  function saveToLocalStorage(payload) {
    try {
      if (!payload.id) payload.id = "sub_" + Date.now();
      const existing = JSON.parse(localStorage.getItem("DEMO_SUBMISSIONS") || "[]");
      existing.unshift(payload);
      localStorage.setItem("DEMO_SUBMISSIONS", JSON.stringify(existing));
    } catch (e) {
      console.warn("Không thể lưu localStorage:", e);
    }
  }

  // 8. Khởi chạy khi DOM sẵn sàng
  document.addEventListener("DOMContentLoaded", () => {
    initFormFields();
    renderQuestions();

    const form = document.getElementById("survey-form");
    if (form) {
      form.addEventListener("submit", handleSubmit);
    }
  });

})();
