import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import HalfTimer from "./pages/HalfTimer";
import NotFound from "./pages/NotFound";
import React, { useEffect } from "react";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import AuthorPosts from "./pages/AuthorPosts";
import ScrollToTop from "./components/ScrollToTop";
import SupportModal from "./components/SupportModal";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Remove static SEO elements once React has taken over
    const seoFooter = document.getElementById("seo-footer");
    if (seoFooter) seoFooter.remove();
    
    const seoPlaceholder = document.getElementById("seo-content-placeholder");
    if (seoPlaceholder) seoPlaceholder.remove();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <SupportModal />
            <Routes>
              <Route path="/" element={<HalfTimer />} />
              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="/nba" element={<HalfTimer defaultSport="nba" />} />
              <Route path="/nfl" element={<HalfTimer defaultSport="nfl" />} />
              <Route path="/march-madness-halftime-timer" element={<HalfTimer defaultSport="ncaa" />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/blog/author/:authorName" element={<AuthorPosts />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/contact" element={<Contact />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;