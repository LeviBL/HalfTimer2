import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HalfTimer from "./pages/HalfTimer";
import NotFound from "./pages/NotFound";
import React from "react";
import MobileNavMenu from "./components/MobileNavMenu"; // Import the new navigation menu
import About from "./pages/About"; // Import the About page
import PrivacyPolicy from "./pages/PrivacyPolicy"; // Import the Privacy Policy page
import TermsOfService from "./pages/TermsOfService"; // Import the Terms of Service page

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MobileNavMenu /> {/* Add the navigation menu here */}
        <Routes>
          <Route path="/" element={<HalfTimer />} />
          <Route path="/about" element={<About />} /> {/* New About route */}
          <Route path="/privacy" element={<PrivacyPolicy />} /> {/* New Privacy Policy route */}
          <Route path="/terms" element={<TermsOfService />} /> {/* New Terms of Service route */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;