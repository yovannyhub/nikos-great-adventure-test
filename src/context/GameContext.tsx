import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  ColorKey,
  PlayerProgress,
  AudioSettings,
  AccessibilitySettings,
  NarrationMessage,
  SecretDiscovery,
} from '../types/game';
import { audioService } from '../services/audioService';
import { FOREST_SECRETS } from '../data/secretsData';

interface GameContextType {
  // Navigation
  currentView: 'home' | 'level1' | 'worldmap' | 'progress';
  setCurrentView: (view: 'home' | 'level1' | 'worldmap' | 'progress') => void;

  // Progress
  progress: PlayerProgress;
  secrets: SecretDiscovery[];
  restoreColor: (color: ColorKey) => void;
  discoverSecret: (secretId: string) => void;
  addPoints: (amount: number, reason?: string) => void;
  resetProgress: () => void;
  completeLevel1: () => void;

  // Audio
  audioSettings: AudioSettings;
  updateAudioSettings: (newSettings: Partial<AudioSettings>) => void;
  toggleMasterMute: () => void;
  toggleMusic: () => void;

  // Accessibility
  accessibility: AccessibilitySettings;
  updateAccessibility: (newSettings: Partial<AccessibilitySettings>) => void;

  // Live Narration System
  currentNarration: NarrationMessage | null;
  speak: (
    speaker: 'Jessica (Teacher)' | 'Barnaby (Rabbit)' | 'Niko',
    text: string,
    subtext?: string,
    mood?: 'happy' | 'gentle' | 'celebrate' | 'thinking'
  ) => void;
  dismissNarration: () => void;

  // Active Modals & Dialogs
  activeColorChallenge: ColorKey | null;
  openColorChallenge: (color: ColorKey) => void;
  closeColorChallenge: () => void;

  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;

  isLevelCompleteModalOpen: boolean;
  setIsLevelCompleteModalOpen: (open: boolean) => void;

  isProgressModalOpen: boolean;
  setIsProgressModalOpen: (open: boolean) => void;

  selectedWorldId: number | null;
  setSelectedWorldId: (id: number | null) => void;

  recentNotification: { text: string; points?: number; icon?: string } | null;
  dismissNotification: () => void;
}

const STORAGE_KEY_PROGRESS = 'niko_adventure_progress_v1';
const STORAGE_KEY_AUDIO = 'niko_adventure_audio_v1';
const STORAGE_KEY_A11Y = 'niko_adventure_a11y_v1';

const defaultProgress: PlayerProgress = {
  points: 150, // Starting explorer bonus
  restoredColors: [],
  discoveredSecrets: [],
  level1Completed: false,
  badges: ['First Steps Explorer'],
  totalTimeMinutes: 3,
  lastPlayedAt: new Date().toISOString(),
};

const defaultAudio: AudioSettings = {
  masterMuted: false,
  musicVolume: 0.35,
  sfxVolume: 0.75,
  narrationVolume: 0.85,
};

