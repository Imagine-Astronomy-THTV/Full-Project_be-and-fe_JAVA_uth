"use client";

import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-50 to-sky-200">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-black">
          🧮 Đăng nhập học toán trực tuyến
        </h1>

        <form className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="w-full border border-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Mật khẩu</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-700 text-white py-2 rounded-lg font-semibold transition duration-200"
          >
            Đăng nhập
          </button>
        </form>

        <div className="text-center mt-4 text-sm">
          <a href="#" className="text-sky-600 hover:underline">
            Quên mật khẩu?
          </a>
          <span className="mx-2">•</span>
          <Link href="/register" className="text-sky-600 hover:underline">
            Đăng ký tài khoản mới
          </Link>
          
        </div>
      </div>
    </div>
  );
}
