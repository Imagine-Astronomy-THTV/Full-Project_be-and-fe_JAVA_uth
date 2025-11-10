'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { loginApi } from '@/api-client/auth-api'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr(null)
    setLoading(true)

    try {
      const data = await loginApi({ username, password })
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('expiredAt', String(data.expiredAt))
      router.push('/student')
    } catch (error: any) {
      setErr(error.message || 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-300 to-pink-200 overflow-hidden px-4">
      {/* hiệu ứng nền giữ nguyên */}
      <div className="absolute w-64 h-64 bg-white rounded-full opacity-60 top-10 left-20 blur-xl" />
      <div className="absolute w-36 h-36 bg-white rounded-full opacity-70 bottom-20 right-24 blur-lg" />
      <div className="absolute w-24 h-24 bg-white rounded-full opacity-80 top-1/3 right-1/3 blur-md" />

      {/* khung 2 cột */}
      <div className="relative z-10 flex flex-col md:flex-row gap-10 items-start justify-center w-full max-w-6xl">

        {/* Cột trái: nội dung cho học sinh */}
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl w-full md:w-2/3">
          <h2 className="text-2xl font-bold text-orange-700 mb-4">📢 Thông báo chung</h2>
          <ul className="space-y-2 text-gray-800 text-sm">
            <li className="border-b pb-2">
              Mở đăng ký lớp Bồi dưỡng Toán 6–9 học kỳ này <span className="text-orange-500 font-semibold ml-1">09/11/2025</span>
            </li>
            <li className="border-b pb-2">
              Lịch kiểm tra giữa kỳ Toán trực tuyến (tự luyện + thi thử) <span className="text-orange-500 font-semibold ml-1">Tuần 3 Tháng 11</span>
            </li>
            <li className="border-b pb-2">
              Bảo trì hệ thống vào 23:00–23:30 mỗi thứ Bảy — các khóa học vẫn truy cập được sau thời gian này
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-orange-700 mt-6 mb-4">🎓 Chương trình học</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Lộ trình Toán theo chương trình phổ thông mới: từ làm quen số học (lớp 1–2), 
            tư duy logic &amp; hình học cơ bản (lớp 3–5), đại số &amp; hình học (lớp 6–9), 
            đến hàm số – xác suất – hình học tọa độ (lớp 10–12). 
            Mỗi bài có video ngắn, ví dụ mẫu, bài tập tự luyện, và đề kiểm tra định kỳ. 
            Phụ huynh có thể theo dõi tiến độ ngay sau khi đăng nhập.
          </p>

          <h2 className="text-2xl font-bold text-orange-700 mt-6 mb-4">💰 Học phí &amp; Chính sách ưu đãi</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Học phí tính theo gói: Tháng / Học kỳ / Năm. 
            Miễn phí 7 ngày trải nghiệm, giảm 15% cho gói học kỳ và 25% cho gói năm. 
            Hỗ trợ học bổng dành cho học sinh có hoàn cảnh khó khăn — vui lòng liên hệ sau khi đăng nhập để được hướng dẫn.
          </p>
        </div>

        {/* Cột phải: form đăng nhập giữ nguyên */}
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full md:w-1/3 text-center">
          <h1 className="text-3xl font-extrabold text-orange-700 mb-2">ĐĂNG NHẬP HỌC TOÁN TRỰC TUYẾN</h1>
          <p className="text-orange-600 font-medium mb-6">Cùng vui học mỗi ngày!</p>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block mb-1 font-semibold text-gray-800">Tên đăng nhập</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập username"
                className="w-full border border-orange-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-gray-800">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                className="w-full border border-orange-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white py-2 rounded-lg font-semibold shadow-md transition-all duration-200"
            >
              {loading ? 'Đang đăng nhập…' : 'Đăng nhập'}
            </button>

            {err && <p className="text-red-600 text-sm">{err}</p>}
          </form>

          <div className="mt-6 pt-4 border-t border-orange-200 text-sm">
            <span className="text-gray-700">Chưa có tài khoản? </span>
            <Link href="/register" className="text-orange-600 font-semibold hover:underline">
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