const defaultA11y: AccessibilitySettings = {
  sensoryCalmMode: false,
  highContrastMode: false,
  dyslexiaFont: false,
  largeText: false,
  showCaptions: true,
  colorBlindSymbols: true,
  controlsMode: 'dpad',
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation
  const [currentView, setCurrentView] = useState<'home' | 'level1' | 'worldmap' | 'progress'>('home');

  // Progress state
  const [progress, setProgress] = useState<PlayerProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROGRESS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return defaultProgress;
  });

  // Secrets state
  const [secrets, setSecrets] = useState<SecretDiscovery[]>(() => {
    return FOREST_SECRETS.map((sec) => ({
      ...sec,
      found: progress.discoveredSecrets.includes(sec.id),
    }));
  });

  // Audio settings
  const [audioSettings, setAudioSettings] = useState<AudioSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUDIO);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return defaultAudio;
  });

  // Accessibility settings
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_A11Y);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return defaultA11y;
  });

  // Modals
  const [activeColorChallenge, setActiveColorChallenge] = useState<ColorKey | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLevelCompleteModalOpen, setIsLevelCompleteModalOpen] = useState(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [selectedWorldId, setSelectedWorldId] = useState<number | null>(null);

  // Narration
  const [currentNarration, setCurrentNarration] = useState<NarrationMessage | null>({
    speaker: 'Jessica (Teacher)',
    speakerRole: 'Teacher Guide',
    text: 'Welcome to Niko’s Great Adventure! I am Jessica, your guide. Let’s help Barnaby restore the Forest of Lost Colors!',
    subtext: 'Tap anywhere or use the controls to explore!',
    mood: 'happy',
  });

  // Toast notification
  const [recentNotification, setRecentNotification] = useState<{ text: string; points?: number; icon?: string } | null>(null);

  // Sync audio service with settings
  useEffect(() => {
    audioService.updateVolumes(audioSettings);
    localStorage.setItem(STORAGE_KEY_AUDIO, JSON.stringify(audioSettings));
  }, [audioSettings]);

  // Sync progress with storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));
  }, [progress]);

  // Sync accessibility with storage & DOM classes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_A11Y, JSON.stringify(accessibility));

    if (accessibility.sensoryCalmMode) {
      document.documentElement.classList.add('sensory-calm');
    } else {
      document.documentElement.classList.remove('sensory-calm');
    }

    if (accessibility.highContrastMode) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    if (accessibility.dyslexiaFont) {
      document.documentElement.classList.add('dyslexia-mode');
    } else {
      document.documentElement.classList.remove('dyslexia-mode');
    }
  }, [accessibility]);

  // Update secrets when progress changes
  useEffect(() => {
    setSecrets((prev) =>
      prev.map((sec) => ({
        ...sec,
        found: progress.discoveredSecrets.includes(sec.id),
      }))
    );
  }, [progress.discoveredSecrets]);

  const updateAudioSettings = useCallback((newSettings: Partial<AudioSettings>) => {
    setAudioSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const toggleMasterMute = useCallback(() => {
    setAudioSettings((prev) => ({ ...prev, masterMuted: !prev.masterMuted }));
  }, []);

  const toggleMusic = useCallback(() => {
    const isPlaying = audioService.toggleMusic();
    if (isPlaying) {
      audioService.playButton();
    }
  }, []);

  const updateAccessibility = useCallback((newSettings: Partial<AccessibilitySettings>) => {
    setAccessibility((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const addPoints = useCallback((amount: number, reason?: string) => {
    setProgress((prev) => ({
      ...prev,
      points: prev.points + amount,
    }));
    audioService.playSecretFound();
    if (reason) {
      setRecentNotification({
        text: reason,
        points: amount,
        icon: '⭐',
      });
      setTimeout(() => {
        setRecentNotification((curr) => (curr?.text === reason ? null : curr));
      }, 3500);
    }
  }, []);

  const speak = useCallback(
    (
      speaker: 'Jessica (Teacher)' | 'Barnaby (Rabbit)' | 'Niko',
      text: string,
      subtext?: string,
      mood: 'happy' | 'gentle' | 'celebrate' | 'thinking' = 'happy'
    ) => {
      const charName = speaker.startsWith('Jessica')
        ? 'Jessica'
        : speaker.startsWith('Barnaby')
        ? 'Barnaby'
        : 'Niko';

      audioService.playCharacterVoice(charName, undefined, mood);

      setCurrentNarration({
        speaker,
        speakerRole: speaker.startsWith('Jessica')
          ? 'Teacher Guide'
          : speaker.startsWith('Barnaby')
          ? 'Animal Companion'
          : 'Explorer',
        text,
        subtext,
        mood,
      });
    },
    []
  );

  const dismissNarration = useCallback(() => {
    setCurrentNarration(null);
  }, []);

  const dismissNotification = useCallback(() => {
    setRecentNotification(null);
  }, []);

  const restoreColor = useCallback(
    (color: ColorKey) => {
      setProgress((prev) => {
        if (prev.restoredColors.includes(color)) return prev;

        const updatedColors = [...prev.restoredColors, color];
        const newPoints = prev.points + 100;
        const colorNameUpper = color.toUpperCase();

        const newBadges = [...prev.badges];
        const badgeName = `${colorNameUpper} Crystal Guardian`;
        if (!newBadges.includes(badgeName)) {
          newBadges.push(badgeName);
        }

        const isFullyRestored = updatedColors.length >= 6;
        if (isFullyRestored && !newBadges.includes('Master Rainbow Restorer')) {
          newBadges.push('Master Rainbow Restorer');
        }

        return {
          ...prev,
          restoredColors: updatedColors,
          points: newPoints,
          badges: newBadges,
          level1Completed: isFullyRestored ? true : prev.level1Completed,
        };
      });

      audioService.playColorRestore();

      // Speak celebration
      speak(
        'Barnaby (Rabbit)',
        `Yippee! You restored ${color.toUpperCase()}! The forest is sparkling so brightly!`,
        'Every color brings life and smiles back to our woodland friends.',
        'celebrate'
      );

      // Check if all 6 colors are restored
      setTimeout(() => {
        setProgress((latest) => {
          if (latest.restoredColors.length >= 6 && !latest.level1Completed) {
            setIsLevelCompleteModalOpen(true);
            audioService.playFanfare();
          }
          return latest;
        });
      }, 1200);
    },
    [speak]
  );

  const discoverSecret = useCallback(
    (secretId: string) => {
      const secret = FOREST_SECRETS.find((s) => s.id === secretId);
      if (!secret) return;

      setProgress((prev) => {
        if (prev.discoveredSecrets.includes(secretId)) return prev;
        const updated = [...prev.discoveredSecrets, secretId];
        return {
          ...prev,
          discoveredSecrets: updated,
          points: prev.points + secret.points,
          badges:
            updated.length >= 4 && !prev.badges.includes('Forest Secret Sleuth')
              ? [...prev.badges, 'Forest Secret Sleuth']
              : prev.badges,
        };
      });

      audioService.playSecretFound();
      speak('Jessica (Teacher)', `You found a secret: ${secret.name}!`, secret.description, 'celebrate');
    },
    [speak]
  );

  const completeLevel1 = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      level1Completed: true,
      points: prev.points + 250,
      completedAt: new Date().toISOString(),
    }));
    audioService.playFanfare();
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress);
    setSecrets(FOREST_SECRETS.map((s) => ({ ...s, found: false })));
    localStorage.removeItem(STORAGE_KEY_PROGRESS);
    speak('Jessica (Teacher)', 'Progress has been reset! Ready for a fresh new adventure!', '', 'happy');
  }, [speak]);

  const openColorChallenge = useCallback((color: ColorKey) => {
    audioService.playButton();
    setActiveColorChallenge(color);
  }, []);

  const closeColorChallenge = useCallback(() => {
    audioService.playButton();
    setActiveColorChallenge(null);
  }, []);

  return (
    <GameContext.Provider
      value={{
        currentView,
        setCurrentView,
        progress,
        secrets,
        restoreColor,
        discoverSecret,
        addPoints,
        resetProgress,
        completeLevel1,
        audioSettings,
        updateAudioSettings,
        toggleMasterMute,
        toggleMusic,
        accessibility,
        updateAccessibility,
        currentNarration,
        speak,
        dismissNarration,
        activeColorChallenge,
        openColorChallenge,
        closeColorChallenge,
        isSettingsOpen,
        setIsSettingsOpen,
        isLevelCompleteModalOpen,
        setIsLevelCompleteModalOpen,
        isProgressModalOpen,
        setIsProgressModalOpen,
        selectedWorldId,
        setSelectedWorldId,
        recentNotification,
        dismissNotification,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
