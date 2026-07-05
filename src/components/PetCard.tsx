import React from 'react';
import { ToggleLeft, ToggleRight, Sparkles, Dog, Cat, Settings2, Plus } from 'lucide-react';
import { Pet } from '../types';

interface PetCardProps {
  activePet: Pet;
  isMatched: boolean;
  onToggleMatch: (val: boolean) => void;
  onManagePets: () => void;
}

export default function PetCard({ activePet, isMatched, onToggleMatch, onManagePets }: PetCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-brand-border p-4.5 transition-all duration-300 hover:border-brand-primary/30 relative overflow-hidden group">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-brand-primary-light/10 to-transparent rounded-full -mr-10 -mt-10 pointer-events-none transition-transform duration-500 group-hover:scale-110" />

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3.5 cursor-pointer" onClick={onManagePets}>
          <div className="relative">
            {activePet.avatarUrl ? (
              <img
                src={activePet.avatarUrl}
                alt={activePet.name}
                className="w-13 h-13 rounded-full object-cover border-2 border-brand-primary-light"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-13 h-13 rounded-full bg-brand-primary-light/50 flex items-center justify-center border-2 border-brand-primary">
                {activePet.type === 'dog' ? (
                  <Dog className="w-6.5 h-6.5 text-brand-primary" />
                ) : (
                  <Cat className="w-6.5 h-6.5 text-brand-primary" />
                )}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 bg-brand-primary text-white p-1 rounded-full shadow-md">
              <Settings2 className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base text-brand-text">根据“{activePet.name}”匹配</span>
              <Sparkles className="w-3.5 h-3.5 text-brand-primary animate-pulse" />
            </div>
            <span className="text-xs text-brand-text-subtle font-medium mt-0.5">
              {activePet.age}岁 · {activePet.breed} · {activePet.energyLevel === 'high' ? '高' : activePet.energyLevel === 'medium' ? '中' : '低'}运动量
            </span>
          </div>
        </div>

        {/* Switch Toggle with Motion/Smooth animation */}
        <button
          id="pet-matching-switch"
          onClick={() => onToggleMatch(!isMatched)}
          className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            isMatched ? 'bg-brand-primary' : 'bg-brand-border'
          }`}
          aria-label="Toggle pet matching"
        >
          <span
            className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
              isMatched ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
