"use client";
import {
  useEffect,
  useState,
  useCallback,
  Suspense,
  useRef,
  MouseEvent,
} from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Loader2,
  SlidersHorizontal,
  MapPin,
  CalendarDays,
  Phone,
  ChevronDown,
  RefreshCw,
  Calendar,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { BloodRequest } from "@/types/models";
import { cn } from "@/lib/utils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type LocationSuggestion = {
  id: number;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
};

// Add types for sorting
type SortBy = "createdAt" | "neededBy" | "bagsNeeded";
type SortOrder = "asc" | "desc";

// Use native fetch with a simple AbortController implementation
const useFetch = <T,>(url: string, options = {}) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    const controller = new AbortController();
    setLoading(true);
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        ...options,
      });
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setData(result);
      setError("");
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError(err.message || "Failed to load data");
      }
    } finally {
      setLoading(false);
    }
    return () => controller.abort();
  }, [url, options]);

  return { data, loading, error, fetchData };
};

// Add a LoadingSkeleton component for cards
const LoadingSkeleton = () => {
  return Array(6)
    .fill(0)
    .map((_, i) => (
      <div
        key={i}
        className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 sm:p-6 h-full animate-pulse"
        style={{
          animationDelay: `${i * 0.1}s`,
          animationDuration: "1.5s",
        }}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="w-3/4">
            <div className="h-6 bg-gray-800 rounded-md mb-3"></div>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-5 w-8 bg-gray-800/80 rounded-full"></div>
              <div className="h-4 w-24 bg-gray-800/60 rounded-md"></div>
            </div>
          </div>
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-gray-800"></div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div>
            <div className="h-4 bg-gray-800/60 rounded-md w-full mb-2"></div>
            <div className="h-4 bg-gray-800/60 rounded-md w-3/4 mt-2"></div>
          </div>
          <div className="h-16 bg-gray-800/40 rounded-md w-full"></div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-3">
            <div className="h-4 bg-gray-800/70 rounded-md w-32"></div>
            <div className="h-4 bg-gray-800/70 rounded-md w-28"></div>
          </div>
        </div>
      </div>
    ));
};

