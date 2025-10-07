"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // ⚙️ Giả lập tài khoản mẫu
    if (email === "student@example.com" && password === "123456") {
      router.push("/student"); // ✅ Chuyển hướng sang trang student
    } else {
      alert("Sai email hoặc mật khẩu! Hãy thử lại.");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-300 to-pink-200 overflow-hidden">
      {/* 🌕 Các chấm tròn trang trí có độ bóng sáng */}
      <div className="absolute w-64 h-64 bg-white rounded-full opacity-60 top-10 left-20 blur-xl shadow-[0_0_40px_rgba(255,255,255,0.6)]"></div>
      <div className="absolute w-36 h-36 bg-white rounded-full opacity-70 bottom-20 right-24 blur-lg shadow-[0_0_50px_rgba(255,255,255,0.8)]"></div>
      <div className="absolute w-24 h-24 bg-white rounded-full opacity-80 top-1/3 right-1/3 blur-md shadow-[0_0_30px_rgba(255,255,255,0.9)]"></div>

      {/* 🧱 Form container */}
      <div className="relative z-10 bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md text-center transform transition-all duration-300 hover:shadow-orange-200">
        {/* Tiêu đề */}
        <h1 className="text-4xl font-extrabold text-orange-700 mb-4 tracking-wide">
          Đăng nhập học toán trực tuyến
        </h1>
        <p className="text-orange-500 font-semibold mb-8">Cùng vui học mỗi ngày!</p>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5 text-left">
          <div>
            <label className="block mb-2 font-semibold text-gray-800">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
              className="w-full border border-orange-300 rounded-lg px-3 py-2 text-black font-medium placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 hover:border-orange-400 transition duration-200"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-800">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              className="w-full border border-orange-300 rounded-lg px-3 py-2 text-black font-medium placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 hover:border-orange-400 transition duration-200"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold shadow-md hover:shadow-orange-300 transition-all duration-200"
          >
            Đăng nhập
          </button>
        </form>

        {/* Liên kết đăng ký */}
        <div className="text-center mt-6 text-sm">
          <a
            href="/register"
            className="text-orange-600 font-medium hover:underline hover:text-orange-700 transition"
          >
            Đăng ký tài khoản mới
          </a>
        </div>
      </div>
    </div>
  );
}
