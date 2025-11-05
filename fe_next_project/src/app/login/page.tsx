'use client'

import { useRouter } from 'next/navigation'
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

      // lưu token
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
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-300 to-pink-200 overflow-hidden">
      <div className="absolute w-64 h-64 bg-white rounded-full opacity-60 top-10 left-20 blur-xl shadow-[0_0_40px_rgba(255,255,255,0.6)]" />
      <div className="absolute w-36 h-36 bg-white rounded-full opacity-70 bottom-20 right-24 blur-lg shadow-[0_0_50px_rgba(255,255,255,0.8)]" />
      <div className="absolute w-24 h-24 bg-white rounded-full opacity-80 top-1/3 right-1/3 blur-md shadow-[0_0_30px_rgba(255,255,255,0.9)]" />

      <div className="relative z-10 bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md text-center">
        <h1 className="text-4xl font-extrabold text-orange-700 mb-4">ĐĂNG NHẬP HỌC TOÁN TRỰC TUYẾN</h1>
        <p className="text-orange-700 font-semibold mb-8">Cùng vui học mỗi ngày!</p>

        <form onSubmit={handleLogin} className="space-y-5 text-left">
          <div>
            <label className="block mb-2 font-semibold text-gray-800">Tên đăng nhập</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập username của bạn"
              className="w-full border border-orange-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400"
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

          {err && <p className="text-red-600 text-sm mt-2">{err}</p>}
        </form>
      </div>
    </div>
  )
}
