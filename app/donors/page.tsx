"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { MapPin, Phone, Calendar, X, Filter, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Define the Donor interface based on the User model
interface Donor {
  id: string;
  name: string;
  bloodGroup: string;
  location: string;
  coordinates: [number, number];
  imageURL: string;
  phone: string;
  dob: string | null;
}

// Location suggestion interface for search
interface LocationSuggestion {
  id: number;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
}

export default function Donors() {
  // State variables
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bloodGroupFilter, setBloodGroupFilter] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{
    address: string;
    coordinates: [number, number];
  } | null>(null);
  const [radius, setRadius] = useState("");
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Function to fetch location suggestions
  const fetchSuggestions = useCallback(async (query: string) => {
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
  }, []);

  // Function to fetch donors with filters
  const fetchDonors = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (bloodGroupFilter) {
        params.append("bloodGroup", bloodGroupFilter);
      }
      
      if (selectedLocation && radius) {
        params.append("lat", selectedLocation.coordinates[1].toString());
        params.append("lng", selectedLocation.coordinates[0].toString());
        params.append("radius", radius);
      }
      
      const response = await fetch(`/api/donors?${params}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch donors");
      }
      
      const data = await response.json();
      setDonors(data);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch donors");
      setDonors([]);
    } finally {
      setLoading(false);
    }
  }, [bloodGroupFilter, selectedLocation, radius]);

  // Fetch donors on component mount and when filters change
  useEffect(() => {
    fetchDonors();
  }, [fetchDonors]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  // Handle location selection
  const handleLocationSelect = (place: LocationSuggestion) => {
    setSelectedLocation({
      address: `${place.address}, ${place.city}`,
      coordinates: [place.longitude, place.latitude],
    });
    setLocationQuery("");
    setSuggestions([]);
  };

  // Handle donor card click
  const handleDonorClick = (donor: Donor) => {
    setSelectedDonor(donor);
    setShowModal(true);
  };

  // Reset all filters
  const resetFilters = () => {
    setBloodGroupFilter("");
    setLocationQuery("");
    setSelectedLocation(null);
    setRadius("");
  };

  // Calculate age from date of birth
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-8">
          Find Blood Donors
        </h1>

        {/* Filter Controls */}
        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 sm:p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Filter className="w-5 h-5 mr-2" /> Filter Donors
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Blood Group Filter */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block">
                Blood Group
              </label>
              <div className="relative group">
                <select
                  value={bloodGroupFilter}
                  onChange={(e) => setBloodGroupFilter(e.target.value)}
                  className="w-full appearance-none bg-gray-800/70 border border-gray-700 rounded-lg p-2.5 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/70 focus:border-red-500/50 transition-all cursor-pointer hover:bg-gray-700/80 hover:border-gray-600"
                >
                  <option value="">All Blood Groups</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                    (group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    )
                  )}
                </select>
                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Location Filter */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block">
                Location Search
              </label>
              <div className="relative">
                <Input
                  placeholder="Search location..."
                  value={locationQuery}
                  onChange={(e) => {
                    setLocationQuery(e.target.value);
                    fetchSuggestions(e.target.value);
                  }}
                  className="bg-gray-800/50 border-gray-700"
                />
                {suggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
                    {suggestions.map((place) => (
                      <div
                        key={place.id}
                        onClick={() => handleLocationSelect(place)}
                        className="p-3 hover:bg-gray-800/50 cursor-pointer transition-colors border-b border-gray-800 last:border-0"
                      >
                        <div className="text-sm">{place.address}</div>
                        <div className="text-xs text-gray-400">
                          {place.city}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedLocation && (
                <div className="mt-4">
                  <div className="text-sm text-gray-300 flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4" />
                    {selectedLocation.address}
                  </div>
                  <Input
                    type="number"
                    placeholder="Radius in meters (e.g., 5000 = 5km)"
                    value={radius}
                    onChange={(e) => setRadius(e.target.value)}
                    className="bg-gray-800/50 border-gray-700"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-end gap-3 mt-6">
            <Button 
              onClick={resetFilters} 
              variant="outline"
              className="border-gray-700 text-gray-300 hover:text-white hover:border-gray-600"
            >
              Reset Filters
            </Button>
            <Button 
              onClick={fetchDonors} 
              className="bg-red-600 hover:bg-red-700"
            >
              Search Donors
            </Button>
          </div>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center my-16">
            <div className="w-12 h-12 border-3 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error message */}
        {error && !loading && (
          <div className="text-center text-red-500 my-16">
            <p>{error}</p>
            <Button onClick={fetchDonors} className="mt-4 bg-red-600 hover:bg-red-700">
              Try Again
            </Button>
          </div>
        )}

        {/* No results */}
        {!loading && !error && donors.length === 0 && (
          <div className="text-center text-gray-400 my-16">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-xl font-semibold text-white mb-2">No Donors Found</h2>
            <p>Try adjusting your filters or searching in a different location.</p>
          </div>
        )}

        {/* Donors Grid */}
        {!loading && !error && donors.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {donors.map((donor) => (
              <motion.div
                key={donor.id}
                className="bg-gray-900/50 border border-gray-700 rounded-xl overflow-hidden hover:border-red-500 transition-all duration-300 hover:shadow-lg cursor-pointer"
                whileHover={{ y: -5 }}
                onClick={() => handleDonorClick(donor)}
              >
                <div className="flex flex-col h-full">
                  <div className="relative">
                    <div className="bg-gradient-to-r from-red-600 to-pink-600 h-24"></div>
                    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                      <div className="rounded-full border-4 border-gray-900/90 overflow-hidden h-24 w-24">
                        <Image
                          src={donor.imageURL}
                          alt={donor.name}
                          width={96}
                          height={96}
                          className="object-cover h-full w-full"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 pt-16 p-4 flex flex-col">
                    <h3 className="text-xl font-semibold text-white text-center mb-2 truncate">
                      {donor.name}
                    </h3>
                    
                    <div className="flex justify-center mb-4">
                      <span className="bg-red-500/20 text-red-500 text-lg font-bold px-3 py-1 rounded-full">
                        {donor.bloodGroup}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-400 flex items-center mb-2">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{donor.location}</span>
                    </div>
                    
                    {donor.dob && (
                      <div className="text-sm text-gray-400 flex items-center">
                        <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>Age: {calculateAge(donor.dob)} years</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 border-t border-gray-800">
                    <button className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-2 rounded-lg hover:from-red-700 hover:to-pink-700 transition-colors">
                      Contact
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Donor Detail Modal */}
      <AnimatePresence>
        {showModal && selectedDonor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-lg w-full border border-gray-700 shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="relative">
                <div className="bg-gradient-to-r from-red-600 to-pink-600 h-32"></div>
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                  <div className="rounded-full border-4 border-gray-900 overflow-hidden h-32 w-32">
                    <Image
                      src={selectedDonor.imageURL}
                      alt={selectedDonor.name}
                      width={128}
                      height={128}
                      className="object-cover h-full w-full"
                    />
                  </div>
                </div>
              </div>
              
              {/* Body */}
              <div className="pt-20 p-6">
                <h2 className="text-2xl font-bold text-white text-center mb-1">
                  {selectedDonor.name}
                </h2>
                
                <div className="flex justify-center mb-6">
                  <span className="bg-red-500/20 text-red-500 text-xl font-bold px-4 py-1 rounded-full">
                    {selectedDonor.bloodGroup}
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">Location</h3>
                      <p className="text-white">{selectedDonor.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">Contact</h3>
                      <p className="text-white">{selectedDonor.phone}</p>
                    </div>
                  </div>
                  
                  {selectedDonor.dob && (
                    <div className="flex items-start">
                      <Calendar className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-400">Age</h3>
                        <p className="text-white">{calculateAge(selectedDonor.dob)} years</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Action buttons */}
                <div className="grid gap-4 mt-8">
                  <a
                    href={`tel:${selectedDonor.phone}`}
                    className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors"
                  >
                    <Phone className="w-4 h-4 mr-2" /> Call
                  </a>
                  
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        /* Custom styling for select options */
        select option {
          background-color: #1f2937;
          color: white;
          padding: 8px 12px;
        }
        select option:hover {
          background-color: #374151;
        }
        select option:checked {
          background-color: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }
      `}</style>
    </div>
  );
}
