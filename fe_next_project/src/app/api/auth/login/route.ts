import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../../lib/prisma"; // ✅ Dùng alias gọn gàng

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // ✅ Log kiểm tra
    console.log("📩 Login request:", email);

    // Tìm user theo email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Email không tồn tại!" },
        { status: 404 }
      );
    }

    // So sánh mật khẩu (đúng thứ tự)
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔐 Compare result:", isMatch);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Sai email hoặc mật khẩu!" },
        { status: 401 }
      );
    }

    // Tạo JWT Token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: String(user.role) }, // ✅ ép về string
      process.env.JWT_SECRET || "default_secret", // ✅ fallback
      { expiresIn: "7d" }
    );

    // ✅ Trả kết quả
    return NextResponse.json(
      {
        message: "Đăng nhập thành công!",
        token,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: String(user.role),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("🔥 Lỗi khi đăng nhập:", error);
    return NextResponse.json(
      { error: "Lỗi máy chủ, vui lòng thử lại sau!" },
      { status: 500 }
    );
  }
}
