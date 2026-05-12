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
      <DialogContent className="sm:max-w-[375px] rounded-3xl border-none p-0 overflow-hidden bg-white shadow-2xl">
        <div className="p-6 md:p-8">
          <DialogHeader className="space-y-3 text-center">
            <div className="mx-auto w-12 h-1 bg-blue-600 rounded-full mb-1" />
            <DialogTitle className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Welcome to <br /> The Halftimer!
            </DialogTitle>
            <DialogDescription className="text-lg font-bold text-blue-600">
              Introducing The Journal
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 text-center">
            <p className="text-slate-600 text-base font-medium leading-relaxed">
              Get inside analysis, breakdowns, and a nice read in during halftime.
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link to="/blog" className="flex-1">
              <Button className="w-full h-12 text-base font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-2xl transition-all transform hover:scale-[1.02] shadow-lg">
                Read Blog
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              onClick={() => setIsOpen(false)}
              className="flex-1 h-12 text-base font-bold text-slate-500 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all"
            >
              Maybe Later
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
              This message will not appear again
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogWelcomeModal;