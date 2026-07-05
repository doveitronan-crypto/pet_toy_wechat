import React from 'react';
import { Compass, Heart, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'discover' | 'wishlist' | 'mine';
  onChangeTab: (tab: 'discover' | 'wishlist' | 'mine') => void;
  wishlistCount: number;
}

export default function BottomNav({ activeTab, onChangeTab, wishlistCount }: BottomNavProps) {
  const tabs = [
    { id: 'discover', label: '发现', icon: Compass, badge: false },
    { id: 'wishlist', label: '心愿', icon: Heart, badge: true },
    { id: 'mine', label: '我的', icon: User, badge: false },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-brand-border py-2 z-40 flex justify-around items-center">
      <div className="w-full max-w-md mx-auto flex justify-around items-center px-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className="flex flex-col items-center justify-center gap-1 min-w-[64px] relative py-1 cursor-pointer select-none group"
            >
              {/* Active Tab Highlight Shape (Capsule rounded behind icon as in screenshot) */}
              <div
                className={`relative px-5 py-1 rounded-2xl transition-all duration-300 flex items-center justify-center ${
                  isActive
                    ? 'bg-brand-primary-light/60 text-brand-primary'
                    : 'text-brand-text-subtle hover:text-brand-primary/65'
                }`}
              >
                <Icon className={`w-5.5 h-5.5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />

                {/* Wishlist badge count */}
                {tab.badge && wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 bg-brand-primary text-white text-[9px] font-bold font-mono h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center shadow-sm">
                    {wishlistCount}
                  </span>
                )}
              </div>

              {/* Tab Label */}
              <span
                className={`text-[10px] font-bold transition-all duration-300 leading-none ${
                  isActive ? 'text-brand-primary font-extrabold' : 'text-brand-text-subtle'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
