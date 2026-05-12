"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const BlogWelcomeModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenModal = localStorage.getItem("hasSeenBlogModal");
    if (!hasSeenModal) {
      setIsOpen(true);
      localStorage.setItem("hasSeenBlogModal", "true");
    }
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[450px] rounded-3xl border-none p-0 overflow-hidden bg-white shadow-2xl">
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>
        
        <div className="p-8 pt-10">
          <DialogHeader className="space-y-3 text-center sm:text-left">
            <DialogTitle className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome to The Halftimer!
            </DialogTitle>
            <DialogDescription className="text-lg font-semibold text-blue-600">
              Introducing the HalfTimer Blog
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6">
            <p className="text-slate-600 text-lg leading-relaxed">
              Get inside analysis, breakdowns, and a nice read in during halftime.
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-3">
            <Link to="/blog" className="w-full">
              <Button className="w-full h-12 text-lg font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all transform hover:scale-[1.02]">
                Read the Blog
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              onClick={() => setIsOpen(false)}
              className="w-full h-12 text-lg font-medium text-slate-500 bg-gray-50 hover:bg-gray-100 rounded-xl"
            >
              Maybe Later
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400 font-medium">
              (This message will not appear again)
            </p>
          </div>
        </div>
        
        {/* Decorative accent */}
        <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400" />
      </DialogContent>
    </Dialog>
  );
};

export default BlogWelcomeModal;