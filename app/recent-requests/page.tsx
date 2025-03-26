"use client";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Loader2,
  SlidersHorizontal,
  MapPin,
  CalendarDays,
  Phone,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { BloodRequest } from "@/types/models";
import { cn } from "@/lib/utils";

type LocationSuggestion = {
  id: number;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
};

const RecentRequests = () => {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{
    address: string;
    coordinates: [number, number];
  } | null>(null);

  // Filters
  const [filters, setFilters] = useState({
    bloodGroup: "",
    radius: "",
    minBags: "",
    maxBags: "",
    minDate: "",
    maxDate: "",
  });

  // Sorting
  const [sorting, setSorting] = useState({
    sortBy: "createdAt" as "createdAt" | "neededBy" | "bagsNeeded",
    sortOrder: "desc" as "asc" | "desc",
  });

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

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        ...filters,
        sortBy: sorting.sortBy,
        sortOrder: sorting.sortOrder,
        ...(selectedLocation && {
          lat: selectedLocation.coordinates[1].toString(),
          lng: selectedLocation.coordinates[0].toString(),
        }),
      });

      const response = await fetch(`/api/blood-requests?${params}`);
      if (!response.ok) throw new Error("Failed to fetch requests");

      const data = await response.json();
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load requests");
    } finally {
      setLoading(false);
    }
  }, [filters, sorting, selectedLocation]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocationSelect = (place: LocationSuggestion) => {
    setSelectedLocation({
      address: `${place.address}, ${place.city}`,
      coordinates: [place.longitude, place.latitude],
    });
    setLocationQuery("");
    setSuggestions([]);
  };

  const resetFilters = () => {
    setFilters({
      bloodGroup: "",
      radius: "",
      minBags: "",
      maxBags: "",
      minDate: "",
      maxDate: "",
    });
    setSelectedLocation(null);
    fetchRequests();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent"
          >
            Recent Blood Requests
          </motion.h1>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="bg-gray-900/50 border-gray-700 hover:bg-gray-800/50 text-sm sm:text-base"
              size="sm"
            >
              <SlidersHorizontal className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>

            <select
              value={`${sorting.sortBy}-${sorting.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split("-");
                setSorting({
                  sortBy: sortBy as any,
                  sortOrder: sortOrder as any,
                });
              }}
              className="bg-gray-900/50 border border-gray-700 rounded-lg px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base text-white focus:ring-2 focus:ring-red-500 appearance-none bg-no-repeat bg-right pr-6 sm:pr-8 cursor-pointer"
              style={{
                backgroundImage:
                  'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM3NTc1NzUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSI2IDkgMTIgMTUgMTggOSIvPjwvc3ZnPg==")',
                backgroundSize: "16px",
                backgroundPosition: "right 8px center",
              }}
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="neededBy-asc">Urgency (Soonest)</option>
              <option value="bagsNeeded-desc">Most Bags Needed</option>
              <option value="bagsNeeded-asc">Fewest Bags Needed</option>
            </select>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 sm:p-6 mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Blood Group Filter */}
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">
                    Blood Group
                  </label>
                  <select
                    value={filters.bloodGroup}
                    onChange={(e) =>
                      handleFilterChange("bloodGroup", e.target.value)
                    }
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-2.5 text-white appearance-none bg-no-repeat bg-right pr-8 cursor-pointer"
                    style={{
                      backgroundImage:
                        'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM3NTc1NzUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSI2IDkgMTIgMTUgMTggOSIvPjwvc3ZnPg==")',
                      backgroundSize: "16px",
                      backgroundPosition: "right 8px center",
                    }}
                  >
                    <option value="">All Groups</option>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                      (group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">
                    Location Filter
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
                        value={filters.radius}
                        onChange={(e) =>
                          handleFilterChange("radius", e.target.value)
                        }
                        className="bg-gray-800/50 border-gray-700"
                      />
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="md:col-span-2 flex flex-wrap justify-center sm:justify-end gap-2">
                  <Button
                    onClick={fetchRequests}
                    className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                  >
                    Apply Filters
                  </Button>
                  <Button
                    onClick={resetFilters}
                    variant="ghost"
                    className="text-gray-400 hover:text-white w-full sm:w-auto"
                  >
                    Reset All
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rest of the code remains same as previous version */}
        {loading ? (
          <div className="flex justify-center mt-12">
            <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 mt-8">{error}</div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            <AnimatePresence>
              {requests.map((request) => (
                <motion.div
                  key={request._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  layout
                >
                  <Card className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 sm:p-6 h-full hover:border-red-500 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div className="max-w-[75%]">
                        <h3 className="text-lg sm:text-xl font-semibold text-white truncate">
                          {request.patientName}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span
                            className={cn(
                              "px-2 py-1 rounded-full text-xs sm:text-sm",
                              request.bloodGroup === "O-"
                                ? "bg-red-500/20 text-red-500"
                                : "bg-blue-500/20 text-blue-500"
                            )}
                          >
                            {request.bloodGroup}
                          </span>
                          <span className="text-gray-400 text-xs sm:text-sm">
                            {request.bagsNeeded} bags needed
                          </span>
                        </div>
                      </div>
                      {request.patientImage && (
                        <img
                          src={request.patientImage}
                          alt="Patient"
                          className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover border border-gray-700"
                        />
                      )}
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <div className="text-xs sm:text-sm">
                        <p className="text-gray-400 break-words">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 inline-block mr-1 sm:mr-2 flex-shrink-0" />
                          <span className="line-clamp-1">
                            {request.location.address}
                          </span>
                        </p>
                        <p className="text-gray-400 mt-2">
                          <CalendarDays className="w-3 h-3 sm:w-4 sm:h-4 inline-block mr-1 sm:mr-2 flex-shrink-0" />
                          Needed by{" "}
                          {format(parseISO(request.neededBy), "MMM dd, yyyy")}
                        </p>
                      </div>

                      {request.additionalInfo && (
                        <p className="text-gray-300 text-xs sm:text-sm line-clamp-2">
                          {request.additionalInfo}
                        </p>
                      )}

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-3 sm:mt-4">
                        <a
                          href={`tel:${request.contactNumber}`}
                          className="text-red-500 hover:text-red-400 flex items-center text-xs sm:text-sm"
                        >
                          <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                          Contact Donor
                        </a>
                        {request.medicalReport && (
                          <a
                            href={request.medicalReport}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white text-xs sm:text-sm"
                          >
                            View Medical Report
                          </a>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && requests.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            No requests found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentRequests;
