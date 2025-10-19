import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HalfTimer from "./pages/HalfTimer";
import NotFound from "./pages/NotFound";
import React, { useState } from "react";
import AppHeader from "./components/AppHeader"; // Import the new AppHeader
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

const App = () => {
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppHeader lastUpdated={lastUpdated} isRefreshing={isRefreshing} /> {/* Render AppHeader */}
          <Routes>
            <Route
              path="/"
              element={
                <HalfTimer
                  setLastUpdated={setLastUpdated}
                  setIsRefreshing={setIsRefreshing}
                />
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;