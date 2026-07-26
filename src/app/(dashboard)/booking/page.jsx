"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { toast } from "react-hot-toast";
import { 
    FaCalendarAlt, 
    FaUserAlt, 
    FaEdit, 
    FaTrashAlt, 
    FaTimes, 
    FaClock, 
    FaNotesMedical,
    FaExclamationTriangle,
    FaSpinner
} from "react-icons/fa";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://assignment-9-server-ybq9.onrender.com";

export default function BookingPage() {
    const router = useRouter();
    const { data: session, isPending } = useSession();
    const currentUser = session?.user;

    const [bookings, setBookings] = useState([]);
    const [isLoadingBookings, setIsLoadingBookings] = useState(true);
    
    // Update Modal States
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isSubmittingUpdate, setIsSubmittingUpdate] = useState(false);
    const [updateFormData, setUpdateFormData] = useState({
        patientName: "",
        appointmentDate: "",
        appointmentTime: "",
        notes: ""
    });

    // Delete Modal States
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [bookingToDelete, setBookingToDelete] = useState(null);
    const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);

    // Prevent multiple parallel initial fetches
    const hasFetchedRef = useRef(false);

    /**
     * Helper function to get authorization headers correctly
     */
    const getAuthHeaders = () => {
        const token = typeof window !== "undefined" ? localStorage.getItem("docappoint_token") : null;
        return {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
        };
    };

    /**
     * Fetch user bookings safely with auto-retry on 401 reload
     */
    const fetchUserBookings = useCallback(async (isRetry = false) => {
        if (!currentUser?.email) return;

        try {
            setIsLoadingBookings(true);
            const res = await fetch(`${BACKEND_URL}/api/bookings?email=${currentUser.email}`, {
                method: "GET",
                credentials: "include",
                headers: getAuthHeaders()
            });

            if (res.ok) {
                const data = await res.json();
                setBookings(data.bookings || data);
            } else if (res.status === 401 && !isRetry) {
                // If 401 on page refresh, wait 600ms for token/session hydration and retry once
                setTimeout(() => {
                    // eslint-disable-next-line react-hooks/immutability
                    fetchUserBookings(true);
                }, 600);
                return;
            } else {
                const err = await res.json().catch(() => ({}));
                toast.error(err.message || "Failed to load bookings.");
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
            toast.error("Failed to load bookings from server.");
        } finally {
            setIsLoadingBookings(false);
        }
    }, [currentUser?.email]);

    // Handle session loading and automatic data fetching on reload
    useEffect(() => {
        if (isPending) return;

        if (!session?.user) {
            toast.error("Unauthorized access: Login required");
            router.push("/login");
            return;
        }

        // Fetch bookings once user session is active
        if (currentUser?.email) {
            fetchUserBookings();
        }
    }, [isPending, session, router, currentUser?.email, fetchUserBookings]);

    // Delete Booking Handler
    const handleConfirmDelete = async () => {
        if (!bookingToDelete) return;
        setIsSubmittingDelete(true);

        try {
            const res = await fetch(`${BACKEND_URL}/api/bookings/${bookingToDelete._id}`, {
                method: "DELETE",
                credentials: "include",
                headers: getAuthHeaders()
            });
            const result = await res.json();

            if (res.ok && result.success) {
                toast.success("Appointment canceled successfully.");
                setBookings((prev) => prev.filter((item) => item._id !== bookingToDelete._id));
                setIsDeleteModalOpen(false);
                setBookingToDelete(null);
            } else {
                toast.error(result.message || "Failed to delete appointment.");
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Server connection error.");
        } finally {
            setIsSubmittingDelete(false);
        }
    };

    // Open Update Modal
    const openUpdateModal = (booking) => {
        setSelectedBooking(booking);
        setUpdateFormData({
            patientName: booking.patientName || "",
            appointmentDate: booking.appointmentDate || booking.date || "",
            appointmentTime: booking.appointmentTime || booking.time || "12:00",
            notes: booking.notes || ""
        });
        setIsUpdateModalOpen(true);
    };

    // Submit Update Handler
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setIsSubmittingUpdate(true);

        try {
            const res = await fetch(`${BACKEND_URL}/api/bookings/${selectedBooking._id}`, {
                method: "PATCH",
                credentials: "include",
                headers: getAuthHeaders(),
                body: JSON.stringify(updateFormData)
            });
            const result = await res.json();

            if (res.ok && result.success) {
                toast.success("Appointment updated successfully.");
                setBookings((prev) =>
                    prev.map((item) =>
                        item._id === selectedBooking._id
                            ? { ...item, ...updateFormData }
                            : item
                    )
                );
                setIsUpdateModalOpen(false);
            } else {
                toast.error(result.message || "Failed to update appointment.");
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Server error.");
        } finally {
            setIsSubmittingUpdate(false);
        }
    };

    // Show loading spinner while session is being resolved on page reload
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
            <div className="max-w-6xl mx-auto space-y-6">

                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl text-[#941865]">
                        My Bookings
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage and track all your upcoming doctor appointments.
                    </p>
                </div>

                <div>
                    {isLoadingBookings ? (
                        <div className="flex justify-center items-center min-h-64">
                            <FaSpinner className="animate-spin text-3xl text-[#941865]" />
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-150 p-8 shadow-sm min-h-64 flex items-center justify-center text-center">
                            <div className="space-y-2">
                                <p className="text-xl font-medium text-gray-800">No appointments found</p>
                                <p className="text-sm text-gray-400">You have not scheduled any medical visits yet.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {bookings.map((booking) => (
                                <div 
                                    key={booking._id} 
                                    className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4"
                                >
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-[#0f766e]">
                                            {booking.doctorName}
                                        </h3>
                                        <div className="space-y-2 text-xs md:text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <FaUserAlt className="text-gray-400 shrink-0 text-xs" />
                                                <span>Patient: <strong className="text-gray-800">{booking.patientName}</strong></span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaCalendarAlt className="text-gray-400 shrink-0 text-xs" />
                                                <span>Date: <strong className="text-gray-800">{booking.appointmentDate || booking.date}</strong></span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaClock className="text-gray-400 shrink-0 text-xs" />
                                                <span>Time: <strong className="text-gray-800">{booking.appointmentTime || booking.time || "Not Set"}</strong></span>
                                            </div>
                                            {booking.notes && (
                                                <div className="flex items-start gap-2 pt-2 border-t border-gray-100 mt-2">
                                                    <FaNotesMedical className="text-gray-400 shrink-0 text-xs mt-0.5" />
                                                    <span className="text-xs wrap-break-word">Reason: {booking.notes}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                                        <button
                                            onClick={() => openUpdateModal(booking)}
                                            className="cursor-pointer flex items-center justify-center gap-1.5 py-2 border border-[#941865] text-xs font-semibold rounded-xl hover:bg-gray-50 text-[#941865] transition-colors"
                                        >
                                            <FaEdit className="text-xs" /> Update
                                        </button>
                                        <button
                                            onClick={() => {
                                                setBookingToDelete(booking);
                                                setIsDeleteModalOpen(true);
                                            }}
                                            className="cursor-pointer flex items-center justify-center gap-1.5 py-2 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 shadow-sm transition-all"
                                        >
                                            <FaTrashAlt className="text-xs" /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal: Update Booking */}
            {isUpdateModalOpen && selectedBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col my-5">
                        <div className="p-4 bg-[#941865] text-white flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-sm">Update Appointment</h3>
                                <p className="text-[10px] text-white/80 mt-0.5">Edit booking information</p>
                            </div>
                            <button
                                onClick={() => setIsUpdateModalOpen(false)}
                                className="text-white/80 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/10"
                            >
                                <FaTimes className="text-xs" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateSubmit} className="p-5 flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Doctor</label>
                                <input
                                    type="text"
                                    value={selectedBooking.doctorName}
                                    disabled
                                    className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-500 cursor-not-allowed focus:outline-none"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Patient Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={updateFormData.patientName}
                                    onChange={(e) => setUpdateFormData({ ...updateFormData, patientName: e.target.value })}
                                    className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#941865] transition-colors"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={updateFormData.appointmentDate}
                                        onChange={(e) => setUpdateFormData({ ...updateFormData, appointmentDate: e.target.value })}
                                        className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#941865] cursor-pointer"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Time *</label>
                                    <input
                                        type="time"
                                        required
                                        value={updateFormData.appointmentTime}
                                        onChange={(e) => setUpdateFormData({ ...updateFormData, appointmentTime: e.target.value })}
                                        className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#941865] cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Reason</label>
                                <textarea
                                    rows="3"
                                    value={updateFormData.notes}
                                    onChange={(e) => setUpdateFormData({ ...updateFormData, notes: e.target.value })}
                                    className="bg-white border border-gray-300 rounded-lg p-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#941865] resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsUpdateModalOpen(false)}
                                    disabled={isSubmittingUpdate}
                                    className="cursor-pointer py-2 rounded-xl border border-[#941865] text-xs font-semibold text-[#941865] hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmittingUpdate}
                                    className="cursor-pointer py-2 rounded-xl text-xs font-bold text-white shadow-md hover:opacity-90 transition-all flex items-center justify-center disabled:opacity-75"
                                    style={{ backgroundColor: "#941865" }}
                                >
                                    {isSubmittingUpdate ? (
                                        <FaSpinner className="animate-spin text-sm" />
                                    ) : (
                                        "Save Changes"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Delete Confirmation */}
            {isDeleteModalOpen && bookingToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
                    <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-6 flex flex-col items-center text-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 text-xl shrink-0">
                            <FaExclamationTriangle />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-base font-bold text-gray-900">Cancel Appointment?</h3>
                            <p className="text-xs text-gray-500">
                                Are you sure you want to cancel your appointment with <span className="font-semibold text-gray-700">{bookingToDelete.doctorName}</span>?
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 w-full mt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsDeleteModalOpen(false);
                                    setBookingToDelete(null);
                                }}
                                disabled={isSubmittingDelete}
                                className="cursor-pointer py-2 px-4 rounded-xl border border-gray-300 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                No, Keep it
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmDelete}
                                disabled={isSubmittingDelete}
                                className="cursor-pointer py-2 px-4 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow-sm transition-all flex items-center justify-center disabled:opacity-75"
                            >
                                {isSubmittingDelete ? (
                                    <FaSpinner className="animate-spin text-sm" />
                                ) : (
                                    "Yes, Cancel"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}