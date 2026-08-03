"use client";

import Image from "next/image";
import { FaStar, FaRegStar, FaQuoteLeft } from "react-icons/fa6";

const reviews = [
  {
    id: 1,
    name: "Fatema Begum",
    image: "/images/Fatema-Begum.jpg",
    location: "Dhaka, Bangladesh",
    rating: 5,
    comment:
      "DocAppoint made booking my cardiologist appointment incredibly easy. The doctor was professional and attentive. I highly recommend this platform to everyone.",
    doctor: "Dr. Jahangir Alam",
    specialty: "Cardiologist",
  },
  {
    id: 2,
    name: "Rahim Uddin",
    image: "/images/Rahim-Uddin.jpg",
    location: "Chittagong, Bangladesh",
    rating: 5,
    comment:
      "I was able to find and book a specialist within minutes. No more waiting in long queues. This service has genuinely changed how I manage my family's healthcare.",
    doctor: "Dr. Mehedi Hasan",
    specialty: "Neurologist",
  },
  {
    id: 3,
    name: "Nusrat Jahan",
    image: "/images/Nusrat-Jahan.jpg",
    location: "Sylhet, Bangladesh",
    rating: 4,
    comment:
      "Very smooth experience from start to finish. The interface is clean, the doctors are highly qualified, and the confirmation was instant. Will definitely use again.",
    doctor: "Dr. Sumaiya Islam",
    specialty: "Dermatologist",
  },
];

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
          {star <= rating ? (
            <FaStar className="text-yellow-400 text-sm" />
          ) : (
            <FaRegStar className="text-gray-200 text-sm" />
          )}
        </span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-12 px-4 max-full mx-auto bg-[#FDF4F9] w-full">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            What Our <span style={{ color: "#941865" }}>Patients Say</span>
          </h2>
          <p className="mt-2 text-xs md:text-sm text-gray-500">
            Thousands of patients trust DocAppoint for their healthcare needs. Here is what some of them have to say.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-[#941865]/20 flex flex-col gap-4 hover:shadow-md transition-shadow duration-300"
            >
              {/* Quote Icon Box */}
              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-[#FDE8F3]">
                <FaQuoteLeft className="text-[#941865] text-2xl" />
              </div>

              {/* Rating Component */}
              <StarRating rating={review.rating} />

              {/* Patient Comment */}
              <p className="text-gray-600 text-sm leading-relaxed flex-1">
                &ldquo;{review.comment}&rdquo;
              </p>

              {/* Clean Divider Line */}
              <div className="h-px bg-gray-100 w-full" />

              {/* Patient and Doctor Footer Info */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full overflow-hidden border-2 shrink-0 border-[#941865]">
                  <Image
                    src={review.image}
                    alt={review.name}
                    width={44}
                    height={44}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{review.name}</p>
                  <p className="text-xs text-gray-400">{review.location}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-xs font-medium text-[#941865]">
                    {review.doctor}
                  </p>
                  <p className="text-xs text-gray-400">{review.specialty}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Metrics/Stats */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { number: "500+", label: "Expert Doctors" },
            { number: "10K+", label: "Happy Patients" },
            { number: "50+", label: "Specialties" },
            { number: "4.9", label: "Average Rating" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-[#941865]">
                {stat.number}
              </p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}