/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/immutability */
"use client";

import React, { useEffect, useState, useRef } from "react";
import { FaUserMd, FaSmile, FaHospital, FaCheckCircle } from "react-icons/fa";

const statsData = [
  {
    id: "doctors",
    target: 500,
    suffix: "+",
    label: "Specialist Doctors",
    description: "Consult with highly qualified, board-certified medical specialists with years of clinical experience.",
    icon: <FaUserMd className="text-xl" />,
  },
  {
    id: "patients",
    target: 10000,
    suffix: "+",
    label: "Happy Patients",
    description: "Successfully treated thousands of patients with top-tier healthcare and full satisfaction.",
    icon: <FaSmile className="text-xl" />,
  },
  {
    id: "hospitals",
    target: 20,
    suffix: "+",
    label: "Hospital Partners",
    description: "Top reputed healthcare medical centers and clinical institutions partnering with us.",
    icon: <FaHospital className="text-xl" />,
  },
  {
    id: "satisfaction",
    target: 99,
    suffix: "%",
    label: "Positive Feedback",
    description: "Consistent high ratings and positive patient feedback for medical assistance.",
    icon: <FaCheckCircle className="text-xl" />,
  },
];

export default function HealthStats() {
  const [counts, setCounts] = useState(statsData.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounters();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasAnimated]);

  const animateCounters = () => {
    const duration = 2000;
    const steps = 50;
    const intervalTime = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounts(
        statsData.map((item) => Math.floor(item.target * progress))
      );

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounts(statsData.map((item) => item.target));
      }
    }, intervalTime);
  };

  return (
    <section ref={sectionRef} className="py-12 px-4 max-full mx-auto bg-white w-full overflow-hidden">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            Healthcare <span style={{ color: "#941865" }}>Thousands Across the Nation</span>
          </h2>
          <p className="mt-2 text-xs md:text-sm text-gray-500">
            We connect you with trusted healthcare professionals, ensuring a modern, seamless, and deeply compassionate medical journey.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <div
              key={stat.id}
              className="bg-gray-50/50 border border-[#941865]/20 hover:border-[#941865]/40 transition-all duration-300 shadow-sm hover:shadow-md p-6 rounded-2xl flex flex-col items-center text-center group"
            >
              {/* Icon Container */}
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-sm transition-transform duration-300 group-hover:scale-110 mb-4"
                style={{ backgroundColor: "#941865" }}
              >
                {stat.icon}
              </div>

              {/* Number Count */}
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">
                {counts[index].toLocaleString()}
                <span className="text-gray-800">{stat.suffix}</span>
              </h3>

              {/* Title & Description */}
              <h4 className="text-sm font-bold text-gray-800 transition-colors duration-200 group-hover:text-[#941865] mt-2">
                {stat.label}
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed mt-2 max-w-xs">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}