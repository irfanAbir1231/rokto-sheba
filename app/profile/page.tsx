"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";

const Profile = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  // Personal Info States
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [dob, setDob] = useState("");
  const [nid, setNid] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Address State
  const [address, setAddress] = useState({
    name: "",
    location: {
      type: "Point",
      coordinates: [0, 0],
    },
  });

  // Separate States for Reports
  const [hbsAg, setHbsAg] = useState("");
  const [vdrl, setVdrl] = useState("");
  const [antiHcv, setAntiHcv] = useState("");
  const [cbc, setCbc] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      // Ensure user is loaded and user.id is available
      if (!isLoaded || !user?.id) {
        console.error("User ID is not available or user is not loaded");
        return;
      }

      try {
        const response = await fetch(`/api/profile?clerkID=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          if (!data.isUpdated) {
            router.push("/profile-update");
            return;
          }

          // Set personal details
          setFirstName(data.firstName);
          setLastName(data.lastName);
          setPhone(data.phone);
          setBloodGroup(data.bloodGroup);
          setDob(new Date(data.dob).toISOString().split("T")[0]);
          setNid(data.nidNumber);
          setImageUrl(data.imageURL);
          setAddress(data.address);

          // Set individual report states
          setHbsAg(data.hbsAgReport || "");
          setVdrl(data.vdrlReport || "");
          setAntiHcv(data.antiHcvReport || "");
          setCbc(data.cbcReport || "");
        } else {
          console.error("Error fetching profile data:", response.status);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    if (isLoaded && user?.id) {
      fetchProfileData();
    }
  }, [user, isLoaded, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D1117]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C1272D]"></div>
      </div>
    );
  }

  const handleUpdateClick = () => {
    router.push("/profile-update");
  };

  return (
    <main className="mt-16 min-h-screen bg-[#0D1117]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-[#F8F9FA]">
            Profile Information
          </h1>

          <div className="space-y-6">
            {/* Personal Information Section */}
            <section className="bg-[#161B22] rounded-lg border border-[#30363D] overflow-hidden">
              <div className="border-b border-[#30363D] bg-[#21262D] px-6 py-4">
                <h2 className="text-xl font-semibold text-[#F8F9FA]">
                  Personal Details
                </h2>
              </div>
              <div className="px-6 py-6">
                <div className="flex justify-center mb-6">
                  <img
                    src={imageUrl || "/default-avatar.png"}
                    alt="User Avatar"
                    className="w-24 h-24 rounded-full border-4 border-gray-300"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-400">
                        Full Name
                      </label>
                      <p className="text-lg text-[#F8F9FA] font-semibold">
                        {firstName} {lastName}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-400">
                        Phone Number
                      </label>
                      <p className="text-lg text-[#F8F9FA] font-semibold">
                        {phone}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-400">
                        Blood Group
                      </label>
                      <p className="text-lg font-semibold text-[#C1272D]">
                        {bloodGroup}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-400">
                        Date of Birth
                      </label>
                      <p className="text-lg text-[#F8F9FA] font-semibold">
                        {dob}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-400">
                        NID Number
                      </label>
                      <p className="text-lg text-[#F8F9FA] font-semibold">
                        {nid}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-400">
                        Address
                      </label>
                      <p className="text-lg text-[#F8F9FA] font-semibold">
                        {address.name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Medical Reports Section */}
            <section className="bg-[#161B22] rounded-lg border border-[#30363D] overflow-hidden">
              <div className="border-b border-[#30363D] bg-[#21262D] px-6 py-4">
                <h2 className="text-xl font-semibold text-[#F8F9FA]">
                  Medical Reports
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: "HBsAg", value: hbsAg },
                    { label: "VDRL", value: vdrl },
                    { label: "AntiHCV", value: antiHcv },
                    { label: "CBC", value: cbc },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="bg-[#21262D] rounded-lg p-4 border border-[#30363D]"
                    >
                      <label className="text-sm font-medium text-gray-400">
                        {label} Report
                      </label>
                      <div className="mt-1">
                        {value ? (
                          <a
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-[#C1272D] hover:text-[#8B1E3F] transition-colors"
                          >
                            View Report
                          </a>
                        ) : (
                          <span className="text-gray-500">Not uploaded</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="flex justify-end">
              <button
                onClick={handleUpdateClick}
                className="px-6 py-2 bg-[#C1272D] text-[#F8F9FA] rounded-lg font-medium hover:bg-[#8B1E3F] transition-colors"
              >
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
