/**
 * ADMIN.JS - QUẢN LÝ BẢNG ĐIỀU KHIỂN GIẢNG VIÊN
 */

(function () {
  "use strict";

  let supabase = null;
  const config = window.APP_CONFIG || {};

  let currentSubmissions = [];
  let filteredSubmissions = [];
  let activeStudent = null;
  let radarChartInstance = null;
  let showOnlyShortlist = false;

  // 1. Khởi tạo Supabase Client
  function getSupabaseClient() {
    if (!supabase && window.supabase && config.SUPABASE_URL && config.SUPABASE_ANON_KEY) {
      try {
        supabase = window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);
      } catch (err) {
        console.error("Lỗi khởi tạo Supabase:", err);
      }
    }
    return supabase;
  }

  // 2. Kiểm tra phiên đăng nhập hiện tại
  async function checkAuthSession() {
    const isDemoLoggedIn = sessionStorage.getItem("ADMIN_DEMO_LOGGED_IN") === "true";
    const client = getSupabaseClient();
    const isSupabaseConfigured = client && config.SUPABASE_URL && !config.SUPABASE_URL.includes("YOUR_PROJECT_ID");

    if (!isSupabaseConfigured) {
      if (isDemoLoggedIn) {
        showDashboard({ email: "giangvien@university.edu.vn" });
        loadSubmissions();
      } else {
        showAuthScreen();
      }
      return;
    }

    try {
      const { data: { session } } = await client.auth.getSession();
      if (session && session.user) {
        showDashboard(session.user);
        loadSubmissions();
      } else {
        showAuthScreen();
      }

      // Giữ phiên đăng nhập liên tục (tự động refresh token, không bao giờ bị văng trừ khi bấm Đăng xuất)
      client.auth.onAuthStateChange((event, newSession) => {
        if (event === "SIGNED_IN" && newSession?.user) {
          showDashboard(newSession.user);
          loadSubmissions();
        } else if (event === "SIGNED_OUT") {
          showAuthScreen();
        }
      });
    } catch (err) {
      console.warn("Chưa đăng nhập:", err);
      showAuthScreen();
    }
  }

  function showAuthScreen() {
    document.getElementById("auth-container").classList.remove("hidden");
    document.getElementById("dashboard-container").classList.add("hidden");
  }

  function showDashboard(user) {
    document.getElementById("auth-container").classList.add("hidden");
    document.getElementById("dashboard-container").classList.remove("hidden");
    const userDisplay = document.getElementById("user-display");
    if (userDisplay && user) {
      userDisplay.textContent = `👤 ${user.email}`;
    }
  }

  let isRegisterMode = false;

  function setAuthMode(register) {
    isRegisterMode = register;
    const tabLogin = document.getElementById("tab-login-btn");
    const tabRegister = document.getElementById("tab-register-btn");
    const btnText = document.getElementById("login-btn-text");
    const errorDiv = document.getElementById("login-error");
    if (errorDiv) errorDiv.classList.add("hidden");

    if (register) {
      tabRegister?.classList.add("bg-white", "shadow-sm", "font-bold", "text-slate-800");
      tabRegister?.classList.remove("text-slate-500");
      tabLogin?.classList.remove("bg-white", "shadow-sm", "font-bold", "text-slate-800");
      tabLogin?.classList.add("text-slate-500");
      if (btnText) btnText.textContent = "Đăng ký tài khoản Giảng viên";
    } else {
      tabLogin?.classList.add("bg-white", "shadow-sm", "font-bold", "text-slate-800");
      tabLogin?.classList.remove("text-slate-500");
      tabRegister?.classList.remove("bg-white", "shadow-sm", "font-bold", "text-slate-800");
      tabRegister?.classList.add("text-slate-500");
      if (btnText) btnText.textContent = "Đăng nhập Bảng điều khiển";
    }
  }

  // 3. Xử lý Đăng nhập / Đăng ký
  async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById("admin-email").value.trim();
    const password = document.getElementById("admin-password").value;
    const errorDiv = document.getElementById("login-error");
    const loginBtn = document.getElementById("login-btn");
    const spinner = document.getElementById("login-spinner");
    const btnText = document.getElementById("login-btn-text");

    errorDiv.classList.add("hidden");
    errorDiv.textContent = "";

    const client = getSupabaseClient();
    const isSupabaseConfigured = client && config.SUPABASE_URL && !config.SUPABASE_URL.includes("YOUR_PROJECT_ID");

    if (!isSupabaseConfigured) {
      // Chế độ Demo / Thử nghiệm tự động: cho phép đăng nhập ngay
      const demoUser = { email: email || "giangvien@university.edu.vn", role: "demo_admin" };
      sessionStorage.setItem("ADMIN_DEMO_LOGGED_IN", "true");
      showDashboard(demoUser);
      loadSubmissions();
      return;
    }

    loginBtn.disabled = true;
    spinner.classList.remove("hidden");
    btnText.textContent = isRegisterMode ? "Đang tạo tài khoản..." : "Đang xác thực...";

    try {
      if (isRegisterMode) {
        // ĐĂNG KÝ TÀI KHOẢN MỚI
        const { data, error } = await client.auth.signUp({
          email: email,
          password: password
        });

        if (error) {
          errorDiv.textContent = "Đăng ký không thành công: " + error.message;
          errorDiv.classList.remove("hidden");
        } else if (data && data.user) {
          alert("Tạo tài khoản Giảng viên thành công! Đang chuyển vào Bảng điều khiển...");
          showDashboard(data.user);
          loadSubmissions();
        }
      } else {
        // ĐĂNG NHẬP
        const { data, error } = await client.auth.signInWithPassword({
          email: email,
          password: password
        });

        if (error) {
          errorDiv.innerHTML = `
            <div><strong>Đăng nhập không thành công:</strong> ${error.message}</div>
            <div class="mt-1 pt-1 border-t border-rose-200">
              💡 <em>Lần đầu tiên sử dụng?</em> Hãy bấm vào tab <strong>"Đăng ký mới (1 lần đầu)"</strong> ở trên để tạo tài khoản trong 3 giây!
            </div>
          `;
          errorDiv.classList.remove("hidden");
        } else if (data && data.user) {
          showDashboard(data.user);
          loadSubmissions();
        }
      }
    } catch (err) {
      errorDiv.textContent = "Lỗi kết nối: " + err.message;
      errorDiv.classList.remove("hidden");
    } finally {
      loginBtn.disabled = false;
      spinner.classList.add("hidden");
      btnText.textContent = isRegisterMode ? "Đăng ký tài khoản Giảng viên" : "Đăng nhập Bảng điều khiển";
    }
  }

  // 4. Xử lý Đăng xuất
  async function handleLogout() {
    sessionStorage.removeItem("ADMIN_DEMO_LOGGED_IN");
    const client = getSupabaseClient();
    if (client) {
      await client.auth.signOut();
    }
    showAuthScreen();
  }

  // 5. Tải dữ liệu danh sách khảo sát từ Firebase, Supabase hoặc Local Demo
  async function loadSubmissions() {
    // 5.1 Ưu tiên nạp từ Firebase Realtime Database nếu có cấu hình
    if (config.FIREBASE_DB_URL) {
      try {
        const fbUrl = config.FIREBASE_DB_URL.replace(/\/$/, "");
        const res = await fetch(`${fbUrl}/submissions.json`);
        const data = await res.json();
        if (data) {
          currentSubmissions = Object.keys(data).map(k => ({
            id: k,
            ...data[k]
          })).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else {
          currentSubmissions = [];
        }
        populateClassFilterOptions();
        updateDashboardStats();
        applyFilters();
        return;
      } catch (err) {
        console.error("Lỗi nạp từ Firebase:", err);
      }
    }

    const client = getSupabaseClient();
    const isSupabaseConfigured = client && config.SUPABASE_URL && !config.SUPABASE_URL.includes("YOUR_PROJECT_ID");

    if (!isSupabaseConfigured) {
      // Nạp dữ liệu từ LocalStorage hoặc dữ liệu mẫu sinh động ban đầu
      const localList = JSON.parse(localStorage.getItem("DEMO_SUBMISSIONS") || "null");
      if (!localList || localList.length === 0) {
        currentSubmissions = getInitialDemoStudents();
        localStorage.setItem("DEMO_SUBMISSIONS", JSON.stringify(currentSubmissions));
      } else {
        currentSubmissions = localList;
      }

      populateClassFilterOptions();
      updateDashboardStats();
      applyFilters();
      return;
    }

    const tbody = document.getElementById("student-table-body");
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="10" class="py-12 text-center text-slate-400">
            <div class="inline-flex items-center space-x-2">
              <svg class="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
              <span>Đang tải danh sách sinh viên từ cơ sở dữ liệu...</span>
            </div>
          </td>
        </tr>
      `;
    }

    try {
      const { data, error } = await client
        .from("submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Lỗi lấy dữ liệu:", error);
        if (tbody) {
          tbody.innerHTML = `
            <tr>
              <td colspan="10" class="py-8 text-center text-rose-500 font-medium">
                Không thể tải dữ liệu: ${error.message}. Kiểm tra quyền truy cập RLS.
              </td>
            </tr>
          `;
        }
        return;
      }

      currentSubmissions = data || [];
      populateClassFilterOptions();
      updateDashboardStats();
      applyFilters();

    } catch (err) {
      console.error("Lỗi khi tải khảo sát:", err);
    }
  }

  // 6. Điền các lớp vào bộ lọc
  function populateClassFilterOptions() {
    const select = document.getElementById("filter-class");
    if (!select) return;

    const currentVal = select.value;
    const classSet = new Set();
    currentSubmissions.forEach(s => {
      if (s.lop) classSet.add(s.lop.trim().toUpperCase());
    });

    select.innerHTML = '<option value="ALL">-- Tất cả các lớp --</option>';
    Array.from(classSet).sort().forEach(cls => {
      const opt = document.createElement("option");
      opt.value = cls;
      opt.textContent = `Lớp ${cls}`;
      select.appendChild(opt);
    });

    if (currentVal && classSet.has(currentVal)) {
      select.value = currentVal;
    }
  }

  // 7. Cập nhật các thẻ thống kê tổng quan (Metrics)
  function updateDashboardStats() {
    const totalCount = currentSubmissions.length;
    let shortlistCount = 0;
    let sumScore = 0;
    const classSet = new Set();

    currentSubmissions.forEach(s => {
      if (s.tagged_for_review) shortlistCount++;
      const avg = Number(s.overall_avg) || 0;
      sumScore += avg;
      if (s.lop) classSet.add(s.lop.trim().toUpperCase());
    });

    const overallCohortAvg = totalCount > 0 ? (sumScore / totalCount).toFixed(2) : "0.0";

    const statTotal = document.getElementById("stat-total");
    const statShortlist = document.getElementById("stat-shortlist");
    const statAvg = document.getElementById("stat-avg");
    const statClasses = document.getElementById("stat-classes");

    if (statTotal) statTotal.textContent = totalCount;
    if (statShortlist) statShortlist.textContent = shortlistCount;
    if (statAvg) statAvg.textContent = overallCohortAvg;
    if (statClasses) statClasses.textContent = classSet.size;
  }

  // 8. Áp dụng tìm kiếm và bộ lọc
  function applyFilters() {
    const searchVal = (document.getElementById("search-input")?.value || "").toLowerCase().trim();
    const classVal = document.getElementById("filter-class")?.value || "ALL";

    filteredSubmissions = currentSubmissions.filter(s => {
      // Lọc theo lớp
      if (classVal !== "ALL" && s.lop?.trim().toUpperCase() !== classVal) {
        return false;
      }

      // Lọc chỉ sinh viên cần tìm hiểu thêm
      if (showOnlyShortlist && !s.tagged_for_review) {
        return false;
      }

      // Lọc theo từ khóa tìm kiếm
      if (searchVal) {
        const matchMssv = (s.mssv || "").toLowerCase().includes(searchVal);
        const matchName = (s.ho_ten || "").toLowerCase().includes(searchVal);
        const matchPhone = (s.so_dien_thoai || "").toLowerCase().includes(searchVal);
        if (!matchMssv && !matchName && !matchPhone) return false;
      }

      return true;
    });

    renderTable();
  }

  // 9. Hiển thị bảng danh sách sinh viên
  function renderTable() {
    const tbody = document.getElementById("student-table-body");
    if (!tbody) return;

    if (!filteredSubmissions.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="10" class="py-12 text-center text-slate-400">
            Không có sinh viên nào phù hợp với bộ lọc hiện tại.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = "";

    filteredSubmissions.forEach(s => {
      const tr = document.createElement("tr");
      tr.className = "hover:bg-slate-50/80 transition-colors border-b border-slate-100";

      const scores = s.dimension_scores || {};
      const tn = scores.trach_nhiem ?? "--";
      const cd = scores.chu_dong ?? "--";
      const tc = scores.to_chuc ?? "--";
      const gt = scores.giao_tiep ?? "--";
      const avg = Number(s.overall_avg ?? 0).toFixed(2);

      // Màu sắc badge điểm trung bình
      let avgBadgeColor = "bg-slate-100 text-slate-700";
      if (avg >= 4.2) avgBadgeColor = "bg-emerald-100 text-emerald-800 font-bold";
      else if (avg >= 3.8) avgBadgeColor = "bg-blue-100 text-blue-800 font-bold";
      else if (avg < 3.0) avgBadgeColor = "bg-rose-100 text-rose-800";

      tr.innerHTML = `
        <td class="py-3 px-4">
          <div class="font-bold text-slate-900">${escapeHtml(s.ho_ten)}</div>
          <div class="text-[11px] text-slate-400 font-mono">${escapeHtml(s.mssv)}</div>
        </td>
        <td class="py-3 px-3 font-semibold text-slate-600 text-xs">
          ${escapeHtml(s.lop)}
        </td>
        <td class="py-3 px-3 text-xs text-slate-500">
          <div>📞 ${escapeHtml(s.so_dien_thoai)}</div>
          <div class="text-[11px] text-slate-400">${escapeHtml(s.kenh_lien_he)}</div>
        </td>
        <td class="py-3 px-3 text-center">
          <span class="inline-block px-2 py-0.5 rounded text-xs font-semibold ${getScoreBadgeClass(tn)}">${tn}</span>
        </td>
        <td class="py-3 px-3 text-center">
          <span class="inline-block px-2 py-0.5 rounded text-xs font-semibold ${getScoreBadgeClass(cd)}">${cd}</span>
        </td>
        <td class="py-3 px-3 text-center">
          <span class="inline-block px-2 py-0.5 rounded text-xs font-semibold ${getScoreBadgeClass(tc)}">${tc}</span>
        </td>
        <td class="py-3 px-3 text-center">
          <span class="inline-block px-2 py-0.5 rounded text-xs font-semibold ${getScoreBadgeClass(gt)}">${gt}</span>
        </td>
        <td class="py-3 px-3 text-center">
          <span class="inline-block px-2.5 py-1 rounded-lg text-xs ${avgBadgeColor}">${avg}</span>
        </td>
        <td class="py-3 px-3 text-center">
          <button 
            type="button" 
            onclick="toggleReviewTag('${s.id}', ${!s.tagged_for_review})"
            class="px-2 py-1 rounded-lg text-xs font-medium transition-all ${
              s.tagged_for_review
                ? 'bg-amber-100 text-amber-800 border border-amber-300 font-semibold'
                : 'bg-slate-50 text-slate-400 hover:text-slate-600 border border-slate-200'
            }"
            title="Nhấn để đổi trạng thái"
          >
            ${s.tagged_for_review ? '⭐ Cần tìm hiểu' : '○ Chưa đánh dấu'}
          </button>
        </td>
        <td class="py-3 px-4 text-right">
          <button 
            type="button"
            onclick="openStudentModal('${s.id}')"
            class="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl font-semibold text-xs transition-all"
          >
            Chi tiết
          </button>
        </td>
      `;

      tbody.appendChild(tr);
    });
  }

  function getScoreBadgeClass(score) {
    const num = Number(score);
    if (isNaN(num)) return "bg-slate-100 text-slate-500";
    if (num >= 4.5) return "bg-emerald-50 text-emerald-700 font-bold";
    if (num >= 3.8) return "bg-blue-50 text-blue-700";
    if (num >= 3.0) return "bg-amber-50 text-amber-700";
    return "bg-rose-50 text-rose-700";
  }

  // 10. Mở Modal Chi tiết Sinh viên (Profile & Radar Chart)
  window.openStudentModal = function (studentId) {
    const student = currentSubmissions.find(s => s.id === studentId);
    if (!student) return;

    activeStudent = student;

    // Điền thông tin cơ bản
    document.getElementById("modal-name").textContent = student.ho_ten;
    document.getElementById("modal-sub").textContent = `MSSV: ${student.mssv} | Lớp: ${student.lop} | Ngày nộp: ${new Date(student.created_at).toLocaleDateString("vi-VN")}`;
    document.getElementById("modal-phone").textContent = student.so_dien_thoai;
    document.getElementById("modal-email").textContent = student.email;
    document.getElementById("modal-channel").textContent = student.kenh_lien_he;

    // Ghi chú của giảng viên
    const taggedCheckbox = document.getElementById("modal-tagged-checkbox");
    const notesInput = document.getElementById("modal-notes-input");
    if (taggedCheckbox) taggedCheckbox.checked = !!student.tagged_for_review;
    if (notesInput) notesInput.value = student.lecturer_notes || "";

    // Chi tiết 6 chiều
    renderModalDimensions(student);

    // Vẽ biểu đồ Radar mạng nhện
    renderRadarChart(student);

    // Chi tiết từng câu trả lời
    renderModalAnswers(student);

    // Mở modal
    document.getElementById("detail-modal").classList.remove("hidden");
  };

  window.closeStudentModal = function () {
    document.getElementById("detail-modal").classList.add("hidden");
    activeStudent = null;
  };

  // Render thanh đo từng chiều trong modal
  function renderModalDimensions(student) {
    const container = document.getElementById("modal-dimensions-list");
    if (!container) return;

    const dims = window.SURVEY_DIMENSIONS || {};
    const scores = student.dimension_scores || {};
    let html = "";

    Object.keys(dims).forEach(k => {
      const info = dims[k];
      const sc = Number(scores[k] ?? 0);
      const percent = Math.min(100, Math.round((sc / 5) * 100));

      html += `
        <div class="bg-white p-2.5 rounded-xl border border-slate-200">
          <div class="flex justify-between items-center mb-1">
            <span class="text-xs font-semibold text-slate-700">${info.name}</span>
            <span class="text-xs font-bold" style="color: ${info.color}">${sc.toFixed(2)} / 5.0</span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-1.5">
            <div class="h-1.5 rounded-full" style="width: ${percent}%; background-color: ${info.color}"></div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  // Vẽ biểu đồ Radar Chart đối chiếu cá nhân vs trung bình lớp
  function renderRadarChart(student) {
    const canvas = document.getElementById("student-radar-chart");
    if (!canvas) return;

    const dims = window.SURVEY_DIMENSIONS || {};
    const labels = Object.values(dims).map(d => d.name);
    const dimKeys = Object.keys(dims);

    // Điểm sinh viên
    const studentData = dimKeys.map(k => Number(student.dimension_scores?.[k] || 0));

    // Điểm trung bình cả lớp để đối chiếu
    const classAvgData = dimKeys.map(k => {
      let sum = 0;
      let count = 0;
      currentSubmissions.forEach(s => {
        if (s.dimension_scores?.[k] !== undefined) {
          sum += Number(s.dimension_scores[k]);
          count++;
        }
      });
      return count > 0 ? Number((sum / count).toFixed(2)) : 0;
    });

    if (radarChartInstance) {
      radarChartInstance.destroy();
    }

    radarChartInstance = new Chart(canvas, {
      type: "radar",
      data: {
        labels: labels,
        datasets: [
          {
            label: student.ho_ten,
            data: studentData,
            backgroundColor: "rgba(37, 99, 235, 0.2)",
            borderColor: "rgba(37, 99, 235, 1)",
            pointBackgroundColor: "rgba(37, 99, 235, 1)",
            borderWidth: 2,
            pointRadius: 3
          },
          {
            label: "Trung bình lớp",
            data: classAvgData,
            backgroundColor: "rgba(148, 163, 184, 0.15)",
            borderColor: "rgba(148, 163, 184, 0.8)",
            pointBackgroundColor: "rgba(148, 163, 184, 0.8)",
            borderWidth: 1.5,
            borderDash: [4, 4],
            pointRadius: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            min: 0,
            max: 5,
            ticks: { stepSize: 1, display: false },
            pointLabels: {
              font: { size: 10, weight: "bold" },
              color: "#475569"
            },
            grid: { color: "#e2e8f0" }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  // Render chi tiết từng câu trả lời trong modal
  function renderModalAnswers(student) {
    const container = document.getElementById("modal-answers-container");
    if (!container) return;

    const questions = window.SURVEY_QUESTIONS || [];
    const answers = student.answers || {};

    let html = "";
    questions.forEach((q, idx) => {
      const ansVal = answers[q.id];
      let displayAns = "-- Chưa có --";

      if (q.type === "likert") {
        const mapLikert = {
          "1": "1 - Rất không đồng ý",
          "2": "2 - Không đồng ý",
          "3": "3 - Trung lập",
          "4": "4 - Đồng ý",
          "5": "5 - Rất đồng ý"
        };
        displayAns = mapLikert[ansVal] || ansVal;
      } else if (q.type === "situational" || q.type === "forced_choice") {
        const optIdx = Number(ansVal);
        if (q.options && q.options[optIdx]) {
          const letter = String.fromCharCode(65 + optIdx);
          displayAns = `(${letter}) ${q.options[optIdx].text}`;
        }
      }

      html += `
        <div class="p-2.5 rounded-xl border border-slate-200 bg-white text-xs">
          <div class="font-medium text-slate-800">
            <span class="text-blue-600 font-bold">C${idx + 1}:</span> ${escapeHtml(q.text)}
          </div>
          <div class="mt-1 text-slate-600 pl-4 border-l-2 border-blue-400">
            ➔ <strong>Đáp án:</strong> ${escapeHtml(displayAns)}
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  // 11. Lưu Ghi chú & Đổi trạng thái Review của Giảng viên
  async function handleSaveNote() {
    if (!activeStudent) return;
    const client = getSupabaseClient();
    const isSupabaseConfigured = client && config.SUPABASE_URL && !config.SUPABASE_URL.includes("YOUR_PROJECT_ID");

    const notes = document.getElementById("modal-notes-input").value.trim();
    const tagged = document.getElementById("modal-tagged-checkbox").checked;
    const saveBtn = document.getElementById("save-note-btn");

    saveBtn.disabled = true;
    saveBtn.textContent = "Đang lưu...";

    if (config.FIREBASE_DB_URL) {
      try {
        const fbUrl = config.FIREBASE_DB_URL.replace(/\/$/, "");
        await fetch(`${fbUrl}/submissions/${activeStudent.id}.json`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lecturer_notes: notes,
            tagged_for_review: tagged
          })
        });
        activeStudent.lecturer_notes = notes;
        activeStudent.tagged_for_review = tagged;
        const found = currentSubmissions.find(s => s.id === activeStudent.id);
        if (found) {
          found.lecturer_notes = notes;
          found.tagged_for_review = tagged;
        }
        updateDashboardStats();
        applyFilters();
        alert("Đã lưu ghi chú thành công!");
      } catch (e) {
        alert("Lỗi lưu Firebase: " + e.message);
      } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = "Lưu ghi chú";
      }
      return;
    }

    if (!isSupabaseConfigured) {
      activeStudent.lecturer_notes = notes;
      activeStudent.tagged_for_review = tagged;
      const found = currentSubmissions.find(s => s.id === activeStudent.id);
      if (found) {
        found.lecturer_notes = notes;
        found.tagged_for_review = tagged;
      }
      localStorage.setItem("DEMO_SUBMISSIONS", JSON.stringify(currentSubmissions));
      updateDashboardStats();
      applyFilters();
      alert("Đã lưu ghi chú thành công!");
      saveBtn.disabled = false;
      saveBtn.textContent = "Lưu ghi chú";
      return;
    }

    try {
      const { error } = await client
        .from("submissions")
        .update({
          lecturer_notes: notes,
          tagged_for_review: tagged
        })
        .eq("id", activeStudent.id);

      if (error) {
        alert("Lỗi khi lưu: " + error.message);
      } else {
        activeStudent.lecturer_notes = notes;
        activeStudent.tagged_for_review = tagged;
        
        // Cập nhật lại danh sách bộ nhớ cục bộ
        const found = currentSubmissions.find(s => s.id === activeStudent.id);
        if (found) {
          found.lecturer_notes = notes;
          found.tagged_for_review = tagged;
        }

        updateDashboardStats();
        applyFilters();
        alert("Đã lưu ghi chú thành công!");
      }
    } catch (err) {
      alert("Lỗi kết nối: " + err.message);
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = "Lưu ghi chú";
    }
  }

  // 12. Chuyển đổi nhanh trạng thái "Cần tìm hiểu thêm" từ bảng
  window.toggleReviewTag = async function (studentId, newStatus) {
    if (config.FIREBASE_DB_URL) {
      try {
        const fbUrl = config.FIREBASE_DB_URL.replace(/\/$/, "");
        await fetch(`${fbUrl}/submissions/${studentId}.json`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tagged_for_review: newStatus })
        });
        const found = currentSubmissions.find(s => s.id === studentId);
        if (found) found.tagged_for_review = newStatus;
        updateDashboardStats();
        applyFilters();
      } catch (e) {
        console.error("Lỗi cập nhật Firebase:", e);
      }
      return;
    }

    const client = getSupabaseClient();
    const isSupabaseConfigured = client && config.SUPABASE_URL && !config.SUPABASE_URL.includes("YOUR_PROJECT_ID");

    if (!isSupabaseConfigured) {
      const found = currentSubmissions.find(s => s.id === studentId);
      if (found) {
        found.tagged_for_review = newStatus;
        localStorage.setItem("DEMO_SUBMISSIONS", JSON.stringify(currentSubmissions));
        updateDashboardStats();
        applyFilters();
      }
      return;
    }

    try {
      const { error } = await client
        .from("submissions")
        .update({ tagged_for_review: newStatus })
        .eq("id", studentId);

      if (!error) {
        const found = currentSubmissions.find(s => s.id === studentId);
        if (found) found.tagged_for_review = newStatus;
        updateDashboardStats();
        applyFilters();
      } else {
        alert("Lỗi cập nhật: " + error.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 13. Xuất file CSV (Đầy đủ tiếng Việt UTF-8 BOM)
  function handleExportCSV() {
    if (!currentSubmissions.length) {
      alert("Không có dữ liệu để xuất file!");
      return;
    }

    const headers = [
      "MSSV",
      "Họ và tên",
      "Lớp",
      "Số điện thoại",
      "Email",
      "Kênh liên hệ ưu tiên",
      "Trách nhiệm (1-5)",
      "Chủ động (1-5)",
      "Tổ chức (1-5)",
      "Giao tiếp (1-5)",
      "Giải quyết vấn đề (1-5)",
      "Bình tĩnh thích ứng (1-5)",
      "Điểm TB",
      "Cần tìm hiểu thêm",
      "Ghi chú giảng viên",
      "Thời gian nộp"
    ];

    const rows = currentSubmissions.map(s => {
      const sc = s.dimension_scores || {};
      return [
        `"${escapeCSV(s.mssv)}"`,
        `"${escapeCSV(s.ho_ten)}"`,
        `"${escapeCSV(s.lop)}"`,
        `"${escapeCSV(s.so_dien_thoai)}"`,
        `"${escapeCSV(s.email)}"`,
        `"${escapeCSV(s.kenh_lien_he)}"`,
        sc.trach_nhiem ?? "",
        sc.chu_dong ?? "",
        sc.to_chuc ?? "",
        sc.giao_tiep ?? "",
        sc.giai_quyet_van_de ?? "",
        sc.binh_tinh ?? "",
        s.overall_avg ?? "",
        s.tagged_for_review ? "CÓ" : "KHÔNG",
        `"${escapeCSV(s.lecturer_notes || "")}"`,
        `"${new Date(s.created_at).toLocaleString("vi-VN")}"`
      ].join(",");
    });

    // Thêm ký tự UTF-8 BOM (\uFEFF) để Excel hiển thị đúng dấu tiếng Việt
    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `khao_sat_lop_hoc_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // 14. Quản lý Modal Cấu hình nhanh
  window.toggleConfigModal = function (show) {
    const modal = document.getElementById("config-modal");
    if (!modal) return;
    if (show) {
      const fbInput = document.getElementById("config-firebase-input");
      if (fbInput) fbInput.value = localStorage.getItem("APP_FIREBASE_URL") || config.FIREBASE_DB_URL || "";

      document.getElementById("config-url-input").value = localStorage.getItem("APP_SUPABASE_URL") || config.SUPABASE_URL || "";
      document.getElementById("config-key-input").value = localStorage.getItem("APP_SUPABASE_ANON_KEY") || config.SUPABASE_ANON_KEY || "";
      modal.classList.remove("hidden");
    } else {
      modal.classList.add("hidden");
    }
  };

  function handleSaveConfig() {
    const fbUrl = document.getElementById("config-firebase-input")?.value.trim();
    const url = document.getElementById("config-url-input")?.value.trim();
    const key = document.getElementById("config-key-input")?.value.trim();

    if (fbUrl) {
      localStorage.setItem("APP_FIREBASE_URL", fbUrl);
      window.APP_CONFIG.FIREBASE_DB_URL = fbUrl;
    }

    if (url && key) {
      localStorage.setItem("APP_SUPABASE_URL", url);
      localStorage.setItem("APP_SUPABASE_ANON_KEY", key);
      window.APP_CONFIG.SUPABASE_URL = url;
      window.APP_CONFIG.SUPABASE_ANON_KEY = key;
      supabase = null; // Reset client
    }

    alert("Đã lưu cấu hình cơ sở dữ liệu! Hệ thống sẽ tải lại dữ liệu mới.");
    toggleConfigModal(false);
    loadSubmissions();
  }

  // Helpers
  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeCSV(str) {
    if (!str) return "";
    return String(str).replace(/"/g, '""');
  }

  // 15. Khởi tạo sự kiện khi DOM nạp xong
  document.addEventListener("DOMContentLoaded", () => {
    // Auth listeners
    document.getElementById("tab-login-btn")?.addEventListener("click", () => setAuthMode(false));
    document.getElementById("tab-register-btn")?.addEventListener("click", () => setAuthMode(true));
    document.getElementById("login-form")?.addEventListener("submit", handleLogin);
    document.getElementById("logout-btn")?.addEventListener("click", handleLogout);
    document.getElementById("refresh-btn")?.addEventListener("click", loadSubmissions);
    document.getElementById("export-csv-btn")?.addEventListener("click", handleExportCSV);
    document.getElementById("save-config-btn")?.addEventListener("click", handleSaveConfig);
    document.getElementById("save-note-btn")?.addEventListener("click", handleSaveNote);

    // Search and filter listeners
    document.getElementById("search-input")?.addEventListener("input", applyFilters);
    document.getElementById("filter-class")?.addEventListener("change", applyFilters);

    // Toggle shortlist filter
    const toggleShortlistBtn = document.getElementById("toggle-shortlist-btn");
    toggleShortlistBtn?.addEventListener("click", () => {
      showOnlyShortlist = !showOnlyShortlist;
      if (showOnlyShortlist) {
        toggleShortlistBtn.classList.remove("bg-slate-50", "text-slate-600");
        toggleShortlistBtn.classList.add("bg-amber-100", "text-amber-800", "border-amber-300");
      } else {
        toggleShortlistBtn.classList.remove("bg-amber-100", "text-amber-800", "border-amber-300");
        toggleShortlistBtn.classList.add("bg-slate-50", "text-slate-600");
      }
      applyFilters();
    });

    // Bắt đầu kiểm tra session
    checkAuthSession();
  });

  function getInitialDemoStudents() {
    return [
      {
        id: "demo_1",
        mssv: "26000001",
        ho_ten: "Nguyễn Hoàng Minh",
        lop: "D21_TH01",
        so_dien_thoai: "0912345678",
        email: "minh.nh@student.edu.vn",
        kenh_lien_he: "Zalo (Ưu tiên)",
        session_code: "2026_HK1",
        answers: { q1: 5, q2: 1, q3: 0, q4: 0, q5: 4, q6: 2, q7: 0, q8: 0, q9: 5, q10: 1, q11: 0, q12: 0, q13: 4, q14: 2, q15: 0, q16: 0, q17: 4, q18: 2, q19: 0, q20: 0, q21: 4, q22: 2, q23: 0, q24: 0 },
        dimension_scores: { trach_nhiem: 4.8, chu_dong: 4.2, to_chuc: 4.6, giao_tiep: 4.3, giai_quyet_van_de: 4.2, binh_tinh: 4.4 },
        overall_avg: 4.42,
        tagged_for_review: true,
        lecturer_notes: "Sinh viên rất có trách nhiệm, phong cách làm việc ngăn nắp, tiềm năng phối hợp tốt.",
        created_at: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: "demo_2",
        mssv: "2112045",
        ho_ten: "Trần Thị Mai Anh",
        lop: "D21_TH01",
        so_dien_thoai: "0987654321",
        email: "anh.ttm@student.edu.vn",
        kenh_lien_he: "Zalo (Ưu tiên)",
        session_code: "2026_HK1",
        answers: { q1: 4, q2: 2, q3: 0, q4: 0, q5: 5, q6: 1, q7: 0, q8: 0, q9: 4, q10: 2, q11: 0, q12: 0, q13: 5, q14: 1, q15: 0, q16: 0, q17: 4, q18: 2, q19: 0, q20: 0, q21: 4, q22: 2, q23: 0, q24: 0 },
        dimension_scores: { trach_nhiem: 4.3, chu_dong: 4.7, to_chuc: 4.0, giao_tiep: 4.8, giai_quyet_van_de: 4.1, binh_tinh: 4.2 },
        overall_avg: 4.35,
        tagged_for_review: true,
        lecturer_notes: "Giao tiếp nổi trội, năng động, kết nối bạn bè rất nhanh trong các buổi thảo luận.",
        created_at: new Date(Date.now() - 3600000 * 5).toISOString()
      },
      {
        id: "demo_3",
        mssv: "2212089",
        ho_ten: "Lê Quốc Bảo",
        lop: "D22_CNTT01",
        so_dien_thoai: "0909123888",
        email: "bao.lq@student.edu.vn",
        kenh_lien_he: "Email trường / Email cá nhân",
        session_code: "2026_HK1",
        answers: { q1: 4, q2: 3, q3: 1, q4: 0, q5: 3, q6: 3, q7: 1, q8: 1, q9: 3, q10: 3, q11: 1, q12: 1, q13: 3, q14: 3, q15: 1, q16: 1, q17: 4, q18: 3, q19: 1, q20: 0, q21: 3, q22: 3, q23: 1, q24: 1 },
        dimension_scores: { trach_nhiem: 3.5, chu_dong: 3.2, to_chuc: 3.3, giao_tiep: 3.4, giai_quyet_van_de: 3.8, binh_tinh: 3.3 },
        overall_avg: 3.42,
        tagged_for_review: false,
        lecturer_notes: "",
        created_at: new Date(Date.now() - 3600000 * 24).toISOString()
      },
      {
        id: "demo_4",
        mssv: "2212112",
        ho_ten: "Phạm Vũ Linh",
        lop: "D22_CNTT02",
        so_dien_thoai: "0933456789",
        email: "linh.pv@student.edu.vn",
        kenh_lien_he: "Zalo (Ưu tiên)",
        session_code: "2026_HK1",
        answers: { q1: 5, q2: 2, q3: 0, q4: 0, q5: 4, q6: 2, q7: 0, q8: 0, q9: 4, q10: 2, q11: 0, q12: 0, q13: 4, q14: 2, q15: 0, q16: 0, q17: 5, q18: 1, q19: 0, q20: 0, q21: 4, q22: 2, q23: 0, q24: 0 },
        dimension_scores: { trach_nhiem: 4.4, chu_dong: 4.1, to_chuc: 4.2, giao_tiep: 4.0, giai_quyet_van_de: 4.8, binh_tinh: 4.3 },
        overall_avg: 4.30,
        tagged_for_review: true,
        lecturer_notes: "Tư duy giải quyết vấn đề và thích nghi rất tốt, điềm tĩnh.",
        created_at: new Date(Date.now() - 3600000 * 30).toISOString()
      }
    ];
  }

})();
