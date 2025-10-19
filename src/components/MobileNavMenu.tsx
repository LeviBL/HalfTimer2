"use client";

import React from "react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const MobileNavMenu: React.FC = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="fixed top-4 left-4 z-50 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px] p-2 bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg shadow-lg border border-gray-200 mt-2 ml-2">
        <DropdownMenuItem asChild>
          <Link
            to="/"
            className="block px-3 py-2 text-gray-700 hover:bg-gray-300 hover:text-blue-600 transition-colors duration-200 rounded-md font-medium"
          >
            Home
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-200 my-1" />
        <DropdownMenuItem asChild>
          <Link
            to="/about"
            className="block px-3 py-2 text-gray-700 hover:bg-gray-300 hover:text-blue-600 transition-colors duration-200 rounded-md font-medium"
          >
            About
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            to="/privacy"
            className="block px-3 py-2 text-gray-700 hover:bg-gray-300 hover:text-blue-600 transition-colors duration-200 rounded-md font-medium"
          >
            Privacy Policy
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            to="/terms"
            className="block px-3 py-2 text-gray-700 hover:bg-gray-300 hover:text-blue-600 transition-colors duration-200 rounded-md font-medium"
          >
            Terms of Service
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            to="/contact"
            className="block px-3 py-2 text-gray-700 hover:bg-gray-300 hover:text-blue-600 transition-colors duration-200 rounded-md font-medium"
          >
            Contact
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MobileNavMenu;