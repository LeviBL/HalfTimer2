import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Award } from 'lucide-react';

const TrophySmackAdCard: React.FC = () => {
  return (
    <a
      href="https://www.trophysmack.com/collections/fantasy-football-trophies"
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full transition-transform transform hover:-translate-y-1"
    >
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 w-full">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
          <Award className="w-12 h-12 text-amber-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">Fantasy Football Trophies</h3>
          <p className="text-sm text-gray-300 mb-4">The best trophies, rings, and belts for your fantasy league.</p>
          <div className="text-xs font-semibold text-amber-400 tracking-wider uppercase">TrophySmack.com</div>
        </CardContent>
      </Card>
    </a>
  );
};

export default TrophySmackAdCard;
