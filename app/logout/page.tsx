"use client";

import React from "react";

const LogoutPage = () => {
  const handleLogout = () => {
    console.log("Anda memilih logout.");
    localStorage.removeItem("token"); // Hapus token
    window.location.href = "/login"; // Redirect ke halaman login
  };

  const handleCancel = () => {
    console.log("Anda membatalkan logout.");
    window.history.back(); // Kembali ke halaman sebelumnya
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 text-center w-full max-w-sm">
        <div className="text-gray-500 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M12 17h.01m-6.938 5h13.856C18.66 21.02 19 20.11 19 19.06V4.94C19 3.89 18.66 3 17.856 3H6.144C5.34 3 5 3.89 5 4.94v14.12c0 1.05.34 1.94 1.062 1.94z"
            />
          </svg>
        </div>
        <p className="text-lg font-semibold mb-4">
          Apakah Anda Yakin Ingin Logout?
        </p>
        <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:justify-center sm:space-x-4">
          <button
            className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={handleLogout}
          >
            Iya
          </button>
          <button
            className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            onClick={handleCancel}
          >
            Tidak
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutPage;
