import sys
import io
import csv
from collections import defaultdict

# Force UTF-8 output
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

filepath = r'd:\LTT\Danh gia\2026\DANH GIA QUY 3 MOI\student-survey-app\data\khao_sat_lop_hoc_2026-09-25.csv'

with open(filepath, 'r', encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    students = list(reader)

print(f"Tổng số sinh viên đã làm khảo sát: {len(students)}")

dim_keys = [
    'Trách nhiệm (1-5)',
    'Chủ động (1-5)',
    'Tổ chức (1-5)',
    'Giao tiếp (1-5)',
    'Giải quyết vấn đề (1-5)',
    'Bình tĩnh thích ứng (1-5)'
]

dim_short = {
    'Trách nhiệm (1-5)': 'TN',
    'Chủ động (1-5)': 'CD',
    'Tổ chức (1-5)': 'TC',
    'Giao tiếp (1-5)': 'GT',
    'Giải quyết vấn đề (1-5)': 'GQVD',
    'Bình tĩnh thích ứng (1-5)': 'BT'
}

# Convert scores to float
parsed = []
cohort_sums = defaultdict(float)

for s in students:
    p = {
        'mssv': s['MSSV'].strip(),
        'ho_ten': s['Họ và tên'].strip(),
        'lop': s['Lớp'].strip(),
        'sdt': s['Số điện thoại'].strip(),
        'email': s['Email'].strip(),
        'kenh': s['Kênh liên hệ ưu tiên'].strip(),
        'avg': float(s['Điểm TB']),
        'tagged': s['Cần tìm hiểu thêm'].strip().upper() == 'CÓ',
        'scores': {}
    }
    for k in dim_keys:
        val = float(s[k])
        p['scores'][dim_short[k]] = val
        cohort_sums[dim_short[k]] += val
    parsed.append(p)

n = len(parsed)
cohort_avg = {k: round(cohort_sums[k] / n, 2) for k in cohort_sums}
overall_cohort_avg = round(sum(p['avg'] for p in parsed) / n, 2)

print("\n--- ĐIỂM TRUNG BÌNH TOÀN LỚP (COHORT BENCHMARK) ---")
print(f"Điểm TB chung: {overall_cohort_avg} / 5.0")
for k, v in cohort_avg.items():
    print(f"  - {k}: {v}")

print("\n--- DANH SÁCH TẤT CẢ SINH VIÊN (SẮP XẾP THEO ĐIỂM TB GIẢM DẦN) ---")
sorted_by_avg = sorted(parsed, key=lambda x: x['avg'], reverse=True)
for i, s in enumerate(sorted_by_avg, 1):
    sc = s['scores']
    tag_str = "[CẦN TÌM HIỂU THÊM]" if s['tagged'] else ""
    print(f"{i:2d}. {s['mssv']} | {s['ho_ten']:25s} | TB: {s['avg']:.2f} | TN:{sc['TN']} CD:{sc['CD']} TC:{sc['TC']} GT:{sc['GT']} GQ:{sc['GQVD']} BT:{sc['BT']} {tag_str}")

# Filter candidates:
# Let's inspect leadership profiles:
# 1. Trưởng nhóm / Lớp trưởng: Cân bằng cao, đặc biệt Trách nhiệm, Tổ chức, Thích ứng
# 2. Phó học tập: Giải quyết vấn đề + Trách nhiệm + Chủ động
# 3. Phó phong trào / Bí thư: Chủ động + Giao tiếp
# 4. Tổ chức / Điều phối: Tổ chức + Trách nhiệm
# 5. Kỹ thuật / Thực hành: Giải quyết vấn đề + Bình tĩnh

# Filter strictly real students of class 26C1-CĐT1 (MSSV starts with 2600)
real_students = [p for p in parsed if p['mssv'].startswith('2600')]
print(f"\nSố lượng sinh viên thực tế lớp 26C1-CĐT1: {len(real_students)}")

# Recalculate cohort benchmark on real students
real_cohort_sums = defaultdict(float)
for s in real_students:
    for k in dim_keys:
        real_cohort_sums[dim_short[k]] += s['scores'][dim_short[k]]

real_n = len(real_students)
real_cohort_avg = {k: round(real_cohort_sums[k] / real_n, 2) for k in real_cohort_sums}
real_overall_avg = round(sum(p['avg'] for p in real_students) / real_n, 2)

print("\n=== ĐIỂM CHUẨN TRUNG BÌNH TOÀN LỚP (COHORT BENCHMARK) ===")
print(f"Điểm TB chung toàn lớp: {real_overall_avg} / 5.0")
for k, v in real_cohort_avg.items():
    print(f"  - {k} ({dim_keys[list(dim_short.values()).index(k)]}): {v}")

print("\n=== BẢNG XẾP HẠNG TOP SINH VIÊN (THEO ĐIỂM TB TOÀN DIỆN) ===")
real_sorted = sorted(real_students, key=lambda x: x['avg'], reverse=True)
for i, s in enumerate(real_sorted, 1):
    sc = s['scores']
    tag = "[CẦN TÌM HIỂU THÊM]" if s['tagged'] else ""
    print(f"{i:2d}. MSSV: {s['mssv']} | {s['ho_ten']:25s} | TB: {s['avg']:.2f} | Lớp: {s['lop']} | SĐT: {s['sdt']} | Kênh: {s['kenh']} {tag}")
    print(f"    Chi tiết: TN={sc['TN']} | CD={sc['CD']} | TC={sc['TC']} | GT={sc['GT']} | GQVD={sc['GQVD']} | BT={sc['BT']}")

print("\n" + "="*80)
print("=== PHÂN TÍCH CHUYÊN SÂU 5 ỨNG VIÊN XUẤT SẮC NHẤT ===")
print("="*80)

top5 = real_sorted[:5]
roles = [
    {
        "role": "Lớp trưởng (Class President / Trưởng nhóm điều phối chung)",
        "fit_reason": "Điểm trung bình cao nhất lớp (4.79), đạt điểm 5.0 tuyệt đối ở 4/6 tiêu chí cốt lõi (Trách nhiệm, Tổ chức, Giao tiếp, Bình tĩnh thích ứng) và 4.75 ở Giải quyết vấn đề. Đây là hồ sơ lãnh đạo toàn diện mẫu mực, có uy tín tự nhiên, khả năng tổ chức công việc bài bản, bình tĩnh trước áp lực và giao tiếp xuất sắc."
    },
    {
        "role": "Lớp phó Phong trào / Hoạt động / Bí thư (Vice-President of Activities)",
        "fit_reason": "Điểm Chủ động (CD) và Trách nhiệm (TN) đạt tuyệt đối 5.0/5.0, Bình tĩnh (BT) 5.0/5.0. Năng lượng hành động cực kỳ cao, tiên phong trong mọi phong trào, dám nghĩ dám làm và có tinh thần phụng sự tập thể vững vàng."
    },
    {
        "role": "Lớp phó Học tập & Hỗ trợ Chuyên môn (Academic Coordinator)",
        "fit_reason": "Điểm Tổ chức (TC) đạt 5.0 tuyệt đối; Giải quyết vấn đề (GQVD) 4.5, Giao tiếp (GT) 4.5, Trách nhiệm (TN) 4.75. Phong cách làm việc logic, có phương pháp, kiên nhẫn và có năng lực hướng dẫn, phân tích tài liệu học tập cho các bạn."
    },
    {
        "role": "Ủy viên phụ trách Đời sống & Kết nối Lớp (Student Welfare & Discipline)",
        "fit_reason": "Hồ sơ điểm cực kỳ đồng đều và vững chắc (tất cả các tiêu chí đều đạt từ 4.25 đến 4.75, không có điểm trũng). Trách nhiệm cao (4.75), Kỹ năng giải quyết vấn đề (4.5), Tổ chức (4.5). Đóng vai trò là cầu nối hòa giải, gắn kết sinh viên và duy trì sự ổn định của tập thể."
    },
    {
        "role": "Trưởng ban Kỹ thuật - Thực hành Xưởng / Trợ lý Lớp (Technical & Workshop Lead)",
        "fit_reason": "Thế mạnh vượt trội về Tổ chức (4.5), Giải quyết vấn đề kỹ thuật (4.5), Giao tiếp (4.5) và Bình tĩnh xử lý tình huống phát sinh (4.5). Rất thích hợp để chỉ huy các buổi thực hành tay nghề, an toàn lao động và phân chia công cụ/trang thiết bị xưởng cơ điện tử."
    }
]

for idx, (s, r) in enumerate(zip(top5, roles), 1):
    sc = s['scores']
    print(f"\nỨNG VIÊN {idx}: {s['ho_ten']} (MSSV: {s['mssv']})")
    print(f"  - Lớp: {s['lop']} | SĐT: {s['sdt']} | Email: {s['email']}")
    print(f"  - Kênh liên hệ ưu tiên: {s['kenh']}")
    print(f"  - Điểm TB chung: {s['avg']:.2f} / 5.0 (Vượt chuẩn lớp +{s['avg'] - real_overall_avg:.2f})")
    print(f"  - Điểm 6 chiều: TN={sc['TN']} | CD={sc['CD']} | TC={sc['TC']} | GT={sc['GT']} | GQVD={sc['GQVD']} | BT={sc['BT']}")
    print(f"  - Đề xuất vị trí: {r['role']}")
    print(f"  - Lý do đề xuất: {r['fit_reason']}")

print("\n" + "="*80)
print("=== CÁC ỨNG VIÊN DỰ PHÒNG TIỀM NĂNG (BACKUP CANDIDATES) ===")
print("="*80)
for s in real_sorted[5:8]:
    sc = s['scores']
    print(f"- {s['ho_ten']} (MSSV: {s['mssv']}) - Điểm TB: {s['avg']:.2f} | GT: {sc['GT']} | TC: {sc['TC']} | GQVD: {sc['GQVD']} (Rất mạnh về kết nối và hỗ trợ)")

