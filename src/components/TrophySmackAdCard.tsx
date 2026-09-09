import React from 'react';
import { Card } from '@/components/ui/card';

const TrophySmackAdCard: React.FC = () => {
  return (
    <a
      href="https://www.trophysmack.com/collections/fantasy-football-trophies"
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full transition-transform transform hover:-translate-y-1"
    >
      <Card className="overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white">
        <img
          src="/assets/trophysmack-card.png"
          alt="TrophySmack Fantasy Football Trophies"
          className="w-full h-auto"
        />
      </Card>
    </a>
  );
};

export default TrophySmackAdCard;
