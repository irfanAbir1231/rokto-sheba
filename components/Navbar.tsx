"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isLoggedIn } = useAuth();

  return (
    <div className="navbar bg-gradient-to-r from-[#0D1117] via-[#0D1117] to-[#0D1117] bg-opacity-80 backdrop-blur-lg text-[#F8F9FA] shadow-md px-6 py-3">
      <div className="flex-1">
        <Link
          href="/"
          className="text-2xl font-semibold text-[#C1272D] hover:text-[#8B1E3F] transition duration-300"
        >
          Blood Donation App
        </Link>
      </div>
      <div className="flex-none flex items-center space-x-4">
        {isLoggedIn ? (
          <>
            <Link
              href="/donors"
              className="btn bg-[#C1272D] text-[#F8F9FA] hover:bg-[#8B1E3F] transition duration-300"
            >
              Find Donors
            </Link>
            <Link
              href="/recent-requests"
              className="btn bg-[#0D1117] text-[#F8F9FA] hover:bg-[#8B1E3F] transition duration-300"
            >
              Recent Requests
            </Link>
            <Link
              href="/request-blood"
              className="btn bg-[#B0B3B8] text-[#0D1117] hover:bg-[#8B1E3F] transition duration-300"
            >
              Request for Blood
            </Link>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-12 h-12 rounded-full border-2 border-[#F8F9FA] shadow-lg overflow-hidden">
                  <img
                    alt="Profile"
                    src="/image1.jpg"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="mt-3 p-3 shadow-lg menu menu-compact dropdown-content bg-[#0D1117] text-[#F8F9FA] rounded-lg w-48"
              >
                <li>
                  <Link
                    href="/profile"
                    className="btn bg-[#C1272D] text-[#F8F9FA] hover:bg-[#8B1E3F] transition duration-300 w-full text-center"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/logout"
                    className="btn bg-[#8B1E3F] text-[#F8F9FA] hover:bg-[#C1272D] transition duration-300 w-full text-center"
                  >
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <Link
            href="/login"
            className="btn bg-[#B0B3B8] text-[#0D1117] hover:bg-[#8B1E3F] transition duration-300"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
