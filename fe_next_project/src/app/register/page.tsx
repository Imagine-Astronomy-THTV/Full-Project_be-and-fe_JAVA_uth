"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register } from "../../lib/api";

export default function RegisterPage() {
  const router = useRouter();
  // 👉 State để lưu dữ liệu người nhập
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 👉 Hàm xử lý khi nhấn nút Đăng ký
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);

    try {
      // Gửi role mặc định là STUDENT khi đăng ký
      await register({ email, password, role: "STUDENT" });
      alert("🎉 Đăng ký thành công! Hãy đăng nhập nhé!");
      router.push("/login");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Lỗi server, vui lòng thử lại!";
      alert(errorMessage);
    } finally {
      setLoading(false);
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
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-2 rounded-lg font-semibold transition duration-200"
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
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