// Enhance RequestCard with parallax effect
const RequestCard = ({ request }: { request: BloodRequest }) => {
  // Optimize image loading with state-based rendering
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Handle parallax effect
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation based on mouse position (reduced for subtlety)
    const rotateX = (y - centerY) / 25;
    const rotateY = (centerX - x) / 25;

    // Apply transformation
    card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
    card.style.zIndex = "10";
    card.style.boxShadow = "0 15px 35px -10px rgba(0, 0, 0, 0.5)";
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;

    // Reset transformation
    cardRef.current.style.transform =
      "perspective(1200px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
    cardRef.current.style.zIndex = "1";
    cardRef.current.style.boxShadow = "none";
  };

  return (
    <Card
      ref={cardRef}
      className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 sm:p-6 h-full hover:border-red-500 transition-all duration-300"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        willChange: "transform",
        transition: "all 0.3s ease-out",
      }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="max-w-[75%]" style={{ transform: "translateZ(15px)" }}>
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
          <div
            className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg border border-gray-700 overflow-hidden ${
              !imageLoaded ? "bg-gray-800/50" : ""
            }`}
            style={{ transform: "translateZ(25px)" }}
          >
            <img
              src={request.patientImage}
              alt="Patient"
              width={64}
              height={64}
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              loading="lazy"
              decoding="async"
            />
          </div>
        )}
      </div>

      <div
        className="space-y-3 sm:space-y-4"
        style={{ transform: "translateZ(10px)" }}
      >
        <div className="text-xs sm:text-sm">
          <p className="text-gray-400 break-words">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 inline-block mr-1 sm:mr-2 flex-shrink-0" />
            <span className="line-clamp-1">{request.location.address}</span>
          </p>
          <p className="text-gray-400 mt-2">
            <CalendarDays className="w-3 h-3 sm:w-4 sm:h-4 inline-block mr-1 sm:mr-2 flex-shrink-0" />
            Needed by {format(parseISO(request.neededBy), "MMM dd, yyyy")}
          </p>
        </div>

        {request.additionalInfo && (
          <p className="text-gray-300 text-xs sm:text-sm line-clamp-2">
            {request.additionalInfo}
          </p>
        )}

        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-3 sm:mt-4"
          style={{ transform: "translateZ(20px)" }}
        >
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
  );
};

const RecentRequests = () => {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);
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

  // Date picker states
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Sorting
  const [sorting, setSorting] = useState({
    sortBy: "createdAt" as SortBy,
    sortOrder: "desc" as SortOrder,
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

  // Using AbortController to cancel previous requests
  const fetchRequests = useCallback(async () => {
    const controller = new AbortController();
    const signal = controller.signal;

    try {
      setLoading(true);
      setShowSkeleton(true);

      const params = new URLSearchParams({
        ...filters,
        sortBy: sorting.sortBy,
        sortOrder: sorting.sortOrder,
        ...(selectedLocation && {
          lat: selectedLocation.coordinates[1].toString(),
          lng: selectedLocation.coordinates[0].toString(),
        }),
      });

      const response = await fetch(`/api/blood-requests?${params}`, {
        signal,
        cache: "no-store", // Change from force-cache to no-store to always fetch fresh data
      });

      if (!response.ok) throw new Error("Failed to fetch requests");

      const data = await response.json();
      setRequests(data);

      setTimeout(() => {
        setLoading(false);
        setTimeout(() => {
          setShowSkeleton(false);
        }, 200);
      }, 800);
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError(err.message || "Failed to load requests");
        setLoading(false);
        setShowSkeleton(false);
      }
    }

    return () => controller.abort();
  }, [filters, sorting, selectedLocation]);

  useEffect(() => {
    let cleanupFunction: (() => void) | undefined;

    // Handle the Promise returned by fetchRequests
    fetchRequests().then((cleanup) => {
      cleanupFunction = cleanup;
    });

    // Return the cleanup function
    return () => {
      if (cleanupFunction) cleanupFunction();
    };
  }, [fetchRequests]);

  // Update date filters when calendar dates change
  useEffect(() => {
    if (startDate) {
      handleFilterChange("minDate", format(startDate, "yyyy-MM-dd"));
    }
    if (endDate) {
      handleFilterChange("maxDate", format(endDate, "yyyy-MM-dd"));
    }
  }, [startDate, endDate]);

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

  // Add a new handleRefresh function
  const handleRefresh = () => {
    setShowSkeleton(true);
    fetchRequests();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <style jsx global>{`
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

        /* Optimized spinner that uses CSS instead of SVG for better performance */
        .lightweight-spinner {
          width: 2rem;
          height: 2rem;
          border: 3px solid rgba(220, 38, 38, 0.2);
          border-top-color: rgba(220, 38, 38, 0.8);
          border-radius: 50%;
          animation: spinner 0.6s linear infinite;
        }

        @keyframes spinner {
          to {
            transform: rotate(360deg);
          }
        }

        /* Custom loading animation for skeletons */
        @keyframes pulse {
          0% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            opacity: 0.6;
          }
        }

        .animate-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }

        /* Fade in animation for cards */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }

        /* Staggered animations for cards */
        .card-grid > div {
          opacity: 0;
        }

        .card-grid > div:nth-child(1) {
          animation-delay: 0.1s;
        }
        .card-grid > div:nth-child(2) {
          animation-delay: 0.2s;
        }
        .card-grid > div:nth-child(3) {
          animation-delay: 0.3s;
        }
        .card-grid > div:nth-child(4) {
          animation-delay: 0.4s;
        }
        .card-grid > div:nth-child(5) {
          animation-delay: 0.5s;
        }
        .card-grid > div:nth-child(6) {
          animation-delay: 0.6s;
        }
        .card-grid > div:nth-child(n + 7) {
          animation-delay: 0.7s;
        }

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

        .react-datepicker__day--in-range {
          background-color: rgba(239, 68, 68, 0.2);
          color: white;
        }

        .react-datepicker__day--in-selecting-range {
          background-color: rgba(239, 68, 68, 0.2);
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

        .react-datepicker__year-read-view--down-arrow,
        .react-datepicker__month-read-view--down-arrow {
          border-color: #9ca3af;
        }

        .react-datepicker__time-container {
          border-left-color: #374151;
        }

        .react-datepicker__time-container .react-datepicker__time {
          background-color: #1f2937;
        }

        .react-datepicker-time__header {
          color: white;
        }

        .react-datepicker__time-list-item {
          color: white;
        }

        .react-datepicker__time-list-item:hover {
          background-color: rgba(239, 68, 68, 0.2) !important;
        }

        .react-datepicker__time-list-item--selected {
          background-color: #ef4444 !important;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            Recent Blood Requests
          </h1>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="bg-gray-900/50 border-gray-700 hover:bg-gray-800/50 text-sm sm:text-base"
              size="sm"
              disabled={loading}
            >
              <SlidersHorizontal className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>

            <Button
              onClick={handleRefresh}
              variant="outline"
              className="bg-gray-900/50 border-gray-700 hover:bg-gray-800/50 text-sm sm:text-base"
              size="sm"
              disabled={loading}
            >
              <RefreshCw
                className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 ${
                  loading ? "animate-spin" : ""
                }`}
              />
              Refresh
            </Button>

            <div className="relative group">
              <select
                value={`${sorting.sortBy}-${sorting.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split("-");
                  setSorting({
                    sortBy: sortBy as SortBy,
                    sortOrder: sortOrder as SortOrder,
                  });
                }}
                className="appearance-none bg-gray-900/70 border border-gray-700 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 pr-8 sm:pr-10 text-sm sm:text-base text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/70 focus:border-red-500/50 transition-all duration-200 cursor-pointer hover:bg-gray-800/80 hover:border-gray-600"
                disabled={loading}
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="neededBy-asc">Urgency (Soonest)</option>
                <option value="bagsNeeded-desc">Most Bags Needed</option>
                <option value="bagsNeeded-asc">Fewest Bags Needed</option>
              </select>
              <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-gray-300 transition-transform duration-200 group-hover:translate-y-[-45%]">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters panel without animations */}
        {showFilters && (
          <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 sm:p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Blood Group Filter */}
              <div>
                <label className="text-sm text-gray-300 mb-2 block">
                  Blood Group
                </label>
                <div className="relative group">
                  <select
                    value={filters.bloodGroup}
                    onChange={(e) =>
                      handleFilterChange("bloodGroup", e.target.value)
                    }
                    className="w-full appearance-none bg-gray-800/70 border border-gray-700 rounded-lg p-2.5 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/70 focus:border-red-500/50 transition-all duration-200 cursor-pointer hover:bg-gray-700/80 hover:border-gray-600"
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
                  <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-gray-300 transition-transform duration-200 group-hover:translate-y-[-45%]">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Bags Filter */}
              <div>
                <label className="text-sm text-gray-300 mb-2 block">
                  Bags Needed
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min bags"
                    value={filters.minBags}
                    onChange={(e) =>
                      handleFilterChange("minBags", e.target.value)
                    }
                    className="bg-gray-800/50 border-gray-700"
                    min="1"
                  />
                  <Input
                    type="number"
                    placeholder="Max bags"
                    value={filters.maxBags}
                    onChange={(e) =>
                      handleFilterChange("maxBags", e.target.value)
                    }
                    className="bg-gray-800/50 border-gray-700"
                    min="1"
                  />
                </div>
              </div>

              {/* Date Range Filter - Professional Calendar UI */}
              <div>
                <label className="text-sm text-gray-300 mb-2 block">
                  Date Range (Needed By)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-gray-800/70 border-gray-700 hover:bg-gray-700/80",
                            !startDate && "text-gray-400"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {startDate
                            ? format(startDate, "MMM dd, yyyy")
                            : "Start date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 bg-gray-800 border-gray-700">
                        <DatePicker
                          selected={startDate}
                          onChange={(date: Date | null) => setStartDate(date)}
                          selectsStart
                          startDate={startDate}
                          endDate={endDate}
                          minDate={new Date()}
                          inline
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="relative">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-gray-800/70 border-gray-700 hover:bg-gray-700/80",
                            !endDate && "text-gray-400"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {endDate
                            ? format(endDate, "MMM dd, yyyy")
                            : "End date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 bg-gray-800 border-gray-700">
                        <DatePicker
                          selected={endDate}
                          onChange={(date: Date | null) => setEndDate(date)}
                          selectsEnd
                          startDate={startDate}
                          endDate={endDate}
                          minDate={startDate || new Date()}
                          inline
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
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
          </div>
        )}

        {/* Loading indicator only shown when first loading */}
        {loading && (
          <div className="flex justify-center mb-8">
            <div className="lightweight-spinner"></div>
          </div>
        )}

        {/* Always render both skeletons and actual content, control visibility with CSS */}
        <div className="relative">
          {/* Skeleton layer */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 transition-opacity duration-300"
            style={{
              opacity: showSkeleton ? 1 : 0,
              position: showSkeleton ? "relative" : "absolute",
              top: 0,
              left: 0,
              width: "100%",
              zIndex: showSkeleton ? 10 : -1,
              pointerEvents: showSkeleton ? "auto" : "none",
            }}
          >
            <LoadingSkeleton />
          </div>

          {/* Actual content layer */}
          {!error && (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 card-grid transition-opacity duration-300"
              style={{
                opacity: !showSkeleton && !loading ? 1 : 0,
                visibility: !showSkeleton && !loading ? "visible" : "hidden",
              }}
            >
              {requests.map((request) => (
                <div key={request._id} className="fade-in">
                  <RequestCard request={request} />
                </div>
              ))}
            </div>
          )}

          {/* Error message */}
          {error && !showSkeleton && (
            <div className="text-center text-red-500 mt-8">{error}</div>
          )}

          {/* No results message */}
          {!loading && !showSkeleton && requests.length === 0 && !error && (
            <div className="text-center text-gray-400 mt-8">
              No requests found matching your criteria
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentRequests;
