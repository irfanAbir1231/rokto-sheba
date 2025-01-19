"use client";

import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ name, email, phone, address });
  };

  //   if (!user) {
  //     return <div>Loading...</div>;
  //   }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-4">Profile</h1>
      <div className="bg-[#0D1117] p-6 rounded-lg shadow-lg text-[#F8F9FA]">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded-lg bg-[#1E2228] text-[#F8F9FA]"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded-lg bg-[#1E2228] text-[#F8F9FA]"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Phone:</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 rounded-lg bg-[#1E2228] text-[#F8F9FA]"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Address:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 rounded-lg bg-[#1E2228] text-[#F8F9FA]"
            />
          </div>
          <button
            type="submit"
            className="btn bg-[#C1272D] text-[#F8F9FA] hover:bg-[#8B1E3F] transition duration-300"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
