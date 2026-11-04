// Audio Service for Niko's Great Adventure
// Supports prerecorded MP3 narration, independent volume controls,
// Web Audio ambient adventure music, handcrafted kid-friendly sound effects,
// and melodic character voice inflections (without robotic browser speech synthesis).

export class AudioService {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private narrationGain: GainNode | null = null;
  private masterGain: GainNode | null = null;

  private isMusicPlaying = false;
  private musicInterval: number | null = null;

  private musicVolume = 0.4;
  private sfxVolume = 0.7;
  private narrationVolume = 0.85;
  private isMasterMuted = false;

  // Prerecorded MP3 Audio element cache
  private prerecordedAudioMap = new Map<string, HTMLAudioElement>();

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.isMasterMuted ? 0 : 1;
        this.masterGain.connect(this.ctx.destination);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.value = this.musicVolume;
        this.musicGain.connect(this.masterGain);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.value = this.sfxVolume;
        this.sfxGain.connect(this.masterGain);

        this.narrationGain = this.ctx.createGain();
        this.narrationGain.gain.value = this.narrationVolume;
        this.narrationGain.connect(this.masterGain);
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public updateVolumes(settings: {
    musicVolume: number;
    sfxVolume: number;
    narrationVolume: number;
    masterMuted: boolean;
  }) {
    this.musicVolume = Math.max(0, Math.min(1, settings.musicVolume));
    this.sfxVolume = Math.max(0, Math.min(1, settings.sfxVolume));
    this.narrationVolume = Math.max(0, Math.min(1, settings.narrationVolume));
    this.isMasterMuted = settings.masterMuted;

    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.isMasterMuted ? 0 : 1, this.ctx?.currentTime || 0);
    }
    if (this.musicGain) {
      this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx?.currentTime || 0);
    }
    if (this.sfxGain) {
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx?.currentTime || 0);
    }
    if (this.narrationGain) {
      this.narrationGain.gain.setValueAtTime(this.narrationVolume, this.ctx?.currentTime || 0);
    }
  }

  // --- Narration Voice System ---
  // Plays prerecorded MP3 if available; otherwise plays friendly character melodic voice tones
  // Absolutely NO robotic browser text-to-speech
  public playCharacterVoice(
    character: 'Jessica' | 'Barnaby' | 'Niko',
    mp3Path?: string,
    mood: 'happy' | 'gentle' | 'celebrate' | 'thinking' = 'happy'
  ) {
    this.initContext();

    // If a prerecorded MP3 path is provided and valid, attempt playback
    if (mp3Path && !this.isMasterMuted && this.narrationVolume > 0) {
      let audio = this.prerecordedAudioMap.get(mp3Path);
      if (!audio) {
        audio = new Audio(mp3Path);
        this.prerecordedAudioMap.set(mp3Path, audio);
      }
      audio.volume = this.narrationVolume;
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Fallback to melodic voice flourishes if file is missing/unreachable
        this.synthesizeCharacterSpeechFlourish(character, mood);
      });
      return;
    }

    // Melodic character voice inflection
    this.synthesizeCharacterSpeechFlourish(character, mood);
  }

  private synthesizeCharacterSpeechFlourish(
    character: 'Jessica' | 'Barnaby' | 'Niko',
    mood: 'happy' | 'gentle' | 'celebrate' | 'thinking'
  ) {
    if (!this.ctx || !this.narrationGain || this.isMasterMuted || this.narrationVolume <= 0) return;

    const now = this.ctx.currentTime;

    if (character === 'Jessica') {
      // Jessica (Teacher): Warm, soothing flute & vibraphone melodic greeting
      const notes = mood === 'celebrate' ? [523.25, 659.25, 783.99, 1046.5] : [440, 554.37, 659.25];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        // Soft bell envelope
        noteGain.gain.setValueAtTime(0, now + idx * 0.12);
        noteGain.gain.linearRampToValueAtTime(0.22 * this.narrationVolume, now + idx * 0.12 + 0.04);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.35);

        osc.connect(noteGain);
        noteGain.connect(this.narrationGain!);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.36);
      });
    } else if (character === 'Barnaby') {
      // Barnaby (Rabbit): Cheerful, bouncy woodwind marimba chirps
      const notes = mood === 'celebrate' ? [587.33, 739.99, 880, 1174.66] : [659.25, 783.99, 659.25, 880];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);

        noteGain.gain.setValueAtTime(0, now + idx * 0.09);
        noteGain.gain.linearRampToValueAtTime(0.24 * this.narrationVolume, now + idx * 0.09 + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.22);

        osc.connect(noteGain);
        noteGain.connect(this.narrationGain!);

        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.23);
      });
    } else {
      // Niko: Cheerful adventurer chime
      const notes = [440, 523.25, 659.25];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        noteGain.gain.setValueAtTime(0, now + idx * 0.1);
        noteGain.gain.linearRampToValueAtTime(0.18 * this.narrationVolume, now + idx * 0.1 + 0.03);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.25);
        osc.connect(noteGain);
        noteGain.connect(this.narrationGain!);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.26);
      });
    }
  }

  // --- Kid-Friendly Sound Effects ---

  public playButton() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMasterMuted || this.sfxVolume <= 0) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.08);

    g.gain.setValueAtTime(0.2 * this.sfxVolume, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.11);
  }

  public playFootstep() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMasterMuted || this.sfxVolume <= 0) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140 + Math.random() * 30, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.06);

    g.gain.setValueAtTime(0.12 * this.sfxVolume, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  public playSparkle() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMasterMuted || this.sfxVolume <= 0) return;
    const now = this.ctx.currentTime;
    const freqs = [1046.5, 1318.5, 1567.98, 2093.0];

    freqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      g.gain.setValueAtTime(0.12 * this.sfxVolume, now + idx * 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.18);

      osc.connect(g);
      g.connect(this.sfxGain!);
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.2);
    });
  }

  public playColorRestore() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMasterMuted || this.sfxVolume <= 0) return;
    const now = this.ctx.currentTime;

    // Rich blossoming harmonic chord
    const chord = [392.0, 523.25, 659.25, 783.99, 1046.5];
    chord.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      g.gain.setValueAtTime(0.01, now + idx * 0.07);
      g.gain.linearRampToValueAtTime(0.22 * this.sfxVolume, now + idx * 0.07 + 0.08);
      g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.85);

      osc.connect(g);
      g.connect(this.sfxGain!);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.9);
    });
  }

  public playGentleEncouragement() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMasterMuted || this.sfxVolume <= 0) return;
    const now = this.ctx.currentTime;

    // Encouraging soft two-tone chime (F4 -> G4)
    const notes = [349.23, 392.0];
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.14);
      g.gain.setValueAtTime(0.15 * this.sfxVolume, now + idx * 0.14);
      g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.14 + 0.25);
      osc.connect(g);
      g.connect(this.sfxGain!);
      osc.start(now + idx * 0.14);
      osc.stop(now + idx * 0.14 + 0.26);
    });
  }

  public playSecretFound() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMasterMuted || this.sfxVolume <= 0) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      g.gain.setValueAtTime(0.18 * this.sfxVolume, now + idx * 0.08);
      g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);
      osc.connect(g);
      g.connect(this.sfxGain!);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.32);
    });
  }

  public playFanfare() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMasterMuted || this.sfxVolume <= 0) return;
    const now = this.ctx.currentTime;
    const notes = [
      { f: 523.25, d: 0.15 },
      { f: 659.25, d: 0.15 },
      { f: 783.99, d: 0.18 },
      { f: 1046.5, d: 0.45 },
    ];
    let offset = 0;
    notes.forEach((note) => {
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.f, now + offset);
      g.gain.setValueAtTime(0.01, now + offset);
      g.gain.linearRampToValueAtTime(0.25 * this.sfxVolume, now + offset + 0.04);
      g.gain.exponentialRampToValueAtTime(0.001, now + offset + note.d);
      osc.connect(g);
      g.connect(this.sfxGain!);
      osc.start(now + offset);
      osc.stop(now + offset + note.d + 0.02);
      offset += note.d * 0.75;
    });
  }

  // --- Ambient Adventure Background Music ---
  // Warm, gentle, loopable pentatonic melody synthesized with soft sine/triangle tones
  public startMusic() {
    this.initContext();
    if (this.isMusicPlaying) return;
    this.isMusicPlaying = true;

    // Melody pattern: soft chords every 2.4 seconds
    const chords = [
      [261.63, 329.63, 392.0], // C major
      [220.0, 261.63, 329.63], // A minor
      [174.61, 220.0, 261.63], // F major
      [196.0, 246.94, 293.66], // G major
    ];
    let chordIndex = 0;

    const playChord = () => {
      if (!this.isMusicPlaying || !this.ctx || !this.musicGain || this.isMasterMuted || this.musicVolume <= 0) return;
      const now = this.ctx.currentTime;
      const currentChord = chords[chordIndex % chords.length];
      chordIndex++;

      currentChord.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const g = this.ctx!.createGain();

        osc.type = idx === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        g.gain.setValueAtTime(0, now + idx * 0.08);
        g.gain.linearRampToValueAtTime(0.08 * this.musicVolume, now + idx * 0.08 + 0.4);
        g.gain.exponentialRampToValueAtTime(0.0005, now + idx * 0.08 + 2.3);

        osc.connect(g);
        g.connect(this.musicGain!);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 2.35);
      });
    };

    // Play first chord immediately
    playChord();
    this.musicInterval = window.setInterval(playChord, 2400);
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval !== null) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  public toggleMusic(): boolean {
    if (this.isMusicPlaying) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic();
      return true;
    }
  }
}

export const audioService = new AudioService();
