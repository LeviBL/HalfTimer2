"use client";

import React from "react";
import MobileNavMenu from "@/components/MobileNavMenu";
import Footer from "@/components/Footer";

const Contact: React.FC = () => {
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

        <div className="w-full max-w-md mx-auto my-6 p-4 bg-slate-900/50 backdrop-blur rounded-xl border border-slate-800 flex flex-col items-center justify-center not-prose">
          <p className="text-xs text-slate-400 font-medium mb-3">Enjoying the clocks? Buy me a coffee via BTC</p>
          <div className="w-full h-[1050px] overflow-hidden rounded-lg">
            <iframe 
              src="https://buymeabitcoffee.vercel.app/btc/bc1qcvvkf92dzh49mlx3uw9lpk4s3l00660rxvr0h2?identifier=LeviBL"
              className="w-full h-full border-0 bg-transparent"
              title="Buy Me A Bitcoin Coffee"
              scrolling="no"
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;