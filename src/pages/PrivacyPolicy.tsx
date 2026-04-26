"use client";

import React from "react";
import { Link } from "react-router-dom";
import MobileNavMenu from "@/components/MobileNavMenu";
import Footer from "@/components/Footer";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4 pt-20 text-gray-800 relative">
      <MobileNavMenu />
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg prose prose-sm sm:prose lg:prose-lg">
        <div className="flex items-center justify-center gap-4 mb-6">
          <h1 className="text-4xl font-extrabold text-gray-900 text-center m-0">Privacy Policy</h1>
        </div>

        <p className="mb-6">
          At The Halftimer, we are committed to protecting your privacy. This policy outlines how we handle data and the third-party services we use to keep the site running.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">1. Data Collection</h2>
        <p className="mb-4">
          The Halftimer does not require user accounts or collect personally identifiable information (like names or emails) directly. We use standard log files (IP addresses, browser type, and time stamps) to analyze site traffic and performance during peak game times.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">2. Cookies and Third-Party Advertising</h2>
        <p className="mb-4">
          We use Google AdSense to serve advertisements.
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>Google uses cookies to serve ads based on your prior visits to this or other websites.</li>
          <li>Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to this site.</li>
          <li>You may opt out of personalized advertising by visiting <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Ads Settings</a>.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">3. Analytics</h2>
        <p className="mb-4">
          We use Google Analytics to track site usage, such as page views and returning users. This data is anonymous and helps us optimize the countdown timers for the best fan experience.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">4. Your Rights (CCPA & GDPR)</h2>
        <p className="mb-4">
          Depending on your location (including California and the EU), you have the right to:
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>Know what data is being collected (in our case, anonymous cookies).</li>
          <li>Request the deletion of any data.</li>
          <li>Opt out of the "sale" of personal information.</li>
        </ul>
        <p className="mb-4">
          Since we do not store personal profiles, your "data" consists of cookies which you can manage or delete directly through your browser settings at any time.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">5. Contact</h2>
        <p className="mb-4">
          If you have questions about this policy or the site, you can reach out via our <Link to="/contact" className="text-blue-600 hover:underline">contact page</Link>.
        </p>

        <p className="text-gray-600 mt-8 text-right">Last updated: April 25, 2026</p>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;