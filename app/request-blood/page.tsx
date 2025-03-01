"use client";

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, useTransform, useScroll } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export default function RequestBlood() {
  const { scrollYProgress } = useScroll();
  const yOffset = useTransform(scrollYProgress, [0, 1], [50, -50]); // Parallax effect

  const [formData, setFormData] = useState({
    name: "",
    bloodGroup: "",
    location: "",
    phone: "",
    bloodBags: "",
    neededDate: new Date(),
    comments: "",
  });
  const [patientImage, setPatientImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setPatientImage(e.target.files[0]);
  };

  const handleDateChange = (date: Date) => {
    setFormData({ ...formData, neededDate: date });
    setShowCalendar(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name || !formData.bloodGroup || !formData.phone) {
      toast.error("Please fill all required fields!");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      toast.success("Blood request submitted successfully!");
      setLoading(false);
    }, 2000);
  };

  return (
    <motion.div
      style={{ y: yOffset }}
      className="min-h-screen bg-[#0D1117] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-24"
    >
      <Card className="max-w-4xl w-full bg-[#161B22] p-8 rounded-lg shadow-lg border border-gray-700">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar
          theme="dark"
        />
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl font-bold text-[#F8F9FA] text-center mb-8"
        >
          Request for Blood
        </motion.h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <select
              name="bloodGroup"
              className="input bg-gray-900 text-white"
              value={formData.bloodGroup}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select Blood Group
              </option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
            <Input
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              required
            />
            <Input
              name="phone"
              placeholder="Phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <Input
              name="bloodBags"
              placeholder="No. of Blood Bags"
              type="number"
              value={formData.bloodBags}
              onChange={handleChange}
              required
            />

            {/* Calendar Date Picker */}
            <div className="relative">
              <Button
                type="button"
                className="w-full text-left px-4 py-2 bg-gray-900 text-white rounded-md"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                {format(formData.neededDate, "PPP")}
              </Button>
              {showCalendar && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-12 z-10 bg-[#161B22] p-2 rounded-md shadow-md"
                >
                  <Calendar
                    mode="single"
                    selected={formData.neededDate}
                    onSelect={(date) => date && handleDateChange(date)}
                    className="border border-gray-700 rounded-md"
                  />
                </motion.div>
              )}
            </div>

            {/* Image Upload with Preview */}
            <div className="flex flex-col">
              <input
                type="file"
                className="hidden"
                id="imageUpload"
                onChange={handleImageChange}
              />
              <label
                htmlFor="imageUpload"
                className="w-full h-32 border border-gray-700 flex items-center justify-center rounded-md cursor-pointer bg-gray-900 text-white hover:bg-gray-800 transition"
              >
                {patientImage ? (
                  <img
                    src={URL.createObjectURL(patientImage)}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  "Upload Patient Image"
                )}
              </label>
            </div>
          </div>

          <Textarea
            name="comments"
            placeholder="Additional Comments"
            value={formData.comments}
            onChange={handleChange}
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C1272D] hover:bg-[#8B1E3F] transition"
          >
            {loading ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </Card>
    </motion.div>
  );
}
