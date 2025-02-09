"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";

const Profile = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState({
    name: "",
    location: {
      type: "Point",
      coordinates: [0, 0],
    },
  });
  const [reports, setReports] = useState<{ HBsAg: string; VDRL: string; AntiHCV: string; CBC: string }>({
    HBsAg: "",
    VDRL: "",
    AntiHCV: "",
    CBC: "",
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) {
        console.error("User ID is not available");
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
          setFirstName(data.firstName);
          setLastName(data.lastName);
          setPhone(data.phone);
          setBloodGroup(data.bloodGroup);
          setDob(new Date(data.dob).toISOString().split("T")[0]);
          setAddress(data.address);
          setReports(data.reports || {});
        } else {
          console.error("Error fetching profile data:", response.status);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, [user, router]);

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
          <h1 className="text-3xl font-bold mb-8 text-[#F8F9FA]">Profile Information</h1>
          
          <div className="space-y-6">
            {/* Personal Information Section */}
            <section className="bg-[#161B22] rounded-lg border border-[#30363D] overflow-hidden">
              <div className="border-b border-[#30363D] bg-[#21262D] px-6 py-4">
                <h2 className="text-xl font-semibold text-[#F8F9FA]">Personal Details</h2>
              </div>
              <div className="px-6 py-6">
                <div className="flex justify-center mb-6">
                  <img
                    src={user?.imageUrl}
                    alt="User Avatar"
                    className="w-24 h-24 rounded-full border-4 border-gray-300"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-400">Full Name</label>
                      <p className="text-lg text-[#F8F9FA] font-semibold">{firstName} {lastName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-400">Phone Number</label>
                      <p className="text-lg text-[#F8F9FA] font-semibold">{phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-400">Blood Group</label>
                      <p className="text-lg font-semibold text-[#C1272D]">{bloodGroup}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-400">Date of Birth</label>
                      <p className="text-lg text-[#F8F9FA] font-semibold">{dob}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-400">Address</label>
                      <p className="text-lg text-[#F8F9FA] font-semibold">{address.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Medical Reports Section */}
            <section className="bg-[#161B22] rounded-lg border border-[#30363D] overflow-hidden">
              <div className="border-b border-[#30363D] bg-[#21262D] px-6 py-4">
                <h2 className="text-xl font-semibold text-[#F8F9FA]">Medical Reports</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(reports).map(([key, value]) => (
                    <div key={key} className="bg-[#21262D] rounded-lg p-4 border border-[#30363D]">
                      <label className="text-sm font-medium text-gray-400">{key} Report</label>
                      <div className="mt-1">
                        {value ? (
                          <a
                            href={value as string}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-[#C1272D] hover:text-[#8B1E3F] transition-colors"
                          >
                            View Report
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
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
                className="px-6 py-2 bg-[#C1272D] text-[#F8F9FA] rounded-lg font-medium hover:bg-[#8B1E3F] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#C1272D] focus:ring-offset-2 focus:ring-offset-[#0D1117]"
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