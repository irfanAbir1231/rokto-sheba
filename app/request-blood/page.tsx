"use client";

import { useState } from "react";

export default function RequestBlood() {
  const [name, setName] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [bloodBags, setBloodBags] = useState("");
  const [neededDate, setNeededDate] = useState("");
  const [patientImage, setPatientImage] = useState<File | null>(null);
  const [comments, setComments] = useState("");

  const handleSubmit = () => {
    alert("Blood request submitted!");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPatientImage(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-24"> {/* Added pt-24 for padding-top */}
      <div className="max-w-4xl w-full bg-[#161B22] p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-[#F8F9FA] text-center mb-8">Request for Blood</h1>
        <p className="text-lg text-[#F8F9FA] text-center mb-8">Fill out the form below to request blood.</p>
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#F8F9FA] mb-2">Name</label>
              <input
                type="text"
                placeholder="Name"
                className="w-full p-3 bg-[#0D1117] text-[#F8F9FA] border border-[#C1272D] rounded-lg focus:border-[#8B1E3F] focus:ring-[#8B1E3F]"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#F8F9FA] mb-2">Blood Group</label>
              <select
                className="w-full p-3 bg-[#0D1117] text-[#F8F9FA] border border-[#C1272D] rounded-lg focus:border-[#8B1E3F] focus:ring-[#8B1E3F]"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                required
              >
                <option value="" disabled>Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#F8F9FA] mb-2">Location</label>
              <input
                type="text"
                placeholder="Location"
                className="w-full p-3 bg-[#0D1117] text-[#F8F9FA] border border-[#C1272D] rounded-lg focus:border-[#8B1E3F] focus:ring-[#8B1E3F]"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#F8F9FA] mb-2">Phone</label>
              <input
                type="text"
                placeholder="Phone"
                className="w-full p-3 bg-[#0D1117] text-[#F8F9FA] border border-[#C1272D] rounded-lg focus:border-[#8B1E3F] focus:ring-[#8B1E3F]"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#F8F9FA] mb-2">Number of Blood Bags</label>
              <input
                type="number"
                placeholder="Number of Blood Bags"
                className="w-full p-3 bg-[#0D1117] text-[#F8F9FA] border border-[#C1272D] rounded-lg focus:border-[#8B1E3F] focus:ring-[#8B1E3F]"
                value={bloodBags}
                onChange={(e) => setBloodBags(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#F8F9FA] mb-2">Date Needed</label>
              <input
                type="date"
                className="w-full p-3 bg-[#0D1117] text-[#F8F9FA] border border-[#C1272D] rounded-lg focus:border-[#8B1E3F] focus:ring-[#8B1E3F]"
                value={neededDate}
                onChange={(e) => setNeededDate(e.target.value)}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-[#F8F9FA] mb-2">Upload Patient Image</label>
              <input
                type="file"
                className="w-full p-3 bg-[#0D1117] text-[#F8F9FA] border border-[#C1272D] rounded-lg focus:border-[#8B1E3F] focus:ring-[#8B1E3F]"
                onChange={handleImageChange}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-[#F8F9FA] mb-2">Additional Comments</label>
              <textarea
                placeholder="Additional Comments"
                className="w-full p-3 bg-[#0D1117] text-[#F8F9FA] border border-[#C1272D] rounded-lg focus:border-[#8B1E3F] focus:ring-[#8B1E3F]"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full p-3 bg-[#C1272D] text-[#F8F9FA] font-semibold rounded-lg hover:bg-[#8B1E3F] transition duration-300"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}