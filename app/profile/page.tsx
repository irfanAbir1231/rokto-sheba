"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";

const Profile = () => {
  const { user, isLoaded } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.primaryEmailAddress || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      firstName,
      lastName,
      email,
      phone,
      address,
    };

    try {
      const response = await fetch("/api/profile-update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Profile updated successfully");
      } else {
        console.error("Error updating profile");
      }
    } catch (error) {
      console.error("Error occurred while updating profile:", error);
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-4">Profile</h1>
      <div className="bg-[#0D1117] p-6 rounded-lg shadow-lg text-[#F8F9FA]">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">First Name:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-2 rounded-lg bg-[#1E2228] text-[#F8F9FA]"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Last Name:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-2 rounded-lg bg-[#1E2228] text-[#F8F9FA]"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Email:</label>
            <input
              type="email"
              value={email ? String(email) : ""}
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
