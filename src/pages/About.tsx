"use client";

import React from "react";
import { MadeWithDyad } from "@/components/made-with-dyad";

const About: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4 pt-20 text-gray-800">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">About The Halftimer</h1>

        <p className="mb-4 text-lg leading-relaxed">
          The Halftimer is a live NFL halftime countdown designed to make watching football more efficient and enjoyable. Every week, fans check scores and highlights, but no platform tells you exactly when the second half starts. The Halftimer solves that.
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          By tracking real-time game data, The Halftimer automatically detects when halftime begins, starts a precise countdown, and alerts you when play is about to resume. Whether you’re watching multiple games, taking a break, or managing your time, The Halftimer helps you return to the action at the perfect moment.
        </p>
        <p className="mb-6 text-lg leading-relaxed">
          The goal is simple: optimize time, reduce guesswork, and create a smoother viewing experience for fans. Built with clarity and speed in mind, The Halftimer avoids distractions and endless ads, all for love of the game.
        </p>
        <p className="text-md text-gray-600 text-right italic">
          Created and developed by Levi Brous-Light in 2025.
        </p>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default About;