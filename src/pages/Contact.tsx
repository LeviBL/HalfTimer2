"use client";

import React from "react";
import MobileNavMenu from "@/components/MobileNavMenu";
import Footer from "@/components/Footer";

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4 pt-20 text-gray-800 relative overflow-x-hidden">
      <MobileNavMenu />
      <div className="w-full max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            We'd love to hear from you! If you have any questions, feedback, or suggestions regarding The Halftimer, 
            please don't hesitate to reach out.
          </p>
        </div>

        <div className="mb-10 text-center">
          <p className="text-base sm:text-lg">
            Email us directly at:{" "}
            <a 
              href="mailto:contacthalftimer@gmail.com" 
              className="text-blue-600 hover:underline font-semibold block sm:inline mt-1 sm:mt-0"
            >
              contacthalftimer@gmail.com
            </a>
          </p>
        </div>

        <div className="w-full max-w-md mx-auto my-6 p-4 bg-slate-900/50 backdrop-blur rounded-xl border border-slate-800 flex flex-col items-center justify-center overflow-hidden">
          <p className="text-xs text-slate-400 font-medium mb-4 text-center">Enjoying the clocks? Buy me a coffee via BTC</p>
          
          <div className="relative w-full flex justify-center" style={{ height: 'calc(1030px * 0.82)' }}>
            <div className="absolute top-0 origin-top scale-[0.82] sm:scale-100 w-[360px] sm:w-[400px] h-[1030px]">
              <iframe 
                src="https://buymeabitcoffee.vercel.app/btc/bc1qcvvkf92dzh49mlx3uw9lpk4s3l00660rxvr0h2?identifier=LeviBL"
                className="w-full h-full border-0 bg-transparent"
                title="Buy Me A Bitcoin Coffee"
                scrolling="no"
              />
            </div>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 640px) {
          div[style*="calc(1030px * 0.82)"] {
            height: 1030px !important;
          }
        }
      `}} />
      
      <Footer />
    </div>
  );
};

export default Contact;