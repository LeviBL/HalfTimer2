export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  image: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-optimize-your-nfl-viewing-experience",
    title: "How to Optimize Your NFL Viewing Experience",
    excerpt: "Learn the best ways to stay on top of every game without missing a single play, from multi-screen setups to timing your breaks perfectly.",
    content: "Full article content will go here...",
    date: "May 15, 2025",
    author: "Levi Brous-Light",
    category: "NFL",
    image: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=800&auto=format&fit=crop"
  },
  {
    slug: "the-science-of-halftime-durations",
    title: "The Science of Halftime Durations",
    excerpt: "Ever wondered why some halftimes feel longer than others? We dive into the regulations and broadcast requirements that dictate the clock.",
    content: "Full article content will go here...",
    date: "May 10, 2025",
    author: "Levi Brous-Light",
    category: "Sports Tech",
    image: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=800&auto=format&fit=crop"
  }
];