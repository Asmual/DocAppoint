import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Dynamic metadata configuration for SEO quality
export const metadata = {
  title: {
    default: "Home | DocAppoint",
    template: "%s | DocAppoint",
  },
  description: "Book appointments with experienced doctors and receive quality healthcare support anytime.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
          <Navbar />
          <Toaster 
            position="top-center" 
            reverseOrder={false}
            containerStyle={{
              top: "70px",
            }}
            toastOptions={{
              duration: 3000,
            }}
          />
          <main>{children}</main>
          <Footer />
        </Suspense>
      </body>
    </html>
  );
}