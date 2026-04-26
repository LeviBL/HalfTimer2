"use client";

import React from "react";
import MobileNavMenu from "@/components/MobileNavMenu";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import BlogPostCard from "@/components/BlogPostCard";
import { blogPosts } from "@/data/blogPosts";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, User } from "lucide-react";

const Blog: React.FC = () => {
  // Sort posts by date (descending)
  const sortedPosts = [...blogPosts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const featuredPost = sortedPosts[0];
  const remainingPosts = sortedPosts.slice(1);

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

        {/* Featured Post Section */}
        {featuredPost && (
          <section className="mb-20">
            <Link to={`/blog/${featuredPost.slug}`} className="group block">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500">
                <div className="lg:col-span-7 h-[300px] md:h-[450px] overflow-hidden">
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="lg:col-span-5 p-8 md:p-12">
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6">
                    Featured Analysis
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight group-hover:text-blue-600 transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-600 text-lg mb-8 line-clamp-3 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-6 text-sm text-gray-400 mb-8">
                    <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {featuredPost.date}</span>
                    <span className="flex items-center gap-2"><User className="h-4 w-4" /> {featuredPost.author}</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600 font-bold group-hover:gap-4 transition-all">
                    Read Full Article <ArrowRight className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        <div className="flex items-center gap-4 mb-10">
          <h3 className="text-2xl font-bold text-gray-900">Latest Articles</h3>
          <div className="flex-grow h-px bg-gray-100" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {remainingPosts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Blog;