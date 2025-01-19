"use client";

import { useState } from "react";

export default function RecentRequests() {
  const [city, setCity] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [gender, setGender] = useState("");

  interface Request {
    name: string;
    bloodGroup: string;
    location: string;
    phone: string;
    requestDate: string;
  }

  const [requests, setRequests] = useState<Request[]>([]);

  const handleSearch = () => {
    const filteredRequests = [
      {
        name: "Mohammad Abdullah",
        bloodGroup: "A+",
        location: "Dhaka",
        phone: "123-456-7890",
        requestDate: "2023-09-15",
      },
      {
        name: "Farhan Ahmed",
        bloodGroup: "B+",
        location: "Chattogram",
        phone: "987-654-3210",
        requestDate: "2023-08-20",
      },
      {
        name: "Ayesha Khan",
        bloodGroup: "O+",
        location: "Khulna",
        phone: "111-222-3333",
        requestDate: "2023-07-10",
      },
      {
        name: "Rahim Uddin",
        bloodGroup: "AB-",
        location: "Rajshahi",
        phone: "444-555-6666",
        requestDate: "2023-06-05",
      },
      {
        name: "Sara Ali",
        bloodGroup: "A-",
        location: "Dhaka",
        phone: "777-888-9999",
        requestDate: "2023-05-25",
      },
      {
        name: "Imran Hossain",
        bloodGroup: "B-",
        location: "Chattogram",
        phone: "000-111-2222",
        requestDate: "2023-04-15",
      },
      {
        name: "Nadia Islam",
        bloodGroup: "AB+",
        location: "Khulna",
        phone: "333-444-5555",
        requestDate: "2023-03-10",
      },
      {
        name: "Kamrul Hasan",
        bloodGroup: "O-",
        location: "Rajshahi",
        phone: "666-777-8888",
        requestDate: "2023-02-05",
      },
      {
        name: "Fatima Begum",
        bloodGroup: "A+",
        location: "Dhaka",
        phone: "999-000-1111",
        requestDate: "2023-01-25",
      },
      {
        name: "Rafiq Ahmed",
        bloodGroup: "B+",
        location: "Chattogram",
        phone: "222-333-4444",
        requestDate: "2022-12-15",
      },
      {
        name: "Laila Noor",
        bloodGroup: "O+",
        location: "Khulna",
        phone: "555-666-7777",
        requestDate: "2022-11-10",
      },
      {
        name: "Zahid Hossain",
        bloodGroup: "AB-",
        location: "Rajshahi",
        phone: "888-999-0000",
        requestDate: "2022-10-05",
      },
    ];
    setRequests(filteredRequests);
  };

  return (
    <div className="p-10 bg-[#0D1117] min-h-screen">
      <h1 className="text-3xl font-bold mb-5 text-[#F8F9FA]">
        Recent Requests
      </h1>
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
      {/* Request Cards */}
      <div className="py-6 space-y-6">
        {requests.length > 0 ? (
          requests.map((request, index) => (
            <div
              key={index}
              className="flex items-center bg-[#0D1117] shadow-lg rounded-xl p-6 border border-[#C1272D] hover:scale-105"
            >
              <figure className="w-20 h-20">
                <img
                  src="/image1.jpg"
                  alt="Requester"
                  className="rounded-full border-4 border-[#C1272D]"
                />
              </figure>
              <div className="ml-6 flex-1">
                <h2 className="text-2xl font-bold">{request.name}</h2>
                <p>
                  <strong className="text-[#C1272D]">Blood Group:</strong>{" "}
                  {request.bloodGroup}
                </p>
                <p>
                  <strong className="text-[#C1272D]">Location:</strong>{" "}
                  {request.location}
                </p>
                <p>
                  <strong className="text-[#C1272D]">Request Date:</strong>{" "}
                  {request.requestDate}
                </p>
              </div>
              <div className="flex space-x-2">
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
