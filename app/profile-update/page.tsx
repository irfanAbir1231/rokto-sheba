"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Loader2,
  UploadCloud,
  X,
  MapPin,
  Droplet,
  User,
  Phone,
  CalendarDays,
  FileText,
  ClipboardList,
  Calendar,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

interface Suggestion {
  id: string;
  address: string;
  city: string;
  longitude: number;
  latitude: number;
}

const ProfileUpdate = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  // Personal Information
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [nidNumber, setNidNumber] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [dob, setDob] = useState<Date | null>(null);

  // Address Information
  const [address, setAddress] = useState({
    name: "",
    location: { type: "Point", coordinates: [0, 0] },
  });
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  // Medical Reports
  const [hbsAgReport, setHbsAgReport] = useState<File | null>(null);
  const [vdrlReport, setVdrlReport] = useState<File | null>(null);
  const [antiHcvReport, setAntiHcvReport] = useState<File | null>(null);
  const [cbcReport, setCbcReport] = useState<File | null>(null);

  // Profile Image
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  // Loading States
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const inputAnimations = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  const isValidPhoneNumber = (phone: string) => /^01\d{9}$/.test(phone);
  const isFormValid =
    firstName && lastName && phone && bloodGroup && address.name;

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profile?clerkID=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data?.isUpdated) {
            setFirstName(data.firstName);
            setLastName(data.lastName);
            setPhone(data.phone);
            setNidNumber(data.nidNumber);
            setBloodGroup(data.bloodGroup);
            setDob(data.dob ? new Date(data.dob) : null);
            setAddress(data.address);
            setAvatarPreview(data.imageURL || user.imageUrl);
          }
        }
      } catch (_) {
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [isLoaded, user]);

  const fetchSuggestions = async (query: string) => {
    if (query.length < 3) return setSuggestions([]);

    try {
      const response = await fetch(
        `https://barikoi.xyz/v1/api/search/autocomplete/${process.env.NEXT_PUBLIC_BARIKOI_API_KEY}/place?q=${query}`
      );
      const data = await response.json();
      setSuggestions(data.places || []);
    } catch (err) {
      console.error("Location search failed:", err);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress((prev) => ({ ...prev, name: value }));
    fetchSuggestions(value);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setAddress({
      name: `${suggestion.address}, ${suggestion.city}`,
      location: {
        type: "Point",
        coordinates: [suggestion.longitude, suggestion.latitude],
      },
    });
    setSuggestions([]);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleReportChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) setter(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPhoneNumber(phone)) {
      toast.error("Phone must be 11 digits starting with 01");
      return;
    }

    if (!dob) {
      toast.error("Date of birth is required");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("phone", phone);
    formData.append("nidNumber", nidNumber);
    formData.append("bloodGroup", bloodGroup);
    formData.append("dob", dob.toISOString());
    formData.append("address", JSON.stringify(address));
    if (avatar) formData.append("imageURL", avatar);
    if (hbsAgReport) formData.append("hbsAgReport", hbsAgReport);
    if (vdrlReport) formData.append("vdrlReport", vdrlReport);
    if (antiHcvReport) formData.append("antiHcvReport", antiHcvReport);
    if (cbcReport) formData.append("cbcReport", cbcReport);

    try {
      const response = await fetch("/api/profile-update", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("Profile updated successfully");
        setTimeout(() => router.push("/profile"), 2000);
      } else {
        throw new Error("Update failed");
      }
    } catch (_) {
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a]">
        <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] pt-24"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <motion.div
          variants={cardVariants}
          className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-6"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            Update Profile
          </h1>

          <motion.div whileHover={{ scale: 1.05 }} className="relative group">
            <label className="cursor-pointer">
              <input
                type="file"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <div className="relative w-32 h-32 rounded-full border-4 border-gray-700 group-hover:border-red-500 transition-all">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-gray-400 text-sm">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <UploadCloud className="w-6 h-6 text-white" />
                </div>
              </div>
            </label>
          </motion.div>
        </motion.div>

        {/* Main Form */}
        <motion.form
          onSubmit={handleSubmit}
          variants={cardVariants}
          className="space-y-8"
        >
          {/* Personal Information Section */}
          <motion.div
            variants={cardVariants}
            className="bg-[#161B22]/90 backdrop-blur-lg rounded-2xl border border-gray-800/50 p-8"
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-3 text-red-500">
              <User className="w-6 h-6" />
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <motion.div variants={inputAnimations}>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all"
                  required
                />
              </motion.div>

              {/* Last Name */}
              <motion.div variants={inputAnimations}>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all"
                  required
                />
              </motion.div>

              {/* Phone Number */}
              <motion.div variants={inputAnimations}>
                <label className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all pr-12"
                    required
                  />
                  {!isValidPhoneNumber(phone) && phone.length > 0 && (
                    <X className="w-5 h-5 text-red-500 absolute right-3 top-3.5" />
                  )}
                </div>
                {!isValidPhoneNumber(phone) && phone.length > 0 && (
                  <p className="text-red-500 text-sm mt-2">
                    Must start with 01 and have 11 digits
                  </p>
                )}
              </motion.div>

              {/* NID Number */}
              <motion.div variants={inputAnimations}>
                <label className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <ClipboardList className="w-4 h-4" />
                  NID Number
                </label>
                <input
                  type="text"
                  value={nidNumber}
                  onChange={(e) => setNidNumber(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all pr-12"
                  required
                />
              </motion.div>

              {/* Blood Group */}
              <motion.div variants={inputAnimations}>
                <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <Droplet className="w-4 h-4" />
                  Blood Group
                </label>
                <div className="relative">
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all appearance-none pr-12"
                  >
                    <option value="" disabled>
                      Select Blood Group
                    </option>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                      (group) => (
                        <option
                          key={group}
                          value={group}
                          className="bg-gray-800"
                        >
                          {group}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </motion.div>

              {/* Date of Birth */}
              <motion.div variants={inputAnimations}>
                <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  Date of Birth
                </label>
                <div className="relative">
                  <DatePicker
                    selected={dob}
                    onChange={(date) => setDob(date)}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    placeholderText="Select date of birth"
                    dateFormat="MMM dd, yyyy"
                    className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all"
                    wrapperClassName="w-full"
                    maxDate={new Date()}
                    required
                  />
                  <Calendar className="absolute right-3 top-3.5 text-gray-400 pointer-events-none w-5 h-5" />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Address Section */}
          <motion.div
            variants={cardVariants}
            className="bg-[#161B22]/90 backdrop-blur-lg rounded-2xl border border-gray-800/50 p-8"
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-3 text-red-500">
              <MapPin className="w-6 h-6" />
              Address Information
            </h2>

            <motion.div variants={inputAnimations} className="relative">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Search Address
              </label>
              <input
                type="text"
                value={address.name}
                onChange={handleAddressChange}
                className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all"
                required
              />
              {suggestions.length > 0 && (
                <ul className="absolute z-10 mt-2 w-full bg-gray-900/80 backdrop-blur-lg rounded-xl border border-gray-700 shadow-xl max-h-60 overflow-y-auto">
                  {suggestions.map((suggestion) => (
                    <li
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="p-3 hover:bg-gray-800/50 cursor-pointer transition-colors border-b border-gray-800 last:border-0"
                    >
                      <div className="text-sm">{suggestion.address}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {suggestion.city}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          </motion.div>

          {/* Medical Reports Section */}
          <motion.div
            variants={cardVariants}
            className="bg-[#161B22]/90 backdrop-blur-lg rounded-2xl border border-gray-800/50 p-8"
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-3 text-red-500">
              <FileText className="w-6 h-6" />
              Medical Reports
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  label: "HBsAg Report",
                  state: hbsAgReport,
                  setter: setHbsAgReport,
                },
                {
                  label: "VDRL Report",
                  state: vdrlReport,
                  setter: setVdrlReport,
                },
                {
                  label: "Anti HCV Report",
                  state: antiHcvReport,
                  setter: setAntiHcvReport,
                },
                {
                  label: "CBC Report",
                  state: cbcReport,
                  setter: setCbcReport,
                },
              ].map(({ label, state, setter }) => (
                <motion.div
                  key={label}
                  variants={inputAnimations}
                  className="relative group"
                >
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    {label}
                  </label>
                  <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center hover:border-red-500 transition-colors">
                    <input
                      type="file"
                      onChange={(e) => handleReportChange(e, setter)}
                      className="hidden"
                      id={label}
                    />
                    <label
                      htmlFor={label}
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <UploadCloud className="w-8 h-8 text-gray-500 mb-2 group-hover:text-red-500 transition-colors" />
                      <span className="text-gray-400 group-hover:text-white transition-colors">
                        {state ? "Change File" : "Upload File"}
                      </span>
                      {state && (
                        <div className="mt-2 text-sm text-gray-500 group-hover:text-gray-300 truncate w-full">
                          {state.name}
                        </div>
                      )}
                    </label>
                    {state && (
                      <button
                        type="button"
                        onClick={() => setter(null)}
                        className="absolute top-2 right-2 p-1 text-gray-500 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={cardVariants} className="text-center">
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl font-medium hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Save Profile Updates
                </>
              )}
            </button>
          </motion.div>
        </motion.form>
      </div>

      <style jsx global>{`
        /* Custom styles for react-datepicker */
        .react-datepicker {
          font-family: inherit;
          border: 1px solid #374151;
          border-radius: 0.5rem;
          background-color: #1f2937;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
        }

        .react-datepicker-wrapper {
          width: 100%;
        }

        .react-datepicker__header {
          background-color: #111827;
          border-bottom: 1px solid #374151;
          padding-top: 10px;
        }

        .react-datepicker__current-month {
          color: white;
          font-weight: 600;
        }

        .react-datepicker__day-name {
          color: rgba(255, 255, 255, 0.6);
        }

        .react-datepicker__day {
          color: white;
        }

        .react-datepicker__day:hover {
          background-color: rgba(239, 68, 68, 0.2);
          border-radius: 0.3rem;
        }

        .react-datepicker__day--selected {
          background-color: #ef4444;
          border-radius: 0.3rem;
        }

        .react-datepicker__day--keyboard-selected {
          background-color: rgba(239, 68, 68, 0.5);
          border-radius: 0.3rem;
        }

        .react-datepicker__day--disabled {
          color: #6b7280;
        }

        .react-datepicker__navigation {
          top: 13px;
        }

        .react-datepicker__navigation-icon::before {
          border-color: #9ca3af;
        }

        .react-datepicker__navigation:hover *::before {
          border-color: #ef4444;
        }

        /* Dropdown styles for month and year */
        .react-datepicker__month-select,
        .react-datepicker__year-select {
          background-color: #1f2937;
          color: white;
          border: 1px solid #374151;
          border-radius: 0.25rem;
          padding: 0.375rem 0.75rem;
          font-size: 0.875rem;
          line-height: 1.25rem;
          appearance: menulist; /* Show the default dropdown arrow */
        }

        .react-datepicker__month-select option,
        .react-datepicker__year-select option {
          background-color: #1f2937;
          color: white;
        }

        .react-datepicker__month-dropdown,
        .react-datepicker__year-dropdown {
          background-color: #1f2937;
          border: 1px solid #374151;
          border-radius: 0.25rem;
        }
      `}</style>
    </motion.div>
  );
};

export default ProfileUpdate;
