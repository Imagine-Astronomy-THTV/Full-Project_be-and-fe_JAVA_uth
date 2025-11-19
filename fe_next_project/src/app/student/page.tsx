"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { apiCall } from "@/lib/api";

const DISTRICTS_HCM = [
    "Quận 1",
    "Quận 2",
    "Quận 3",
    "Quận 4",
    "Quận 5",
    "Quận 6",
    "Quận 7",
    "Quận 8",
    "Quận 9",
    "Quận 10",
    "Quận 11",
    "Quận 12",
    "Thủ Đức",
    "Bình Thạnh",
    "Bình Tân",
    "Tân Bình",
];

const GRADE_LEVELS = ["Lớp 10", "Lớp 11", "Lớp 12"];

type Student = {
    fullName: string;
    dob: string;
    gender: "nam" | "nữ" | "khác" | "";
    district: string;
    email: string;
    phone: string;
    gradeLevel: string;
};

const EMPTY_STUDENT: Student = {
    fullName: "",
    dob: "",
    gender: "",
    district: "",
    email: "",
    phone: "",
    gradeLevel: "",
};

function cls(...s: (string | false | null | undefined)[]) {
    return s.filter(Boolean).join(" ");
}

function buildMonth(year: number, monthIndex: number) {
    const start = new Date(year, monthIndex, 1);
    const end = new Date(year, monthIndex + 1, 0);
    const startDay = start.getDay(); // 0 = CN
    const cells: { day: number | null }[] = [];

    const leading = (startDay + 6) % 7; // chỉnh về CN–T2–…–T7
    for (let i = 0; i < leading; i++) cells.push({ day: null });
    for (let d = 1; d <= end.getDate(); d++) cells.push({ day: d });
    while (cells.length % 7 !== 0) cells.push({ day: null });
    return cells;
}

