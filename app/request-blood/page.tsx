"use client";
import { useState, useCallback, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isValidPhoneNumber } from "@/lib/utils/validator";
import {
  motion,
  useTransform,
  useScroll,
  AnimatePresence,
} from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Loader2,
  MapPin,
  Droplet,
  CalendarDays,
  User,
  FileText,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

type BarikoiLocation = {
  address: string;
  coordinates: [number, number];
};

type BarikoiSuggestion = {
  id: number;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
};

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function RequestBlood() {
  const router = useRouter();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { scrollYProgress } = useScroll();
  const yOffset = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const [profileVerified, setProfileVerified] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // State variables
  const [formData, setFormData] = useState({
    patientName: "",
    bloodGroup: "",
    location: null as BarikoiLocation | null,
    bagsNeeded: 1,
    neededBy: new Date(),
    contactNumber: "",
    additionalInfo: "",
  });
  const [patientImage, setPatientImage] = useState<File | null>(null);
  const [medicalReport, setMedicalReport] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<BarikoiSuggestion[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Animation variants
  const stepVariants = {
    hidden: { x: 100, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
  };

  // Fetch location suggestions
  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      setIsSearching(true);
      const response = await fetch(
        `https://barikoi.xyz/v1/api/search/autocomplete/${process.env.NEXT_PUBLIC_BARIKOI_API_KEY}/place?q=${query}`
      );
      const data = await response.json();
      setSuggestions(data.places || []);
    } catch {
      toast.error("Failed to load location suggestions");
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const verifyProfile = async () => {
      if (!clerkLoaded) return;

      if (!clerkUser) {
        router.push("/sign-in");
        return;
      }

      try {
        const response = await fetch("/api/check-profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          // router.push("/profile-update");
          router.push("/profile-update?message=profile-incomplete");
          return;
        }

        const data = await response.json();
        if (!data.isUpdated) {
          // router.push("/profile-update");
          router.push("/profile-update?message=profile-incomplete");
          return;
        }

        setProfileVerified(true);
      } catch {
        toast.error("Failed to verify profile");
        router.push("/profile-update");
      } finally {
        setLoadingProfile(false);
      }
    };

    verifyProfile();
  }, [clerkUser, clerkLoaded, router]);

  if (!clerkLoaded || loadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
      </div>
    );
  }

  if (!profileVerified) {
    return null; // Redirecting, so no need to render anything
  }

  if (!clerkLoaded || loadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
      </div>
    );
  }

  if (!profileVerified) {
    return null; // Redirecting, so no need to render anything
  }

  // Form handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length >= 3) {
      fetchSuggestions(query);
    }
  };

  const handleLocationSelect = (place: BarikoiSuggestion) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        address: `${place.address}, ${place.city}`,
        coordinates: [place.longitude, place.latitude],
      },
    }));
    setSearchQuery("");
    setSuggestions([]);
  };

  const handleFileChange =
    (setter: React.Dispatch<React.SetStateAction<File | null>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) setter(e.target.files[0]);
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.location?.coordinates)
        throw new Error("Please select a valid location");

      const formPayload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "location") {
          formPayload.append(key, JSON.stringify(value));
        } else {
          formPayload.append(key, value ? value.toString() : "");
        }
      });

      if (patientImage) {
        formPayload.append("patientImage", patientImage);
      }
      if (medicalReport) {
        formPayload.append("medicalReport", medicalReport);
      }

      const response = await fetch("/api/blood-requests", {
        method: "POST",
        body: formPayload,
      });

      if (!response.ok) throw new Error("Submission failed");

      toast.success("Request submitted successfully!");
      // Reset form
      setFormData({
        patientName: "",
        bloodGroup: "",
        location: null,
        bagsNeeded: 1,
        neededBy: new Date(),
        contactNumber: "",
        additionalInfo: "",
      });
      setPatientImage(null);
      setMedicalReport(null);
      setCurrentStep(1);
    } catch {
      toast.error("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      style={{ y: yOffset }}
      className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-24"
    >
      <ToastContainer position="top-right" autoClose={5000} theme="dark" />
      <Card className="max-w-4xl w-full bg-[#161B22]/90 backdrop-blur-lg p-8 rounded-xl shadow-2xl border border-gray-800/50">
        <ToastContainer position="top-right" autoClose={3000} theme="dark" />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-2">
            LifeSaver Connect
          </h1>
          <p className="text-gray-400">Urgent Blood Request Form</p>
        </motion.div>

        <div className="flex justify-center mb-8">
          {[1, 2].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= step
                    ? "bg-red-500 text-white"
                    : "bg-gray-700 text-gray-400"
                }`}
              >
                {step}
              </div>
              {step < 2 && <div className="w-12 h-1 bg-gray-700 mx-2" />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <AnimatePresence mode="wait">
            {currentStep === 1 ? (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Patient Details */}
                <motion.div variants={formVariants}>
                  <label className="text-sm font-medium text-gray-300 flex items-center mb-2">
                    <User className="w-4 h-4 mr-2" />
                    Patient Name
                  </label>
                  <Input
                    name="patientName"
                    placeholder="Full Name"
                    value={formData.patientName}
                    onChange={(e) =>
                      setFormData({ ...formData, patientName: e.target.value })
                    }
                    className="bg-gray-900/50 border-gray-700 focus:ring-2 focus:ring-red-500"
                    required
                  />
                </motion.div>

                {/* Blood Group */}
                <motion.div variants={formVariants}>
                  <label className="text-sm font-medium text-gray-300 flex items-center mb-2">
                    <Droplet className="w-4 h-4 mr-2" />
                    Blood Group
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={(e) =>
                      setFormData({ ...formData, bloodGroup: e.target.value })
                    }
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-red-500"
                    required
                  >
                    <option value="" disabled>
                      Select Blood Type
                    </option>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                      (bg) => (
                        <option key={bg} value={bg} className="bg-gray-800">
                          {bg}
                        </option>
                      )
                    )}
                  </select>
                </motion.div>

                {/* Location Search */}
                <motion.div variants={formVariants} className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    Hospital Location
                  </label>
                  <div className="relative">
                    <Input
                      placeholder="Start typing to search location..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="bg-gray-900/50 border-gray-700 focus:ring-2 focus:ring-red-500"
                    />
                    <AnimatePresence>
                      {isSearching && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-y-0 right-3 flex items-center"
                        >
                          <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {suggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute z-10 w-full mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl"
                      >
                        {suggestions.map((place) => (
                          <div
                            key={place.id}
                            onClick={() => handleLocationSelect(place)}
                            className="p-3 hover:bg-gray-800/50 cursor-pointer transition-colors border-b border-gray-800 last:border-0"
                          >
                            <div className="font-medium text-sm">
                              {place.address}
                            </div>
                            <div className="text-xs text-gray-400">
                              {place.city}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                  {formData.location && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 text-sm text-green-400 flex items-center"
                    >
                      <MapPin className="w-4 h-4 mr-1" />
                      {formData.location.address}
                    </motion.div>
                  )}
                </motion.div>

                <div className="md:col-span-2 flex justify-end">
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    disabled={
                      !formData.patientName ||
                      !formData.bloodGroup ||
                      !formData.location
                    }
                    className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-lg font-medium transition-transform hover:scale-105"
                  >
                    Next Step
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Contact Info */}
                <motion.div variants={formVariants}>
                  <label className="text-sm font-medium text-gray-300 flex items-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4 mr-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                      />
                    </svg>
                    Contact Number
                  </label>
                  <Input
                    name="contactNumber"
                    type="tel"
                    value={formData.contactNumber}
                    onChange={(e) => {
                      const phone = e.target.value;
                      setFormData({
                        ...formData,
                        contactNumber: phone,
                      });
                    }}
                    className="bg-gray-900/50 border-gray-700 focus:ring-2 focus:ring-red-500"
                    required
                  />
                  {!isValidPhoneNumber(formData.contactNumber) &&
                    formData.contactNumber.length > 0 && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        Phone number must start with &apos;01&apos; and contain
                        11 digits
                      </motion.p>
                    )}
                </motion.div>
                {/* Blood Bags */}
                <motion.div variants={formVariants}>
                  <label className="text-sm font-medium text-gray-300 flex items-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4 mr-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                      />
                    </svg>
                    Bags Needed
                  </label>
                  <Input
                    name="bagsNeeded"
                    type="number"
                    min="1"
                    value={formData.bagsNeeded}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bagsNeeded: Number(e.target.value),
                      })
                    }
                    className="bg-gray-900/50 border-gray-700 focus:ring-2 focus:ring-red-500"
                    required
                  />
                </motion.div>

                {/* Date Picker */}
                <motion.div variants={formVariants}>
                  <label className="text-sm font-medium text-gray-300 flex items-center mb-2">
                    <CalendarDays className="w-4 h-4 mr-2" />
                    Needed By
                  </label>
                  <div className="relative">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-gray-900/50 border-gray-700 hover:bg-gray-800/50",
                            "focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {format(formData.neededBy, "MMM dd, yyyy")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 bg-gray-800 border-gray-700">
                        <DatePicker
                          selected={formData.neededBy}
                          onChange={(date: Date | null) => {
                            if (date) {
                              setFormData({ ...formData, neededBy: date });
                            }
                          }}
                          minDate={new Date()}
                          inline
                          wrapperClassName="w-full"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </motion.div>

                {/* File Uploads */}
                <motion.div variants={formVariants} className="md:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center hover:border-red-500 transition-colors">
                      <input
                        type="file"
                        id="patientImage"
                        className="hidden"
                        onChange={handleFileChange(setPatientImage)}
                        accept="image/*"
                      />
                      <label htmlFor="patientImage" className="cursor-pointer">
                        <div className="mb-3 text-red-500">
                          <User className="w-8 h-8 mx-auto" />
                        </div>
                        <p className="text-sm font-medium mb-1">
                          {patientImage
                            ? "Change Patient Photo"
                            : "Upload Patient Photo"}
                        </p>
                        <p className="text-xs text-gray-400">
                          (Optional, Max 5MB)
                        </p>
                        {patientImage && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-3"
                          >
                            <Image
                              src={URL.createObjectURL(patientImage)}
                              alt="Preview"
                              width={96}
                              height={96}
                              className="w-24 h-24 rounded-lg object-cover mx-auto border border-gray-700"
                            />
                          </motion.div>
                        )}
                      </label>
                    </div>

                    <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center hover:border-red-500 transition-colors">
                      <input
                        type="file"
                        id="medicalReport"
                        className="hidden"
                        onChange={handleFileChange(setMedicalReport)}
                        accept=".pdf,.doc,.docx"
                      />
                      <label htmlFor="medicalReport" className="cursor-pointer">
                        <div className="mb-3 text-red-500">
                          <FileText className="w-8 h-8 mx-auto" />
                        </div>
                        <p className="text-sm font-medium mb-1">
                          {medicalReport
                            ? "Change Medical Report"
                            : "Upload Medical Report"}
                        </p>
                        <p className="text-xs text-gray-400">
                          (Optional, PDF/DOC)
                        </p>
                        {medicalReport && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-3 text-sm text-green-400"
                          >
                            {medicalReport.name}
                          </motion.div>
                        )}
                      </label>
                    </div>
                  </div>
                </motion.div>

                {/* Additional Info */}
                <motion.div variants={formVariants} className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4 mr-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                      />
                    </svg>
                    Additional Information
                  </label>
                  <Textarea
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        additionalInfo: e.target.value,
                      })
                    }
                    className="bg-gray-900/50 border-gray-700 focus:ring-2 focus:ring-red-500 min-h-[120px]"
                    placeholder="Special requirements, hospital details, etc..."
                  />
                </motion.div>

                <div className="md:col-span-2 flex justify-between">
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="bg-gray-700 hover:bg-gray-600 px-8 py-3 rounded-lg font-medium transition-transform hover:scale-105"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-lg font-medium transition-transform hover:scale-105"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Submit Request"
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </Card>

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
      `}</style>
    </motion.div>
  );
}
