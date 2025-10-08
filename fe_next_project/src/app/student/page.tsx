"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function StudentProfile() {
  const [student, setStudent] = useState({
    name: "",
    dob: "",
    hometown: "",
    address: "",
    course: "",
    email: "",
    phone: "",
  });

  const [photo, setPhoto] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thong tin hoc sinh da duoc luu thanh cong!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 to-pink-100 flex flex-col items-center py-10 px-4">
      <header className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center text-center w-full max-w-lg">
        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-orange-300 shadow-md">
          {photo ? (
            <Image
              src={photo}
              alt="Anh hoc sinh"
              width={120}
              height={120}
              className="rounded-full object-cover"
              unoptimized
            />
          ) : (
            <img
              src="/student-avatar.png"
              alt="Anh mac dinh"
              width={120}
              height={120}
              className="rounded-full border border-orange-300 shadow-sm object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/120x120?text=Avatar";
              }}
            />
          )}
        </div>

        <h1 className="text-2xl font-extrabold text-orange-700 mb-1">
          Ho so hoc sinh
        </h1>
        <p className="text-gray-600 font-medium">
          Vui long dien day du thong tin ben duoi
        </p>
      </header>

      <main className="bg-white mt-6 p-8 rounded-3xl shadow-2xl w-full max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Anh the
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="w-full border border-orange-300 rounded-lg px-3 py-2 text-gray-800 bg-orange-50 cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-orange-400 file:text-white hover:file:bg-orange-500 transition"
            />
            {photo && (
              <div className="mt-3 flex justify-center">
                <Image
                  src={photo}
                  alt="Anh xem truoc"
                  width={120}
                  height={120}
                  className="rounded-lg border border-orange-300 shadow-sm object-cover"
                  unoptimized
                />
              </div>
            )}
          </div>

          {Object.entries({
            name: "Ho va ten",
            dob: "Ngay sinh",
            hometown: "Que quan",
            address: "Dia chi",
            course: "Khoa hoc",
            email: "Email",
            phone: "So dien thoai",
          }).map(([key, label]) => (
            <div key={key}>
              <label className="block mb-1 font-semibold text-gray-700">
                {label}
              </label>
              <input
                type="text"
                name={key}
                value={student[key as keyof typeof student]}
                onChange={handleChange}
                placeholder={`Nhap ${label.toLowerCase()}`}
                className="w-full border border-orange-300 rounded-lg px-3 py-2 text-black font-medium placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                required
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold shadow-md hover:shadow-orange-300 transition-all duration-200"
          >
            Luu thong tin
          </button>
        </form>
      </main>

      <footer className="mt-6 flex gap-4">
        <Link
          href="/login"
          className="bg-orange-100 hover:bg-orange-300 text-orange-700 font-semibold px-6 py-2 rounded-full shadow-sm transition-all duration-200"
        >
          {"<- Quay lai"}
        </Link>

        <Link
          href="/home"
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-full shadow-md transition-all duration-200"
        >
          {"Tiep theo ->"}
        </Link>
      </footer>

      <style jsx>{`
        ::placeholder {
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