export default function StudentDashboard() {
    const [student, setStudent] = useState<Student>(EMPTY_STUDENT);
    const [photo, setPhoto] = useState<string | null>(null);
    const [photoName, setPhotoName] = useState<string>("");
    const [editMode, setEditMode] = useState(true);
    const [progress, setProgress] = useState(0);
    const [reminders] = useState<number>(0);

    const [classes] = useState<{ name: string }[]>([
        { name: "Đại số 10: Hàm số bậc nhất" },
        { name: "Hình học 10: Vector & Tọa độ" },
        { name: "Ôn luyện: Bất đẳng thức" },
    ]);

    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());
    const [selectedDay, setSelectedDay] = useState<number | null>(
        today.getDate()
    );
    const cells = useMemo(() => buildMonth(year, month), [year, month]);

    const handleChange = <K extends keyof Student>(k: K, v: Student[K]) =>
        setStudent((s) => ({ ...s, [k]: v }));

    const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setPhotoName(f.name);
        const r = new FileReader();
        r.onloadend = () => setPhoto(r.result as string);
        r.readAsDataURL(f);
    };

    const normalizeDate = (value: string) => {
        if (!value) return null;
        return value; // yyyy-MM-dd gửi luôn cho BE
    };

    const save = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!student.fullName.trim()) {
            alert("Vui lòng nhập họ tên!");
            return;
        }
        if (!student.gradeLevel) {
            alert("Vui lòng chọn lớp học!");
            return;
        }

        const payload = {
            fullName: student.fullName,
            dob: normalizeDate(student.dob),
            gender: student.gender || null,
            district: student.district || null,
            email: student.email || null,
            phone: student.phone || null,
            gradeLevel: student.gradeLevel,
            note: null,
        };

        try {
            const result = await apiCall("/api/students", {
                method: "POST",
                body: JSON.stringify(payload),
            });
            console.log("Student saved successfully:", result);
            setEditMode(false);
            alert("Đã lưu thông tin học sinh vào CSDL.");
        } catch (err: any) {
            console.error("Save student failed:", err);
            const errorMessage = err?.message || "Lưu thất bại. Vui lòng thử lại.";
            alert(errorMessage);
        }
    };

    // vòng tròn tiến độ
    const R = 52;
    const C = 2 * Math.PI * R;
    const dash = (Math.max(0, Math.min(100, progress)) / 100) * C;

    const monthsVi = [
        "tháng 1",
        "tháng 2",
        "tháng 3",
        "tháng 4",
        "tháng 5",
        "tháng 6",
        "tháng 7",
        "tháng 8",
        "tháng 9",
        "tháng 10",
        "tháng 11",
        "tháng 12",
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-900 via-[#5e1f12] to-[#3b0c12] text-orange-50">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-black/40 backdrop-blur">
                <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
            <span className="font-extrabold text-xl text-orange-400">
              MathBridge
            </span>
                        <span className="text-sm text-orange-300/80 hidden sm:inline">
              | Cổng học sinh trực tuyến
            </span>
                    </div>
                    <Link
                        href="/login"
                        className="text-sm font-semibold text-orange-300 hover:underline"
                    >
                        Đăng xuất
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
                {/* Thông tin học sinh + Lịch theo tháng */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Thông tin học sinh */}
                    <section className="lg:col-span-2 bg-black/40 rounded-2xl shadow p-5">
                        <div className="flex items-start gap-5">
                            {/* Ảnh thẻ */}
                            <div className="shrink-0 w-40">
                                <div className="w-28 h-32 rounded-lg overflow-hidden border-4 border-orange-500 bg-black/30 grid place-items-center">
                                    {photo ? (
                                        <Image
                                            src={photo}
                                            alt="Ảnh học sinh"
                                            width={112}
                                            height={128}
                                            className="w-full h-full object-cover"
                                            unoptimized
                                        />
                                    ) : (
                                        <span className="text-orange-300/70 text-sm">Student</span>
                                    )}
                                </div>

                                {editMode && (
                                    <div className="mt-3">
                                        <label
                                            htmlFor="photo"
                                            className="block text-xs font-semibold text-orange-200 mb-1"
                                        >
                                            Chọn ảnh thẻ tại đây
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <label
                                                htmlFor="photo"
                                                className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-orange-600 text-white text-xs hover:bg-orange-700"
                                            >
                                                📷 Tải ảnh lên
                                            </label>
                                            <input
                                                id="photo"
                                                type="file"
                                                accept="image/*"
                                                onChange={handlePhoto}
                                                className="hidden"
                                            />
                                        </div>
                                        <div className="mt-1 text-[11px] text-orange-200/80 truncate max-w-[10rem]">
                                            {photoName || "Chưa có tệp nào được chọn"}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Form thông tin */}
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-extrabold text-orange-400">
                                        Thông tin học sinh
                                    </h2>
                                    <button
                                        onClick={() => setEditMode((v) => !v)}
                                        className="text-sm px-3 py-1.5 rounded-lg border border-orange-500 text-orange-300 hover:bg-white/5"
                                    >
                                        {editMode ? "Xong" : "Chỉnh sửa"}
                                    </button>
                                </div>

                                <form
                                    onSubmit={save}
                                    className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mt-4 text-sm"
                                >
                                    <TextField
                                        label="Họ tên"
                                        edit={editMode}
                                        value={student.fullName}
                                        onChange={(v: string) => handleChange("fullName", v)}
                                        placeholder="Nhập họ tên"
                                    />

                                    <SelectField
                                        label="Giới tính"
                                        edit={editMode}
                                        value={student.gender}
                                        onChange={(v: string) =>
                                            handleChange("gender", v as Student["gender"])
                                        }
                                        options={[
                                            { value: "", label: "-- Chọn giới tính --" },
                                            { value: "nam", label: "Nam" },
                                            { value: "nữ", label: "Nữ" },
                                            { value: "khác", label: "Khác" },
                                        ]}
                                    />

                                    <DateField
                                        label="Ngày sinh"
                                        edit={editMode}
                                        value={student.dob}
                                        onChange={(v: string) => handleChange("dob", v)}
                                    />

                                    <SelectField
                                        label="Quận (TP.HCM)"
                                        edit={editMode}
                                        value={student.district}
                                        onChange={(v: string) => handleChange("district", v)}
                                        options={[
                                            { value: "", label: "-- Chọn quận --" },
                                            ...DISTRICTS_HCM.map((d) => ({ value: d, label: d })),
                                        ]}
                                    />

                                    <SelectField
                                        label="Lớp (10–12)"
                                        edit={editMode}
                                        value={student.gradeLevel}
                                        onChange={(v: string) => handleChange("gradeLevel", v)}
                                        options={[
                                            { value: "", label: "-- Chọn lớp --" },
                                            ...GRADE_LEVELS.map((g) => ({ value: g, label: g })),
                                        ]}
                                    />

                                    <TextField
                                        label="Email"
                                        edit={editMode}
                                        value={student.email}
                                        onChange={(v: string) => handleChange("email", v)}
                                        placeholder="Nhập email"
                                    />

                                    <TextField
                                        label="Số điện thoại"
                                        edit={editMode}
                                        value={student.phone}
                                        onChange={(v: string) => handleChange("phone", v)}
                                        placeholder="Nhập số điện thoại"
                                    />

                                    {editMode && (
                                        <div className="col-span-full">
                                            <button
                                                type="submit"
                                                className="mt-2 px-4 py-2 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600"
                                            >
                                                Lưu thông tin
                                            </button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </section>

                    {/* Lịch tháng */}
                    <section className="bg-black/40 rounded-2xl shadow p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-orange-400">Lịch theo tháng</h3>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        const m = month - 1;
                                        if (m < 0) {
                                            setMonth(11);
                                            setYear(year - 1);
                                        } else setMonth(m);
                                    }}
                                    className="px-2 py-1 rounded border border-orange-700 hover:bg-white/5"
                                >
                                    ‹
                                </button>
                                <span className="text-sm">
{monthsVi[month]} {year}
                </span>
                                <button
                                    onClick={() => {
                                        const m = month + 1;
                                        if (m > 11) {
                                            setMonth(0);
                                            setYear(year + 1);
                                        } else setMonth(m);
                                    }}
                                    className="px-2 py-1 rounded border border-orange-700 hover:bg-white/5"
                                >
                                    ›
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 text-center text-xs font-semibold text-orange-300 mb-2">
                            {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((d) => (
                                <div key={d} className="py-1">
                                    {d}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-sm">
                            {cells.map((cell, i) => {
                                const isSel = !!cell.day && selectedDay === cell.day;
                                return (
                                    <button
                                        key={i}
                                        disabled={!cell.day}
                                        onClick={() => cell.day && setSelectedDay(cell.day)}
                                        className={cls(
                                            "h-9 rounded-md border border-orange-900/60",
                                            cell.day ? "hover:border-orange-500" : "border-transparent",
                                            isSel
                                                ? "bg-orange-600 text-white"
                                                : "bg-black/30 text-orange-100"
                                        )}
                                    >
                                        {cell.day || ""}
                                    </button>
                                );
                            })}
                        </div>
                    </section>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <TileStat title="Nhắc nhở" value={reminders} />

                    <TileLink
                        label="Vào lớp học online sắp tới"
                        sub="Zoom / Google Meet"
                        icon="📡"
                        href="/demozoom"
                    />

                    <TileLink
                        label="Đặt lịch học"
                        sub="Tự tạo buổi học"
                        icon="📅"
                        href="/schedule"
                    />

                    <TileLink
                        label="Thống kê học tập"
                        sub="Điểm & tiến độ Toán"
                        icon="📊"
                        href="/stats"
                    />

                    <TileLink
                        label="Đánh giá buổi học"
                        sub="Feedback giáo viên"
                        icon="📝"
                        href="/feedback"
                    />
                </div>


                {/* Tiến độ & Feedback gần đây */}
                <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tiến độ học tập */}
                    <div className="bg-black/40 rounded-2xl p-5 shadow flex items-center gap-5">
                        <div className="relative w-32 h-32">
                            <svg
                                viewBox="0 0 120 120"
                                className="w-full h-full rotate-[-90deg]"
                            >
                                <circle
                                    cx="60"
                                    cy="60"
                                    r={R}
                                    className="stroke-orange-900/70"
                                    strokeWidth="10"
                                    fill="none"
                                />
                                <circle
                                    cx="60"
                                    cy="60"
                                    r={R}
                                    className="stroke-orange-400"
                                    strokeWidth="10"
                                    fill="none"
                                    strokeDasharray={C}
                                    strokeDashoffset={C - dash}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-extrabold text-orange-100">
                  {Math.round(progress)}%
                </span>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-orange-300 text-lg">
                                Tiến độ học tập
                            </h3>
                            <p className="text-sm text-orange-200/80 mt-1">
                                Hoàn thành {Math.round(progress)}% mục tiêu tuần này.
                            </p>
                            {editMode && (
                                <button
                                    type="button"
                                    className="mt-3 px-3 py-1.5 rounded-lg bg-orange-500 text-xs font-semibold hover:bg-orange-600"
                                    onClick={() =>
                                        setProgress((p) => Math.min(100, Math.round(p + 20)))
                                    }
                                >
                                    Tăng thử tiến độ
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Feedback gần đây */}
                    <div className="bg-black/40 rounded-2xl p-5 shadow">
                        <h3 className="font-bold text-orange-300 text-lg mb-2">
                            Feedback gần đây
                        </h3>
                        <p className="text-sm text-orange-200/80">
                            Hiện chưa có feedback nào. Khi giáo viên gửi nhận xét, nội dung sẽ
                            xuất hiện tại đây để học sinh và phụ huynh tiện theo dõi.
                        </p>

                        {classes.length > 0 && (
                            <ul className="mt-3 text-xs text-orange-200/90 space-y-1">
                                <li className="font-semibold text-orange-300">
                                    Lớp hiện tại:
                                </li>
                                {classes.map((c, idx) => (
                                    <li key={idx}>• {c.name}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}

/* ---------- Input components ---------- */
function TextField({ label, value, onChange, placeholder, edit }: any) {
    return (
        <div>
            <span className="block text-orange-300/80 mb-1">{label}</span>
            {edit ? (
                <input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-transparent border border-orange-700 rounded-md px-3 py-2 placeholder:text-orange-200/50 focus:outline-none focus:border-orange-400"
                />
            ) : (
                <span className="font-medium">
          {value || <em className="text-orange-300/60">—</em>}
        </span>
            )}
        </div>
    );
}
function SelectField<T extends string>({
                                           label,
                                           value,
                                           onChange,
                                           options,
                                           edit,
                                       }: any) {
    return (
        <div>
            <span className="block text-orange-300/80 mb-1">{label}</span>
            {edit ? (
                <div className="relative">
                    <select
                        value={value}
                        onChange={(e) => onChange(e.target.value as T)}
                        className="w-full appearance-none bg-transparent border border-orange-700 rounded-md px-3 py-2 focus:outline-none focus:border-orange-400"
                    >
                        {options.map((o: any) => (
                            <option key={o.value} value={o.value} className="bg-gray-900">
                                {o.label}
                            </option>
                        ))}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-orange-300">
            ▾
          </span>
                </div>
            ) : (
                <span className="font-medium">
          {options.find((o: any) => o.value === value)?.label || (
              <em className="text-orange-300/60">—</em>
          )}
        </span>
            )}
        </div>
    );
}

function DateField({ label, value, onChange, edit }: any) {
    return (
        <div>
            <span className="block text-orange-300/80 mb-1">{label}</span>
            {edit ? (
                <div>
                    <input
                        type="date"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full bg-transparent border border-orange-700 rounded-md px-3 py-2 focus:outline-none focus:border-orange-400 [color-scheme:dark]"
                    />
                    <p className="text-[11px] text-orange-200/70 mt-1">
                        Định dạng hiển thị: <b>dd/mm/yyyy</b>
                    </p>
                </div>
            ) : (
                <span className="font-medium">
          {value ? (
              new Date(value).toLocaleDateString("vi-VN")
          ) : (
              <em className="text-orange-300/60">—</em>
          )}
        </span>
            )}
        </div>
    );
}

function TileStat({ title, value }: any) {
    return (
        <div className="rounded-2xl p-4 bg-black/40 shadow">
            <div className="text-sm font-semibold text-orange-200">{title}</div>
            <div className="text-3xl font-extrabold mt-1 text-orange-100">
                {value}
            </div>
            <div className="mt-2 text-xs text-orange-300/70">Xem chi tiết</div>
        </div>
    );
}

function TileLink({
                      label,
                      href,
                      icon = "🏫",
                      sub,
                  }: {
    label: string;
    href?: string;
    icon?: React.ReactNode;
    sub?: string;
}) {
    const inner = (
        <>
            <span className="text-2xl">{icon}</span>
            <span className="text-sm font-semibold text-orange-100 text-center">
        {label}
      </span>
            {sub && (
                <span className="text-[11px] text-orange-300/80 text-center">
          {sub}
        </span>
            )}
        </>
    );

    const baseCls =
        "rounded-2xl p-4 bg-black/40 shadow hover:bg-white/5 transition flex flex-col items-center gap-2";

    return href ? (
        <Link href={href} className={baseCls}>
            {inner}
        </Link>
    ) : (
        <button className={baseCls}>{inner}</button>
    );
}