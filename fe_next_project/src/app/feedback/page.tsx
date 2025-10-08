"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ClassFeedbackPage() {
  const [form, setForm] = useState({
    name: "",
    course: "",
    teacher: "",
    date: "",
    mode: "", // Trực tiếp / Online
    rating: 0, // 1..5
    useful: "", // yes/no
    comments: "",
    suggestions: "",
    anonymous: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const setRating = (n: number) => setForm((p) => ({ ...p, rating: n }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: gọi API lưu nếu cần
    alert("Cảm ơn bạn! Đánh giá đã được ghi nhận.");
    // reset nhẹ
    setForm({
      name: "",
      course: "",
      teacher: "",
      date: "",
      mode: "",
      rating: 0,
      useful: "",
      comments: "",
      suggestions: "",
      anonymous: false,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-orange-50 to-rose-200">
      <div className="mx-auto max-w-3xl px-4 py-10">
        {/* Header */}
        <header className="rounded-2xl bg-white/90 p-6 text-center shadow-xl ring-1 ring-rose-100">
          <h1 className="text-2xl font-extrabold tracking-tight text-rose-700">
            Đánh giá & Nhận xét sau buổi học
          </h1>
          <p className="mt-1 text-gray-600">
            Vui lòng dành ít phút để phản hồi giúp buổi học sau tốt hơn ✨
          </p>
        </header>

        {/* Form */}
        <main className="mt-6 rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-rose-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hàng 2 cột */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field
                label="Họ và tên (tuỳ chọn)"
                name="name"
                value={form.name}
                placeholder="Nhập họ và tên"
                onChange={handleChange}
              />

              <Field
                label="Môn/Lớp"
                name="course"
                value={form.course}
                placeholder="VD: Lập trình Java - K17"
                onChange={handleChange}
                required
              />

              <Field
                label="Giảng viên"
                name="teacher"
                value={form.teacher}
                placeholder="VD: ThS. Nguyễn Văn A"
                onChange={handleChange}
                required
              />

              <Field
                label="Ngày học"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>

            {/* Select: Hình thức buổi học */}
            <div>
              <Label>Hình thức buổi học</Label>
              <div className="relative">
                <select
                  name="mode"
                  value={form.mode}
                  onChange={handleChange}
                  className="h-11 w-full appearance-none rounded-xl border border-rose-300 bg-white px-3 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  required
                >
                  <option value="">— Chọn hình thức —</option>
                  <option value="Trực tiếp">Trực tiếp</option>
                  <option value="Online">Online</option>
                  <option value="Hybrid">Kết hợp (Hybrid)</option>
                </select>
                {/* mũi tên căn giữa */}
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-rose-600">
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </div>
            </div>

            {/* Rating */}
            <div>
              <Label>Mức độ hài lòng</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    type="button"
                    key={n}
                    onClick={() => setRating(n)}
                    aria-label={`Chọn ${n} sao`}
                    className={`h-10 w-10 rounded-full border transition ${
                      form.rating >= n
                        ? "border-amber-400 bg-amber-100 text-amber-600"
                        : "border-gray-300 bg-white text-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {form.rating ? `Bạn chọn ${form.rating}/5` : "Chọn số sao để đánh giá."}
              </p>
            </div>

            {/* Hữu ích? */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <RadioGroup
                label="Nội dung buổi học có hữu ích?"
                name="useful"
                value={form.useful}
                onChange={handleChange}
                options={[
                  { label: "Có", value: "yes" },
                  { label: "Chưa", value: "no" },
                ]}
                required
              />

              <div className="flex items-end">
                <label className="inline-flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    name="anonymous"
                    checked={form.anonymous}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                  />
                  <span className="text-gray-700">Gửi ẩn danh</span>
                </label>
              </div>
            </div>

            {/* Nhận xét */}
            <div>
              <Label>Nhận xét tổng quan</Label>
              <textarea
                name="comments"
                value={form.comments}
                onChange={handleChange}
                rows={4}
                placeholder="Bạn thích điều gì? Phần nào còn khó?"
                className="w-full rounded-xl border border-rose-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-400"
                required
              />
            </div>

            {/* Góp ý cải thiện */}
            <div>
              <Label>Góp ý cải thiện</Label>
              <textarea
                name="suggestions"
                value={form.suggestions}
                onChange={handleChange}
                rows={3}
                placeholder="Đề xuất để buổi học sau tốt hơn…"
                className="w-full rounded-xl border border-rose-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setForm({
                    name: "",
                    course: "",
                    teacher: "",
                    date: "",
                    mode: "",
                    rating: 0,
                    useful: "",
                    comments: "",
                    suggestions: "",
                    anonymous: false,
                  })
                }
                className="rounded-xl border border-gray-300 bg-white px-5 py-2 font-medium text-gray-700 hover:bg-gray-50"
              >
                Đặt lại
              </button>
              <button
                type="submit"
                className="rounded-xl bg-rose-500 px-5 py-2 font-semibold text-white shadow hover:bg-rose-600"
              >
                Gửi đánh giá
              </button>
            </div>
          </form>
        </main>

        {/* Footer nav */}
        <div className="mt-6 flex justify-center gap-4">
        <Link
            href="/login"
            className="inline-flex items-center justify-center h-11 min-w-[200px] px-6 rounded-full bg-rose-500 text-white font-semibold shadow hover:bg-rose-600"
        >
            Trang chủ
        </Link>

        <Link
            href="/teacher"
            className="inline-flex items-center justify-center h-11 min-w-[200px] px-6 rounded-full bg-rose-500 text-white font-semibold shadow hover:bg-rose-600"
        >
            Tới trang giảng viên
        </Link>
        </div>

      </div>

      <style jsx>{`
        ::placeholder { font-style: italic; }
      `}</style>
    </div>
  );
}

/* ---------- small UI helpers ---------- */

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1 block text-sm font-semibold text-gray-700">{children}</label>
  );
}

function Field(
  props: React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
  }
) {
  const { label, ...rest } = props;
  return (
    <div>
      <Label>{label}</Label>
      <input
        {...rest}
        className="h-11 w-full rounded-xl border border-rose-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-400"
      />
    </div>
  );
}

function RadioGroup({
  label,
  name,
  value,
  onChange,
  options,
  required,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  options: { label: string; value: string }[];
  required?: boolean;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex gap-4 rounded-xl border border-rose-200 bg-white px-3 py-2">
        {options.map((opt) => (
          <label key={opt.value} className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={onChange}
              required={required}
              className="h-4 w-4 border-gray-300 text-rose-600 focus:ring-rose-500"
            />
            <span className="text-gray-800">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
