/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { RiMenu3Line } from "react-icons/ri";
import {
  MdClose,
  MdPersonOutline,
  MdLogout,
  MdSearch,
  MdOutlineMedicalServices,
} from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import toast from "react-hot-toast";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://assignment-9-server-ybq9.onrender.com";

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef(null);

  // Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const searchRef = useRef(null);

  // JWT Fetching and Storage logic
  useEffect(() => {
    if (user?.email) {
      fetch(`${BACKEND_URL}/jwt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, name: user.name }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("JWT generation failed");
          return res.json();
        })
        .then((data) => {
          if (data.success && data.token) {
            localStorage.setItem("docappoint_token", data.token);
          }
        })
        .catch(() => {});
    } else {
      localStorage.removeItem("docappoint_token");
    }
  }, [user]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Real-time Debounced Search Logic
  useEffect(() => {
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      setSearchResults([]);
      setSearchDropdownOpen(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      setSearchDropdownOpen(true);
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/doctors/search?query=${encodeURIComponent(
            trimmedQuery
          )}`
        );

        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        const data = await res.json();

        if (data.success) {
          setSearchResults(data.doctors || []);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "All Appointments", href: "/all-appointments" },
    { label: "My Booking", href: "/booking" },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      localStorage.removeItem("docappoint_token");
      toast.success("Successfully logged out");
      setMobileMenuOpen(false);
      setDropdownOpen(false);
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  const firstName = user?.name ? user.name.split(" ")[0] : "User";

  return (
    <nav className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4 md:px-6 gap-3">
        {/* Brand Logo & Search Box Container */}
        <div className="flex items-center gap-4 lg:gap-6 flex-1 md:flex-none">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/images/logo.png"
              alt="DocAppoint Logo"
              width={42}
              height={42}
              className="object-contain"
              style={{ height: "auto" }}
            />
            <span
              className="text-xl font-bold tracking-tight hidden sm:inline"
              style={{ color: "#941865" }}
            >
              DocAppoint
            </span>
          </Link>

          {/* Search Input Box */}
          <div className="relative w-full sm:w-64 md:w-72 lg:w-80" ref={searchRef}>
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search doctors, specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchQuery.trim()) setSearchDropdownOpen(true);
                }}
                className="w-full pl-9 pr-8 py-1.5 text-xs md:text-sm bg-gray-50 border rounded-full focus:outline-none focus:bg-white transition-all text-gray-800 placeholder-gray-400"
                style={{ borderColor: "#941865" }}
              />
              <MdSearch className="absolute left-3 text-lg text-gray-400" />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                    setSearchDropdownOpen(false);
                  }}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Real-time Search Result Dropdown */}
            {searchDropdownOpen && (
              <div className="absolute left-0 mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden max-h-96 overflow-y-auto">
                {isSearching ? (
                  <div className="flex items-center justify-center py-6 gap-2 text-gray-500 text-xs">
                    <div className="w-4 h-4 border-2 border-[#941865] border-t-transparent rounded-full animate-spin" />
                    Searching doctors...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="divide-y divide-gray-50">
                    <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Doctors Found ({searchResults.length})
                    </div>
                    {searchResults.map((doctor) => (
                      <Link
                        key={doctor._id}
                        href={`/doctors/${doctor._id}`}
                        onClick={() => {
                          setSearchDropdownOpen(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-3 p-2.5 hover:bg-gray-50 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                          {doctor.image ? (
                            <img
                              src={doctor.image}
                              alt={doctor.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                              <MdOutlineMedicalServices className="text-lg" />
                            </div>
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs md:text-sm font-bold text-gray-800 group-hover:text-[#941865] transition-colors truncate">
                            {doctor.name}
                          </p>
                          <p className="text-[11px] text-[#941865] font-semibold truncate">
                            {doctor.specialty || doctor.designation || "Medical Specialist"}
                          </p>
                          {doctor.hospital && (
                            <p className="text-[10px] text-gray-400 truncate">
                              {doctor.hospital}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-6 text-center text-xs text-gray-500">
                    No doctors found matching &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors duration-200 relative group shrink-0
                ${pathname === link.href ? "text-[#941865]" : "text-gray-600 hover:text-[#941865]"}`}
            >
              {link.label}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-[#941865] transition-all duration-300
                ${pathname === link.href ? "w-full" : "w-0"}`}
              />
            </Link>
          ))}
        </div>

        {/* Desktop Auth Controls & User Profile Dropdown */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          {isPending ? (
            <div className="w-8 h-8 border-2 border-[#941865] border-t-transparent rounded-full animate-spin" />
          ) : !user ? (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-[#941865] border border-[#941865] rounded-lg py-1.5 px-4 relative overflow-hidden group transition-colors duration-300 ease-out hover:text-white"
              >
                <span className="absolute inset-0 w-full h-full bg-[#941865] transition-transform duration-300 ease-out -translate-x-full group-hover:translate-x-0" />
                <span className="relative z-10">Login</span>
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium text-white rounded-lg py-1.5 px-4 transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: "#941865" }}
              >
                Register
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 focus:outline-none cursor-pointer group"
              >
                <span className="text-sm font-semibold text-gray-700 group-hover:text-[#941865] transition-colors">
                  Hi, {firstName}
                </span>
                <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center border-2 border-[#941865]">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User"}
                      width={36}
                      height={36}
                      className="object-cover w-full h-full rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <FaUserCircle className="text-3xl text-[#941865]" />
                  )}
                </div>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 transition-all duration-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-800 truncate">{user.name}</p>
                    <p className="text-xs font-medium text-gray-500 truncate">{user.email}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/my-profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#941865] transition-colors"
                    >
                      <MdPersonOutline className="text-lg" />
                      View Profile
                    </Link>
                  </div>

                  <div className="border-t border-gray-100 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <MdLogout className="text-lg" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="focus:outline-none text-gray-700 hover:text-[#941865] transition-colors p-1"
          >
            {mobileMenuOpen ? <MdClose className="text-2xl" /> : <RiMenu3Line className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Options */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-md">
          <div className="flex flex-col px-6 py-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-semibold py-2.5 border-b border-gray-50 transition-colors duration-200
                  ${pathname === link.href ? "text-[#941865]" : "text-gray-600 hover:text-[#941865]"}`}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-[#941865] align-middle" />
                )}
              </Link>
            ))}
            <div className="pt-3 flex flex-col gap-2">
              {isPending ? (
                <div className="flex justify-center py-2">
                  <div className="w-6 h-6 border-2 border-[#941865] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : !user ? (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center text-sm font-semibold text-[#941865] border border-[#941865] rounded-lg py-2.5 hover:bg-[#941865] hover:text-white transition-all duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center text-sm font-semibold text-white rounded-lg py-2.5 hover:opacity-90 transition-all duration-200"
                    style={{ backgroundColor: "#941865" }}
                  >
                    Register
                  </Link>
                </>
              ) : (
                <div className="flex flex-col gap-3 pt-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center border-2 border-[#941865]">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.name || "User"}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full rounded-full"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <FaUserCircle className="text-4xl text-[#941865]" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">Hi, {firstName}</p>
                      <p className="text-xs font-medium text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/my-profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-[#941865] py-1"
                  >
                    <MdPersonOutline className="text-lg" /> View Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-white rounded-lg py-2.5 transition-opacity hover:opacity-90 cursor-pointer mt-1"
                    style={{ backgroundColor: "#941865" }}
                  >
                    <MdLogout className="text-lg" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}