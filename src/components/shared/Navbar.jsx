/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { RiMenu3Line } from "react-icons/ri";
import { MdClose, MdBookmarkBorder, MdPersonOutline, MdLogout } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import toast from "react-hot-toast";

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef(null);

  // JWT Fetching and Storage logic
  useEffect(() => {
    if (user?.email) {
      fetch("https://assignment-9-server-ybq9.onrender.com/jwt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, name: user.name }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.token) {
            localStorage.setItem("docappoint_token", data.token);
          }
        })
        .catch(() => { });
    } else {
      localStorage.removeItem("docappoint_token");
    }
  }, [user]);

  // Handle click outside to close user dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  // Helper to extract first name
  const firstName = user?.name ? user.name.split(" ")[0] : "User";

  return (
    <nav className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-6">
       
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/images/logo.png" alt="DocAppoint Logo" width={46} height={46} className="object-contain" style={{ height: "auto" }} />
          <span className="text-xl font-bold tracking-tight" style={{ color: "#941865" }}>DocAppoint</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}
              className={`text-sm font-medium transition-colors duration-200 relative group
                ${pathname === link.href ? "text-[#941865]" : "text-gray-600 hover:text-[#941865]"}`}>
              {link.label}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#941865] transition-all duration-300
                ${pathname === link.href ? "w-full" : "w-0"}`} />
            </Link>
          ))}
        </div>
       
        {/* Desktop Auth Controls & User Profile Dropdown */}
        <div className="hidden md:flex items-center gap-4">
          {isPending ? (
            <div className="w-8 h-8 border-2 border-[#941865] border-t-transparent rounded-full animate-spin" />
          ) : !user ? (
            <>
              <Link href="/login" className="text-sm font-medium text-[#941865] border border-[#941865] rounded-lg py-2 px-5 relative overflow-hidden group transition-colors duration-300 ease-out hover:text-white">
                <span className="absolute inset-0 w-full h-full bg-[#941865] transition-transform duration-300 ease-out -translate-x-full group-hover:translate-x-0" />
                <span className="relative z-10">Login</span>
              </Link>
              <Link href="/register" className="text-sm font-medium text-white rounded-lg py-2 px-4 transition-all duration-200 hover:opacity-90" style={{ backgroundColor: "#941865" }}>Register</Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              {/* User Greeting & Avatar Trigger */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 focus:outline-none cursor-pointer group"
              >
                <span className="text-sm font-semibold text-gray-700 group-hover:text-[#941865] transition-colors">
                  Hi, {firstName}
                </span>
                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center border-2 border-[#941865]">
                  {user.image ? (
                    <Image src={user.image} alt={user.name || "User"} width={40} height={40}
                      className="object-cover w-full h-full rounded-full" referrerPolicy="no-referrer" />
                  ) : (
                    <FaUserCircle className="text-4xl text-[#941865]" />
                  )}
                </div>
              </button>

              {/* User Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 transition-all duration-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-800 truncate">{user.name}</p>
                    <p className="text-xs font-medium text-gray-500 truncate">{user.email}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/booking"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#941865] transition-colors"
                    >
                      <MdBookmarkBorder className="text-lg" />
                      My Booking
                    </Link>
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
        <div className="flex md:hidden items-center gap-3">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="focus:outline-none text-gray-700 hover:text-[#941865] transition-colors">
            {mobileMenuOpen ? <MdClose className="text-2xl" /> : <RiMenu3Line className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Options */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-md">
          <div className="flex flex-col px-6 py-4 gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-semibold py-2.5 border-b border-gray-50 transition-colors duration-200
                  ${pathname === link.href ? "text-[#941865]" : "text-gray-600 hover:text-[#941865]"}`}>
                {link.label}
                {pathname === link.href && <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-[#941865] align-middle" />}
              </Link>
            ))}
            <div className="pt-3 flex flex-col gap-2">
              {isPending ? (
                <div className="flex justify-center py-2">
                  <div className="w-6 h-6 border-2 border-[#941865] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : !user ? (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center text-sm font-semibold text-[#941865] border border-[#941865] rounded-lg py-2.5 hover:bg-[#941865] hover:text-white transition-all duration-200">Login</Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="w-full text-center text-sm font-semibold text-white rounded-lg py-2.5 hover:opacity-90 transition-all duration-200" style={{ backgroundColor: "#941865" }}>Register</Link>
                </>
              ) : (
                <div className="flex flex-col gap-3 pt-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center border-2 border-[#941865]">
                      {user.image ? (
                        <Image src={user.image} alt={user.name || "User"} width={40} height={40}
                          className="object-cover w-full h-full rounded-full" referrerPolicy="no-referrer" />
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
                    href="/booking"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-[#941865] py-1"
                  >
                    <MdBookmarkBorder className="text-lg" /> My Booking
                  </Link>
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