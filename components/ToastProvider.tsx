"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastProvider() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      style={{
        backgroundColor: "#B91C1C", // Dark red background
        color: "#FFFFFF", // White text
        border: "1px solid #991B1B", // Slightly darker red border
      }}
    />
  );
}
