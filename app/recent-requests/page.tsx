// RecentRequests.tsx
"use client";

import { useState } from "react";

export default function RecentRequests() {
  const [city, setCity] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [gender, setGender] = useState("");

  interface Request {
    gender: string;
    name: string;
    bloodGroup: string;
    location: string;
    phone: string;
    requestDate: string;
  }

  const [requests, setRequests] = useState<Request[]>([
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
  ]);

  const handleSearch = () => {
    const filteredRequests = requests.filter(request => request.location === city && request.bloodGroup === bloodGroup && request.gender === gender);
    setRequests(filteredRequests);
  };

  return (
    <div className="p-10 bg-[#0D1117] min-h-screen">
      <h1 className="text-3xl font-bold mb-5 text-[#F8F9FA]">Recent Requests</h1>
      <div className="form-control">
        <div className="flex flex-wrap justify-center gap-4 py-4">
          <select
            className="select select-bordered w-full max-w-xs bg-[#0D1117] text-[#F8F9FA] border-[#C1272D]"
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
            className="select select-bordered w-full max-w-xs bg-[#0D1117] text-[#F8F9FA] border-[#C1272D]"
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
            className="select select-bordered w-full max-w-xs bg-[#0D1117] text-[#F8F9FA] border-[#C1272D]"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option disabled value="">Gender</option>
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
        </div>
      </div>
      {/* Request Cards */}
      <div className="py-6 space-y-6">
        {requests.length > 0 ? (
          requests.map((request, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-center bg-[#0D1117] shadow-lg rounded-xl p-6 border border-[#C1272D] hover:scale-105"
            >
              <figure className="w-20 h-20">
                <img
                  src="/image1.jpg"
                  alt="Requester"
                  className="rounded-full border-4 border-[#C1272D]"
                />
              </figure>
              <div className="ml-0 md:ml-6 mt-4 md:mt-0 flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold">{request.name}</h2>
                <p><strong className="text-[#C1272D]">Blood Group:</strong> {request.bloodGroup}</p>
                <p><strong className="text-[#C1272D]">Location:</strong> {request.location}</p>
                <p><strong className="text-[#C1272D]">Request Date:</strong> {request.requestDate}</p>
              </div>
              <div className="flex space-x-2 mt-4 md:mt-0">
                <a
                  href={`sms:${request.phone}`}
                  className="btn bg-[#C1272D] text-[#F8F9FA] hover:bg-[#8B1E3F] flex items-center"
                >
                  Message
                </a>
                <a
                  href={`tel:${request.phone}`}
                  className="btn bg-[#C1272D] text-[#F8F9FA] hover:bg-[#8B1E3F] flex items-center"
                >
                  Call
                </a>
              </div>
            </div>
          ))
        ) : (
          <p className="text-[#F8F9FA]">No requests found yet!</p>
        )}
      </div>
    </div>
  );
}
