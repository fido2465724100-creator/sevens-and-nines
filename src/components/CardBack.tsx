import React from 'react';
import { CardBackStyle } from '../engine/types';

interface CardBackProps {
  style?: CardBackStyle;
  customImageUrl?: string | null;
  className?: string;
}

export const CardBack: React.FC<CardBackProps> = ({
  style = 'classic-blue',
  customImageUrl,
  className = '',
}) => {
  // If user selected custom image and provided a valid URL
  if (style === 'custom' && customImageUrl) {
    return (
      <div
        className={`w-full h-full rounded-lg border-2 border-white/80 overflow-hidden shadow-inner bg-slate-800 flex items-center justify-center ${className}`}
      >
        <img
          src={customImageUrl}
          alt="Custom Card Back"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Render one of the 8 vector procedural patterns
  return (
    <div
      className={`w-full h-full rounded-lg border-2 border-white/90 shadow-md overflow-hidden relative select-none ${className}`}
      style={{
        background: getBackground(style),
      }}
    >
      <div className="absolute inset-1 border border-white/40 rounded pointer-events-none" />
      <div className="absolute inset-1.5 border border-white/20 rounded pointer-events-none" />
      {renderPattern(style)}
    </div>
  );
};

function getBackground(style: CardBackStyle): string {
  switch (style) {
    case 'classic-blue':
      return 'linear-gradient(135deg, #1e3a8a 0%, #172554 100%)';
    case 'classic-red':
      return 'linear-gradient(135deg, #991b1b 0%, #450a0a 100%)';
    case 'soviet-atlas':
      return 'linear-gradient(135deg, #831843 0%, #500724 100%)';
    case 'royal-gold':
      return 'linear-gradient(135deg, #18181b 0%, #09090b 100%)';
    case 'emerald':
      return 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)';
    case 'cyber-neon':
      return 'linear-gradient(135deg, #0f172a 0%, #020617 100%)';
    case 'wood-vintage':
      return 'linear-gradient(135deg, #78350f 0%, #451a03 100%)';
    case 'galaxy':
      return 'linear-gradient(135deg, #3b0764 0%, #09021a 100%)';
    default:
      return 'linear-gradient(135deg, #1e3a8a 0%, #172554 100%)';
  }
}

function renderPattern(style: CardBackStyle) {
  switch (style) {
    case 'classic-blue':
    case 'classic-red':
      return (
        <svg className="w-full h-full opacity-60" viewBox="0 0 100 140">
          <defs>
            <pattern id={`pattern-${style}`} width="12" height="12" patternUnits="userSpaceOnUse">
              <path d="M6 0 L12 6 L6 12 L0 6 Z" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" />
              <circle cx="6" cy="6" r="1.5" fill="rgba(255,255,255,0.5)" />
            </pattern>
          </defs>
          <rect width="100" height="140" fill={`url(#pattern-${style})`} />
          <circle cx="50" cy="70" r="22" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
          <path d="M50 52 L64 70 L50 88 L36 70 Z" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
          <circle cx="50" cy="70" r="4" fill="rgba(255,255,255,0.9)" />
        </svg>
      );

    case 'soviet-atlas':
      return (
        <svg className="w-full h-full opacity-70" viewBox="0 0 100 140">
          <defs>
            <pattern id="atlas-pattern" width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M0 0 L16 16 M16 0 L0 16" stroke="rgba(244, 114, 182, 0.4)" strokeWidth="0.6" />
              <circle cx="8" cy="8" r="2" fill="rgba(253, 224, 71, 0.7)" />
            </pattern>
          </defs>
          <rect width="100" height="140" fill="url(#atlas-pattern)" />
          <rect x="25" y="45" width="50" height="50" rx="4" fill="none" stroke="#f472b6" strokeWidth="1.5" transform="rotate(45 50 70)" />
          <circle cx="50" cy="70" r="10" fill="#be185d" stroke="#fde047" strokeWidth="1" />
          <path d="M50 63 L52 68 L57 70 L52 72 L50 77 L48 72 L43 70 L48 68 Z" fill="#fde047" />
        </svg>
      );

    case 'royal-gold':
      return (
        <svg className="w-full h-full" viewBox="0 0 100 140">
          <defs>
            <pattern id="gold-grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="5" cy="5" r="1" fill="#f59e0b" opacity="0.6" />
              <path d="M0 5 H10 M5 0 V10" stroke="#b45309" strokeWidth="0.4" opacity="0.4" />
            </pattern>
          </defs>
          <rect width="100" height="140" fill="url(#gold-grid)" />
          <rect x="20" y="30" width="60" height="80" rx="6" fill="none" stroke="#fbbf24" strokeWidth="1.2" />
          <circle cx="50" cy="70" r="16" fill="#18181b" stroke="#f59e0b" strokeWidth="1.5" />
          {/* Crown */}
          <path d="M42 74 L42 66 L46 70 L50 64 L54 70 L58 66 L58 74 Z" fill="#fbbf24" />
          <circle cx="50" cy="73" r="1.5" fill="#18181b" />
        </svg>
      );

    case 'emerald':
      return (
        <svg className="w-full h-full opacity-70" viewBox="0 0 100 140">
          <defs>
            <pattern id="emerald-weave" width="14" height="14" patternUnits="userSpaceOnUse">
              <path d="M7 0 L14 7 L7 14 L0 7 Z" fill="none" stroke="#34d399" strokeWidth="0.9" />
              <circle cx="7" cy="7" r="1.5" fill="#a7f3d0" />
            </pattern>
          </defs>
          <rect width="100" height="140" fill="url(#emerald-weave)" />
          <circle cx="50" cy="70" r="20" fill="none" stroke="#6ee7b7" strokeWidth="2" strokeDasharray="3,2" />
          <circle cx="50" cy="70" r="8" fill="#047857" stroke="#a7f3d0" strokeWidth="1.5" />
        </svg>
      );

    case 'cyber-neon':
      return (
        <svg className="w-full h-full" viewBox="0 0 100 140">
          <defs>
            <pattern id="cyber-circuits" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M0 10 H12 V20 M12 10 L18 4 M18 4 H20" fill="none" stroke="#06b6d4" strokeWidth="0.7" opacity="0.5" />
              <circle cx="12" cy="10" r="1.2" fill="#ec4899" />
            </pattern>
          </defs>
          <rect width="100" height="140" fill="url(#cyber-circuits)" />
          <polygon points="50,45 72,70 50,95 28,70" fill="none" stroke="#ec4899" strokeWidth="1.8" />
          <circle cx="50" cy="70" r="12" fill="#020617" stroke="#06b6d4" strokeWidth="1.8" />
          <circle cx="50" cy="70" r="4" fill="#06b6d4" />
        </svg>
      );

    case 'wood-vintage':
      return (
        <svg className="w-full h-full opacity-80" viewBox="0 0 100 140">
          <defs>
            <pattern id="wood-grain" width="100" height="20" patternUnits="userSpaceOnUse">
              <path d="M0 5 Q 50 12, 100 5 M0 14 Q 50 8, 100 14" fill="none" stroke="#92400e" strokeWidth="0.8" opacity="0.4" />
            </pattern>
          </defs>
          <rect width="100" height="140" fill="url(#wood-grain)" />
          <circle cx="50" cy="70" r="22" fill="#451a03" stroke="#d97706" strokeWidth="1.5" />
          <path d="M50 56 L55 67 L65 70 L55 73 L50 84 L45 73 L35 70 L45 67 Z" fill="#d97706" />
        </svg>
      );

    case 'galaxy':
      return (
        <svg className="w-full h-full" viewBox="0 0 100 140">
          <circle cx="20" cy="30" r="1" fill="#fff" opacity="0.8" />
          <circle cx="80" cy="25" r="1.5" fill="#e9d5ff" opacity="0.9" />
          <circle cx="35" cy="85" r="1.2" fill="#fff" opacity="0.7" />
          <circle cx="75" cy="115" r="1.8" fill="#c084fc" opacity="0.8" />
          <circle cx="15" cy="120" r="1" fill="#fff" opacity="0.5" />
          <circle cx="85" cy="75" r="1" fill="#fff" opacity="0.6" />
          {/* Nebula spiral */}
          <ellipse cx="50" cy="70" rx="30" ry="16" fill="none" stroke="#c084fc" strokeWidth="1.2" transform="rotate(-30 50 70)" opacity="0.7" />
          <ellipse cx="50" cy="70" rx="20" ry="10" fill="none" stroke="#38bdf8" strokeWidth="1.2" transform="rotate(30 50 70)" opacity="0.6" />
          <circle cx="50" cy="70" r="5" fill="#f0abfc" />
        </svg>
      );

    default:
      return null;
  }
}
