"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const SupportModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check for initial popup
    const hasSeenModal = localStorage.getItem("hasSeenSupportModal");
    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem("hasSeenSupportModal", "true");
      }, 2000); // Show after 2 seconds for new visitors
      return () => clearTimeout(timer);
    }

    // Listen for manual trigger from footer
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-support-modal", handleOpen);
    return () => window.removeEventListener("open-support-modal", handleOpen);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[375px] rounded-3xl border-none p-0 overflow-hidden bg-white shadow-2xl">
        <div className="p-6 md:p-8">
          <DialogHeader className="space-y-3 text-center">
            <div className="mx-auto w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-2">
              <Heart className="h-6 w-6 text-blue-600 fill-blue-600" />
            </div>
            <DialogTitle className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Love The <br /> HalfTimer?
            </DialogTitle>
          </DialogHeader>

          <div className="mt-6 text-center">
            <p className="text-slate-600 text-base font-medium leading-relaxed">
              Keep the clocks fast and the servers running. Support the project by buying us a coffee!
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Link to="/contact" className="w-full" onClick={() => setIsOpen(false)}>
              <Button className="w-full h-12 text-base font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all transform hover:scale-[1.02] shadow-lg">
                Support Project
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              onClick={() => setIsOpen(false)}
              className="w-full h-12 text-base font-bold text-slate-500 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all"
            >
              Maybe Later
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
              Thank you for your support
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupportModal;