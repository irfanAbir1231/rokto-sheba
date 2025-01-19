"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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

  useEffect(() => {
    const image = document.getElementById("animated-image");
    if (image) {
      image.style.transform = "translateX(0)";
    }
  }, []);

  useEffect(() => {
    const image = document.getElementById("animated-image-right");
    if (image) {
      image.style.transform = "translateX(0)";
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0D1117]">
      {/* Animated Image */}
      <div
        className="absolute left-0 top-[8%] transform -translate-x-full transition-transform duration-1000"
        id="animated-image"
      >
        <img src="/Shiny.png" alt="Open" className="w-96 h-auto object-cover" />
      </div>

      <div
        className="absolute right-0 top-[40%]  transform translate-x-full transition-transform duration-1000"
        id="animated-image-right"
      >
        <img
          src="/Shiny1.png"
          alt="Open"
          className="w-96 h-auto object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="max-w-md text-center text-[#F8F9FA]">
          <div className="flex items-center justify-center space-x-4">
            {/* <img
              src="/Open.png"
              alt="Open"
              className="w-1/4 h-auto object-cover"
            /> */}
            <h1 className="text-5xl font-bold">
              Welcome to Blood Donation App
            </h1>
          </div>
          <p className="py-6">
            Find and connect with blood donors nearby. Register now to save
            lives!
          </p>

          {/* City & Blood Group Selection */}
          <div className="flex justify-center space-x-4 py-4">
            <select
              className="select select-bordered w-full max-w-xs bg-[#0D1117] text-[#F8F9FA] border-[#C1272D]"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option disabled value="">
                City
              </option>
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
              <option disabled value="">
                Blood Group
              </option>
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
              className="btn bg-[#C1272D] text-[#F8F9FA] hover:bg-[#8B1E3F]"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>

          {/* Donor Cards */}
          <div className="py-6 space-y-6">
            {donors.map((donor, index) => (
              <div
                key={index}
                className="flex items-center bg-[#0D1117] shadow-lg rounded-xl p-6 border border-[#C1272D] hover:scale-105"
              >
                <figure className="w-20 h-20">
                  <img
                    src="/image1.jpg"
                    alt="Donor"
                    className="rounded-full border-4 border-[#C1272D]"
                  />
                </figure>
                <div className="ml-6 flex-1">
                  <h2 className="text-2xl font-bold">{donor.name}</h2>
                  <p>
                    <strong className="text-[#C1272D]">Blood Group:</strong>{" "}
                    {donor.bloodGroup}
                  </p>
                  <p>
                    <strong className="text-[#C1272D]">Location:</strong>{" "}
                    {donor.location}
                  </p>
                </div>
                <a
                  href={`tel:${donor.phone}`}
                  className="btn bg-[#C1272D] text-[#F8F9FA] hover:bg-[#8B1E3F] flex items-center"
                >
                  Call
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* 🔥 Statistics Section */}
      <div className="stats shadow-lg bg-[#0D1117] text-[#F8F9FA] border border-[#C1272D] rounded-lg mt-6 w-full p-6">
        <div className="stat">
          <div className="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-8 w-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Total Donors</div>
          <div className="stat-value">5,400</div>
          <div className="stat-desc">Active donors in the system</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-8 w-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Total Donations</div>
          <div className="stat-value">12,800</div>
          <div className="stat-desc">Successful blood donations</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-8 w-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Total Requests</div>
          <div className="stat-value">3,200</div>
          <div className="stat-desc">Blood requests made</div>
        </div>
      </div>
      {/* Top Donors Section */}
      <div className="mt-6 p-6 bg-[#0D1117] border border-[#C1272D] rounded-lg text-[#F8F9FA]">
        <h1 className="text-3xl font-bold text-center">
          Top Donors of Last Month
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {["John Doe", "Jane Smith", "Alice Johnson"].map((donor, index) => (
            <div
              key={index}
              className="p-4 border border-[#C1272D] rounded-lg text-center"
            >
              <img
                src="/image1.jpg"
                alt="Top Donor"
                className="w-24 h-24 rounded-full mx-auto mb-2 border-4 border-[#C1272D]"
              />
              <h3 className="text-xl font-bold">{donor}</h3>
              <p className="text-sm">Most Donations This Month</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
