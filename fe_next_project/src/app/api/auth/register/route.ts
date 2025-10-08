import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";// hoặc "../../../../lib/prisma" nếu alias chưa hoạt động
import { Role } from "@prisma/client"; // ✅ dùng enum Prisma chính chủ

export async function POST(req: Request) {
  try {
    const { email, password, fullName } = await req.json();

    // Kiểm tra email tồn tại
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email đã tồn tại!" },
        { status: 400 }
      );
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        role: Role.student, // ✅ fix enum
      },
    });

    return NextResponse.json(
      { message: "Đăng ký thành công!", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Lỗi khi đăng ký:", error);
    return NextResponse.json(
      { error: "Lỗi máy chủ, thử lại sau!" },
      { status: 500 }
    );
  }
}
