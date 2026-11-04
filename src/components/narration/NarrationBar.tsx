import React from 'react';
import { useGame } from '../../context/GameContext';
import { Volume2, X, Sparkles, Heart } from 'lucide-react';
import { audioService } from '../../services/audioService';
import { NikoCharacter } from '../characters/NikoCharacter';

export const NarrationBar: React.FC = () => {
  const { currentNarration, dismissNarration, accessibility } = useGame();

  if (!currentNarration || !accessibility.showCaptions) {
    return null;
  }

  const isJessica = currentNarration.speaker.startsWith('Jessica');
  const isBarnaby = currentNarration.speaker.startsWith('Barnaby');

  const avatarSrc = '/images/barnaby.png';

  const replayAudio = () => {
    const char = isJessica ? 'Jessica' : isBarnaby ? 'Barnaby' : 'Niko';
    const mood = currentNarration.mood === 'celebrating' ? 'celebrate' : (currentNarration.mood || 'happy');
    audioService.playCharacterVoice(char, undefined, mood);
  };

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-2xl z-40 transition-all ${
        accessibility.sensoryCalmMode ? '' : 'animate-bounce-subtle'
      }`}
    >
      <div className="bg-white/95 backdrop-blur-md border-4 border-amber-300 rounded-3xl p-4 md:p-5 shadow-2xl relative flex items-start gap-4">
        {/* Speaker Avatar / Badge */}
        <div className="relative shrink-0">
          <div
            className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden border-3 shadow-md flex items-center justify-center ${
              isJessica
                ? 'bg-gradient-to-br from-purple-200 to-pink-200 border-purple-400'
                : isBarnaby
                ? 'bg-gradient-to-br from-amber-100 to-orange-200 border-amber-400'
                : 'bg-gradient-to-br from-teal-100 to-emerald-200 border-teal-400'
            }`}
          >
            {isJessica ? (
              <div className="text-3xl" title="Teacher Jessica">
                👩‍🏫
              </div>
            ) : isBarnaby ? (
              <img
                src={avatarSrc}
                alt={currentNarration.speaker}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <NikoCharacter
                size="icon"
                focus="face"
                pose={currentNarration.mood === 'celebrate' ? 'celebrating' : 'idle'}
                decorative
                className="rounded-2xl overflow-hidden"
              />
            )}
          </div>
          <span
            className={`absolute -bottom-1 -right-1 text-xs px-2 py-0.5 rounded-full font-bold text-white shadow-sm ${
              isJessica ? 'bg-purple-600' : isBarnaby ? 'bg-amber-600' : 'bg-teal-600'
            }`}
          >
            {isJessica ? 'Teacher' : isBarnaby ? 'Companion' : 'Niko'}
          </span>
        </div>

        {/* Speech Content */}
        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`font-black text-sm md:text-base tracking-wide ${
                isJessica ? 'text-purple-800' : isBarnaby ? 'text-amber-800' : 'text-teal-800'
              }`}
            >
              {currentNarration.speaker}
            </span>
            {currentNarration.mood === 'celebrate' && (
              <span className="flex items-center text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                <Sparkles className="w-3 h-3 mr-1 text-amber-500" />
                Hooray!
              </span>
            )}
            {currentNarration.mood === 'gentle' && (
              <span className="flex items-center text-xs bg-pink-100 text-pink-800 px-2 py-0.5 rounded-full font-bold">
                <Heart className="w-3 h-3 mr-1 text-pink-500" />
                Gentle Tip
              </span>
            )}
          </div>

          <p className="text-slate-800 font-bold text-base md:text-lg leading-snug">
            {currentNarration.text}
          </p>

          {currentNarration.subtext && (
            <p className="text-slate-600 text-xs md:text-sm mt-1 font-medium">
              {currentNarration.subtext}
            </p>
          )}

          {/* Replay voice button */}
          <div className="mt-2 flex items-center gap-3">
            <button
              onClick={replayAudio}
              className="inline-flex items-center gap-1.5 text-xs font-black text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1 rounded-xl transition cursor-pointer"
              title="Listen again"
            >
              <Volume2 className="w-3.5 h-3.5" />
              Listen Again
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={dismissNarration}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer"
          aria-label="Dismiss message"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
