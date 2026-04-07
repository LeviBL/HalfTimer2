"use client";

import React from "react";
import MobileNavMenu from "@/components/MobileNavMenu";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4 pt-20 text-gray-800 relative">
      <MobileNavMenu />
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg prose prose-sm sm:prose lg:prose-lg">
        <div className="flex items-center justify-center gap-4 mb-6">
          <Logo size={48} />
          <h1 className="text-4xl font-extrabold text-gray-900 text-center m-0">Contact Us</h1>
        </div>

        <p className="mb-4">
          We'd love to hear from you! If you have any questions, feedback, or suggestions regarding The Halftimer, 
          please don't hesitate to reach out.
        </p>

        <p className="mb-6 text-lg text-center">
          You can email us directly at:{" "}
          <a 
            href="mailto:contacthalftimer@gmail.com" 
            className="text-blue-600 hover:underline font-semibold"
          >
            contacthalftimer@gmail.com
          </a>
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;