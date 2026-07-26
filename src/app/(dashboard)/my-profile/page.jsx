"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { 
    FaCamera, 
    FaUser, 
    FaEnvelope, 
    FaPhone, 
    FaSave, 
    FaSpinner, 
    FaUserShield 
} from "react-icons/fa";

// Global Production/Development Backend API Endpoint
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://assignment-9-server-ybq9.onrender.com";

// ImgBB API Key
const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "8db3ed627958165a68869da0d42a539e";

export default function MyProfilePage() {
    const router = useRouter();
    const { data: session, isPending, refetch } = useSession();

    // Local state for user metadata
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        image: ""
    });

    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch active profile data directly from MongoDB & Session on page load
    useEffect(() => {
        const loadProfileData = async () => {
            if (!isPending && session?.user?.email) {
                const userEmail = session.user.email;

                // Fallback initial data from auth session
                setFormData({
                    name: session.user.name || "",
                    email: userEmail,
                    phone: session.user.phone || session.user.phoneNumber || "",
                    image: session.user.image || session.user.avatar || ""
                });

                // Fetch database stored details from backend so data persists after refresh
                try {
                    const res = await fetch(`${BACKEND_URL}/api/users/profile?email=${encodeURIComponent(userEmail)}`);
                    if (res.ok) {
                        const dbResult = await res.json();
                        if (dbResult?.data) {
                            setFormData({
                                name: dbResult.data.name || session.user.name || "",
                                email: userEmail,
                                phone: dbResult.data.phone || session.user.phone || session.user.phoneNumber || "",
                                image: dbResult.data.image || session.user.image || session.user.avatar || ""
                            });
                        }
                    }
                } catch (err) {
                    console.error("Failed to load user profile from MongoDB:", err);
                }
            }
        };

        loadProfileData();
    }, [session, isPending]);

    // Redirect unauthenticated traffic
    useEffect(() => {
        if (!isPending && !session?.user) {
            router.push("/login");
        }
    }, [session, isPending, router]);

    /**
     * Direct upload to ImgBB API
     */
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please upload a valid image file.");
            return;
        }

        const imageData = new FormData();
        imageData.append("image", file);

        try {
            setIsUploadingImage(true);
            toast.loading("Uploading image...", { id: "img-upload" });

            const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                method: "POST",
                body: imageData,
            });

            const data = await res.json();

            if (data.success && data.data?.display_url) {
                const uploadedImageUrl = data.data.display_url;
                setFormData((prev) => ({ ...prev, image: uploadedImageUrl }));
                toast.success("Image uploaded successfully! Click to save permanently.", { id: "img-upload" });
            } else {
                toast.error(data?.error?.message || "Image Upload failed!", { id: "img-upload" });
            }
        } catch (error) {
            console.error("ImgBB Upload error:", error);
            toast.error("Error uploading image.", { id: "img-upload" });
        } finally {
            setIsUploadingImage(false);
        }
    };

    /**
     * Submit profile update to Backend & MongoDB
     */
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem("docappoint_token");

            const updatePayload = {
                email: formData.email || session?.user?.email,
                name: formData.name,
                phone: formData.phone,
                phoneNumber: formData.phone,
                image: formData.image,
                avatar: formData.image
            };

            const res = await fetch(`${BACKEND_URL}/api/users/profile`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { "Authorization": `Bearer ${token}` }),
                },
                body: JSON.stringify(updatePayload)
            });

            const contentType = res.headers.get("content-type");
            let result;

            if (contentType && contentType.includes("application/json")) {
                result = await res.json();
            } else {
                const textText = await res.text();
                console.error("Backend non-JSON response:", textText);
                throw new Error(`Server connection error (${res.status}).`);
            }

            if (res.ok && result.success) {
                toast.success(result.message || "Profile details updated successfully!");
                
                if (typeof refetch === "function") {
                    await refetch();
                } else {
                    router.refresh();
                }
            } else {
                toast.error(result.message || "Failed to update profile.");
            }
        } catch (error) {
            console.error("Update profile error:", error);
            toast.error(error.message || "Server error while saving profile.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isPending) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#941865] border-t-transparent"></div>
            </div>
        );
    }

    if (!session?.user) return null;

    return (
        <div className="w-full min-h-[70vh] px-4 py-8 md:px-6 bg-white">
            <div className="max-w-3xl mx-auto space-y-8">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl text-[#941865]">
                        My Profile
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage your account information and preferences.
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-[#941865] p-6 md:p-8 shadow-sm">
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                        
                        {/* Avatar Image Upload Section */}
                        <div className="flex flex-col items-center justify-center pb-6 border-b border-gray-100">
                            <div className="relative group">
                                <div className="h-28 w-28 md:h-32 md:w-32 rounded-full overflow-hidden border-4 border-[#941865]/10 shadow-md relative bg-gray-50 flex items-center justify-center">
                                    {formData.image ? (
                                        <Image 
                                            src={formData.image} 
                                            alt="User Avatar" 
                                            fill
                                            sizes="128px"
                                            className="object-cover"
                                            unoptimized
                                        />
                                    ) : (
                                        <FaUser className="text-4xl text-gray-400" />
                                    )}

                                    {isUploadingImage && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                                            <FaSpinner className="animate-spin text-2xl" />
                                        </div>
                                    )}
                                </div>

                                <label 
                                    htmlFor="avatar-upload"
                                    className="absolute bottom-1 right-1 bg-[#941865] text-white p-2.5 rounded-full shadow-md hover:bg-[#7a1353] cursor-pointer transition-all hover:scale-105 active:scale-95"
                                    title="Upload new image"
                                >
                                    <FaCamera className="text-xs md:text-sm" />
                                </label>
                                <input 
                                    type="file" 
                                    id="avatar-upload" 
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden" 
                                    disabled={isUploadingImage}
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-3">
                                Click camera icon to upload photo. Max size: 5MB. Supported formats: JPG, PNG, GIF.
                            </p>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                    <FaUser className="text-[#941865]" /> Full Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter your full name"
                                    className="bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-gray-800 focus:outline-none focus:border-[#941865] transition-colors shadow-sm"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                                    <FaEnvelope className="text-[#941865]" /> Email Address <FaUserShield className="text-gray-400 text-xs" />
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    readOnly
                                    className="bg-gray-100 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-gray-500 cursor-not-allowed focus:outline-none"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5 md:col-span-2">
                                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                                    <FaPhone className="text-[#941865]" /> Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+880 1XXXXXXXXX"
                                    className="bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-gray-800 focus:outline-none focus:border-[#941865] transition-colors shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting || isUploadingImage}
                                className="cursor-pointer py-2.5 px-6 rounded-xl text-xs md:text-sm font-bold text-white shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                style={{ backgroundColor: "#941865" }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <FaSpinner className="animate-spin text-sm" /> Saving Changes...
                                    </>
                                ) : (
                                    <>
                                        <FaSave className="text-sm" /> Save Profile
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}