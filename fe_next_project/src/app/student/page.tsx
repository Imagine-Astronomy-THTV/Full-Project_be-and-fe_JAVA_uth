"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function StudentProfile() {
  // 🧠 Trạng thái lưu thông tin học sinh
  const [student, setStudent] = useState({
    name: "",
    dob: "",
    hometown: "",
    address: "",
    course: "",
    email: "",
    phone: "",
  });

  // 🖼️ Trạng thái lưu ảnh thẻ
  const [photo, setPhoto] = useState<string | null>(null);

  // 📥 Hàm xử lý khi nhập dữ liệu
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStudent((prev) => ({ ...prev, [name]: value }));
  };

  // 📸 Hàm xử lý khi tải ảnh
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // 💾 Gửi form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("✅ Thông tin học sinh đã được lưu!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-pink-100 flex flex-col items-center py-10 px-4">
      {/* 🧑‍🎓 Header */}
      <header className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center text-center w-full max-w-lg">
        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-orange-300 shadow-md">
          {/* Nếu không có ảnh, dùng placeholder */}
          {photo ? (
            <Image
              src={photo}
              alt="Avatar"
              width={120}
              height={120}
              className="rounded-full object-cover"
              unoptimized
            />
          ) : (
            <img
              src="/student-avatar.png"
              alt="Avatar mặc định"
              width={120}
              height={120}
              onError={(e) =>
                (e.currentTarget.src =
                  "https://placehold.co/120x120?text=Avatar")
              }
              className="rounded-full border border-orange-300 shadow-sm object-cover"
            />
          )}
        </div>
        <h1 className="text-2xl font-extrabold text-orange-700 mb-1">
          Hồ sơ học sinh
        </h1>
        <p className="text-gray-600 font-medium">
          Vui lòng điền đầy đủ thông tin bên dưới 👇
        </p>
      </header>

      {/* 📋 Form */}
      <main className="bg-white mt-6 p-8 rounded-3xl shadow-2xl w-full max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Ảnh thẻ */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Ảnh thẻ
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="w-full border border-orange-300 rounded-lg px-3 py-2 text-gray-800 bg-orange-50 cursor-pointer 
              file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-orange-400 file:text-white hover:file:bg-orange-500 transition"
            />
            {photo && (
              <div className="mt-3 flex justify-center">
                <Image
                  src={photo}
                  alt="Ảnh thẻ"
                  width={120}
                  height={120}
                  className="rounded-lg border border-orange-300 shadow-sm object-cover"
                  unoptimized
                />
              </div>
            )}
          </div>

          {/* Các trường thông tin */}
          {Object.entries({
            name: "Họ và tên",
            dob: "Ngày sinh",
            hometown: "Quê quán",
            address: "Địa chỉ",
            course: "Khóa học",
            email: "Email",
            phone: "Số điện thoại",
          }).map(([key, label]) => (
            <div key={key}>
              <label className="block mb-1 font-semibold text-gray-700">
                {label}
              </label>
              <input
                type="text"
                name={key}
                value={student[key as keyof typeof student]}
                onChange={handleChange}
                placeholder={`Nhập ${label.toLowerCase()}`}
                className="w-full border border-orange-300 rounded-lg px-3 py-2 text-black font-medium 
                placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                required
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold shadow-md 
            hover:shadow-orange-300 transition-all duration-200"
          >
            Lưu thông tin
          </button>
        </form>
      </main>

      {/* 🔗 Nút điều hướng */}
      <footer className="mt-6 flex gap-4">
        <Link
          href="/login"
          className="bg-orange-100 hover:bg-orange-200 text-orange-700 font-semibold px-6 py-2 rounded-full 
          shadow-sm transition-all duration-200"
        >
          ← Quay lại
        </Link>

        <Link
          href="/home"
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-full 
          shadow-md transition-all duration-200"
        >
          Tiếp theo →
        </Link>
      </footer>

      {/* ⚙️ CSS nhẹ */}
      <style jsx>{`
        ::placeholder {
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
