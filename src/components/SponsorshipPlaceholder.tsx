"use client";

import React from 'react';

export default function SponsorshipPlaceholder() {
  const email = "contacthalftimer@gmail.com";
  const subject = encodeURIComponent("TheHalfTimer Banner Ad Sponsorship");

  return (
    <a 
      href={`mailto:${email}?subject=${subject}`}
      className="group block w-full max-w-sm mx-auto border-2 border-dashed border-[#cfcfcf] bg-neutral-50/50 hover:bg-neutral-50 hover:border-[#9281c7] p-6 rounded-2xl transition-all duration-200 ease-in-out text-center shadow-sm"
    >
      <div className="flex flex-col items-center justify-center space-y-6 py-10">
        {/* Animated Radio Pulse using branding color #9281c7 */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9281c7] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#9281c7]"></span>
          </span>
          <p className="text-sm font-bold tracking-widest text-neutral-500 uppercase">
            Sponsorship
          </p>
        </div>
        
        {/* Main Pitch */}
        <h4 className="text-base font-bold text-neutral-800 transition-colors leading-snug max-w-[240px]">
          Reach live sports fans right during commercial breaks.
        </h4>
        
        {/* Subtle CTA Link using accent color */}
        <div className="text-sm font-semibold text-[#9281c7] group-hover:underline pt-4">
          Lock In This Spot &rarr;
        </div>
      </div>
    </a>
  );
}