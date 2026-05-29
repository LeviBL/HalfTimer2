"use client";

import React from 'react';

export default function AnnouncementBar() {
  const email = "contacthalftimer@gmail.com";
  const subject = encodeURIComponent("TheHalfTimer Sponsorship Inquiry");
  
  return (
    <div className="w-full bg-[#ceedd7] text-[#0d3c38] py-2 px-4 text-center text-xs md:text-sm font-semibold tracking-wide border-b border-[#b8e0c5] uppercase z-[60]">
      Want to sponsor? Email us at{" "}
      <a 
        href={`mailto:${email}?subject=${subject}`}
        className="underline hover:text-teal-800 transition-colors duration-150 lowercase font-bold tracking-normal ml-1"
      >
        {email}
      </a>
    </div>
  );
}