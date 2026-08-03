"use client";

import React, { useState } from "react";
import { FiPhoneCall } from "react-icons/fi";

const faqList = [
  {
    id: 1,
    category: "Booking",
    question: "How do I book an appointment with a doctor?",
    answer: "Search for your preferred doctor or specialty, select a convenient date and time slot from their profile, and click 'Book Appointment'. Follow the prompt to confirm your contact details.",
  },
  {
    id: 2,
    category: "Booking",
    question: "Can I cancel or reschedule my appointment?",
    answer: "Yes, you can manage your appointments directly from your account dashboard. Navigating to 'My Bookings' allows you to request a cancellation or reschedule up to 2 hours prior to the slot.",
  },
  {
    id: 3,
    category: "Payment",
    question: "What payment methods are supported?",
    answer: "We support major credit/debit cards, online banking, and mobile financial services (bKash, Nagad, Rocket). You can also opt to pay directly at the clinic depending on the doctor's preference.",
  },
  {
    id: 4,
    category: "Account",
    question: "Do I need an account to schedule a consultation?",
    answer: "Creating an account is recommended to track your appointments, view medical history, and save doctor profiles. However, you can also proceed with quick guest checkouts using your phone number.",
  },
  {
    id: 5,
    category: "General",
    question: "How do I receive confirmation of my serial?",
    answer: "Once booked, an instant confirmation SMS and email containing your serial number, appointment time, and doctor details will be sent to your registered contact info.",
  },
];

export default function FaqAccordion() {
  const [activeTab, setActiveTab] = useState("All");

  const categories = ["All", "Booking", "Payment", "Account", "General"];

  const filteredFaqs =
    activeTab === "All"
      ? faqList
      : faqList.filter((item) => item.category === activeTab);

  return (
    <section className="py-12 px-4 max-full mx-auto bg-white w-full overflow-hidden">
      <div className="max-w-5xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            Frequently <span style={{ color: "#941865" }}>Asked Questions</span>
          </h2>
          <p className="mt-2 text-xs md:text-sm text-gray-500">
            Got questions? We have answers. Find answers to common queries regarding doctor bookings, payments, and account setup.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm cursor-pointer ${
                activeTab === category
                  ? "bg-[#941865] text-white"
                  : "bg-gray-50 text-gray-600 border border-gray-100 hover:bg-gray-100 hover:text-[#941865]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((item, index) => (
              <div
                key={item.id}
                className="collapse collapse-plus bg-gray-50/50 border border-[#941865]/20 rounded-2xl shadow-sm hover:border-[#941865]/40 transition-all duration-200"
              >
                <input
                  type="radio"
                  name="faq-accordion"
                  defaultChecked={index === 0}
                />
                <div className="collapse-title text-sm sm:text-base font-bold text-gray-800 pr-12">
                  {item.question}
                </div>
                <div className="collapse-content text-xs sm:text-sm text-gray-600 leading-relaxed">
                  <p>{item.answer}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-xs text-gray-500">
              No questions found under this category.
            </div>
          )}
        </div>

        {/* Bottom Support Callout Box */}
        <div className="mt-12 text-center p-6 bg-gray-50/50 border border-[#941865]/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="text-left space-y-1">
            <h3 className="text-base font-bold text-gray-800">
              Still have questions?
            </h3>
            <p className="text-xs text-gray-500">
              Can’t find the answer you’re looking for? Please contact our support team.
            </p>
          </div>
          <a
            href="tel:+880123456789"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-xs shadow-sm transition-transform duration-300 hover:scale-105 shrink-0"
            style={{ backgroundColor: "#941865" }}
          >
            <FiPhoneCall className="text-base" />
            Contact Support
          </a>
        </div>

      </div>
    </section>
  );
}