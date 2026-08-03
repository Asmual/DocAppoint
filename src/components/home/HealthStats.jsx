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
    <section ref={sectionRef} className="py-16 bg-white w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl text-[#941865]">
            Trusted by Thousands Across the Nation
          </h2>
          <p className="text-sm md:text-base text-gray-500 max-w-xl mx-auto leading-relaxed">
            We connect you with trusted healthcare professionals, ensuring a modern, seamless, and deeply compassionate medical journey.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {statsData.map((stat, index) => (
            <div
              key={stat.id}
              className="bg-gray-50/50 border border-gray-100 hover:border-[#941865]/30 transition-all duration-300 shadow-sm hover:shadow-md p-6 rounded-2xl flex flex-col items-center text-center group"
            >
              {/* Icon Container with match color #941865 */}
              <div 
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-sm transition-transform duration-300 group-hover:scale-110 mb-5"
                style={{ backgroundColor: "#941865" }}
              >
                {stat.icon}
              </div>

              {/* Number Count */}
              <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">
                {counts[index].toLocaleString()}
                <span className="text-[#941865]">{stat.suffix}</span>
              </h3>

              {/* Title & Description */}
              <h4 className="text-lg font-bold text-gray-800 transition-colors duration-200 group-hover:text-[#941865] mt-2">
                {stat.label}
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed mt-2 max-w-xs">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}