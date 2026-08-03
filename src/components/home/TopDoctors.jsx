"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { FaStar, FaRegClock, FaMapMarkerAlt, FaStethoscope } from "react-icons/fa";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://assignment-9-server-ybq9.onrender.com";

export default function TopRatedDoctors() {
  const router = useRouter();
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  const [topRated, setTopRated] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopDoctors = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${BACKEND_URL}/api/doctors`);
        if (res.ok) {
          const data = await res.json();
          const sortedData = [...data]
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 3);
            
          setTopRated(sortedData);
        } else {
          console.error("Failed to fetch doctors from server");
        }
      } catch (error) {
        console.error("Error fetching top rated doctors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopDoctors();
  }, []);

  const handleViewDetails = (id) => {
    router.push(isLoggedIn ? `/doctors/${id}` : "/login");
  };

  if (isLoading) {
    return (
      <div className="flex py-20 items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#941865] border-t-transparent"></div>
      </div>
    );
  }

  if (topRated.length === 0) return null;

  return (
    <section className="py-12 px-4 max-full mx-auto bg-white w-full">
      {/* Header Section */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
          Top <span style={{ color: "#941865" }}>Rated Doctors</span>
        </h2>
        <p className="mt-2 text-xs md:text-sm text-gray-500">
          Our highest rated doctors based on patient reviews and experience.
        </p>
      </div>

      {/* 3-Column Layout Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 bg-white">
        {topRated.map((doctor) => {
          const currentId = doctor._id || doctor.id;

          return (
            <div
              key={currentId}
              className="bg-white rounded-xl shadow-sm border border-[#941865]/20 overflow-hidden hover:shadow-md transition-all duration-300 group flex flex-col justify-between"
            >
              {/* Top-aligned Image Container */}
              <div className="relative h-56 w-full bg-gray-50 overflow-hidden">
                {doctor.image ? (
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    fill
                    sizes="(max-w-6xl) 33vw"
                    className="object-cover object-top group-hover:scale-102 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-2xl font-bold">
                    {doctor.name?.charAt(0)}
                  </div>
                )}
                
                {/* Rating Badge */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-[10px] font-bold px-2 py-0.5 rounded-full text-gray-800 shadow-sm flex items-center gap-1">
                  <FaStar className="text-amber-400" />
                  {doctor.rating || "N/A"}
                  <span className="text-[8px] text-gray-400 font-normal">({doctor.reviews || 0})</span>
                </div>
              </div>

              {/* Core Details Content Area */}
              <div className="p-4 flex flex-col grow gap-2.5 bg-white">
                <div>
                  {/* Doctor Identity */}
                  <h3 className="text-base font-bold text-gray-800 group-hover:text-[#941865] transition-colors line-clamp-1">
                    {doctor.name}
                  </h3>
                  
                  {/* Specialty Title */}
                  <div className="flex items-center gap-1 text-xs font-semibold mt-0.5" style={{ color: "#941865" }}>
                    <FaStethoscope className="text-[10px]" />
                    <span className="truncate">{doctor.specialty}</span>
                  </div>
                </div>

                {/* Description Paragraph */}
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed h-12 overflow-hidden">
                  {doctor.description || "No description provided for this specific doctor profile."}
                </p>

                {/* Metadata Info (Location & Experience) */}
                <div className="flex flex-col gap-1 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-gray-400 shrink-0 text-[10px]" />
                    <span className="truncate">{doctor.location || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaRegClock className="text-gray-400 shrink-0 text-[10px]" />
                    <span>{doctor.experience || "N/A"}</span>
                  </div>
                </div>

                {/* Structural Divider */}
                <div className="border-b border-gray-100 my-0.5 w-full" />

                {/* Card Footer containing Fee Metrics & Action Button */}
                <div className="flex items-center justify-between mt-auto pt-1 bg-white">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-gray-400 font-medium uppercase tracking-wider">Fee</span>
                    <span className="text-sm font-extrabold" style={{ color: "#941865" }}>
                      ${doctor.fee || 0}
                    </span>
                  </div>
                  
                  {/* Action Button */}
                  <button
                    onClick={() => handleViewDetails(currentId)}
                    className="px-3 py-2 rounded-lg text-[11px] font-semibold text-white shadow-sm hover:opacity-90 active:scale-95 transition-all duration-200 shrink-0 cursor-pointer"
                    style={{ backgroundColor: "#941865" }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}