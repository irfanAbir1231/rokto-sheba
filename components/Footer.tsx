"use client";
import { motion, useTransform, useScroll } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  // Use a ref for the footer to track its own scroll position
  const footerRef = useRef<HTMLDivElement>(null);

  // Now useScroll will only track the footer element's visibility
  const { scrollYProgress } = useScroll({
    // Track the footer in relation to the viewport
    target: footerRef,
    offset: ["start end", "end start"],
  });

  // Apply a transform based on the footer's visibility in viewport
  const yOffset = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.1, 0]);

  // Use state for client detection only
  const [isClient, setIsClient] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Mark as client-side rendered
    setIsClient(true);

    const handleScroll = () => {
      if (!footerRef.current) return;

      // Check if footer is in viewport
      const rect = footerRef.current.getBoundingClientRect();
      setIsVisible(rect.top < window.innerHeight);
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToFAQ = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    try {
      // First try to find the element with id 'faq-section'
      const faqSection = document.getElementById("faq-section");

      if (faqSection) {
        faqSection.scrollIntoView({ behavior: "smooth" });
        return;
      }

      // If not found, try to find by heading text
      const headings = Array.from(
        document.querySelectorAll("h1, h2, h3, h4, h5, h6")
      );

      // Find the first heading containing the FAQ text
      for (const heading of headings) {
        if (heading.textContent?.includes("Frequently Asked Questions")) {
          // Cast to HTMLElement which definitely has scrollIntoView
          const element = heading as HTMLElement;
          element.scrollIntoView({ behavior: "smooth" });
          return;
        }
      }

      // If we get here, no element was found
      window.location.href = "/#faq-section";
    } catch (error) {
      console.error("Error scrolling to FAQ section:", error);
      // Fallback to navigation
      window.location.href = "/#faq-section";
    }
  };

  // Common content structure for both client and server rendering
  const FooterContent = () => (
    <>
      {/* About Section */}
      <div>
        <h2 className="text-2xl font-bold text-[#C1272D]">রক্তসেবা</h2>
        <p className="text-sm opacity-80 mt-2">
          Connecting donors with those in need. Your one drop of blood can
          create a ripple of hope.
        </p>
      </div>

      {/* Quick Links and Contact combined */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-[#C1272D] mb-3">
            Quick Links
          </h3>
          <ul className="space-y-2">
            {isClient ? (
              <>
                <motion.li whileHover={{ scale: 1.1 }}>
                  <Link
                    href="http://localhost:3000/donors"
                    className="hover:text-[#C1272D] transition"
                  >
                    Find a Donor
                  </Link>
                </motion.li>
                <motion.li whileHover={{ scale: 1.1 }}>
                  <Link
                    href="http://localhost:3000/sign-in"
                    className="hover:text-[#C1272D] transition"
                  >
                    Become a Donor
                  </Link>
                </motion.li>
                <motion.li whileHover={{ scale: 1.1 }}>
                  <a
                    href="#faq-section"
                    onClick={scrollToFAQ}
                    className="hover:text-[#C1272D] transition"
                  >
                    FAQs
                  </a>
                </motion.li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="http://localhost:3000/donors"
                    className="hover:text-[#C1272D] transition"
                  >
                    Find a Donor
                  </Link>
                </li>
                <li>
                  <Link
                    href="http://localhost:3000/sign-in"
                    className="hover:text-[#C1272D] transition"
                  >
                    Become a Donor
                  </Link>
                </li>
                <li>
                  <a
                    href="#faq-section"
                    className="hover:text-[#C1272D] transition"
                  >
                    FAQs
                  </a>
                </li>
              </>
            )}
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
            {isClient ? (
              <>
                <motion.a
                  whileHover={{ scale: 1.2 }}
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C1272D] transition text-xl"
                >
                  <FaFacebook />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.2 }}
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C1272D] transition text-xl"
                >
                  <FaInstagram />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.2 }}
                  href="https://wa.me/8801234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C1272D] transition text-xl"
                >
                  <FaWhatsapp />
                </motion.a>
              </>
            ) : (
              <>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C1272D] transition text-xl"
                >
                  <FaFacebook />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C1272D] transition text-xl"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://wa.me/8801234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C1272D] transition text-xl"
                >
                  <FaWhatsapp />
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <footer
      ref={footerRef}
      className="bg-[#0D1117] text-[#F8F9FA] py-12 px-6 md:px-16 relative overflow-hidden"
    >
      {isClient && (
        <motion.div
          className="absolute inset-0 z-0"
          style={{
            y: yOffset,
            opacity: opacity,
          }}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-red-600/10 to-transparent"></div>
          <div className="grid grid-cols-5 gap-4 h-full w-full">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="bg-red-600/10 h-full rounded-full transform rotate-45 translate-y-1/2"
              ></div>
            ))}
          </div>
        </motion.div>
      )}

      {isClient ? (
        <motion.div
          className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-10 relative z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <FooterContent />
        </motion.div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-10 relative z-10">
          <FooterContent />
        </div>
      )}

      {/* Bottom Footer */}
      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm opacity-60 relative z-10">
        &copy; {new Date().getFullYear()} রক্তসেবা | All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
