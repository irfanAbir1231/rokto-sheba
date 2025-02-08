"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar"; // Import the Navbar component

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
    const leftImage = document.getElementById("animated-image");
    const rightImage = document.getElementById("animated-image-right");

    if (leftImage) {
      leftImage.classList.add("-translate-x-full");
      setTimeout(() => {
        leftImage.classList.remove("-translate-x-full");
      }, 100);
    }

    if (rightImage) {
      rightImage.classList.add("translate-x-full");
      setTimeout(() => {
        rightImage.classList.remove("translate-x-full");
      }, 100);
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0D1117] px-4 sm:px-6 lg:px-8">
      {/* Navbar */}
      <Navbar />

      {/* Animated Images - Hidden on mobile */}
      <div
        className="hidden lg:block absolute left-0 top-[4%] transform -translate-x-full transition-transform duration-1000"
        id="animated-image"
      >
        <img src="/Shiny.png" alt="Open" className="w-64 xl:w-96 h-auto object-cover" />
      </div>

      <div
        className="hidden lg:block absolute right-0 top-[26%] transform translate-x-full transition-transform duration-1000"
        id="animated-image-right"
      >
        <img src="/Shiny1.png" alt="Open" className="w-64 xl:w-96 h-auto object-cover" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen py-12">
        <div className="w-full max-w-4xl text-center text-[#F8F9FA]">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Welcome to রক্তসেবা</h1>
          <p className="py-4 sm:py-6 text-sm sm:text-base">
            Find and connect with blood donors nearby. Register now to save lives!
          </p>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 py-4">
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
          <div className="py-6 space-y-6">
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
                    <strong className="text-[#C1272D]">Blood Group:</strong> {donor.bloodGroup}
                  </p>
                  <p className="text-sm sm:text-base">
                    <strong className="text-[#C1272D]">Location:</strong> {donor.location}
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

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stats shadow-lg bg-[#0D1117] text-[#F8F9FA] border border-[#C1272D] rounded-lg mt-6 w-full p-4 sm:p-6">
        <div className="stat text-center">
          <div className="stat-title text-sm sm:text-base">Total Donors</div>
          <div className="stat-value text-2xl sm:text-3xl">5,400</div>
          <div className="stat-desc text-xs sm:text-sm">Active donors in the system</div>
        </div>

        <div className="stat text-center">
          <div className="stat-title text-sm sm:text-base">Total Donations</div>
          <div className="stat-value text-2xl sm:text-3xl">12,800</div>
          <div className="stat-desc text-xs sm:text-sm">Successful blood donations</div>
        </div>

        <div className="stat text-center">
          <div className="stat-title text-sm sm:text-base">Total Requests</div>
          <div className="stat-value text-2xl sm:text-3xl">3,200</div>
          <div className="stat-desc text-xs sm:text-sm">Blood requests made</div>
        </div>
      </div>

      {/* Top Donors Section */}
      <div className="mt-6 p-4 sm:p-6 bg-[#0D1117] border border-[#C1272D] rounded-lg text-[#F8F9FA]">
        <h1 className="text-2xl sm:text-3xl font-bold text-center">Top Donors of Last Month</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4">
          {["John Doe", "Jane Smith", "Alice Johnson"].map((donor, index) => (
            <div
              key={index}
              className="p-4 border border-[#C1272D] rounded-lg text-center hover:scale-105 transition-transform"
            >
              <img
                src="/image1.jpg"
                alt="Top Donor"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-2 border-4 border-[#C1272D]"
              />
              <h3 className="text-lg sm:text-xl font-bold">{donor}</h3>
              <p className="text-xs sm:text-sm">Most Donations This Month</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}