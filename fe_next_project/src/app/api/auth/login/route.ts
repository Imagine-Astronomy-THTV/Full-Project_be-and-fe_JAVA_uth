import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../lib/prisma'; // đảm bảo file ở src/lib/prisma.ts và alias @ hoạt động

// ====== Kiểu dữ liệu cho phản hồi thành công / thất bại (giúp code gọn & type-safe) ======
type LoginSuccess = {
  ok: true;
  message: string;
  user: {
    id: string;
    fullName: string | null;
    email: string;
    role: string;
  };
};

type LoginError = { error: string };

// ====== Hàm tiện ích: xác định có nên set cookie Secure hay không ======
// - prod sau reverse proxy: ưu tiên header X-Forwarded-Proto
// - dev (http://localhost) thì Secure = false
function isHttps(req: NextRequest): boolean {
  const xfProto = req.headers.get('x-forwarded-proto');
  if (xfProto) return xfProto.includes('https');
  try {
    return new URL(req.url).protocol === 'https:';
  } catch {
    return false;
  }
}

// ====== Route handler ======
export async function POST(req: NextRequest) {
  try {
    // Đọc & kiểm tra đầu vào
    const { email, password } = (await req.json()) as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      const body: LoginError = { error: 'Thiếu email hoặc mật khẩu.' };
      return NextResponse.json(body, { status: 400 });
    }

    // Tìm user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      const body: LoginError = { error: 'Email không tồn tại!' };
      return NextResponse.json(body, { status: 404 });
    }

    // So sánh mật khẩu (DB phải lưu bcrypt.hash)
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      const body: LoginError = { error: 'Sai email hoặc mật khẩu!' };
      return NextResponse.json(body, { status: 401 });
    }

    // Ký JWT
    const secret = process.env.JWT_SECRET || 'default_secret'; // nhớ set biến môi trường thật khi deploy
    const token = jwt.sign(
      { id: user.id, email: user.email, role: String(user.role) },
      secret,
      { expiresIn: '7d' }
    );

    // Tạo response JSON (không trả token trong body)
    const res = NextResponse.json<LoginSuccess>(
      {
        ok: true,
        message: 'Đăng nhập thành công!',
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: String(user.role),
        },
      },
      { status: 200 }
    );

    // Set cookie HttpOnly để trình duyệt tự gửi kèm về sau
    res.cookies.set('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isHttps(req), // true khi chạy https (prod)
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 ngày
    });

    return res;
  } catch (err: unknown) {
    console.error('🔥 Lỗi khi đăng nhập:', err);
    const body: LoginError = { error: 'Lỗi máy chủ, vui lòng thử lại sau!' };
    return NextResponse.json(body, { status: 500 });
  }
}
