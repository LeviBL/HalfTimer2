"use client";

import React from "react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import MobileNavMenu from "@/components/MobileNavMenu";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ: React.FC = () => {
  const faqData = [
    {
      question: "What is The Halftimer?",
      answer: "The Halftimer is a real-time sports utility that tracks halftime durations across major leagues like the NFL, NBA, and college basketball. It helps viewers know exactly when games will resume so they don’t miss live action."
    },
    {
      question: "How does The Halftimer work?",
      answer: "The Halftimer uses official game timing structures and live game context to track halftime in real time. Users can quickly check how much time remains before play resumes."
    },
    {
      question: "Which sports and leagues are supported?",
      answer: "The Halftimer currently supports: NFL, NBA, and College basketball (including March Madness). Additional leagues and sports may be added over time."
    },
    {
      question: "Why should I use The Halftimer?",
      answer: "Halftime lengths vary by sport and situation. The Halftimer helps you: avoid missing the start of the second half, track multiple games more efficiently, step away during breaks with confidence, and stay on top of live sports without constant checking."
    },
    {
      question: "Is The Halftimer free to use?",
      answer: "Yes. The Halftimer is completely free to use."
    },
    {
      question: "Do I need to create an account?",
      answer: "No account is required. The tool is instantly accessible to all users."
    },
    {
      question: "How accurate is the halftime timer?",
      answer: "The Halftimer is designed to be as accurate as possible based on standard halftime durations and live conditions."
    },
    {
      question: "Can I use The Halftimer on mobile?",
      answer: "Yes. The Halftimer is optimized for both desktop and mobile devices, so you can check halftime from anywhere."
    },
    {
      question: "Does The Halftimer stream games?",
      answer: "No. The Halftimer does not stream or host any live sports content. It is a timing and tracking tool only."
    },
    {
      question: "How is this different from checking the score app?",
      answer: "Score apps show game status, but they don’t clearly track halftime duration or tell you exactly when to return. The Halftimer is specifically designed to solve that gap."
    },
    {
      question: "Who is The Halftimer for?",
      answer: "The Halftimer is built for: sports fans watching live games, viewers following multiple games at once, and people who don’t want to miss key moments after halftime."
    },
    {
      question: "How can I contact you?",
      answer: "You can reach out through the Contact page for any questions, feedback, or issues."
    },
    {
      question: "Will more features be added?",
      answer: "Yes. The Halftimer is actively being improved with new features, expanded league coverage, and enhanced accuracy."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4 pt-20 text-gray-800 relative">
      <MobileNavMenu />
      <div className="max-w-3xl w-full mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">FAQ – The Halftimer</h1>
        
        <Accordion type="single" collapsible className="w-full space-y-2">
          {faqData.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4 bg-gray-50/50">
              <AccordionTrigger className="text-left font-semibold hover:no-underline py-4">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed pb-4">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <Footer />
      <MadeWithDyad />
    </div>
  );
};

export default FAQ;