"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function TeacherProfile() {
  const [teacher, setTeacher] = useState({
    employeeId: "",
    name: "",
    dob: "",
    gender: "",
    department: "",
    title: "",
    degree: "",
    teachGrades: "",
    email: "",
    phone: "",
    office: "",
  });

  const [photo, setPhoto] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTeacher((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thông tin giảng viên đã được lưu thành công!");
  };

  const departments = [
    "Công nghệ thông tin",
    "Khoa học máy tính",
    "Hệ thống thông tin",
    "Kỹ thuật phần mềm",
    "An toàn thông tin",
    "Trí tuệ nhân tạo",
    "Khác",
  ];

  const titles = [
    "Trợ giảng",
    "Giảng viên",
    "Giảng viên chính",
    "Phó giáo sư",
    "Giáo sư",
  ];

  const degrees = ["Cử nhân", "Kỹ sư", "Thạc sĩ", "Tiến sĩ"];

  // Các khối / lớp giảng dạy cho môn Toán
  const teachGradeOptions = [
    "Lớp 6",
    "Lớp 7",
    "Lớp 8",
    "Lớp 9",
    "Lớp 10",
    "Lớp 11",
    "Lớp 12",
    "Lớp 6–9 (THCS)",
    "Lớp 10–12 (THPT)",
    "Lớp 6–12 (Toàn bộ)",
  ];

  const genders = ["Nam", "Nữ", "Khác"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0501] via-[#260803] to-[#140301] text-orange-50">
      {/* Thanh trên cùng (logo / tiêu đề) có thể reuse header chung nếu bạn có */}
      <div className="max-w-6xl mx-auto px-4 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-orange-400">
            MathBridge
          </span>
          <span className="text-sm text-orange-100/70">
            | Quản lý hồ sơ giảng viên
          </span>
        </div>

        <Link
          href="/login"
          className="text-sm text-orange-100/80 hover:text-orange-300 underline-offset-4 hover:underline"
        >
          Đăng xuất
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cột trái: avatar + nút tải ảnh (giống card Student) */}
          <div className="w-full lg:w-1/3">
            <div className="bg-[#2a1207] border border-orange-800/60 rounded-2xl p-6 flex flex-col items-center shadow-[0_0_30px_rgba(0,0,0,0.6)]">
              <div className="w-40 h-48 bg-[#1a0703] border border-orange-700 rounded-xl flex items-center justify-center overflow-hidden mb-4">
                {photo ? (
                  <Image
                    src={photo}
                    alt="Ảnh giảng viên"
                    width={160}
                    height={190}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                ) : (
                  <span className="text-sm text-orange-200/80 font-semibold">
                    Teacher
                  </span>
                )}
              </div>

              <span className="text-xs text-orange-200/70 mb-3">
                Chọn ảnh thẻ tại đây
              </span>

              <label className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-orange-500 hover:bg-orange-400 text-sm font-semibold text-black cursor-pointer shadow-lg shadow-orange-900/40 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <span>Tải ảnh lên</span>
              </label>

              {photo && (
                <p className="mt-3 text-[11px] text-orange-200/70 text-center">
                  Ảnh đã chọn sẽ được sử dụng trên thẻ giảng viên và lịch dạy.
                </p>
              )}
            </div>
          </div>

          {/* Cột phải: Form thông tin giảng viên */}
          <div className="w-full lg:w-2/3">
            <div className="bg-[#2a1207] border border-orange-800/60 rounded-2xl p-6 lg:p-8 shadow-[0_0_40px_rgba(0,0,0,0.65)] relative">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-orange-300">
                    Thông tin giảng viên
                  </h2>
                  <p className="text-sm text-orange-100/70 mt-1">
                    Vui lòng điền đầy đủ thông tin để quản lý lớp học toán.
                  </p>
                </div>

                <button
                  type="button"
                  className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#3c1b0b] text-orange-100 border border-orange-700 hover:bg-[#4a210f] transition"
                >
                  Xong
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Mã GV + Họ tên */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-semibold text-orange-100">
                      Mã giảng viên
                    </label>
                    <input
                      type="text"
                      name="employeeId"
                      value={teacher.employeeId}
                      onChange={handleChange}
                      placeholder="Nhập mã giảng viên"
                      className="w-full h-11 rounded-lg bg-[#1a0703] border border-orange-700/70 px-3 text-sm text-orange-50 placeholder:text-orange-200/50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-semibold text-orange-100">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={teacher.name}
                      onChange={handleChange}
                      placeholder="Nhập họ và tên"
                      className="w-full h-11 rounded-lg bg-[#1a0703] border border-orange-700/70 px-3 text-sm text-orange-50 placeholder:text-orange-200/50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                </div>

                {/* Ngày sinh + Giới tính */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-semibold text-orange-100">
                      Ngày sinh
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={teacher.dob}
                      onChange={handleChange}
                      className="w-full h-11 rounded-lg bg-[#1a0703] border border-orange-700/70 px-3 text-sm text-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <p className="mt-1 text-[11px] text-orange-200/60">
                      Định dạng: dd/mm/yyyy (tùy theo trình duyệt).
                    </p>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-semibold text-orange-100">
                      Giới tính
                    </label>
                    <div className="relative">
                      <select
                        name="gender"
                        value={teacher.gender}
                        onChange={handleChange}
                        className="w-full h-11 rounded-lg bg-[#1a0703] border border-orange-700/70 pl-3 pr-9 text-sm text-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
                      >
                        <option value="">-- Chọn giới tính --</option>
                        {genders.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-orange-300">
                        ▼
                      </span>
                    </div>
                  </div>
                </div>

                {/* Khoa/Bộ môn + Văn phòng */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-semibold text-orange-100">
                      Khoa / Bộ môn
                    </label>
                    <div className="relative">
                      <select
                        name="department"
                        value={teacher.department}
                        onChange={handleChange}
                        className="w-full h-11 rounded-lg bg-[#1a0703] border border-orange-700/70 pl-3 pr-9 text-sm text-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
                        required
                      >
                        <option value="">-- Chọn khoa/bộ môn --</option>
                        {departments.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-orange-300">
                        ▼
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-semibold text-orange-100">
                      Văn phòng (phòng làm việc)
                    </label>
                    <input
                      type="text"
                      name="office"
                      value={teacher.office}
                      onChange={handleChange}
                      placeholder="Ví dụ: Phòng 402, nhà C"
                      className="w-full h-11 rounded-lg bg-[#1a0703] border border-orange-700/70 px-3 text-sm text-orange-50 placeholder:text-orange-200/50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {/* Chức danh + Học vị */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-semibold text-orange-100">
                      Chức danh
                    </label>
                    <div className="relative">
                      <select
                        name="title"
                        value={teacher.title}
                        onChange={handleChange}
                        className="w-full h-11 rounded-lg bg-[#1a0703] border border-orange-700/70 pl-3 pr-9 text-sm text-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
                      >
                        <option value="">-- Chọn chức danh --</option>
                        {titles.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-orange-300">
                        ▼
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-semibold text-orange-100">
                      Học vị
                    </label>
                    <div className="relative">
                      <select
                        name="degree"
                        value={teacher.degree}
                        onChange={handleChange}
                        className="w-full h-11 rounded-lg bg-[#1a0703] border border-orange-700/70 pl-3 pr-9 text-sm text-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
                      >
                        <option value="">-- Chọn học vị --</option>
                        {degrees.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-orange-300">
                        ▼
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dạy khối lớp Toán */}
                <div>
                  <label className="block mb-1 text-sm font-semibold text-orange-100">
                    Dạy khối lớp (Toán)
                  </label>
                  <div className="relative">
                    <select
                      name="teachGrades"
                      value={teacher.teachGrades}
                      onChange={handleChange}
                      className="w-full h-11 rounded-lg bg-[#1a0703] border border-orange-700/70 pl-3 pr-9 text-sm text-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
                      required
                    >
                      <option value="">
                        -- Chọn khối / lớp giảng dạy (6–12) --
                      </option>
                      {teachGradeOptions.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-orange-300">
                      ▼
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-orange-200/60">
                    Ví dụ: giảng dạy Toán cho{" "}
                    <span className="font-semibold text-orange-200">
                      Lớp 6–12
                    </span>{" "}
                    nếu thầy/cô phụ trách nhiều khối.
                  </p>
                </div>

                {/* Email + Số điện thoại */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-semibold text-orange-100">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={teacher.email}
                      onChange={handleChange}
                      placeholder="Nhập email liên hệ"
                      className="w-full h-11 rounded-lg bg-[#1a0703] border border-orange-700/70 px-3 text-sm text-orange-50 placeholder:text-orange-200/50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-semibold text-orange-100">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={teacher.phone}
                      onChange={handleChange}
                      placeholder="Nhập số điện thoại"
                      className="w-full h-11 rounded-lg bg-[#1a0703] border border-orange-700/70 px-3 text-sm text-orange-50 placeholder:text-orange-200/50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-4 w-full h-11 rounded-lg bg-orange-500 hover:bg-orange-400 text-black font-semibold shadow-[0_0_20px_rgba(248,148,80,0.7)] transition"
                >
                  Lưu thông tin
                </button>
              </form>
            </div>

            {/* Footer nút điều hướng giống style dashboard */}
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/login"
                className="flex-1 min-w-[140px] text-center bg-[#2a1207] border border-orange-700/70 rounded-2xl py-3 text-sm font-semibold text-orange-100 hover:bg-[#38180b] transition shadow-md"
              >
                Quay lại
              </Link>

              <Link
                href="/home"
                className="flex-1 min-w-[140px] text-center bg-orange-500 hover:bg-orange-400 rounded-2xl py-3 text-sm font-semibold text-black shadow-[0_0_18px_rgba(248,148,80,0.7)] transition"
              >
                Tiếp theo
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        ::placeholder {
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
