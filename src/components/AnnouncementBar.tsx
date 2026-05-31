"use client";

import React from 'react';
import { toast } from "sonner";

export default function AnnouncementBar() {
  const email = "contacthalftimer@gmail.com";
  
  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(email);
    toast.success("Email copied to clipboard!");
  };
  
  return (
    <div className="w-full bg-[#9281c7] text-white py-2 px-4 text-center text-xs md:text-sm font-semibold tracking-wide border-b border-[#7a69b0] uppercase z-[60]">
      Want to sponsor? Email us at{" "}
      <button 
        onClick={handleCopy}
        className="underline hover:text-purple-100 transition-colors duration-150 lowercase font-bold tracking-normal ml-1 cursor-pointer"
      >
        {email}
      </button>
    </div>
  );
}