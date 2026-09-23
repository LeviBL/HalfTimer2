"use client";

import React, { useEffect } from "react";
import MobileNavMenu from "@/components/MobileNavMenu";
import Footer from "@/components/Footer";

const Contact: React.FC = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.dataset.name = "BMC-Widget";
    script.dataset.cfasync = "false";
    script.src = "https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js";
    script.dataset.id = "LeviBL";
    script.dataset.description = "Support The Halftimer!";
    script.dataset.message = "Enjoying The Halftimer? Help keep it free.";
    script.dataset.color = "#5F7FFF";
    script.dataset.position = "Right";
    script.dataset.x_margin = "18";
    script.dataset.y_margin = "18";
    document.body.appendChild(script);

    return () => {
      script.remove();
      document.getElementById("bmc-wbtn")?.remove();
      document.querySelectorAll('[class*="bmc-widget"], iframe[src*="buymeacoffee.com"]').forEach((element) => element.remove());
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4 pt-20 text-gray-800 relative">
      <MobileNavMenu />
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg prose prose-sm sm:prose lg:prose-lg">
        <div className="flex items-center justify-center gap-4 mb-6">
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