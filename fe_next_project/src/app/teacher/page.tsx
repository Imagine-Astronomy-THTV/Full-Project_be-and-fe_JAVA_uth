"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function TeacherProfile() {
  const [teacher, setTeacher] = useState({
    employeeId: "",
    name: "",
    dob: "",
    department: "",
    title: "",
    degree: "",
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
  const titles = ["Trợ giảng", "Giảng viên", "Giảng viên chính", "Phó giáo sư", "Giáo sư"];
  const degrees = ["Cử nhân", "Kỹ sư", "Thạc sĩ", "Tiến sĩ"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 to-indigo-100 flex flex-col items-center py-10 px-4">
      <header className="bg-white/90 shadow-lg rounded-2xl p-6 flex flex-col items-center text-center w-full max-w-3xl ring-1 ring-sky-100">
        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-sky-300 shadow-md">
          {photo ? (
            <Image
              src={photo}
              alt="Ảnh giảng viên"
              width={120}
              height={120}
              className="rounded-full object-cover"
              unoptimized
            />
          ) : (
            <img
              src="/teacher-avatar.png"
              alt="Ảnh mặc định"
              width={120}
              height={120}
              className="rounded-full border border-sky-300 shadow-sm object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/120x120?text=Teacher";
              }}
            />
          )}
        </div>

        <h1 className="text-2xl font-extrabold text-sky-700 mb-1">
          Hồ sơ giảng viên
        </h1>
        <p className="text-gray-600 font-medium">
          Vui lòng điền đầy đủ thông tin bên dưới
        </p>
      </header>

      <main className="bg-white mt-6 p-8 rounded-3xl shadow-2xl w-full max-w-3xl ring-1 ring-sky-100">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Ảnh thẻ */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Ảnh thẻ</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="w-full border border-sky-300 rounded-lg px-3 py-2 text-gray-800 bg-sky-50 cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-sky-500 file:text-white hover:file:bg-sky-600 transition"
            />
            {photo && (
              <div className="mt-3 flex justify-center">
                <Image
                  src={photo}
                  alt="Ảnh xem trước"
                  width={120}
                  height={120}
                  className="rounded-lg border border-sky-300 shadow-sm object-cover"
                  unoptimized
                />
              </div>
            )}
          </div>

          {/* Các trường text */}
          {Object.entries({
            employeeId: "Mã giảng viên",
            name: "Họ và tên",
            dob: "Ngày sinh",
            email: "Email",
            phone: "Số điện thoại",
            office: "Văn phòng",
          }).map(([key, label]) => (
            <div key={key}>
              <label className="block mb-1 font-semibold text-gray-700">{label}</label>
              <input
                type={
                  key === "dob" ? "date" : key === "email" ? "email" : key === "phone" ? "tel" : "text"
                }
                name={key}
                value={teacher[key as keyof typeof teacher]}
                onChange={handleChange}
                placeholder={`Nhập ${label.toLowerCase()}`}
                className="w-full border border-sky-300 rounded-lg px-3 py-2 text-black font-medium placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
                required={["employeeId", "name"].includes(key)}
              />
            </div>
          ))}

          {/* Dropdown: Khoa/Bộ môn */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Khoa/Bộ môn</label>
            <div className="relative">
              <select
                name="department"
                value={teacher.department}
                onChange={handleChange}
                className="h-11 w-full appearance-none border border-sky-300 rounded-lg px-3 pr-10 text-black bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                required
              >
                <option value="">— Chọn khoa/bộ môn —</option>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              {/* mũi tên căn giữa */}
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-sky-600">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd"/>
                </svg>
              </span>
            </div>
          </div>

          {/* Dropdown: Chức danh */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Chức danh</label>
            <div className="relative">
              <select
                name="title"
                value={teacher.title}
                onChange={handleChange}
                className="h-11 w-full appearance-none border border-sky-300 rounded-lg px-3 pr-10 text-black bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                <option value="">— Chọn chức danh —</option>
                {titles.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-sky-600">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd"/>
                </svg>
              </span>
            </div>
          </div>

          {/* Dropdown: Học vị */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Học vị</label>
            <div className="relative">
              <select
                name="degree"
                value={teacher.degree}
                onChange={handleChange}
                className="h-11 w-full appearance-none border border-sky-300 rounded-lg px-3 pr-10 text-black bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                <option value="">— Chọn học vị —</option>
                {degrees.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-sky-600">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd"/>
                </svg>
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-700 text-white py-2 rounded-lg font-semibold shadow-md hover:shadow-sky-300 transition-all duration-200"
          >
            Lưu thông tin
          </button>
        </form>
      </main>

      <footer className="mt-6 flex gap-4">
        <Link
          href="/login"
          className="bg-sky-100 hover:bg-sky-300 text-sky-700 font-semibold px-6 py-2 rounded-full shadow-sm transition-all duration-200"
        >
          {"Quay lại"}
        </Link>

        <Link
          href="/home"
          className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-2 rounded-full shadow-md transition-all duration-200"
        >
          {"Tiếp theo "}
        </Link>
      </footer>

      <style jsx>{`
        ::placeholder { font-style: italic; }
      `}</style>
    </div>
  );
}
