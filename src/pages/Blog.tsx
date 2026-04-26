"use client";

import React from "react";
import MobileNavMenu from "@/components/MobileNavMenu";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import BlogPostCard from "@/components/BlogPostCard";
import { blogPosts } from "@/data/blogPosts";

const Blog: React.FC = () => {
  // Sort posts by date (descending)
  const sortedPosts = [...blogPosts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#fcfcfc] text-gray-900 relative">
      <MobileNavMenu />
      
      <div className="w-full max-w-6xl mx-auto px-4 pt-24 pb-12">
        <header className="mb-16 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-4 mb-6">
            <Logo size={56} className="mb-2 md:mb-0" />
            <div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tight text-gray-900">
                The Journal
              </h1>
              <p className="text-lg text-gray-500 font-medium mt-2">
                Deep dives into sports timing, analytics, and the fan experience.
              </p>
            </div>
          </div>
          <div className="h-1 w-24 bg-blue-600 mx-auto md:mx-0 rounded-full" />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {sortedPosts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Blog;