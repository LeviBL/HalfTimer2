"use client";

import React from "react";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4 pt-20 text-gray-800">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg prose prose-sm sm:prose lg:prose-lg">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">Contact Us</h1>

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

        <p className="text-md text-gray-600 text-center italic">
          We aim to respond to all inquiries within 2-3 business days.
        </p>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Contact;