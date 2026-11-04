import React, { CSSProperties } from 'react';

export type NikoPose = 'idle' | 'walking' | 'celebrating' | 'gentle' | 'interacting';
export type NikoFacing = 'left' | 'right' | 'forward' | 'backward';
export type NikoSize = 'icon' | 'avatar' | 'small' | 'card' | 'map' | 'game' | 'hero' | 'modal';

interface NikoCharacterProps {
  pose?: NikoPose;
  facing?: NikoFacing;
  size?: NikoSize;
  focus?: 'full' | 'face';
  className?: string;
  style?: CSSProperties;
  alt?: string;
  decorative?: boolean;
}

const sizeClasses: Record<NikoSize, string> = {
  icon: 'niko-character--icon',
  avatar: 'niko-character--avatar',
  small: 'niko-character--small',
  card: 'niko-character--card',
  map: 'niko-character--map',
  game: 'niko-character--game',
  hero: 'niko-character--hero',
  modal: 'niko-character--modal',
};

export const NikoCharacter: React.FC<NikoCharacterProps> = ({
  pose = 'idle',
  facing = 'right',
  size = 'avatar',
  focus = 'full',
  className = '',
  style,
  alt = 'Niko, the young explorer',
  decorative = false,
}) => (
  <span
    className={`niko-character niko-character--${pose} niko-character--facing-${facing} ${sizeClasses[size]} ${className}`}
    style={style}
    role={decorative ? undefined : 'img'}
    aria-label={decorative ? undefined : alt}
    aria-hidden={decorative || undefined}
  >
    <img
      className={`niko-character__image ${focus === 'face' ? 'niko-character__image--face' : ''}`}
      src={`${import.meta.env.BASE_URL}images/niko-official.png`}
      alt=""
      draggable={false}
    />
  </span>
);