"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { FaEnvelope, FaLock, FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        toast.error(error.message || "Invalid credentials. Please try again.");
      } else {
        toast.success("Logged in successfully!");
        router.push("/");
      }
    } catch (err) {
      console.error("Login error:", err);
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
        <h2 className="text-3xl font-extrabold text-[#9E2F74]">Welcome Back</h2>
        <p className="text-xs text-gray-600 mt-1">
          Login to your account to manage your medical appointments
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 mt-2 text-xs font-bold text-white rounded-xl shadow-md shadow-[#9E2F74]/20 transition-all duration-200 hover:opacity-90 active:scale-[0.99] flex items-center justify-center cursor-pointer disabled:opacity-75"
          style={{ backgroundColor: "#9E2F74" }}
        >
          {isLoading ? <FaSpinner className="animate-spin text-base" /> : "Login"}
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

      {/* Register Link Footer */}
      <p className="text-center text-xs text-gray-600 mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-bold text-[#9E2F74] hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}