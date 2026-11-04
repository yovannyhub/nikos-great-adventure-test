import React from 'react';
import { useGame } from '../../context/GameContext';
import { X, Sparkles } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { recentNotification, dismissNotification, accessibility } = useGame();

  if (!recentNotification) return null;

  return (
    <div
      className={`fixed top-18 right-4 z-50 transition-all ${
        accessibility.sensoryCalmMode ? '' : 'animate-bounce-subtle'
      }`}
    >
      <div className="bg-amber-400 text-amber-950 border-3 border-white rounded-2xl px-4 py-2.5 shadow-2xl flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-white text-amber-900 flex items-center justify-center text-lg font-black shrink-0 shadow-xs">
          {recentNotification.icon || <Sparkles className="w-4 h-4 text-amber-500" />}
        </div>

        <div>
          <div className="font-black text-xs sm:text-sm leading-tight">
            {recentNotification.text}
          </div>
          {recentNotification.points && (
            <div className="text-[11px] font-extrabold text-amber-900">
              + {recentNotification.points} Adventure Stars!
            </div>
          )}
        </div>

        <button
          onClick={dismissNotification}
          className="text-amber-900 hover:text-amber-950 p-1 rounded-lg hover:bg-amber-300 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
