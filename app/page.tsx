"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [city, setCity] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  interface Donor {
    name: string;
    bloodGroup: string;
    location: string;
    phone: string;
    lastDonation?: string;
    donationCount?: number;
  }

  const [donors, setDonors] = useState<Donor[]>([]);
  const [stats, setStats] = useState({
    totalDonors: 1245,
    livesImpacted: 3789,
    activeCampaigns: 8,
    bloodRequests: 42,
  });

  // Handle scroll position for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = () => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const filteredDonors = [
        {
          name: "Mohammad Abdullah",
          bloodGroup: "A+",
          location: "Dhaka",
          phone: "123-456-7890",
          lastDonation: "2 months ago",
          donationCount: 5,
        },
        {
          name: "Farhan Ahmed",
          bloodGroup: "B+",
          location: "Chattogram",
          phone: "987-654-3210",
          lastDonation: "3 months ago",
          donationCount: 3,
        },
        {
          name: "Tasnim Rahman",
          bloodGroup: bloodGroup || "O+",
          location: city || "Dhaka",
          phone: "456-789-0123",
          lastDonation: "1 month ago",
          donationCount: 8,
        },
      ];

      setDonors(filteredDonors);
      setSearchPerformed(true);
      setLoading(false);
    }, 800);
  };

  const testimonials = [
    {
      id: 1,
      name: "Nadia Islam",
      message:
        "রক্তসেবা saved my father's life during an emergency surgery. Found a donor within minutes!",
      image: "/testimonial1.jpg",
    },
    {
      id: 2,
      name: "Rafiq Hasan",
      message:
        "As a regular donor, this platform has made it easy for me to help others in need. The process is seamless.",
      image: "/testimonial2.jpg",
    },
    {
      id: 3,
      name: "Sabina Akter",
      message:
        "The community built around রক্তসেবা has become a lifeline for many patients in our rural hospital.",
      image: "/testimonial3.jpg",
    },
  ];

  // Emergency request component
  const EmergencyRequest = () => (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="bg-gradient-to-r from-[#8B1E3F] to-[#C1272D] p-4 sm:p-6 rounded-xl shadow-xl mb-12"
    >
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="relative">
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-500 rounded-full animate-pulse"></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-white text-xl font-bold">
              Emergency Request: O- Blood Needed
            </h3>
            <p className="text-white opacity-90">
              Dhaka Medical College Hospital • Urgent • 3 Units
            </p>
          </div>
        </div>
        <button className="btn bg-white text-[#C1272D] hover:bg-gray-200 border-none">
          Respond Now
        </button>
      </div>
    </motion.div>
  );

  return (
    <>
      <Navbar />

      {/* Hero Section with Parallax */}
      <div
        className="relative overflow-hidden h-screen flex items-center"
        style={{
          backgroundImage: "url('/blood-donation-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D1117DD] to-[#0D1117]"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center text-[#F8F9FA]"
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="flex flex-col items-center text-center space-y-6"
            >
                {/* Main Heading */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
                <span className="block bg-gradient-to-r from-red-500 via-red-500 to-red-600 text-transparent bg-clip-text">
                  রক্তসেবা
                </span>
                <span className="block bg-gradient-to-r from-red-500 via-pink-300 to-red-600 text-transparent bg-clip-text sm:text-2xl lg:text-6xl font-extrabold tracking-tight mt-2">
                  A Lifeline for Humanity
                </span>
                </h1>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-8 mt-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Link href="/donors">
              <button className="btn btn-lg w-full sm:w-auto bg-[#C1272D] text-[#F8F9FA] hover:bg-[#8B1E3F] shadow-lg flex items-center gap-2">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
                </svg>
                Find Blood Donors
              </button>
              </Link>
              <Link href="/request-blood">
              <button className="btn btn-lg w-full sm:w-auto bg-white text-[#C1272D] hover:bg-gray-100 shadow-lg flex items-center gap-2">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                </svg>
                Request Blood
              </button>
              </Link>
            </motion.div>

            <motion.div
              className="flex justify-center mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <a href="#main-content" className="text-white animate-bounce">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <main id="main-content" className="bg-[#0D1117] pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Statistics Section */}
          <div className="py-16">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
            >
              <div className="bg-gradient-to-br from-[#0D1117] to-[#161F2C] p-6 rounded-xl shadow-xl">
                <div className="text-[#C1272D] text-4xl font-bold mb-2">
                  {stats.totalDonors}+
                </div>
                <div className="text-gray-300">Registered Donors</div>
              </div>
              <div className="bg-gradient-to-br from-[#0D1117] to-[#161F2C] p-6 rounded-xl shadow-xl">
                <div className="text-[#C1272D] text-4xl font-bold mb-2">
                  {stats.livesImpacted}+
                </div>
                <div className="text-gray-300">Lives Impacted</div>
              </div>
              <div className="bg-gradient-to-br from-[#0D1117] to-[#161F2C] p-6 rounded-xl shadow-xl">
                <div className="text-[#C1272D] text-4xl font-bold mb-2">
                  {stats.activeCampaigns}
                </div>
                <div className="text-gray-300">Active Campaigns</div>
              </div>
              <div className="bg-gradient-to-br from-[#0D1117] to-[#161F2C] p-6 rounded-xl shadow-xl">
                <div className="text-[#C1272D] text-4xl font-bold mb-2">
                  {stats.bloodRequests}
                </div>
                <div className="text-gray-300">Pending Requests</div>
              </div>
            </motion.div>
          </div>

          {/* Emergency Request Card */}
          <EmergencyRequest />

          {/* Blood Group Icons */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4 mb-16"
          >
            {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
              (type, index) => (
                <motion.div
                  key={type}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setBloodGroup(type)}
                  className={`cursor-pointer bg-[#161F2C] hover:bg-[#C1272D] transition-colors p-4 rounded-xl text-center ${
                    bloodGroup === type ? "bg-[#C1272D]" : ""
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-xl font-bold text-white">{type}</div>
                </motion.div>
              )
            )}
          </motion.div>

          {/* Search Results */}
          {searchPerformed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-16"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#F8F9FA]">
                  Available Donors
                </h2>
                <div className="badge badge-outline badge-lg">
                  {donors.length} Found
                </div>
              </div>

              <AnimatePresence>
                <div className="space-y-6">
                  {donors.map((donor, index) => (
                    <motion.div
                      key={index}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="flex flex-col sm:flex-row items-center bg-gradient-to-r from-[#161F2C] to-[#0D1117] shadow-lg rounded-xl p-6 border border-[#C1272D]"
                    >
                      <div className="relative mb-4 sm:mb-0">
                        <img
                          src={`/donor${index + 1}.jpg`}
                          alt="Donor"
                          className="w-20 h-20 rounded-full border-4 border-[#C1272D] object-cover"
                        />
                        <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div className="sm:ml-6 flex-1 text-center sm:text-left">
                        <h2 className="text-2xl font-bold text-white">
                          {donor.name}
                        </h2>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <p className="text-sm">
                            <span className="text-[#C1272D] font-semibold">
                              Blood Group:
                            </span>{" "}
                            <span className="text-[#F8F9FA]">
                              {donor.bloodGroup}
                            </span>
                          </p>
                          <p className="text-sm">
                            <span className="text-[#C1272D] font-semibold">
                              Location:
                            </span>{" "}
                            <span className="text-[#F8F9FA]">
                              {donor.location}
                            </span>
                          </p>
                          <p className="text-sm">
                            <span className="text-[#C1272D] font-semibold">
                              Last Donation:
                            </span>{" "}
                            <span className="text-[#F8F9FA]">
                              {donor.lastDonation}
                            </span>
                          </p>
                          <p className="text-sm">
                            <span className="text-[#C1272D] font-semibold">
                              Donations:
                            </span>{" "}
                            <span className="text-[#F8F9FA]">
                              {donor.donationCount}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0 flex flex-col gap-2">
                        <a
                          href={`tel:${donor.phone}`}
                          className="btn bg-[#C1272D] text-[#F8F9FA] hover:bg-[#8B1E3F] flex items-center gap-2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          Call
                        </a>
                        <button className="btn btn-outline border-[#C1272D] text-[#C1272D] hover:bg-[#C1272D] hover:text-white">
                          Message
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            </motion.div>
          )}

          {/* How It Works Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="py-16"
          >
            <h2 className="text-3xl font-bold text-center text-[#F8F9FA] mb-12">
              How রক্তসেবা Works
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                whileHover={{ y: -10 }}
                className="bg-gradient-to-br from-[#161F2C] to-[#0D1117] p-6 rounded-xl text-center shadow-xl"
              >
                <div className="rounded-full bg-[#C1272D] w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Register as a Donor
                </h3>
                <p className="text-gray-400">
                  Create your profile, set your availability, and join our
                  community of heroes.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -10 }}
                className="bg-gradient-to-br from-[#161F2C] to-[#0D1117] p-6 rounded-xl text-center shadow-xl"
              >
                <div className="rounded-full bg-[#C1272D] w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Find Donors
                </h3>
                <p className="text-gray-400">
                  Search for available donors by location, blood group, and
                  availability.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -10 }}
                className="bg-gradient-to-br from-[#161F2C] to-[#0D1117] p-6 rounded-xl text-center shadow-xl"
              >
                <div className="rounded-full bg-[#C1272D] w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Schedule Donation
                </h3>
                <p className="text-gray-400">
                  Connect with donors, schedule appointments, and save lives
                  together.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Testimonials */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="py-16"
          >
            <h2 className="text-3xl font-bold text-center text-[#F8F9FA] mb-12">
              Success Stories
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-[#161F2C] to-[#0D1117] p-6 rounded-xl shadow-xl"
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4 border-2 border-[#C1272D]"
                    />
                    <h3 className="text-xl font-semibold text-white">
                      {testimonial.name}
                    </h3>
                  </div>
                  <p className="text-gray-300 italic">
                    "{testimonial.message}"
                  </p>
                  <div className="flex mt-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-yellow-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="py-16"
          >
            <div className="bg-gradient-to-r from-[#8B1E3F] to-[#C1272D] rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Save Lives?
              </h2>
              <p className="text-white text-opacity-90 text-lg mb-8 max-w-2xl mx-auto">
                Join our community of heroes today. Register as a donor or find
                donors for those in need.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="btn btn-lg bg-white text-[#C1272D] hover:bg-gray-200 border-none shadow-lg">
                  Register as Donor
                </button>
                <button className="btn btn-lg bg-transparent text-white hover:bg-white hover:text-[#C1272D] border-white shadow-lg">
                  Request Blood
                </button>
              </div>
            </div>
          </motion.div>

          {/* Mobile App Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="py-16 flex flex-col md:flex-row items-center gap-8"
          >
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-[#F8F9FA] mb-4">
                Download Our Mobile App
              </h2>
              <p className="text-gray-300 mb-6">
                Take রক্তসেবা with you wherever you go. Find donors, track
                donations, and receive emergency alerts on your phone.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="btn bg-black text-white hover:bg-gray-900 gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.5 12.5c0-1.58-.9-2.95-2.21-3.61l1.21-2.09-3.02-1.75-1.21 2.09A4.5 4.5 0 0 0 8.5 8.5h-2v3.5h2c0 1.58.9 2.95 2.21 3.61l-1.21 2.09 3.02 1.75 1.21-2.09A4.5 4.5 0 0 0 17.5 12.5Z" />
                  </svg>
                  App Store
                </button>
                <button className="btn bg-black text-white hover:bg-gray-900 gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3.5 12.5a9 9 0 1 1 18 0 9 9 0 0 1-18 0Z" />
                  </svg>
                  Google Play
                </button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <motion.img
                src="/mobile-app.jpg"
                alt="Mobile App"
                className="max-w-xs"
                initial={{ y: 20 }}
                animate={{ y: -20 }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 2,
                }}
              />
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="py-16"
          >
            <h2 className="text-3xl font-bold text-center text-[#F8F9FA] mb-12">
              Frequently Asked Questions
            </h2>

            <div className="max-w-3xl mx-auto">
              {[
                {
                  q: "Who can donate blood?",
                  a: "Healthy individuals aged 18-65, weighing at least 50kg, and meeting specific health criteria can donate blood.",
                },
                {
                  q: "How often can I donate blood?",
                  a: "Most healthy donors can give blood every 8-12 weeks, depending on the type of donation and their health status.",
                },
                {
                  q: "Is donating blood safe?",
                  a: "Yes, donating blood is safe. Sterile, disposable needles and equipment are used for each donor to ensure safety.",
                },
                {
                  q: "What should I do before donating blood?",
                  a: "Eat a healthy meal, stay hydrated, and avoid heavy exercise before donating. Bring a valid ID and list of medications.",
                },
                {
                  q: "How long does the donation process take?",
                  a: "The entire process takes about an hour, including registration, health screening, donation, and refreshments.",
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-[#161F2C] to-[#0D1117] p-6 rounded-xl shadow-xl mb-4"
                >
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-gray-300">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
