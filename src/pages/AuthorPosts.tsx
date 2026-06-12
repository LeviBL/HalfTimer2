"use client";

import React from "react";
import { useParams, Link } from "react-router-dom";
import MobileNavMenu from "@/components/MobileNavMenu";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import BlogPostCard from "@/components/BlogPostCard";
import { blogPosts } from "@/data/blogPosts";
import { ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";

const AuthorPosts: React.FC = () => {
  const { authorName } = useParams<{ authorName: string }>();
  
  const authorPosts = blogPosts.filter(
    (post) => post.author.toLowerCase() === authorName?.toLowerCase()
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const displayName = authorPosts.length > 0 ? authorPosts[0].author : authorName;

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#fcfcfc] text-gray-900 relative">
      <SEO 
        title={`Articles by ${displayName}`}
        description={`Read all articles written by ${displayName} on The Halftimer Journal.`}
        canonicalUrl={`https://thehalftimer.com/blog/author/${authorName}`}
      />
      <MobileNavMenu />
      
      <div className="w-full max-w-6xl mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <Link to="/blog">
            <Button variant="ghost" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors p-0">
              <ArrowLeft className="h-4 w-4" /> Back to Journal
            </Button>
          </Link>
        </div>

        <header className="mb-16 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center border-2 border-blue-600 shadow-sm">
              <User className="h-10 w-10 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900">
                Articles by {displayName}
              </h1>
              <p className="text-lg text-gray-500 font-medium mt-2">
                Showing {authorPosts.length} {authorPosts.length === 1 ? 'article' : 'articles'}
              </p>
            </div>
          </div>
          <div className="h-1 w-24 bg-blue-600 mx-auto md:mx-0 rounded-full" />
        </header>

        {authorPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {authorPosts.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">No articles found for this author.</p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default AuthorPosts;