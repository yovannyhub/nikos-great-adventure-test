export type ColorKey = 'red' | 'blue' | 'yellow' | 'green' | 'purple' | 'orange';

export interface ColorInfo {
  key: ColorKey;
  name: string;
  hex: string;
  lightHex: string;
  symbol: string; // Color-blind friendly symbol
  symbolName: string;
  floraName: string;
  stationName: string;
  location: { x: number; y: number }; // percentage coords on forest map
  description: string;
  prompt: string;
  hint: string;
}

export interface SecretDiscovery {
  id: string;
  name: string;
  description: string;
  points: number;
  found: boolean;
  x: number;
  y: number;
  icon: string;
}

export interface PlayerProgress {
  points: number;
  restoredColors: ColorKey[];
  discoveredSecrets: string[];
  level1Completed: boolean;
  badges: string[];
  totalTimeMinutes: number;
  lastPlayedAt: string;
  completedAt?: string;
}

export interface AudioSettings {
  masterMuted: boolean;
  musicVolume: number;     // 0 to 1
  sfxVolume: number;       // 0 to 1
  narrationVolume: number; // 0 to 1
}

export interface AccessibilitySettings {
  sensoryCalmMode: boolean;
  highContrastMode: boolean;
  dyslexiaFont: boolean;
  largeText: boolean;
  showCaptions: boolean;
  colorBlindSymbols: boolean;
  controlsMode: 'touch' | 'dpad' | 'keyboard' | 'auto-assist';
}

export interface WorldData {
  id: number;
  title: string;
  subtitle: string;
  companion: string;
  companionRole: string;
  status: 'playable' | 'locked';
  learningFocus: string;
  description: string;
  environmentTheme: string;
  badgeName: string;
  badgeIcon: string;
  colorTheme: string;
}

export interface NarrationMessage {
  speaker: 'Jessica (Teacher)' | 'Barnaby (Rabbit)' | 'Niko';
  speakerRole: 'Teacher Guide' | 'Animal Companion' | 'Explorer';
  text: string;
  subtext?: string;
  mood?: 'happy' | 'thinking' | 'celebrating' | 'gentle' | 'celebrate';
  audioClipId?: string;
}
