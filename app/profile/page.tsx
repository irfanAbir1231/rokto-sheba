"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Loader2,
  Edit3,
  FileText,
  Droplet,
  User,
  Phone,
  Calendar,
  MapPin,
  IdCard,
} from "lucide-react";
import Image from "next/image";

const Profile = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  // State initialization
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    bloodGroup: "",
    dob: "",
    nid: "",
    imageUrl: "",
    address: { name: "", location: { type: "Point", coordinates: [0, 0] } },
    reports: { hbsAg: "", vdrl: "", antiHcv: "", cbc: "" },
  });

  const [loading, setLoading] = useState(true);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!isLoaded || !user?.id) return;

      try {
        const response = await fetch(`/api/profile?clerkID=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          if (!data.isUpdated) {
            router.push("/profile-update");
            return;
          }

          setProfileData({
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            bloodGroup: data.bloodGroup,
            dob: new Date(data.dob).toLocaleDateString(),
            nid: data.nidNumber,
            imageUrl: data.imageURL,
            address: data.address,
            reports: {
              hbsAg: data.hbsAgReport,
              vdrl: data.vdrlReport,
              antiHcv: data.antiHcvReport,
              cbc: data.cbcReport,
            },
          });
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user, isLoaded, router]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a]">
        <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
      </div>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] pt-24"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="flex items-center justify-between mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            Profile Overview
          </h1>
          <button
            onClick={() => router.push("/profile-update")}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl hover:scale-105 transition-transform"
          >
            <Edit3 className="w-5 h-5" />
            <span className="font-medium">Update Profile</span>
          </button>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          variants={cardVariants}
          className="bg-[#161B22]/90 backdrop-blur-lg rounded-2xl border border-gray-800/50 shadow-2xl overflow-hidden mb-12"
        >
          <div className="flex flex-col md:flex-row items-center p-8 gap-8">
            <div className="relative group w-32 h-32 shrink-0">
              <Image
                src={profileData.imageUrl || "/default-avatar.png"}
                alt="Profile"
                width={128}
                height={128}
                className="w-full h-full rounded-2xl object-cover border-4 border-gray-800/50 group-hover:border-red-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <DetailItem icon={<User />} label="Full Name">
                {profileData.firstName} {profileData.lastName}
              </DetailItem>
              <DetailItem icon={<Phone />} label="Phone">
                {profileData.phone}
              </DetailItem>
              <DetailItem icon={<Droplet />} label="Blood Group">
                <span className="text-red-500 font-semibold">
                  {profileData.bloodGroup}
                </span>
              </DetailItem>
              <DetailItem icon={<Calendar />} label="Date of Birth">
                {profileData.dob}
              </DetailItem>
              <DetailItem icon={<IdCard />} label="NID Number">
                {profileData.nid}
              </DetailItem>
              <DetailItem icon={<MapPin />} label="Address">
                {profileData.address.name}
              </DetailItem>
            </div>
          </div>
        </motion.div>

        {/* Medical Reports */}
        <motion.div
          variants={cardVariants}
          className="bg-[#161B22]/90 backdrop-blur-lg rounded-2xl border border-gray-800/50 shadow-2xl p-8"
        >
          <h2 className="text-2xl font-semibold mb-8 flex items-center gap-3">
            <FileText className="text-red-500" />
            <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              Medical Reports
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ReportCard
              title="HBsAg"
              url={profileData.reports.hbsAg}
              className="hover:border-red-500"
            />
            <ReportCard
              title="VDRL"
              url={profileData.reports.vdrl}
              className="hover:border-pink-500"
            />
            <ReportCard
              title="AntiHCV"
              url={profileData.reports.antiHcv}
              className="hover:border-purple-500"
            />
            <ReportCard
              title="CBC"
              url={profileData.reports.cbc}
              className="hover:border-blue-500"
            />
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
};

const DetailItem = ({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-start gap-4">
    <div className="p-2 bg-gray-900/50 rounded-lg text-red-500">{icon}</div>
    <div>
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <p className="text-gray-200 font-medium">{children || "Not provided"}</p>
    </div>
  </div>
);

const ReportCard = ({
  title,
  url,
  className,
}: {
  title: string;
  url: string;
  className?: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    className={`bg-gray-900/50 rounded-xl p-4 border border-gray-800/50 transition-all ${className}`}
  >
    <h3 className="text-lg font-semibold mb-2 text-gray-200">{title}</h3>
    <div className="h-12 flex items-center">
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-red-500 hover:text-red-400"
        >
          <FileText className="w-5 h-5" />
          <span>View Report</span>
        </a>
      ) : (
        <span className="text-gray-500">Not uploaded</span>
      )}
    </div>
  </motion.div>
);

export default Profile;
