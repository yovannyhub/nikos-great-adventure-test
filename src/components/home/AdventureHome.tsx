import React from 'react';
import { useGame } from '../../context/GameContext';
import { Play, Map, Award, Volume2, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { audioService } from '../../services/audioService';
import { FOREST_COLORS } from '../../data/colorsData';
import { ColorKey } from '../../types/game';
import { NikoCharacter } from '../characters/NikoCharacter';

export const AdventureHome: React.FC = () => {
  const {
    setCurrentView,
    progress,
    setIsSettingsOpen,
    setIsProgressModalOpen,
    accessibility,
    speak,
  } = useGame();

  const handlePlayAdventure = () => {
    audioService.playButton();
    audioService.playFanfare();
    speak(
      'Jessica (Teacher)',
      'Heading into Level 1: The Forest of Lost Colors! Let’s explore and find Barnaby!',
      'Use touch or direction controls to guide Niko around the magical woodland.',
      'happy'
    );
    setCurrentView('level1');
  };

  const restoredCount = progress.restoredColors.length;
  const isAllRestored = restoredCount >= 6;

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Cinematic Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-200 via-amber-100 to-amber-50 pt-6 pb-12 md:pt-10 md:pb-16 px-4">
        {/* Background Decorative Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-30 pointer-events-none">
          <div className="absolute top-10 left-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl" />
          <div className="absolute top-20 right-10 w-96 h-96 bg-emerald-300 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/90 border-2 border-amber-300 px-4 py-1.5 rounded-full shadow-sm mb-4">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-xs md:text-sm font-black text-amber-900 tracking-wide uppercase">
                  Connected 10-World Adventure • Level 1 Playable
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-amber-950 tracking-tight leading-none mb-4 drop-shadow-sm">
                Niko's Great <br />
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 bg-clip-text text-transparent">
                  Adventure
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-amber-900/90 font-bold max-w-xl mx-auto lg:mx-0 mb-6 leading-relaxed">
                Step into a cinematic, handcrafted fairytale world! Help friendly Barnaby the Rabbit
                restore the missing rainbow colors to{' '}
                <span className="underline decoration-emerald-400 decoration-3">The Forest of Lost Colors</span>.
              </p>

              {/* Large Play Adventure Button */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
                <button
                  onClick={handlePlayAdventure}
                  className={`group relative w-full sm:w-auto px-8 md:px-10 py-5 md:py-6 rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-black text-xl md:text-2xl shadow-xl hover:shadow-2xl border-4 border-emerald-300 hover:scale-105 active:scale-95 transition cursor-pointer flex items-center justify-center gap-4 ${
                    accessibility.sensoryCalmMode ? '' : 'animate-gentle-pulse'
                  }`}
                  aria-label="Play Adventure Level 1"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shadow-inner group-hover:rotate-12 transition">
                    <Play className="w-7 h-7 fill-white text-white translate-x-0.5" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-extrabold text-emerald-100 uppercase tracking-wider">
                      {isAllRestored ? 'Replay Level 1' : 'Start Your Quest'}
                    </div>
                    <div className="leading-none text-2xl md:text-3xl">Play Adventure</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    audioService.playButton();
                    setCurrentView('worldmap');
                  }}
                  className="w-full sm:w-auto px-6 py-4 rounded-3xl bg-white/90 hover:bg-white text-amber-950 font-black text-base md:text-lg border-3 border-amber-300 shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center gap-2.5"
                >
                  <Map className="w-5 h-5 text-sky-600" />
                  <span>World Map (10 Realms)</span>
                </button>
              </div>

              {/* Live Level 1 Mission Bar */}
              <div className="bg-white/90 backdrop-blur-sm border-3 border-amber-200 rounded-2xl p-4 shadow-md max-w-xl mx-auto lg:mx-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-sm text-amber-950 flex items-center gap-1.5">
                    <span>🌲</span> Level 1 Mission Progress:
                  </span>
                  <span className="font-black text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    {restoredCount} of 6 Colors Restored
                  </span>
                </div>

                {/* Color dots */}
                <div className="grid grid-cols-6 gap-2">
                  {(['red', 'blue', 'yellow', 'green', 'purple', 'orange'] as ColorKey[]).map((cKey) => {
                    const isRestored = progress.restoredColors.includes(cKey);
                    const colorData = FOREST_COLORS[cKey];
                    return (
                      <div
                        key={cKey}
                        className={`h-8 rounded-xl flex items-center justify-center border-2 transition-all ${
                          isRestored
                            ? 'border-white shadow-sm scale-105'
                            : 'bg-slate-200/80 border-slate-300 opacity-50'
                        }`}
                        style={{ backgroundColor: isRestored ? colorData.hex : undefined }}
                        title={`${colorData.name}: ${isRestored ? 'Restored!' : 'Needs Help'}`}
                      >
                        {isRestored ? (
                          <span className="text-white text-xs font-black">
                            {accessibility.colorBlindSymbols ? colorData.symbol : '✓'}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs font-bold">?</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Cinematic Poster Column */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Frame with rounded borders */}
                <div className="relative rounded-3xl overflow-hidden border-4 border-amber-300 shadow-2xl bg-gradient-to-b from-amber-100 to-amber-200">
                  <img
                    src="/images/adventure-hero.jpg"
                    alt="Golden light spilling into the magical forest"
                    className="w-full h-80 sm:h-96 object-cover object-center"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Shared Niko sprite keeps the hero art consistent with gameplay. */}
                  <div className="absolute inset-0 flex items-end justify-end pr-3 pb-2 pointer-events-none">
                    <NikoCharacter
                      size="hero"
                      pose="idle"
                      facing="left"
                      decorative
                      style={{ height: '92%', aspectRatio: '944 / 1557' }}
                    />
                  </div>

                  {/* Caption on image */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="text-xs font-black uppercase tracking-wider text-amber-300 mb-0.5">
                      Level 1: The Forest of Lost Colors
                    </div>
                    <div className="font-extrabold text-sm sm:text-base leading-tight">
                      A peaceful exploration adventure with friendly animal guides & zero harsh failures.
                    </div>
                  </div>
                </div>

                {/* Floating Character Badges */}
                <div className="absolute -bottom-5 -left-4 bg-white border-3 border-amber-300 rounded-2xl p-2.5 shadow-lg flex items-center gap-2.5">
                  <NikoCharacter
                    size="icon"
                    focus="face"
                    decorative
                    className="rounded-xl overflow-hidden border border-amber-200 bg-teal-50"
                  />
                  <div>
                    <div className="text-xs font-black text-amber-950">Niko</div>
                    <div className="text-[10px] font-bold text-amber-700">Young Explorer</div>
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 bg-white border-3 border-amber-300 rounded-2xl p-2.5 shadow-lg flex items-center gap-2.5">
                  <img
                    src="/images/barnaby.png"
                    alt="Barnaby Avatar"
                    className="w-10 h-10 rounded-xl object-cover object-top border border-amber-200 bg-amber-50"
                  />
                  <div>
                    <div className="text-xs font-black text-amber-950">Barnaby</div>
                    <div className="text-[10px] font-bold text-amber-700">Artist Rabbit</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Navigation Grid (World Map, My Progress, Sound Settings) */}
      <section className="max-w-6xl mx-auto px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-black text-amber-950 text-center mb-6">
          Adventure Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: World Map */}
          <div
            onClick={() => {
              audioService.playButton();
              setCurrentView('worldmap');
            }}
            className="group bg-gradient-to-br from-sky-50 to-indigo-50 border-4 border-sky-200 hover:border-sky-400 rounded-3xl p-6 shadow-md hover:shadow-xl transition cursor-pointer relative overflow-hidden"
          >
            <div className="w-14 h-14 rounded-2xl bg-sky-500 text-white flex items-center justify-center text-2xl shadow-md mb-4 group-hover:scale-110 transition">
              <Map className="w-7 h-7" />
            </div>
            <div className="inline-block bg-sky-100 text-sky-800 text-xs font-black px-2.5 py-0.5 rounded-full mb-2">
              10 Planned Realms
            </div>
            <h3 className="text-xl font-black text-sky-950 mb-2">Interactive World Map</h3>
            <p className="text-sky-800/80 font-bold text-sm mb-4 leading-relaxed">
              Explore the grand map connecting all ten planned realms. Inspect locked previews and
              discover sneak peeks for World 2 through 10!
            </p>
            <div className="flex items-center gap-1.5 text-sky-700 font-extrabold text-sm group-hover:translate-x-1 transition">
              <span>View Worlds</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 2: My Progress */}
          <div
            onClick={() => {
              audioService.playButton();
              setIsProgressModalOpen(true);
            }}
            className="group bg-gradient-to-br from-purple-50 to-pink-50 border-4 border-purple-200 hover:border-purple-400 rounded-3xl p-6 shadow-md hover:shadow-xl transition cursor-pointer relative overflow-hidden"
          >
            <div className="w-14 h-14 rounded-2xl bg-purple-500 text-white flex items-center justify-center text-2xl shadow-md mb-4 group-hover:scale-110 transition">
              <Award className="w-7 h-7" />
            </div>
            <div className="inline-block bg-purple-100 text-purple-800 text-xs font-black px-2.5 py-0.5 rounded-full mb-2">
              ⭐ {progress.points} Points Earned
            </div>
            <h3 className="text-xl font-black text-purple-950 mb-2">My Explorer Progress</h3>
            <p className="text-purple-800/80 font-bold text-sm mb-4 leading-relaxed">
              Review your earned star points, unlocked color badges, secret discoveries, and
              view your printable Explorer Passport!
            </p>
            <div className="flex items-center gap-1.5 text-purple-700 font-extrabold text-sm group-hover:translate-x-1 transition">
              <span>Inspect Badges</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 3: Sound & Accessibility */}
          <div
            onClick={() => {
              audioService.playButton();
              setIsSettingsOpen(true);
            }}
            className="group bg-gradient-to-br from-amber-50 to-orange-50 border-4 border-amber-200 hover:border-amber-400 rounded-3xl p-6 shadow-md hover:shadow-xl transition cursor-pointer relative overflow-hidden"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-md mb-4 group-hover:scale-110 transition">
              <Volume2 className="w-7 h-7" />
            </div>
            <div className="inline-block bg-amber-100 text-amber-800 text-xs font-black px-2.5 py-0.5 rounded-full mb-2">
              Independent Sliders & Sensory Mode
            </div>
            <h3 className="text-xl font-black text-amber-950 mb-2">Sound & Accessibility</h3>
            <p className="text-amber-800/80 font-bold text-sm mb-4 leading-relaxed">
              Customize Narration (Teacher Jessica), Music, and Sound Effects independently.
              Toggle Sensory Calm Mode, High Contrast, and D-Pad controls.
            </p>
            <div className="flex items-center gap-1.5 text-amber-700 font-extrabold text-sm group-hover:translate-x-1 transition">
              <span>Open Settings</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Characters Section */}
      <section className="max-w-6xl mx-auto px-4 mt-12">
        <div className="bg-white border-4 border-amber-200 rounded-3xl p-6 md:p-8 shadow-lg">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-black text-amber-600 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full">
              Cinematic Cast
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-amber-950 mt-2">
              Meet Your Adventure Companions
            </h2>
            <p className="text-amber-900/80 font-bold text-sm mt-1">
              Recurring 3D animated friends who guide children with encouragement and warmth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Character 1: Niko */}
            <div className="bg-gradient-to-b from-teal-50 to-emerald-50 border-3 border-teal-200 rounded-2xl p-5 text-center flex flex-col items-center">
              <NikoCharacter
                size="card"
                pose="idle"
                className="w-24 h-36 rounded-2xl overflow-hidden border-3 border-teal-300 shadow-md mb-3 bg-teal-50"
              />
              <h3 className="text-lg font-black text-teal-950">Niko</h3>
              <p className="text-xs font-black text-teal-700 mb-2">The Young Explorer</p>
              <p className="text-xs text-slate-700 font-bold leading-relaxed">
                Curious, brave, and kind-hearted, Niko wears his red scarf, blue explorer's tunic, leather backpack, and golden compass as he solves nature's mysteries.
              </p>
            </div>

            {/* Character 2: Barnaby */}
            <div className="bg-gradient-to-b from-amber-50 to-orange-50 border-3 border-amber-200 rounded-2xl p-5 text-center flex flex-col items-center">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-3 border-amber-300 shadow-md mb-3 bg-white">
                <img
                  src="/images/barnaby.png"
                  alt="Barnaby the Rabbit"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <h3 className="text-lg font-black text-amber-950">Barnaby</h3>
              <p className="text-xs font-black text-amber-700 mb-2">The Artist Rabbit</p>
              <p className="text-xs text-slate-700 font-bold leading-relaxed">
                Niko's Level 1 companion with perky ears and a wooden paintbrush. He loves carrots and teaching children how colors bring joy!
              </p>
            </div>

            {/* Character 3: Jessica */}
            <div className="bg-gradient-to-b from-purple-50 to-pink-50 border-3 border-purple-200 rounded-2xl p-5 text-center flex flex-col items-center">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-3 border-purple-300 shadow-md mb-3 bg-purple-100 flex items-center justify-center text-5xl">
                👩‍🏫
              </div>
              <h3 className="text-lg font-black text-purple-950">Teacher Jessica</h3>
              <p className="text-xs font-black text-purple-700 mb-2">Permanent Educator Voice</p>
              <p className="text-xs text-slate-700 font-bold leading-relaxed">
                A warm, nurturing female voice who provides positive guidance, gentle hints, and celebration without any robotic text-to-speech.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Parents & Educators / Accessibility Promise */}
      <section className="max-w-6xl mx-auto px-4 mt-8">
        <div className="bg-amber-100/70 border-3 border-amber-300 rounded-3xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-7 h-7 text-emerald-700 shrink-0" />
              <div>
                <h3 className="text-lg md:text-xl font-black text-amber-950">
                  Built for Children Ages 3–9 & Diverse Sensory Needs
                </h3>
                <p className="text-xs md:text-sm font-bold text-amber-800">
                  Zero ads, zero data tracking, no child accounts required, and unlimited encouraging retries.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs md:text-sm font-bold text-amber-950">
            <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-amber-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Sensory Calm Mode (No Flashes)</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-amber-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Color-Blind Friendly Symbols</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-amber-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Big Touch Targets & D-Pad</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-amber-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Prerecorded Human Narration Design</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
