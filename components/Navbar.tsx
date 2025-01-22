"use client";

import Link from "next/link";
import { useUser } from "@clerk/clerk-react";
import { UserButton } from "@clerk/nextjs";

const DotIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="currentColor"
    >
      <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
    </svg>
  );
};

const Navbar = () => {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <div className="navbar bg-gradient-to-r from-[#0D1117] via-[#0D1117] to-[#0D1117] bg-opacity-80 backdrop-blur-lg text-[#F8F9FA] shadow-md px-6 py-3">
      <div className="flex-1">
        <Link href="/" legacyBehavior>
          <a className="text-2xl font-semibold text-[#C1272D] hover:text-[#8B1E3F] transition duration-300">
            Blood Donation App
          </a>
        </Link>
      </div>
      <div className="flex-none flex items-center space-x-4">
        {isLoaded && isSignedIn ? (
          <>
            <Link href="/donors" legacyBehavior>
              <a className="btn bg-[#C1272D] text-[#F8F9FA] hover:bg-[#8B1E3F] transition duration-300">
                Find Donors
              </a>
            </Link>
            <Link href="/recent-requests" legacyBehavior>
              <a className="btn bg-[#0D1117] text-[#F8F9FA] hover:bg-[#8B1E3F] transition duration-300">
                Recent Requests
              </a>
            </Link>
            <Link href="/request-blood" legacyBehavior>
              <a className="btn bg-[#B0B3B8] text-[#0D1117] hover:bg-[#8B1E3F] transition duration-300">
                Request for Blood
              </a>
            </Link>
            <div>
              <UserButton
                showName={true}
                appearance={{
                  elements: {
                    userButtonAvatarBox: {
                      width: "48px",
                      height: "48px",
                    },
                    userButtonTrigger: {
                      padding: "12px",
                      fontSize: "16px",
                    },
                  },
                }}
              >
                <UserButton.UserProfileLink
                  label="Donation Information"
                  url="/profile"
                  labelIcon={<DotIcon />}
                />
              </UserButton>
            </div>
          </>
        ) : (
          <Link href="/sign-in" legacyBehavior>
            <a className="btn bg-[#B0B3B8] text-[#0D1117] hover:bg-[#8B1E3F] transition duration-300">
              Login
            </a>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
