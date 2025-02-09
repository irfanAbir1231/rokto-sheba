"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";

export default function Home() {
  const [city, setCity] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");

  interface Donor {
    name: string;
    bloodGroup: string;
    location: string;
    phone: string;
  }

  const [donors, setDonors] = useState<Donor[]>([]);

  const handleSearch = () => {
    const filteredDonors = [
      {
        name: "Mohammad Abdullah",
        bloodGroup: "A+",
        location: "Dhaka",
        phone: "123-456-7890",
      },
      {
        name: "Farhan Ahmed",
        bloodGroup: "B+",
        location: "Chattogram",
        phone: "987-654-3210",
      },
    ];
    setDonors(filteredDonors);
  };

  return (
    <>
      <Navbar />
      <main className="mt-16 min-h-screen bg-[#0D1117]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto text-center text-[#F8F9FA]">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Welcome to রক্তসেবা
            </h1>
            <p className="text-sm sm:text-base mb-8">
              Find and connect with blood donors nearby. Register now to save lives!
            </p>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-8">
              <select
                className="select select-bordered w-full sm:w-48 bg-[#0D1117] text-[#F8F9FA] border-[#C1272D]"
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
                className="select select-bordered w-full sm:w-48 bg-[#0D1117] text-[#F8F9FA] border-[#C1272D]"
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

              <button
                className="btn w-full sm:w-auto bg-[#C1272D] text-[#F8F9FA] hover:bg-[#8B1E3F]"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>

            {/* Donor List */}
            <div className="space-y-6">
              {donors.map((donor, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-center bg-[#0D1117] shadow-lg rounded-xl p-4 sm:p-6 border border-[#C1272D] hover:scale-105 transition-transform"
                >
                  <figure className="w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-0">
                    <img
                      src="/image1.jpg"
                      alt="Donor"
                      className="rounded-full border-4 border-[#C1272D]"
                    />
                  </figure>
                  <div className="sm:ml-6 flex-1 text-center sm:text-left">
                    <h2 className="text-xl sm:text-2xl font-bold">{donor.name}</h2>
                    <p className="text-sm sm:text-base">
                      <strong className="text-[#C1272D]">Blood Group:</strong>{" "}
                      <span className="text-[#F8F9FA]">{donor.bloodGroup}</span>
                    </p>
                    <p className="text-sm sm:text-base">
                      <strong className="text-[#C1272D]">Location:</strong>{" "}
                      <span className="text-[#F8F9FA]">{donor.location}</span>
                    </p>
                  </div>
                  <a
                    href={`tel:${donor.phone}`}
                    className="btn mt-4 sm:mt-0 bg-[#C1272D] text-[#F8F9FA] hover:bg-[#8B1E3F] flex items-center"
                  >
                    Call
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}