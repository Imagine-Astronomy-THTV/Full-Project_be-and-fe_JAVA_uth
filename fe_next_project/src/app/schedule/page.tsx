"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type ScheduleItem = {
    date: string;
    time: string;
    method: string;
    note: string;
};

export default function SchedulePage() {
    const router = useRouter();
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [method, setMethod] = useState("online");
    const [note, setNote] = useState("");
    const [items, setItems] = useState<ScheduleItem[]>([]);

    // Kiểm tra quyền truy cập - chỉ cho phép giảng viên
    useEffect(() => {
        if (typeof window === "undefined") return;
        const teacherEmail = localStorage.getItem("teacherEmail");
        if (!teacherEmail) {
            router.replace("/login-teacher");
            return;
        }
    }, [router]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!date || !time) {
            alert("Vui lòng chọn ngày và giờ học");
            return;
        }

        const newItem: ScheduleItem = { date, time, method, note };
        setItems((prev) => [...prev, newItem]);

        // reset form
        setTime("");
        setNote("");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-900 via-[#5e1f12] to-[#3b0c12] text-orange-50">
            {/* Header giống các trang khác */}
            <header className="sticky top-0 z-20 bg-black/40 backdrop-blur">
                <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
            <span className="font-extrabold text-xl text-orange-400">
              MathBridge
            </span>
                        <span className="text-sm text-orange-300/80 hidden sm:inline">
              | Đặt lịch học
            </span>
                    </div>
                    <Link
                        href="/teacher/dashboard"
                        className="text-sm font-semibold text-orange-300 hover:underline"
                    >
                        ← Quay lại trang giảng viên
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-4 py-6 space-y-6">
                {/* Form đặt lịch */}
                <section className="bg-black/40 rounded-2xl shadow p-5">
                    <h1 className="text-2xl font-extrabold text-orange-400 mb-4">
                        Đặt lịch học mới
                    </h1>

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"
                    >
                        <div>
                            <label className="block text-orange-300/80 mb-1">
                                Ngày học
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-transparent border border-orange-700 rounded-md px-3 py-2 focus:outline-none focus:border-orange-400 [color-scheme:dark]"
                            />
                        </div>

                        <div>
                            <label className="block text-orange-300/80 mb-1">
                                Giờ học
                            </label>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full bg-transparent border border-orange-700 rounded-md px-3 py-2 focus:outline-none focus:border-orange-400 [color-scheme:dark]"
                            />
                        </div>

                        <div>
                            <label className="block text-orange-300/80 mb-1">
                                Hình thức
                            </label>
                            <select
                                value={method}
                                onChange={(e) => setMethod(e.target.value)}
                                className="w-full bg-transparent border border-orange-700 rounded-md px-3 py-2 focus:outline-none focus:border-orange-400"
                            >
                                <option value="online" className="bg-gray-900">
                                    Online (Zoom / Google Meet)
                                </option>
                                <option value="offline" className="bg-gray-900">
                                    Học trực tiếp
                                </option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-orange-300/80 mb-1">
                                Ghi chú cho buổi học (tuỳ chọn)
                            </label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                rows={3}
                                className="w-full bg-transparent border border-orange-700 rounded-md px-3 py-2 focus:outline-none focus:border-orange-400"
                                placeholder="Ví dụ: Ôn chương Hàm số bậc nhất, chuẩn bị kiểm tra 15 phút..."
                            />
                        </div>

                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                className="mt-2 px-4 py-2 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600"
                            >
                                Đặt lịch học
                            </button>
                        </div>
                    </form>
                </section>

                {/* Danh sách lịch đã đặt (chỉ lưu tạm trên FE) */}
                <section className="bg-black/40 rounded-2xl shadow p-5">
                    <h2 className="text-lg font-bold text-orange-300 mb-3">
                        Lịch học đã đặt
                    </h2>

                    {items.length === 0 ? (
                        <p className="text-sm text-orange-200/80">
                            Chưa có buổi học nào. Hãy đặt buổi học đầu tiên ở form phía trên.
                        </p>
                    ) : (
                        <ul className="space-y-3 text-sm">
                            {items.map((it, idx) => (
                                <li
                                    key={idx}
                                    className="border border-orange-800/70 rounded-xl px-3 py-2 bg-black/30"
                                >
                                    <div className="font-semibold text-orange-100">
                                        {new Date(it.date).toLocaleDateString("vi-VN")} – {it.time}
                                    </div>
                                    <div className="text-xs text-orange-200/80 mt-1">
                                        Hình thức:{" "}
                                        {it.method === "online"
                                            ? "Online (Zoom / Google Meet)"
                                            : "Học trực tiếp"}
                                    </div>
                                    {it.note && (
                                        <div className="text-xs text-orange-200/90 mt-1">
                                            Ghi chú: {it.note}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </main>
        </div>
    );
}