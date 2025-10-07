"use client";

import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-purple-200">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-black">
        <h1 className="text-2xl font-bold text-center mb-6 text-black">
          ✏️ Đăng ký học toán trực tuyến
        </h1>

        <form className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Họ và tên</label>
            <input
              type="text"
              placeholder="Nhập họ và tên"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-gray-600"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              placeholder="Nhập email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-gray-600"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Mật khẩu</label>
            <input
              type="password"
              placeholder="Tạo mật khẩu"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-gray-600"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Xác nhận mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-gray-600"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition duration-200"
          >
            Đăng ký
          </button>
        </form>

        <div className="text-center mt-4 text-sm">
          <span>Đã có tài khoản? </span>
          <Link href="/login" className="text-purple-600 hover:underline">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
