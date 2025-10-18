"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const MobileNavMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false); // Close the sheet when a link is clicked
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild className="fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white">
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] sm:w-[280px] bg-gradient-to-b from-gray-50 to-gray-100 p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Navigation</h2>
        <nav className="flex flex-col gap-4 text-lg">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
            onClick={handleLinkClick}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
            onClick={handleLinkClick}
          >
            About
          </Link>
          <Link
            to="/privacy"
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
            onClick={handleLinkClick}
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms"
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
            onClick={handleLinkClick}
          >
            Terms of Service
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavMenu;