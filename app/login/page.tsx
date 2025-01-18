"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const router = useRouter();
  const { setIsLoggedIn } = useAuth();
  const [email, setEmail] = useState("sample@example.com");
  const [password, setPassword] = useState("password123");

  const handleLogin = () => {
    if (email === "sample@example.com" && password === "password123") {
      setIsLoggedIn(true);
      router.push("/");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="hero min-h-screen bg-[#0D1117]">
      <div className="hero-content flex-col">
        <h1 className="text-3xl font-bold text-[#F8F9FA]">Login</h1>
        <div className="form-control w-full max-w-sm">
          <label className="label">
            <span className="label-text text-[#F8F9FA]">Email</span>
          </label>
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full bg-[#2A2D34] text-[#F8F9FA] border-[#8B1E3F]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="label">
            <span className="label-text text-[#F8F9FA]">Password</span>
          </label>
          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full bg-[#2A2D34] text-[#F8F9FA] border-[#8B1E3F]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn bg-[#C1272D] text-[#F8F9FA] mt-4" onClick={handleLogin}>
            Login
          </button>
          <Link href="/register">
            <button className="btn bg-[#8B1E3F] text-[#F8F9FA] mt-4">Register</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
