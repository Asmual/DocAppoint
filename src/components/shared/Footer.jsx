/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Image from "next/image";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white w-full">
      {/* Main Footer Links Grid */}
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-2 lg:grid-cols-4">

        {/* Column 1: Brand Info */}
        <div className="space-y-5">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="DocAppoint Logo"
              width={46}
              height={46}
              className="object-contain"
              style={{ height: "auto" }}
            />
            <div>
              <h2 className="text-3xl font-bold text-[#941865]">
                DocAppoint
              </h2>
              <p className="text-sm text-gray-500">
                Healthcare Appointment Platform
              </p>
            </div>
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-gray-600">
            Book appointments with trusted doctors and manage your healthcare
            journey through a modern and secure medical platform.
          </p>
        </div>

        {/* Column 2: Navigation Links */}
        <div>
          <h3 className="mb-5 text-xl font-semibold text-[#941865]">
            Quick Links
          </h3>
          <ul className="space-y-4 text-sm text-gray-600">
            <li>
              <Link href="/" className="transition duration-300 hover:text-[#941865]">
                Home
              </Link>
            </li>
            <li>
              <Link href="/all-appointments" className="transition duration-300 hover:text-[#941865]">
                All Appointments
              </Link>
            </li>
            <li>
              <Link href="/booking" className="transition duration-300 hover:text-[#941865]">
                My Booking
              </Link>
            </li>
            <li>
              <Link href="/login" className="transition duration-300 hover:text-[#941865]">
                Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Platform Services */}
        <div>
          <h3 className="mb-5 text-xl font-semibold text-[#941865]">
            Services
          </h3>
          <ul className="space-y-4 text-sm text-gray-600">
            <li className="transition duration-300 hover:text-[#941865] cursor-pointer">
              Online Appointment
            </li>
            <li className="transition duration-300 hover:text-[#941865] cursor-pointer">
              Specialist Doctors
            </li>
            <li className="transition duration-300 hover:text-[#941865] cursor-pointer">
              Patient Support
            </li>
            <li className="transition duration-300 hover:text-[#941865] cursor-pointer">
              Health Consultation
            </li>
          </ul>
        </div>

        {/* Column 4: Social Connections */}
        <div>
          <h3 className="mb-5 text-xl font-semibold text-[#941865]">
            Follow Us
          </h3>
          <p className="text-sm text-gray-600 mb-5 leading-relaxed">
            Stay connected with us on social media for regular healthcare tips and platform updates.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#941865] text-[#941865] transition-all duration-300 hover:bg-[#941865] hover:text-white hover:scale-110 shadow-sm"
            >
              <FaFacebookF className="text-sm" />
            </Link>

            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#941865] text-[#941865] transition-all duration-300 hover:bg-[#941865] hover:text-white hover:scale-110 shadow-sm"
            >
              <FaInstagram className="text-sm" />
            </Link>

            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#941865] text-[#941865] transition-all duration-300 hover:bg-[#941865] hover:text-white hover:scale-110 shadow-sm"
            >
              <FaLinkedinIn className="text-sm" />
            </Link>

            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#941865] text-[#941865] transition-all duration-300 hover:bg-[#941865] hover:text-white hover:scale-110 shadow-sm"
            >
              <FaXTwitter className="text-sm" />
            </Link>
          </div>
        </div>

      </div>

      {/* Footer Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-center text-sm text-gray-500 md:flex-row ">
          <p>
            © 2026 DocAppoint. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="transition duration-300 hover:text-[#941865]">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition duration-300 hover:text-[#941865]">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;