"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/navigation"; // Import useRouter

const Profile = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter(); // Initialize useRouter
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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

  useEffect(() => {
    // Fetch profile data from the server
    const fetchProfileData = async () => {
      if (!user || !user.id) {
        console.error("User ID is not available");
        return;
      }

      try {
        const response = await fetch(`/api/profile?clerkID=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          if (!data.isUpdated) {
            router.push("/profile-update"); // Redirect to profile update page if info is not saved
            return;
          }
          setFirstName(data.firstName);
          setLastName(data.lastName);
          setPhone(data.phone);
          setBloodGroup(data.bloodGroup);
          setDob(new Date(data.dob).toISOString().split("T")[0]); // Format date
          setAddress(data.address);
        } else {
          console.error("Error fetching profile data:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, [user]);

  if (!isLoaded) return null;

  const handleUpdateClick = () => {
    router.push("/profile-update"); // Redirect to profile update page
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-4">Profile</h1>
      <div className="bg-[#0D1117] p-6 rounded-lg shadow-lg text-[#F8F9FA]">
        <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
        <p><strong>First Name:</strong> {firstName}</p>
        <p><strong>Last Name:</strong> {lastName}</p>
        <p><strong>Phone:</strong> {phone}</p>
        <p><strong>Blood Group:</strong> {bloodGroup}</p>
        <p><strong>Date of Birth:</strong> {dob}</p>
        <p><strong>Address:</strong> {address.name}</p>
        <button
          onClick={handleUpdateClick}
          className="btn bg-[#C1272D] text-[#F8F9FA] hover:bg-[#8B1E3F] transition duration-300 mt-4"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default Profile;
