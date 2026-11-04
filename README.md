# Niko's Great Adventure

Responsive React, TypeScript, Vite, and Tailwind prototype. Level 1, The Forest of Lost Colors, is playable; the remaining nine worlds are locked previews.

## Run Locally

```bash
npm install
npm run dev
```

Create a production build with:

```bash
npm run build
```

## Level 1 Controls

- Tap or click the forest to walk Niko to a location.
- Use the on-screen D-pad on touch screens.
- Use Arrow keys or WASD on desktop.
- Choose Guide Niko for auto-assist or Ask Barnaby for a hint.
- Visit color stations, identify matching objects, and paint the faded forest back to life.

Progress, settings, collected points, and discoveries are saved locally in the browser. The prototype does not require accounts or collect personal information.

## Character Asset

`public/images/niko-official.png` is the bundled RGBA Niko sprite with a real transparent alpha channel and no studio backdrop. `src/components/characters/NikoCharacter.tsx` reuses it throughout the homepage, world map, Level 1, dialogue, challenge feedback, and completion views. CSS pose classes provide gentle idle, walking, celebrating, gentle-feedback, and interaction animation without distorting the character artwork. Full-body views use a small soft contact shadow beneath the boots.

## Audio

`src/services/audioService.ts` supports prerecorded character MP3 paths and independent narration, music, and sound-effect volumes. It does not use browser text-to-speech. Add approved narration MP3 files locally and pass their paths to `playCharacterVoice` when wiring recorded lines.