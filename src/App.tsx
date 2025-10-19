"use client";

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HalfTimer from "./pages/HalfTimer";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Contact from "./pages/Contact";
// MobileNavMenu is now rendered inside HalfTimer.tsx

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HalfTimer />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;