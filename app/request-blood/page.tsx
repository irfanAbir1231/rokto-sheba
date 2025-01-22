// RequestBlood.tsx
"use client";

import { useState } from "react";

export default function RequestBlood() {
  const [name, setName] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = () => {
    alert("Blood request submitted!");
  };

  return (
    <div className="hero min-h-screen bg-[#0D1117]">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold text-[#F8F9FA]">Request for Blood</h1>
          <p className="py-6 text-[#F8F9FA]">Fill out the form below to request blood.</p>
          <div className="form-control w-full max-w-sm">
            <label className="label"><span className="label-text text-[#F8F9FA]">Name</span></label>
            <input
              type="text"
              placeholder="Name"
              className="input input-bordered w-full bg-[#0D1117] text-[#F8F9FA] border-[#C1272D]"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label className="label"><span className="label-text text-[#F8F9FA]">Blood Group</span></label>
            <input
              type="text"
              placeholder="Blood Group"
              className="input input-bordered w-full bg-[#0D1117] text-[#F8F9FA] border-[#C1272D]"
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
            />
            <label className="label"><span className="label-text text-[#F8F9FA]">Location</span></label>
            <input
              type="text"
              placeholder="Location"
              className="input input-bordered w-full bg-[#0D1117] text-[#F8F9FA] border-[#C1272D]"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <label className="label"><span className="label-text text-[#F8F9FA]">Phone</span></label>
            <input
              type="text"
              placeholder="Phone"
              className="input input-bordered w-full bg-[#0D1117] text-[#F8F9FA] border-[#C1272D]"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button
              className="btn bg-[#C1272D] text-[#F8F9FA] hover:bg-[#8B1E3F] transition duration-300 mt-4"
              onClick={handleSubmit}
            >
              Submit Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
