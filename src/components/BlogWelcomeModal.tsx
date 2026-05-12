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
      <DialogContent className="sm:max-w-[500px] rounded-3xl border-none p-0 overflow-hidden bg-white shadow-2xl">
        <div className="p-8 md:p-10">
          <DialogHeader className="space-y-4 text-center">
            <div className="mx-auto w-16 h-1 bg-blue-600 rounded-full mb-2" />
            <DialogTitle className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Welcome to <br /> The Halftimer!
            </DialogTitle>
            <DialogDescription className="text-xl font-bold text-blue-600">
              Introducing The Journal
            </DialogDescription>
          </DialogHeader>

          <div className="mt-8 text-center">
            <p className="text-slate-600 text-lg font-medium leading-relaxed">
              Get inside analysis, breakdowns, and a nice read in during halftime.
            </p>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link to="/blog" className="flex-1">
              <Button className="w-full h-14 text-lg font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-2xl transition-all transform hover:scale-[1.02] shadow-lg">
                Read Blog
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              onClick={() => setIsOpen(false)}
              className="flex-1 h-14 text-lg font-bold text-slate-500 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all"
            >
              Maybe Later
            </Button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              This message will not appear again
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogWelcomeModal;