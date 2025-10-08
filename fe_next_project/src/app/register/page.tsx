"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  // 👉 State để lưu dữ liệu người nhập
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 👉 Hàm xử lý khi nhấn nút Đăng ký
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Đăng ký thất bại!");
        return;
      }

      alert("🎉 Đăng ký thành công! Hãy đăng nhập nhé!");
      window.location.href = "/login";
    } catch (err) {
      console.error("Register error:", err);
      alert("Lỗi server, vui lòng thử lại!");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-300 to-pink-200 overflow-hidden">
      {/* 🌕 Các chấm tròn trang trí có độ bóng sáng */}
      <div className="absolute w-64 h-64 bg-white rounded-full opacity-60 top-10 left-20 blur-xl"></div>
      <div className="absolute w-36 h-36 bg-white rounded-full opacity-70 bottom-20 right-24 blur-lg"></div>
      <div className="absolute w-24 h-24 bg-white rounded-full opacity-80 top-1/3 right-1/3 blur-md"></div>

      {/* 🧱 Form container */}
      <div className="relative z-10 bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md text-center transform transition-all duration-300 hover:shadow-pink-200">
        {/* Tiêu đề */}
        <h1 className="text-2xl font-bold text-center mb-6 text-black">
          Đăng ký học toán trực tuyến
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Họ và tên */}
          <div>
            <label className="block mb-1 font-semibold text-black">Họ và tên</label>
            <input
              type="text"
              placeholder="Nhập họ và tên"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 text-black font-medium placeholder:text-gray-400"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-semibold text-black">Email</label>
            <input
              type="email"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 text-black font-medium placeholder:text-gray-400"
              required
            />
          </div>

          {/* Mật khẩu */}
          <div>
            <label className="block mb-1 font-semibold text-black">Mật khẩu</label>
            <input
              type="password"
              placeholder="Tạo mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 text-black font-medium placeholder:text-gray-400"
              required
            />
          </div>

          {/* Xác nhận mật khẩu */}
          <div>
            <label className="block mb-1 font-semibold text-black">Xác nhận mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 text-black font-medium placeholder:text-gray-400"
              required
            />
          </div>

          {/* Nút đăng ký */}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition duration-200"
          >
            Đăng ký
          </button>
        </form>

        {/* Đăng nhập */}
        <div className="text-center mt-4 text-sm">
          <span>Đã có tài khoản? </span>
          <Link href="/login" className="text-orange-500 hover:underline font-semibold">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
