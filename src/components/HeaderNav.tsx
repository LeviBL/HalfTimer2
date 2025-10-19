"use client";

import React from "react";
import MobileNavMenu from "@/components/MobileNavMenu";

const HeaderNav: React.FC = () => {
  return (
    <>
      {/* Logo */}
      <img
        src="/timer_favicon.svg"
        alt="HalfTimer Logo"
        className="absolute top-4 left-4 h-10 w-10 z-50"
      />
      {/* Mobile Navigation Menu, positioned to the right of the logo */}
      <div className="absolute top-4 left-16 z-50">
        <MobileNavMenu />
      </div>
    </>
  );
};

export default HeaderNav;