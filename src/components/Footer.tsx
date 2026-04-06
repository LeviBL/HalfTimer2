"use client";

import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-12 py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold text-gray-900">The Halftimer</h2>
          <p className="text-sm text-gray-500 mt-1">
            © 2025 The Halftimer. All rights reserved.
          </p>
        </div>

        <nav className="flex flex-wrap justify-center gap-6 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <Link to="/about" className="hover:text-blue-600 transition-colors">About</Link>
          <Link to="/faq" className="hover:text-blue-600 transition-colors">FAQ</Link>
          <Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link>
          <Link to="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
          <a 
            href="https://github.com/LeviBL/HalfTimer2" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-gray-900 transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
      <div className="max-w-3xl mx-auto mt-8 text-center text-xs text-gray-400">
        <p className="mb-2">
          The Halftimer provides real-time sports data for informational purposes only.
        </p>
        <p className="mb-4">
          We are not affiliated with the NFL, NBA, or NCAA.
        </p>
        <div className="pt-4 border-t border-gray-100 text-gray-500">
          <span>Made by Levi Brous-Light</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;