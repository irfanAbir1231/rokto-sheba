"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useUser } from "@clerk/clerk-react";
import { UserButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";

const DotIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="currentColor"
      className="w-4 h-4"
    >
      <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
    </svg>
  );
};

const Navbar = () => {
  const { user } = useUser();
  const [profileUrl, setProfileUrl] = useState("/profile-update");
  const { isSignedIn, isLoaded } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/profile?clerkID=${user.id}`);
        const data = await response.json();

        if (data.success) {
          setProfileUrl("/profile");
        } else {
          setProfileUrl("/profile-update");
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [user]);

  return (
    <nav className="fixed top-0 left-0 w-full z-50">
      <div className="navbar bg-gradient-to-r from-[#0D1117] via-[#0D1117] to-[#0D1117] bg-opacity-80 backdrop-blur-lg text-[#F8F9FA] shadow-md px-4 sm:px-6 py-3">
        <div className="flex-1">
          <Link href="/" legacyBehavior>
            <a className="text-xl sm:text-2xl font-semibold text-[#C1272D] hover:text-[#8B1E3F] transition duration-300">
              রক্তসেবা
            </a>
          </Link>
        </div>

        {/* Mobile Menu Button and User Avatar */}
        <div className="flex lg:hidden items-center space-x-4">
          {isLoaded && isSignedIn && (
            <div className="flex items-center">
              <UserButton
                showName={false}
                appearance={{
                  elements: {
                    userButtonAvatarBox: {
                      width: "32px",
                      height: "32px",
                    },
                    userButtonTrigger: {
                      padding: "0",
                    },
                  },
                }}
                userProfileProps={{
                  appearance: {
                    elements: {
                      userProfile: {
                        // Customize the user profile modal if needed
                      },
                    },
                  },
                }}
              >
                <UserButton.UserProfileLink
                  label="Donation Information"
                  url="/profile-update"
                  labelIcon={<DotIcon />}
                />
              </UserButton>
            </div>
          )}
          <button
            onClick={toggleMenu}
            className="text-[#F8F9FA] hover:text-[#C1272D] transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-none items-center space-x-4">
          {isLoaded && isSignedIn ? (
            <>
              <Link href="/donors" legacyBehavior>
                <a className="btn btn-sm sm:btn-md bg-[#C1272D] text-[#F8F9FA] hover:bg-[#8B1E3F] transition duration-300">
                  Find Donors
                </a>
              </Link>
              <Link href="/recent-requests" legacyBehavior>
                <a className="btn btn-sm sm:btn-md bg-[#0D1117] text-[#F8F9FA] hover:bg-[#8B1E3F] transition duration-300">
                  Recent Requests
                </a>
              </Link>
              <Link href="/request-blood" legacyBehavior>
                <a className="btn btn-sm sm:btn-md bg-[#B0B3B8] text-[#0D1117] hover:bg-[#8B1E3F] transition duration-300">
                  Request for Blood
                </a>
              </Link>
              <div>
                <UserButton
                  showName={false}
                  appearance={{
                    elements: {
                      userButtonAvatarBox: {
                        width: "40px",
                        height: "40px",
                      },
                      userButtonTrigger: {
                        padding: "0",
                      },
                    },
                  }}
                  userProfileProps={{
                    appearance: {
                      elements: {
                        userProfile: {
                          // Customize the user profile modal if needed
                        },
                      },
                    },
                  }}
                >
                  <UserButton.UserProfileLink
                    label="Donation Information"
                    url={profileUrl}
                    labelIcon={<DotIcon />}
                  />
                </UserButton>
              </div>
            </>
          ) : (
            <Link href="/sign-in" legacyBehavior>
              <a className="btn btn-sm sm:btn-md bg-[#B0B3B8] text-[#0D1117] hover:bg-[#8B1E3F] transition duration-300">
                Login
              </a>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`lg:hidden fixed top-0 left-0 h-full w-4/6 bg-[#151b24] bg-opacity-95 backdrop-blur-lg shadow-lg transition-all duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col space-y-3 p-4 h-full">
          <div className="flex justify-end">
            <button
              onClick={toggleMenu}
              className="text-[#F8F9FA] hover:text-[#C1272D] transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          {isLoaded && isSignedIn ? (
            <>
              <Link href="/donors" legacyBehavior>
                <a
                  className="btn btn-sm w-full bg-[#C1272D] text-[#F8F9FA] hover:bg-[#8B1E3F] transition duration-300"
                  onClick={handleLinkClick}
                >
                  Find Donors
                </a>
              </Link>
              <Link href="/recent-requests" legacyBehavior>
                <a
                  className="btn btn-sm w-full bg-[#0D1117] text-[#F8F9FA] hover:bg-[#8B1E3F] transition duration-300"
                  onClick={handleLinkClick}
                >
                  Recent Requests
                </a>
              </Link>
              <Link href="/request-blood" legacyBehavior>
                <a
                  className="btn btn-sm w-full bg-[#B0B3B8] text-[#0D1117] hover:bg-[#8B1E3F] transition duration-300"
                  onClick={handleLinkClick}
                >
                  Request for Blood
                </a>
              </Link>
            </>
          ) : (
            <Link href="/sign-in" legacyBehavior>
              <a
                className="btn btn-sm w-full bg-[#B0B3B8] text-[#0D1117] hover:bg-[#8B1E3F] transition duration-300"
                onClick={handleLinkClick}
              >
                Login
              </a>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
