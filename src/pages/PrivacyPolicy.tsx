"use client";

import React from "react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import MobileNavMenu from "@/components/MobileNavMenu"; // Import MobileNavMenu

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4 pt-20 text-gray-800 relative">
      <MobileNavMenu /> {/* Render MobileNavMenu here */}
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg prose prose-sm sm:prose lg:prose-lg">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">Privacy Policy</h1>

        <p className="mb-4">
          At The Halftimer, accessible from <a href="https://thehalftimer.com" className="text-blue-600 hover:underline">thehalftimer.com</a>, your privacy is important to us. 
          This Privacy Policy explains what information we collect, how we use it, and your rights regarding that information.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Information We Collect</h2>
        <p className="mb-4">
          We do not collect any personally identifiable information directly from users. 
          However, we use third-party services such as Google AdSense that may use cookies to serve ads based on your prior visits to this or other websites.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Cookies</h2>
        <p className="mb-4">
          Cookies are small files stored on your device that help websites function properly. 
          Third-party vendors, including Google, use cookies to serve ads based on your interests. 
          You can choose to disable cookies through your browser settings.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Third-Party Services</h2>
        <p className="mb-4">
          We use Google AdSense to display ads. Google may collect data as described in the 
          <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline"> Google Ad Policy</a>. 
          We do not control how Google handles your data, but we recommend reviewing their privacy practices.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Changes to This Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy occasionally. Any changes will be posted on this page with the updated date.
        </p>

        <p className="text-gray-600 mt-8 text-right">Last updated: February 8th, 2026</p>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default PrivacyPolicy;