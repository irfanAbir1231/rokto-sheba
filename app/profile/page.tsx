"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

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
  const [profileUpdated, setProfileUpdated] = useState(false);

  useEffect(() => {
    // Fetch profile data from the server or local storage
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`/api/profile?userId=${user?.id}`);
        if (response.ok) {
          const data = await response.json();
          setFirstName(data.firstName);
          setLastName(data.lastName);
          setPhone(data.phone);
          setBloodGroup(data.bloodGroup);
          setDob(data.dob);
          setAddress(data.address);
          setProfileUpdated(true);
        } else {
          console.error("Error fetching profile data:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    if (user?.id) {
      fetchProfileData();
    }
  }, [user?.id]); // Refetch profile data when user ID changes

  interface Suggestion {
    id: string;
    address: string;
    longitude: number;
    latitude: number;
  }

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = { firstName, lastName, phone, bloodGroup, dob, address };
    try {
      const response = await fetch("/api/profile-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log("Profile updated successfully");
        setProfileUpdated(true);
        localStorage.setItem("profileUpdated", "true");
      } else {
        console.error("Error updating profile");
      }
    } catch (error) {
      console.error("Error occurred while updating profile:", error);
    }
  };

  useEffect(() => {
    const profileUpdated = localStorage.getItem("profileUpdated") === "true";
    setProfileUpdated(profileUpdated);
  }, []);

  const isFormValid = firstName && lastName && phone && bloodGroup && dob && address.name;

  if (!isLoaded) return null;
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-4">Profile</h1>
      <div className="bg-[#0D1117] p-6 rounded-lg shadow-lg text-[#F8F9FA]">
        {profileUpdated ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
            <p><strong>First Name:</strong> {firstName}</p>
            <p><strong>Last Name:</strong> {lastName}</p>
            <p><strong>Phone:</strong> {phone}</p>
            <p><strong>Blood Group:</strong> {bloodGroup}</p>
            <p><strong>Date of Birth:</strong> {dob}</p>
            <p><strong>Address:</strong> {address.name}</p>
            <button
              className="btn bg-[#C1272D] text-[#F8F9FA] hover:bg-[#8B1E3F] mt-4"
              onClick={() => setProfileUpdated(false)}
            >
              Update Profile
            </button>
          </div>
        ) : (
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
            <button
              type="submit"
              className="btn bg-[#C1272D] text-[#F8F9FA] hover:bg-[#8B1E3F] transition duration-300"
              disabled={!isFormValid}
            >
              Save
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
