"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GameCard from "./GameCard";

interface GameCardModalProps {
  game: any;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  isFavorited: boolean;
}

const GameCardModal: React.FC<GameCardModalProps> = ({ game, isOpen, onClose, onToggleFavorite, isFavorited }) => {
  if (!game) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-0 bg-transparent border-none shadow-none">
        <DialogHeader className="sr-only">
          <DialogTitle>Game Details</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center items-center min-h-[300px]">
          <GameCard 
            game={game} 
            isFavorited={isFavorited} 
            onToggleFavorite={onToggleFavorite} 
            sport="ncaa" 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameCardModal;