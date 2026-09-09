import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const TrophySmackAdCard: React.FC = () => {
  return (
    <a
      href="https://www.trophysmack.com/collections/fantasy-football-trophies?utm_source=thehalftimer"
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full"
    >
      <Card className="w-full max-w-[340px] mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6">
          <p className="text-center text-purple-800 text-xs font-bold tracking-widest mb-4">GAME DAY PARTNER</p>
          <div className="flex justify-center mb-4">
            <img
              src="/assets/trophysmack-logo.png"
              alt="Trophy Smack Logo"
              className="w-32"
            />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Make your league win mean something.</h2>
          <p className="text-center text-gray-600 mb-6">Fantasy football trophies, championship belts, and gear made for the group chat.</p>
          <Button className="w-full bg-[#E56A40] hover:bg-[#d45f3a] text-white font-bold py-3 rounded-lg text-base">
            Shop Fantasy Football Trophies
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-center text-gray-400 text-xs mt-4">Sponsored placement - linked to TrophySmack.com</p>
        </div>
      </Card>
    </a>
  );
};

export default TrophySmackAdCard;
