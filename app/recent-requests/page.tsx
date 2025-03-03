"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function RecentRequests() {
  const [city, setCity] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(true);

  interface Request {
    gender: string;
    name: string;
    bloodGroup: string;
    location: string;
    phone: string;
    requestDate: string;
  }

  const [requests, setRequests] = useState<Request[]>([]);
  const allRequests: Request[] = [
    {
      gender: "Male",
      name: "Michael Johnson",
      bloodGroup: "B+",
      location: "Dhaka",
      phone: "123456789",
      requestDate: "2023-03-10",
    },
    {
      gender: "Female",
      name: "Emily Davis",
      bloodGroup: "A-",
      location: "Chattogram",
      phone: "987654321",
      requestDate: "2023-04-05",
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setRequests(allRequests);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      const filteredRequests = allRequests.filter(
        (request) =>
          (city ? request.location === city : true) &&
          (bloodGroup ? request.bloodGroup === bloodGroup : true) &&
          (gender ? request.gender === gender : true)
      );
      setRequests(filteredRequests);
      setLoading(false);
    }, 500);
  };

  return (
    <main className="mt-16 p-4 sm:p-10 bg-[#0D1117] min-h-screen">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-[#F8F9FA]">Recent Requests</h1>
        
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 py-4">
          <select
            className="select select-bordered w-full max-w-xs bg-[#0D1117] text-[#F8F9FA] border-[#C1272D]"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">City</option>
            <option>Dhaka</option>
            <option>Chattogram</option>
            <option>Khulna</option>
            <option>Rajshahi</option>
          </select>

          <select
            className="select select-bordered w-full max-w-xs bg-[#0D1117] text-[#F8F9FA] border-[#C1272D]"
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
          >
            <option value="">Blood Group</option>
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
            className="select select-bordered w-full max-w-xs bg-[#0D1117] text-[#F8F9FA] border-[#C1272D]"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <button
            className="btn bg-[#C1272D] text-[#F8F9FA] hover:bg-[#8B1E3F]"
            onClick={handleSearch}
          >
            Search
          </button>
          <button
            className="btn bg-gray-600 text-[#F8F9FA] hover:bg-gray-500"
            onClick={() => {
              setCity("");
              setBloodGroup("");
              setGender("");
              setRequests(allRequests);
            }}
          >
            Clear Filters
          </button>
        </div>

        {/* Request Cards */}
        <div className="py-6 space-y-6">
          {loading ? (
            <p className="text-[#F8F9FA] text-center">Loading requests...</p>
          ) : requests.length > 0 ? (
            requests.map((request, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col md:flex-row items-center bg-[#0D1117] shadow-lg rounded-xl p-4 sm:p-6 border border-[#C1272D] hover:scale-105"
              >
                <figure className="w-20 h-20">
                  <img
                    src="/image1.jpg"
                    alt="Requester"
                    className="rounded-full border-4 border-[#C1272D]"
                  />
                </figure>
                <div className="ml-0 md:ml-6 mt-4 md:mt-0 flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-[#F8F9FA]">{request.name}</h2>
                  <p><strong className="text-[#C1272D]">Blood Group:</strong> {request.bloodGroup}</p>
                  <p><strong className="text-[#C1272D]">Location:</strong> {request.location}</p>
                  <p><strong className="text-[#C1272D]">Request Date:</strong> {request.requestDate}</p>
                </div>
                <div className="flex space-x-2 mt-4 md:mt-0">
                  <a href={`sms:${request.phone}`} className="btn bg-[#C1272D] text-[#F8F9FA] hover:bg-[#8B1E3F]">Message</a>
                  <a href={`tel:${request.phone}`} className="btn bg-[#C1272D] text-[#F8F9FA] hover:bg-[#8B1E3F]">Call</a>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-[#F8F9FA] text-center">No requests found!</p>
          )}
        </div>
      </div>
    </main>
  );
}