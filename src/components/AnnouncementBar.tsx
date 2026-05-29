"use client";

import React from 'react';

export default function AnnouncementBar() {
  const email = "contacthalftimer@gmail.com";
  const subject = encodeURIComponent("TheHalfTimer Sponsorship Inquiry");
  
  return (
    <div className="w-full bg-[#d3dbf5] text-[#1e293b] py-2 px-4 text-center text-xs md:text-sm font-semibold tracking-wide border-b border-[#b8c5e0] uppercase z-[60]">
      Want to sponsor? Email us at{" "}
      <a 
        href={`mailto:${email}?subject=${subject}`}
        className="underline hover:text-blue-800 transition-colors duration-150 lowercase font-bold tracking-normal ml-1"
      >
        {email}
      </a>
    </div>
  );
}