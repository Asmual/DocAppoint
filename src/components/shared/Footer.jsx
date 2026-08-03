/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaLocationDot,
} from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white w-full">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-wrap lg:flex-nowrap justify-between gap-6 lg:gap-8">
          
          {/* Column 1: Brand Info & Address */}
          <div className="w-full sm:w-[48%] lg:w-[28%] space-y-3.5">
            <Link href="/" className="flex items-center gap-2.5">
              <img
                src="/images/logo.png"
                alt="DocAppoint Logo"
                width={40}
                height={40}
                className="object-contain"
                style={{ height: "auto" }}
              />
              <div>
                <h2 className="text-2xl font-bold text-[#941865]">
                  DocAppoint
                </h2>
                <p className="text-[11px] font-medium text-gray-500">
                  Healthcare Platform
                </p>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-gray-600">
              Book appointments with trusted doctors and manage your healthcare
              journey smoothly.
            </p>

            {/* Dhanmondi Hospital Location */}
            <div className="flex items-start gap-2 pt-1 text-xs text-gray-600">
              <FaLocationDot className="text-[#941865] text-sm shrink-0 mt-0.5" />
              <span>
                House 27, Road 9/A, Dhanmondi, Dhaka-1209, Bangladesh
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="w-full sm:w-[48%] lg:w-auto">
            <div className="relative mb-4 pb-2">
              <h3 className="text-base font-bold text-[#941865]">
                Quick Links
              </h3>
              <span className="absolute bottom-0 left-0 h-[2px] w-[20px] bg-[#941865] rounded-full"></span>
            </div>

            <ul className="space-y-2.5 text-sm font-medium text-gray-600">
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
          <div className="w-full sm:w-[48%] lg:w-auto">
            <div className="relative mb-4 pb-2">
              <h3 className="text-base font-bold text-[#941865]">
                Services
              </h3>
              <span className="absolute bottom-0 left-0 h-[2px] w-[20px] bg-[#941865] rounded-full"></span>
            </div>

            <ul className="space-y-2.5 text-sm font-medium text-gray-600">
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

          {/* Column 4: Policy & Support */}
          <div className="w-full sm:w-[48%] lg:w-auto">
            <div className="relative mb-4 pb-2">
              <h3 className="text-base font-bold text-[#941865]">
                Support & Legal
              </h3>
              <span className="absolute bottom-0 left-0 h-[2px] w-[20px] bg-[#941865] rounded-full"></span>
            </div>

            <ul className="space-y-2.5 text-sm font-medium text-gray-600">
              <li>
                <Link href="/privacy-policy" className="transition duration-300 hover:text-[#941865]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition duration-300 hover:text-[#941865]">
                  Terms & Conditions
                </Link>
              </li>
              <li className="transition duration-300 hover:text-[#941865] cursor-pointer">
                Help Center
              </li>
              <li className="transition duration-300 hover:text-[#941865] cursor-pointer">
                Contact Us
              </li>
            </ul>
          </div>

          {/* Column 5: Social Media & App Downloads */}
          <div className="w-full sm:w-[48%] lg:w-auto space-y-4">
            <div>
              <div className="relative mb-3 pb-2">
                <h3 className="text-base font-bold text-[#941865]">
                  Follow Us
                </h3>
                <span className="absolute bottom-0 left-0 h-[2px] w-[20px] bg-[#941865] rounded-full"></span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#941865] text-[#941865] transition-all duration-300 hover:bg-[#941865] hover:text-white hover:scale-105 shadow-2xs"
                >
                  <FaFacebookF className="text-xs" />
                </Link>

                <Link
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#941865] text-[#941865] transition-all duration-300 hover:bg-[#941865] hover:text-white hover:scale-105 shadow-2xs"
                >
                  <FaInstagram className="text-xs" />
                </Link>

                <Link
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#941865] text-[#941865] transition-all duration-300 hover:bg-[#941865] hover:text-white hover:scale-105 shadow-2xs"
                >
                  <FaLinkedinIn className="text-xs" />
                </Link>

                <Link
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#941865] text-[#941865] transition-all duration-300 hover:bg-[#941865] hover:text-white hover:scale-105 shadow-2xs"
                >
                  <FaXTwitter className="text-xs" />
                </Link>
              </div>
            </div>

            {/* App Downloads */}
            <div>
              <h4 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-700">
                Download Mobile App
              </h4>
              <div className="flex flex-col gap-1.5 items-start">
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform duration-200 hover:scale-105"
                >
                  <img
                    src="/images/footer/google-play.svg"
                    alt="Get it on Google Play"
                    className="h-8 w-auto object-contain"
                  />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform duration-200 hover:scale-105"
                >
                  <img
                    src="/images/footer/app-store.svg"
                    alt="Download on the App Store"
                    className="h-8 w-auto object-contain"
                  />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar: Zero Vertical Padding & Larger Image Height */}
      <div className="border-t border-gray-200 py-1.5 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 md:flex-row">
          
          {/* Copyright Text */}
          <p className="text-sm text-gray-600 font-medium text-center md:text-left">
            Copyright © 2026 DocAppoint. All rights reserved.
          </p>

          {/* Pay With Section with Prominent Image */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm font-bold text-gray-800 whitespace-nowrap">
              Pay With
            </span>
            <img
              src="/images/footer/pay-with.png"
              alt="Payment Methods"
              className="h-10 sm:h-12 md:h-14 w-auto object-contain max-w-full"
            />
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;