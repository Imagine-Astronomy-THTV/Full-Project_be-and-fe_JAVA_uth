"use client";

import React, { useState } from "react";
import Link from "next/link";

type Status = "Sắp học" | "Đang học" | "Hoàn thành";

type Session = {
  id: string;
  date: string;
  time: string;
  topic: string;
  duration: number;
  status: Status;
};

export default function SchedulePage() {
  const [sessions, setSessions] = useState<Session[]>([
    { id: "1", date: "2025-10-11", time: "19:30", topic: "Giới hạn hàm số", duration: 45, status: "Đang học" },
    { id: "2", date: "2025-10-12", time: "20:00", topic: "Hình học – Cát tuyến", duration: 40, status: "Sắp học" },
    { id: "3", date: "2025-10-09", time: "18:30", topic: "Đại số – Hệ PT 2 ẩn", duration: 35, status: "Hoàn thành" },
  ]);

  const [form, setForm] = useState({
    date: "",
    time: "",
    topic: "",
    duration: 45,
    status: "Sắp học" as Status,
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date || !form.time || !form.topic) return;
    setSessions([
      { id: Date.now().toString(), ...form },
      ...sessions,
    ]);
    setForm({ date: "", time: "", topic: "", duration: 45, status: "Sắp học" });
  };

  const handleStatus = (id: string, status: Status) =>
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));

  const handleDelete = (id: string) =>
    setSessions((prev) => prev.filter((s) => s.id !== id));

  const sortByStatus = (a: Session, b: Session) => {
    const order = { "Đang học": 0, "Sắp học": 1, "Hoàn thành": 2 };
    return order[a.status] - order[b.status];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-orange-50 to-rose-200">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-3xl font-extrabold text-rose-700">
            Đặt lịch học <span className="text-orange-600">– Sinh viên</span>
          </h1>
          <div className="flex gap-3">
            <Link
              href="/"
              className="rounded-full bg-rose-500 px-5 py-2 font-semibold text-white shadow hover:bg-rose-600"
            >
              Trang chủ
            </Link>
            <Link
              href="/student"
              className="rounded-full bg-orange-500 px-5 py-2 font-semibold text-white shadow hover:bg-orange-600"
            >
              Thống kê Toán
            </Link>
          </div>
        </div>

        {/* Form thêm */}
        <form
          onSubmit={handleAdd}
          className="rounded-2xl bg-white p-5 shadow-xl ring-1 ring-rose-100"
        >
          <h2 className="mb-3 text-lg font-bold text-gray-800">Thêm buổi học</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="h-11 rounded-xl border border-rose-200 px-3 focus:ring-2 focus:ring-rose-400"
              required
            />
            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="h-11 rounded-xl border border-rose-200 px-3 focus:ring-2 focus:ring-rose-400"
              required
            />
            <input
              type="text"
              placeholder="Chủ đề buổi học..."
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
              className="col-span-2 h-11 rounded-xl border border-orange-200 px-3 focus:ring-2 focus:ring-orange-400"
              required
            />
            <input
              type="number"
              value={form.duration}
              onChange={(e) =>
                setForm({ ...form, duration: Number(e.target.value) })
              }
              className="h-11 rounded-xl border border-rose-200 px-3 focus:ring-2 focus:ring-rose-400"
              min={15}
              step={5}
              placeholder="Phút"
            />
            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as Status })
              }
              className="h-11 rounded-xl border border-rose-200 px-3 focus:ring-2 focus:ring-rose-400"
            >
              <option>Đang học</option>
              <option>Sắp học</option>
              <option>Hoàn thành</option>
            </select>
          </div>
          <div className="mt-4 text-right">
            <button
              type="submit"
              className="rounded-full bg-gradient-to-r from-rose-500 to-orange-500 px-6 py-2 font-semibold text-white shadow hover:brightness-110"
            >
              + Thêm buổi
            </button>
          </div>
        </form>

        {/* Danh sách buổi học */}
        <section className="mt-6 rounded-2xl bg-white p-5 shadow-xl ring-1 ring-orange-100">
          <h2 className="mb-3 text-lg font-bold text-gray-800">Danh sách buổi học</h2>
          {sessions.length === 0 ? (
            <p className="text-sm text-gray-500">Chưa có buổi học nào.</p>
          ) : (
            <ul className="divide-y divide-rose-100">
              {sessions.sort(sortByStatus).map((s) => (
                <li
                  key={s.id}
                  className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{s.topic}</p>
                    <p className="text-sm text-gray-600">
                      {s.date} • {s.time} • {s.duration} phút
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold ${
                        s.status === "Đang học"
                          ? "bg-blue-100 text-blue-700"
                          : s.status === "Sắp học"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {s.status}
                    </span>
                    {s.status !== "Hoàn thành" && (
                      <button
                        onClick={() => handleStatus(s.id, "Hoàn thành")}
                        className="rounded-full border border-emerald-200 px-3 py-1 text-sm text-emerald-700 hover:bg-emerald-50"
                      >
                        ✓ Hoàn thành
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      ✕ Xóa
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
