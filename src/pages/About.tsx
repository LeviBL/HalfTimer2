"use client";

import React, { useState, useEffect } from "react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import MobileNavMenu from "@/components/MobileNavMenu";
import { toast } from "sonner";

const About: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      // We've used the prompt, and can't use it again
      setDeferredPrompt(null);
    } else {
      // Fallback for iOS or browsers that don't support beforeinstallprompt
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      if (isIOS) {
        toast.info("To install: tap the 'Share' icon in your browser and select 'Add to Home Screen'.", {
          duration: 5000,
        });
      } else {
        toast.info("Your browser may not support direct installation. Try adding this page to your home screen manually.", {
          duration: 5000,
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4 pt-20 text-gray-800 relative">
      <MobileNavMenu />
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">About The Halftimer</h1>

        <p className="mb-4 text-lg leading-relaxed">
          The Halftimer is a live sports halftime countdown designed to make watching football and basketball more efficient and enjoyable. Every week, fans check scores and highlights, but no platform tells you exactly when the second half starts. The Halftimer solves that.
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          By tracking real-time game data for the NFL and NBA, The Halftimer automatically detects when halftime begins, starts a precise countdown, and alerts you when play is about to resume. Whether you’re watching multiple games, taking a break, or managing your time, The Halftimer helps you return to the action at the perfect moment.
        </p>
        <p className="mb-6 text-lg leading-relaxed">
          The goal is simple: optimize time, reduce guesswork, and create a smoother viewing experience for fans. Built with clarity and speed in mind, The Halftimer avoids distractions and endless ads, all for love of the game.
        </p>
        <p className="text-md text-gray-600 text-right italic">
          Created and developed by Levi Brous-Light.
        </p>
      </div>
      
      <div className="mt-8 mb-4">
        <button 
          onClick={handleInstallClick}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2"
        >
          Install App to Home Screen
        </button>
      </div>
      
      <MadeWithDyad />
    </div>
  );
};

export default About;