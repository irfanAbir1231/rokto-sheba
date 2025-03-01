"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Donors() {
  const [city, setCity] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [donors, setDonors] = useState<Donor[]>([]);

  interface Donor {
    gender: string;
    name: string;
    bloodGroup: string;
    location: string;
    phone: string;
    lastDonationDate: string;
  }

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      const filteredDonors = donors.filter(
        (donor) =>
          donor.location === city && donor.bloodGroup === bloodGroup && donor.gender === gender
      );
      setDonors(filteredDonors);
      setLoading(false);
    }, 1000);
  };

  const clearFilters = () => {
    setCity("");
    setBloodGroup("");
    setGender("");
    setDonors([]);
  };

  return (
    <main className="mt-16 p-4 sm:p-10 bg-[#0D1117] min-h-screen">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-[#F8F9FA]">Find Donors</h1>
        <div className="flex flex-wrap gap-4 justify-center py-4">
          <select
            className="select w-full max-w-xs bg-[#0D1117] text-[#F8F9FA] border-[#C1272D]"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option disabled value="">City</option>
            <option>Dhaka</option>
            <option>Chattogram</option>
            <option>Khulna</option>
            <option>Rajshahi</option>
          </select>

          <select
            className="select w-full max-w-xs bg-[#0D1117] text-[#F8F9FA] border-[#C1272D]"
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
          >
            <option disabled value="">Blood Group</option>
            <option>A+</option>
            <option>A-</option>
            <option>O+</option>
            <option>O-</option>
            <option>B+</option>
            <option>B-</option>
            <option>AB+</option>
            <option>AB-</option>
          </select>

          <select
            className="select w-full max-w-xs bg-[#0D1117] text-[#F8F9FA] border-[#C1272D]"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option disabled value="">Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <motion.button
            className="btn bg-[#C1272D] text-[#F8F9FA] hover:bg-[#8B1E3F] px-6"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSearch}
          >
            Search
          </motion.button>

          <button
            className="btn bg-gray-700 text-white px-6"
            onClick={clearFilters}
          >
            Clear
          </button>
        </div>

        <div className="py-6 space-y-6">
          {loading ? (
            <p className="text-[#F8F9FA]">Loading donors...</p>
          ) : donors.length > 0 ? (
            donors.map((donor, index) => (
              <motion.div
                key={index}
                className="flex flex-col md:flex-row items-center bg-[#161B22] shadow-lg rounded-xl p-6 border border-[#C1272D] hover:scale-105"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="public/image1.jpg"
                  alt="Donor"
                  width={80}
                  height={80}
                  className="rounded-full border-4 border-[#C1272D]"
                />
                <div className="ml-6 text-left">
                  <h2 className="text-2xl font-bold text-[#F8F9FA]">{donor.name}</h2>
                  <p><strong className="text-[#C1272D]">Blood Group:</strong> {donor.bloodGroup}</p>
                  <p><strong className="text-[#C1272D]">Location:</strong> {donor.location}</p>
                  <p><strong className="text-[#C1272D]">Last Donation Date:</strong> {donor.lastDonationDate}</p>
                </div>
                <div className="flex space-x-2 mt-4 md:mt-0">
                  <a href={`sms:${donor.phone}`} className="btn bg-[#C1272D] text-[#F8F9FA]">Message</a>
                  <a href={`tel:${donor.phone}`} className="btn bg-[#C1272D] text-[#F8F9FA]">Call</a>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center text-[#F8F9FA]">
              <Image src="/no-results.png" alt="No donors found" width={200} height={200} />
              <p>No donors found. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
