"use client";

import { useState } from "react";

export default function Donors() {
  const [city, setCity] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [gender, setGender] = useState("");

  interface Donor {
    name: string;
    bloodGroup: string;
    location: string;
    phone: string;
    lastDonationDate: string;
  }

  const [donors, setDonors] = useState<Donor[]>([]);

  const handleSearch = () => {
    const filteredDonors = [
      {
        name: "Mohammad Abdullah",
        bloodGroup: "A+",
        location: "Dhaka",
        phone: "123-456-7890",
        lastDonationDate: "2023-09-15",
      },
      {
        name: "Farhan Ahmed",
        bloodGroup: "B+",
        location: "Chattogram",
        phone: "987-654-3210",
        lastDonationDate: "2023-08-20",
      },
      {
        name: "Ayesha Khan",
        bloodGroup: "O+",
        location: "Khulna",
        phone: "111-222-3333",
        lastDonationDate: "2023-07-10",
      },
      {
        name: "Rahim Uddin",
        bloodGroup: "AB-",
        location: "Rajshahi",
        phone: "444-555-6666",
        lastDonationDate: "2023-06-05",
      },
      {
        name: "Sara Ali",
        bloodGroup: "A-",
        location: "Dhaka",
        phone: "777-888-9999",
        lastDonationDate: "2023-05-25",
      },
      {
        name: "Imran Hossain",
        bloodGroup: "B-",
        location: "Chattogram",
        phone: "000-111-2222",
        lastDonationDate: "2023-04-15",
      },
      {
        name: "Nadia Islam",
        bloodGroup: "AB+",
        location: "Khulna",
        phone: "333-444-5555",
        lastDonationDate: "2023-03-10",
      },
      {
        name: "Kamrul Hasan",
        bloodGroup: "O-",
        location: "Rajshahi",
        phone: "666-777-8888",
        lastDonationDate: "2023-02-05",
      },
      {
        name: "Fatima Begum",
        bloodGroup: "A+",
        location: "Dhaka",
        phone: "999-000-1111",
        lastDonationDate: "2023-01-25",
      },
      {
        name: "Rafiq Ahmed",
        bloodGroup: "B+",
        location: "Chattogram",
        phone: "222-333-4444",
        lastDonationDate: "2022-12-15",
      },
      {
        name: "Laila Noor",
        bloodGroup: "O+",
        location: "Khulna",
        phone: "555-666-7777",
        lastDonationDate: "2022-11-10",
      },
      {
        name: "Zahid Hossain",
        bloodGroup: "AB-",
        location: "Rajshahi",
        phone: "888-999-0000",
        lastDonationDate: "2022-10-05",
      },
    ];
    setDonors(filteredDonors);
  };

  return (
    <div className="p-10 bg-[#0D1117] min-h-screen">
      <h1 className="text-3xl font-bold mb-5 text-[#F8F9FA]">Find Donors</h1>
      <div className="form-control">
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

          <select
            className="select select-bordered w-full max-w-xs bg-[#0D1117] text-[#F8F9FA] border-[#C1272D]"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option disabled value="">
              Gender
            </option>
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
      {/* Donor Cards */}
      <div className="py-6 space-y-6">
        {donors.length > 0 ? (
          donors.map((donor, index) => (
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
                <p>
                  <strong className="text-[#C1272D]">
                    Last Donation Date:
                  </strong>{" "}
                  {donor.lastDonationDate}
                </p>
              </div>
              <div className="flex space-x-2">
                <a
                  href={`sms:${donor.phone}`}
                  className="btn bg-[#C1272D] text-[#F8F9FA] hover:bg-[#8B1E3F] flex items-center"
                >
                  Message
                </a>
                <a
                  href={`tel:${donor.phone}`}
                  className="btn bg-[#C1272D] text-[#F8F9FA] hover:bg-[#8B1E3F] flex items-center"
                >
                  Call
                </a>
              </div>
            </div>
          ))
        ) : (
          <p className="text-[#F8F9FA]">No donors found yet!</p>
        )}
      </div>
    </div>
  );
}
