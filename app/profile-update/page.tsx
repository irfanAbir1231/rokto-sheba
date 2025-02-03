"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { isValidPhoneNumber } from "@/lib/utils/validator";
import { useRouter } from "next/navigation"; // Updated import

const Profile = () => {
  const { user, isLoaded } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [phone, setPhone] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState({
    name: "",
    location: {
      type: "Point",
      coordinates: [0, 0], // Default coordinates
    },
  });
  const [isUpdated, setIsUpdated] = useState(false); 
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  interface Suggestion {
    id: string;
    address: string;
    longitude: number;
    latitude: number;
  }
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const isFormValid =
    firstName && lastName && phone && bloodGroup && dob && address.name;

  // Fetch user profile data from the database
  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profile?clerkID=${user.id}`);
        const data = await response.json();

        if (data && response.ok && data.isUpdated) {
          const formattedDob = new Date(data.dob).toISOString().split("T")[0];
          setFirstName(data.firstName);
          setLastName(data.lastName);
          setPhone(data.phone);
          setBloodGroup(data.bloodGroup);
          setDob(formattedDob);
          setAddress(data.address);
          setIsUpdated(true);
        } else {
          console.log("User profile not registered in database yet");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };

    fetchProfile();
  }, [isLoaded, user]);

  // Function to fetch autocomplete suggestions from BariKoi
  const fetchSuggestions = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://barikoi.xyz/v1/api/search/autocomplete/${process.env.NEXT_PUBLIC_BARIKOI_API_KEY}/place?q=${query}`
      );
      const data = await response.json();
      setSuggestions(data.places || []);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
    }
  };

  // Handle address input change
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress((prevAddress) => ({
      ...prevAddress,
      name: value,
    }));
    fetchSuggestions(value);
  };

  // Handle address selection from suggestions
  const handleSuggestionClick = (suggestion: any) => {
    setAddress({
      name: suggestion.address,
      location: {
        type: "Point",
        coordinates: [suggestion.longitude, suggestion.latitude],
      },
    });
    setSuggestions([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, reportType: string) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle file upload logic here
      console.log(`File selected for ${reportType}:`, file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPhoneNumber(phone)) {
      alert("Phone number must be 11 digits and start with '01'.");
      return;
    }
    const formData = { firstName, lastName, phone, bloodGroup, dob, address };
    try {
      const response = await fetch("/api/profile-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log("Profile updated successfully");
        router.push("/profile"); // Redirect to /profile after saving
      } else {
        console.error("Error updating profile");
      }
    } catch (error) {
      console.error("Error occurred while updating profile:", error);
    }
  };

  if (!isLoaded || isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-4">Profile</h1>
      <div className="bg-[#0D1117] p-4 sm:p-6 rounded-lg shadow-lg text-[#F8F9FA]">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium">First Name:</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2 rounded-lg bg-[#1E2228] text-[#F8F9FA]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Last Name:</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2 rounded-lg bg-[#1E2228] text-[#F8F9FA]"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium">Phone:</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 rounded-lg bg-[#1E2228] text-[#F8F9FA]"
              />
              {!isValidPhoneNumber(phone) && phone.length > 0 && (
                <p className="text-red-500 text-sm mt-1">
                  Phone number must start with &apos;01&apos; and contain 11
                  digits.
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Blood Group:</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full p-2 rounded-lg bg-[#1E2228] text-[#F8F9FA]"
              >
                <option value="" disabled>
                  Select Blood Group
                </option>
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
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Date of Birth:</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full p-2 rounded-lg bg-[#1E2228] text-[#F8F9FA]"
            />
          </div>
          <div className="mb-4 relative">
            <label className="block text-sm font-medium">Address:</label>
            <input
              type="text"
              value={address.name}
              onChange={handleAddressChange}
              className="w-full p-2 rounded-lg bg-[#1E2228] text-[#F8F9FA]"
            />
            {suggestions.length > 0 && (
              <ul className="absolute z-10 bg-[#1E2228] text-[#F8F9FA] rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto w-full">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.id}
                    className="p-2 hover:bg-[#0D1117] cursor-pointer"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.address}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mb-4">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">HBsAg Report</span>
                <span className="label-text-alt">Upload your HBsAg report</span>
              </div>
              <input
                type="file"
                className="file-input file-input-bordered w-full max-w-xs"
                onChange={(e) => handleFileChange(e, "HBsAg")}
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">VDRL Report</span>
                <span className="label-text-alt">Upload your VDRL report</span>
              </div>
              <input
                type="file"
                className="file-input file-input-bordered w-full max-w-xs"
                onChange={(e) => handleFileChange(e, "VDRL")}
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Anti HCV Report</span>
                <span className="label-text-alt">Upload your Anti HCV report</span>
              </div>
              <input
                type="file"
                className="file-input file-input-bordered w-full max-w-xs"
                onChange={(e) => handleFileChange(e, "Anti HCV")}
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">CBC Report</span>
                <span className="label-text-alt">Upload your CBC report</span>
              </div>
              <input
                type="file"
                className="file-input file-input-bordered w-full max-w-xs"
                onChange={(e) => handleFileChange(e, "CBC")}
              />
            </label>
          </div>
          <button
            type="submit"
            className="btn bg-[#C1272D] text-[#F8F9FA] hover:bg-[#8B1E3F] transition duration-300 w-full md:w-auto"
            disabled={!isFormValid}
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
