"use client";

import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import MobileNavMenu from "@/components/MobileNavMenu";
import Footer from "@/components/Footer";
import { blogPosts } from "@/data/blogPosts";
import { Calendar, User, Share2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import BlogPostCard from "@/components/BlogPostCard";

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  // Get two other posts for the "Next Read" section
  const currentIndex = blogPosts.findIndex((p) => p.slug === slug);
  const nextPosts = [
    blogPosts[(currentIndex + 1) % blogPosts.length],
    blogPosts[(currentIndex + 2) % blogPosts.length],
  ];

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4 pt-20 text-gray-800 relative">
      <MobileNavMenu />
      
      <div className="max-w-3xl w-full mx-auto mb-4 flex justify-start">
        <Link to="/blog">
          <Button variant="ghost" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Button>
        </Link>
      </div>

      <article className="max-w-3xl w-full mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
        <div className="relative h-[300px] md:h-[400px]">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
            <div className="text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center gap-6 text-sm opacity-90">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> {post.date}
                </span>
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" /> {post.author}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <p className="text-xl font-medium text-gray-900 mb-6 italic">
              {post.excerpt}
            </p>
            <div className="whitespace-pre-wrap">
              {post.content}
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleShare} className="flex items-center gap-2">
                <Share2 className="h-4 w-4" /> Share Article
              </Button>
            </div>
            <Link to="/blog">
              <Button variant="ghost" size="sm">
                More Articles
              </Button>
            </Link>
          </div>
        </div>
      </article>

      {/* Next Read Section */}
      <div className="max-w-4xl w-full mx-auto mb-12">
        <div className="flex items-center gap-4 mb-8">
          <h3 className="text-2xl font-bold text-gray-900">Next Read</h3>
          <div className="flex-grow h-px bg-gray-200" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {nextPosts.map((nextPost) => (
            <BlogPostCard key={nextPost.slug} post={nextPost} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogPost;