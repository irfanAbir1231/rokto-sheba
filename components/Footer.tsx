"use client";
import { motion, useTransform, useScroll } from "framer-motion";
import { useEffect, useState } from "react";

const Footer = () => {
  const { scrollYProgress } = useScroll();
  const yOffset = useTransform(scrollYProgress, [0, 1], [50, -50]); // Parallax effect

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > window.innerHeight / 2);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.footer
      style={{ y: yOffset }}
      className="bg-[#0D1117] text-[#F8F9FA] py-12 px-6 md:px-16"
    >
      <motion.div
        className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* About Section */}
        <div>
          <h2 className="text-2xl font-bold text-[#C1272D]">রক্তসেবা</h2>
          <p className="text-sm opacity-80 mt-2">
            Connecting donors with those in need. Your one drop of blood can
            create a ripple of hope.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-[#C1272D] mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <motion.li whileHover={{ scale: 1.1 }}>
              <a href="#" className="hover:text-[#C1272D] transition">Find a Donor</a>
            </motion.li>
            <motion.li whileHover={{ scale: 1.1 }}>
              <a href="#" className="hover:text-[#C1272D] transition">Become a Donor</a>
            </motion.li>
            <motion.li whileHover={{ scale: 1.1 }}>
              <a href="#" className="hover:text-[#C1272D] transition">Blood Donation Facts</a>
            </motion.li>
            <motion.li whileHover={{ scale: 1.1 }}>
              <a href="#" className="hover:text-[#C1272D] transition">FAQs</a>
            </motion.li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-[#C1272D] mb-3">Contact</h3>
          <p className="text-sm opacity-80">📍 Dhaka, Bangladesh</p>
          <p className="text-sm opacity-80">📧 support@raktoseba.com</p>
          <p className="text-sm opacity-80">📞 +880 1234 567 890</p>
          {/* Social Media Icons */}
          <div className="flex gap-4 mt-3">
            <motion.a whileHover={{ scale: 1.2 }} href="#" className="hover:text-[#C1272D] transition text-xl">🔵</motion.a>
            <motion.a whileHover={{ scale: 1.2 }} href="#" className="hover:text-[#C1272D] transition text-xl">📸</motion.a>
            <motion.a whileHover={{ scale: 1.2 }} href="#" className="hover:text-[#C1272D] transition text-xl">🐦</motion.a>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h3 className="text-lg font-semibold text-[#C1272D] mb-3">Stay Updated</h3>
          <p className="text-sm opacity-80 mb-2">Subscribe for updates and donation drives.</p>
          <motion.div
            className="flex items-center bg-gray-800 rounded-lg p-2"
            whileHover={{ scale: 1.05 }}
          >
            <input
              type="email"
              placeholder="Enter email"
              className="bg-transparent flex-grow px-3 py-2 text-sm focus:outline-none"
            />
            <button className="bg-[#C1272D] px-4 py-2 text-white rounded-lg hover:bg-[#8B1E3F] transition">
              Subscribe
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Footer */}
      <motion.div
        className="border-t border-gray-700 mt-8 pt-6 text-center text-sm opacity-60"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 1.2 }}
      >
        &copy; {new Date().getFullYear()} রক্তসেবা | All Rights Reserved
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
