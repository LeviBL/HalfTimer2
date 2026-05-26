"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const SupportModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenModal = localStorage.getItem("hasSeenSupportModal");
    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem("hasSeenSupportModal", "true");
      }, 100); // Reduced delay to 100ms for near-instant appearance
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[400px] rounded-[28px] border-none p-0 overflow-hidden bg-white/95 backdrop-blur-xl shadow-2xl">
        <div className="p-8 pt-12">
          <DialogHeader className="space-y-4 text-center">
            <DialogTitle className="text-3xl font-bold text-black tracking-tight leading-tight">
              Love The HalfTimer?
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 text-center">
            <p className="text-gray-600 text-base font-medium leading-relaxed px-2">
              Keep the clocks fast and the servers running. Support the project by buying us a coffee!
            </p>
          </div>

          <div className="mt-10 flex gap-3">
            <Button 
              variant="ghost" 
              onClick={() => setIsOpen(false)}
              className="flex-1 h-12 text-base font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-2xl transition-all"
            >
              Maybe Later
            </Button>
            <Link to="/contact" className="flex-1" onClick={() => setIsOpen(false)}>
              <Button className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all shadow-md">
                Support
              </Button>
            </Link>
          </div>

          <div className="mt-8 text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.1em]">
              Thank you for your support
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupportModal;