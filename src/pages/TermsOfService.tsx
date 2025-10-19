"use client";

import React from "react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import MobileNavMenu from "@/components/MobileNavMenu"; // Import MobileNavMenu

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4 pt-20 text-gray-800 relative">
      <MobileNavMenu /> {/* Render MobileNavMenu here */}
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg prose prose-sm sm:prose lg:prose-lg">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">Terms of Service</h1>

        <p className="mb-4">
          Welcome to The Halftimer. By using our website at <a href="https://thehalftimer.com" className="text-blue-600 hover:underline">thehalftimer.com</a>, 
          you agree to these Terms of Service. If you do not agree, please do not use our site.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Use of the Site</h2>
        <p className="mb-4">
          The Halftimer provides live NFL halftime countdowns and related game information for personal, non-commercial use. 
          You agree not to misuse, modify, or attempt to disrupt the functionality of this site.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Intellectual Property</h2>
        <p className="mb-4">
          All content, trademarks, and logos displayed on The Halftimer are the property of their respective owners. 
          You may not copy or reuse any part of this site without permission.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Disclaimer</h2>
        <p className="mb-4">
          The information on The Halftimer is provided "as is" without warranties of any kind. 
          While we strive for accuracy, we cannot guarantee that all data (such as live scores or timers) will always be correct or available.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Limitation of Liability</h2>
        <p className="mb-4">
          The Halftimer and its creators are not liable for any damages that result from using or being unable to use this website.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Third-Party Links</h2>
        <p className="mb-4">
          Our site may contain links to third-party websites. We are not responsible for the content or privacy practices of those sites.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Changes to These Terms</h2>
        <p className="mb-4">
          We may update these Terms of Service at any time. Updates will be posted on this page with the revised date.
        </p>

        <p className="text-gray-600 mt-8 text-right">Last updated: October 17, 2025</p>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default TermsOfService;