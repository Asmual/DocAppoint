"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp, signIn } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { FaUser, FaEnvelope, FaLock, FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signUp.email({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        toast.error(error.message || "Registration failed. Please try again.");
      } else {
        toast.success("Account created successfully!");
        router.push("/");
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err) {
      console.error("Google login error:", err);
      toast.error("Failed to login with Google.");
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-[#9E2F74]/30 shadow-md shadow-[#9E2F74]/10 my-auto mx-auto transition-all">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-extrabold text-[#9E2F74]">Create Account</h2>
        <p className="text-xs text-gray-600 mt-1">
          Join DocAppoint to easily manage your healthcare appointments
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Name Field */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-[#9E2F74] uppercase tracking-wider">
            Full Name
          </label>
          <div className="relative flex items-center">
            <FaUser className="absolute left-3.5 text-[#9E2F74]/70 text-sm pointer-events-none" />
            <input
              type="text"
              name="name"
              required
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-[#9E2F74]/30 rounded-xl text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#9E2F74] focus:ring-1 focus:ring-[#9E2F74] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-[#9E2F74] uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative flex items-center">
            <FaEnvelope className="absolute left-3.5 text-[#9E2F74]/70 text-sm pointer-events-none" />
            <input
              type="email"
              name="email"
              required
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-[#9E2F74]/30 rounded-xl text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#9E2F74] focus:ring-1 focus:ring-[#9E2F74] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Password Field with Show/Hide Toggle */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-[#9E2F74] uppercase tracking-wider">
            Password
          </label>
          <div className="relative flex items-center">
            <FaLock className="absolute left-3.5 text-[#9E2F74]/70 text-sm pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2.5 bg-gray-50/50 border border-[#9E2F74]/30 rounded-xl text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#9E2F74] focus:ring-1 focus:ring-[#9E2F74] focus:bg-white transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-[#9E2F74]/70 hover:text-[#9E2F74] focus:outline-none cursor-pointer transition-colors"
            >
              {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
            </button>
          </div>
        </div>

        {/* Confirm Password Field with Show/Hide Toggle */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-[#9E2F74] uppercase tracking-wider">
            Repeat Password
          </label>
          <div className="relative flex items-center">
            <FaLock className="absolute left-3.5 text-[#9E2F74]/70 text-sm pointer-events-none" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              required
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2.5 bg-gray-50/50 border border-[#9E2F74]/30 rounded-xl text-xs text-[#9E2F74] placeholder:text-gray-400 focus:outline-none focus:border-[#9E2F74] focus:ring-1 focus:ring-[#9E2F74] focus:bg-white transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 text-[#9E2F74]/70 hover:text-[#9E2F74] focus:outline-none cursor-pointer transition-colors"
            >
              {showConfirmPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 mt-2 text-xs font-bold text-white rounded-xl shadow-md shadow-[#9E2F74]/20 transition-all duration-200 hover:opacity-90 active:scale-[0.99] flex items-center justify-center cursor-pointer disabled:opacity-75"
          style={{ backgroundColor: "#9E2F74" }}
        >
          {isLoading ? <FaSpinner className="animate-spin text-base" /> : "Register"}
        </button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-6">
        <span className="absolute inset-x-0 h-px bg-[#9E2F74]/20" />
        <span className="relative bg-white px-3 text-[11px] font-semibold text-[#9E2F74]/80 uppercase">
          Or continue with
        </span>
      </div>

      {/* Google Login Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="w-full flex items-center justify-center gap-3 py-2.5 border border-[#9E2F74]/30 rounded-xl text-xs font-semibold text-gray-700 bg-white hover:bg-pink-50/30 active:scale-[0.99] transition-all shadow-sm cursor-pointer"
      >
        <FcGoogle className="text-xl shrink-0" />
        <span>Login with Google</span>
      </button>

      {/* Existing Account Footer */}
      <p className="text-center text-xs text-gray-600 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-[#9E2F74] hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}