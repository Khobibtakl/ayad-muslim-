import React, { useId } from 'react';
import type { ModuleId } from '../types';

export type Icon3DKind =
  | ModuleId
  | 'location'
  | 'sound'
  | 'offline'
  | 'lock'
  | 'download'
  | 'upload'
  | 'sparkles'
  | 'shield'
  | 'moreModules';

interface Icon3DProps {
  kind: Icon3DKind;
  size?: number;
  className?: string;
}

export const Icon3D: React.FC<Icon3DProps> = ({ kind, size = 28, className = '' }) => {
  const uid = useId().replace(/:/g, '');
  const gEmerald = `em-${uid}`;
  const gEmeraldDark = `emd-${uid}`;
  const gGold = `gd-${uid}`;
  const gGoldDark = `gdd-${uid}`;
  const gBlue = `bl-${uid}`;
  const gRose = `rs-${uid}`;
  const gGlass = `gl-${uid}`;
  const gCream = `cr-${uid}`;
  const gDark = `dk-${uid}`;
  const fShadow = `sh-${uid}`;

  const renderGlyph = () => {
    switch (kind) {
      case 'dashboard':
        return (
          <g filter={`url(#${fShadow})`}>
            <rect x="7" y="10" width="21" height="21" rx="6" fill={`url(#${gEmerald})`} />
            <rect x="7" y="10" width="21" height="9" rx="5" fill={`url(#${gGlass})`} opacity="0.45" />
            <rect x="33" y="10" width="21" height="15" rx="6" fill={`url(#${gGold})`} />
            <rect x="33" y="10" width="21" height="7" rx="5" fill={`url(#${gGlass})`} opacity="0.5" />
            <rect x="7" y="35" width="21" height="19" rx="6" fill={`url(#${gBlue})`} />
            <rect x="33" y="29" width="21" height="25" rx="6" fill={`url(#${gEmeraldDark})`} />
            <path d="M43.5 34l1.6 3.3 3.6.5-2.6 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.5 3.6-.5z" fill={`url(#${gGold})`} />
          </g>
        );

      case 'quran':
        return (
          <g filter={`url(#${fShadow})`}>
            {/* Rehal wooden stand base */}
            <path d="M12 49l20-11 20 11-5 5H17z" fill={`url(#${gGoldDark})`} />
            {/* Left & Right Mushaf cover */}
            <path d="M7 17c0-2 2-4 5-4h18v30H12c-3 0-5-1-5-3V17z" fill={`url(#${gEmerald})`} />
            <path d="M57 17c0-2-2-4-5-4H34v30h18c3 0 5-1 5-3V17z" fill={`url(#${gEmeraldDark})`} />
            {/* Ivory Illuminated Pages */}
            <path d="M10 17c4-2 15-2 21 2v23c-6-3-16-3-21-1V17z" fill={`url(#${gCream})`} />
            <path d="M54 17c-4-2-15-2-21 2v23c6-3 16-3 21-1V17z" fill={`url(#${gCream})`} />
            {/* Gold text lines */}
            <rect x="14" y="22" width="12" height="2.2" rx="1" fill={`url(#${gGold})`} />
            <rect x="14" y="27" width="10" height="2" rx="1" fill={`url(#${gEmerald})`} opacity="0.55" />
            <rect x="14" y="32" width="11" height="2" rx="1" fill={`url(#${gEmerald})`} opacity="0.4" />
            <rect x="38" y="22" width="12" height="2.2" rx="1" fill={`url(#${gGold})`} />
            <rect x="38" y="27" width="10" height="2" rx="1" fill={`url(#${gEmerald})`} opacity="0.55" />
            <rect x="38" y="32" width="11" height="2" rx="1" fill={`url(#${gEmerald})`} opacity="0.4" />
            {/* Spine gem */}
            <circle cx="32" cy="43" r="3.5" fill={`url(#${gGold})`} />
          </g>
        );

      case 'dictionary':
        return (
          <g filter={`url(#${fShadow})`}>
            <rect x="10" y="12" width="34" height="42" rx="7" fill={`url(#${gBlue})`} />
            <rect x="16" y="12" width="28" height="42" rx="6" fill={`url(#${gEmerald})`} />
            <rect x="16" y="12" width="28" height="12" rx="6" fill={`url(#${gGlass})`} opacity="0.35" />
            <rect x="22" y="20" width="16" height="4" rx="2" fill={`url(#${gGold})`} />
            <rect x="22" y="28" width="12" height="3" rx="1.5" fill={`url(#${gCream})`} opacity="0.8" />
            {/* 3D Magnifying Lens */}
            <circle cx="44" cy="41" r="10.5" fill={`url(#${gGold})`} />
            <circle cx="44" cy="41" r="7" fill={`url(#${gCream})`} />
            <path d="M51 48l6 6" stroke={`url(#${gGoldDark})`} strokeWidth="4.5" strokeLinecap="round" />
          </g>
        );

      case 'hadith':
        return (
          <g filter={`url(#${fShadow})`}>
            {/* 3D Scroll / Book */}
            <rect x="11" y="9" width="42" height="46" rx="8" fill={`url(#${gGoldDark})`} />
            <rect x="11" y="7" width="40" height="44" rx="8" fill={`url(#${gGold})`} />
            <rect x="16" y="13" width="30" height="32" rx="4" fill={`url(#${gCream})`} />
            <rect x="21" y="19" width="20" height="3" rx="1.5" fill={`url(#${gEmerald})`} />
            <rect x="21" y="25" width="16" height="2.5" rx="1.2" fill={`url(#${gEmeraldDark})`} opacity="0.55" />
            <rect x="21" y="31" width="18" height="2.5" rx="1.2" fill={`url(#${gEmeraldDark})`} opacity="0.4" />
            {/* Emerald Authenticity Seal */}
            <circle cx="45" cy="45" r="9" fill={`url(#${gEmerald})`} />
            <path d="M41.5 45l2.5 2.5 5-5" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        );

      case 'adhkar':
        return (
          <g filter={`url(#${fShadow})`}>
            <circle cx="32" cy="32" r="24" fill={`url(#${gEmeraldDark})`} />
            <circle cx="32" cy="30" r="22" fill={`url(#${gEmerald})`} />
            <ellipse cx="26" cy="18" rx="12" ry="6" fill={`url(#${gGlass})`} opacity="0.35" />
            {/* 3D Golden Crescent */}
            <path
              d="M36 17a14 14 0 1 0 10.5 23.2A11.5 11.5 0 1 1 36 17z"
              fill={`url(#${gGold})`}
            />
            <path d="M42 22l1.3 2.8 3 .4-2.2 2.1.5 3-2.6-1.4-2.7 1.4.5-3-2.2-2.1 3-.4z" fill={`url(#${gCream})`} />
          </g>
        );

      case 'tasbeeh':
        return (
          <g filter={`url(#${fShadow})`}>
            {/* 3D Prayer Beads Ring */}
            <circle cx="32" cy="12" r="5" fill={`url(#${gEmerald})`} />
            <circle cx="43" cy="15" r="4.6" fill={`url(#${gGold})`} />
            <circle cx="51" cy="24" r="4.6" fill={`url(#${gEmerald})`} />
            <circle cx="52" cy="35" r="4.6" fill={`url(#${gEmeraldDark})`} />
            <circle cx="45" cy="45" r="4.6" fill={`url(#${gGold})`} />
            <circle cx="32" cy="49" r="5.5" fill={`url(#${gGold})`} />
            <circle cx="19" cy="45" r="4.6" fill={`url(#${gEmerald})`} />
            <circle cx="12" cy="35" r="4.6" fill={`url(#${gEmeraldDark})`} />
            <circle cx="13" cy="24" r="4.6" fill={`url(#${gEmerald})`} />
            <circle cx="21" cy="15" r="4.6" fill={`url(#${gGold})`} />
            {/* Tassel / Imamah bead */}
            <rect x="29.5" y="53" width="5" height="6" rx="2.5" fill={`url(#${gEmeraldDark})`} />
          </g>
        );

      case 'duas':
        return (
          <g filter={`url(#${fShadow})`}>
            {/* 3D Radiant Heart & Supplication */}
            <path
              d="M32 53S11 40 11 23.5C11 15.8 17 10 24.3 10c4.2 0 6.5 2.1 7.7 4.2C33.2 12.1 35.5 10 39.7 10 47 10 53 15.8 53 23.5 53 40 32 53 32 53z"
              fill={`url(#${gRose})`}
            />
            <ellipse cx="22" cy="20" rx="6" ry="3.5" transform="rotate(-25 22 20)" fill={`url(#${gGlass})`} opacity="0.5" />
            <path d="M32 23l1.8 4 4.2.6-3 3 .7 4.2-3.7-2-3.7 2 .7-4.2-3-3 4.2-.6z" fill={`url(#${gCream})`} />
          </g>
        );

      case 'prayer':
        return (
          <g filter={`url(#${fShadow})`}>
            {/* 3D Emerald & Gold Clock Pedestal */}
            <circle cx="32" cy="34" r="22" fill={`url(#${gEmeraldDark})`} />
            <circle cx="32" cy="32" r="21" fill={`url(#${gEmerald})`} />
            <circle cx="32" cy="32" r="16" fill={`url(#${gCream})`} />
            <circle cx="32" cy="32" r="2.8" fill={`url(#${gGold})`} />
            <path d="M32 21v11l7 4" stroke={`url(#${gEmeraldDark})`} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Top crescent finial */}
            <path d="M28 9a4.5 4.5 0 1 1 8 0z" fill={`url(#${gGold})`} />
          </g>
        );

      case 'qibla':
        return (
          <g filter={`url(#${fShadow})`}>
            {/* 3D Brass & Emerald Compass */}
            <circle cx="32" cy="34" r="23" fill={`url(#${gGoldDark})`} />
            <circle cx="32" cy="31" r="23" fill={`url(#${gGold})`} />
            <circle cx="32" cy="31" r="17.5" fill={`url(#${gDark})`} />
            {/* Compass Needle */}
            <path d="M32 16l5.5 15h-11z" fill={`url(#${gEmerald})`} />
            <path d="M32 46l5.5-15h-11z" fill={`url(#${gCream})`} opacity="0.85" />
            <circle cx="32" cy="31" r="3.4" fill={`url(#${gGold})`} />
          </g>
        );

      case 'mosques':
        return (
          <g filter={`url(#${fShadow})`}>
            {/* 3D Grand Mosque Silhouette */}
            <rect x="9" y="48" width="46" height="7" rx="3" fill={`url(#${gGoldDark})`} />
            {/* Minarets */}
            <rect x="11" y="20" width="7" height="29" rx="2" fill={`url(#${gCream})`} />
            <path d="M11 20l3.5-8 3.5 8z" fill={`url(#${gGold})`} />
            <rect x="46" y="20" width="7" height="29" rx="2" fill={`url(#${gCream})`} />
            <path d="M46 20l3.5-8 3.5 8z" fill={`url(#${gGold})`} />
            {/* Main Dome */}
            <path d="M19 32c0-10 6-16 13-16s13 6 13 16v17H19V32z" fill={`url(#${gEmerald})`} />
            <path d="M22 28c1-5 5-9 10-9" stroke={`url(#${gGlass})`} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
            {/* Doorway */}
            <path d="M27 49V39a5 5 0 0 1 10 0v10z" fill={`url(#${gGold})`} />
            <circle cx="32" cy="12" r="2.2" fill={`url(#${gGold})`} />
          </g>
        );

      case 'library':
        return (
          <g filter={`url(#${fShadow})`}>
            {/* 3D Hardcover Bookshelf Trio */}
            <rect x="9" y="13" width="13" height="39" rx="3.5" fill={`url(#${gEmerald})`} />
            <rect x="11" y="19" width="9" height="4" rx="1" fill={`url(#${gGold})`} />
            <rect x="24" y="10" width="14" height="42" rx="3.5" fill={`url(#${gBlue})`} />
            <rect x="26" y="16" width="10" height="4" rx="1" fill={`url(#${gCream})`} />
            <rect x="40" y="16" width="14" height="36" rx="3.5" fill={`url(#${gGold})`} />
            <rect x="42" y="22" width="10" height="4" rx="1" fill={`url(#${gEmeraldDark})`} />
            <rect x="7" y="51" width="50" height="5" rx="2.5" fill={`url(#${gGoldDark})`} />
          </g>
        );

      case 'quotes':
        return (
          <g filter={`url(#${fShadow})`}>
            <rect x="10" y="12" width="44" height="40" rx="9" fill={`url(#${gEmerald})`} />
            <rect x="10" y="12" width="44" height="14" rx="9" fill={`url(#${gGlass})`} opacity="0.35" />
            <path d="M21 27c0-4 2.5-7 6-7v5c-1.5 0-2.5 1-2.5 2.5V34h3.5v7H21V27zm14 0c0-4 2.5-7 6-7v5c-1.5 0-2.5 1-2.5 2.5V34H42v7h-7V27z" fill={`url(#${gGold})`} />
          </g>
        );

      case 'zakat':
        return (
          <g filter={`url(#${fShadow})`}>
            {/* 3D Gold Balance Scale + Coin */}
            <rect x="29.5" y="12" width="5" height="36" rx="2.5" fill={`url(#${gGoldDark})`} />
            <rect x="19" y="47" width="26" height="6" rx="3" fill={`url(#${gGold})`} />
            <rect x="13" y="18" width="38" height="4" rx="2" fill={`url(#${gGold})`} />
            <path d="M16 22l-5 13h10z" fill={`url(#${gEmerald})`} />
            <path d="M48 22l-5 13h10z" fill={`url(#${gEmerald})`} />
            <circle cx="32" cy="12" r="4.5" fill={`url(#${gGold})`} />
          </g>
        );

      case 'calendar':
        return (
          <g filter={`url(#${fShadow})`}>
            <rect x="10" y="15" width="44" height="40" rx="8" fill={`url(#${gCream})`} />
            <path d="M10 23c0-4.4 3.6-8 8-8h28c4.4 0 8 3.6 8 8v6H10v-6z" fill={`url(#${gEmerald})`} />
            <rect x="20" y="9" width="5" height="10" rx="2.5" fill={`url(#${gGold})`} />
            <rect x="39" y="9" width="5" height="10" rx="2.5" fill={`url(#${gGold})`} />
            <path d="M34 34a7.5 7.5 0 1 0 5.6 12.4 6.2 6.2 0 1 1-5.6-12.4z" fill={`url(#${gGold})`} />
          </g>
        );

      case 'tasks':
        return (
          <g filter={`url(#${fShadow})`}>
            <rect x="10" y="10" width="44" height="44" rx="11" fill={`url(#${gEmeraldDark})`} />
            <rect x="10" y="8" width="44" height="44" rx="11" fill={`url(#${gEmerald})`} />
            <rect x="12" y="10" width="40" height="13" rx="8" fill={`url(#${gGlass})`} opacity="0.35" />
            <path d="M21 30l7 7 15-15" stroke={`url(#${gGold})`} strokeWidth="5.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        );

      case 'routines':
        return (
          <g filter={`url(#${fShadow})`}>
            <circle cx="32" cy="34" r="22" fill={`url(#${gGoldDark})`} />
            <circle cx="32" cy="31" r="22" fill={`url(#${gGold})`} />
            <circle cx="32" cy="31" r="14" fill={`url(#${gCream})`} opacity="0.9" />
            <path d="M22 33l5-5 4 4 9-9" stroke={`url(#${gEmerald})`} strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        );

      case 'statistics':
        return (
          <g filter={`url(#${fShadow})`}>
            <rect x="9" y="48" width="46" height="6" rx="3" fill={`url(#${gDark})`} opacity="0.25" />
            <rect x="12" y="30" width="10" height="20" rx="3.5" fill={`url(#${gBlue})`} />
            <rect x="27" y="14" width="10" height="36" rx="3.5" fill={`url(#${gEmerald})`} />
            <rect x="42" y="22" width="10" height="28" rx="3.5" fill={`url(#${gGold})`} />
          </g>
        );

      case 'assistant':
      case 'sparkles':
        return (
          <g filter={`url(#${fShadow})`}>
            {/* 3D Radiant Fanous / Crescent Sparkle */}
            <rect x="10" y="10" width="44" height="44" rx="14" fill={`url(#${gEmerald})`} />
            <rect x="10" y="10" width="44" height="15" rx="11" fill={`url(#${gGlass})`} opacity="0.35" />
            <path d="M32 16l3.2 10.8L46 30l-10.8 3.2L32 44l-3.2-10.8L18 30l10.8-3.2z" fill={`url(#${gGold})`} />
            <circle cx="45" cy="19" r="3" fill={`url(#${gCream})`} />
          </g>
        );

      case 'search':
        return (
          <g filter={`url(#${fShadow})`}>
            <circle cx="28" cy="28" r="16" fill={`url(#${gBlue})`} />
            <circle cx="28" cy="28" r="10.5" fill={`url(#${gCream})`} />
            <ellipse cx="24" cy="22" rx="4.5" ry="2.2" transform="rotate(-30 24 22)" fill="#ffffff" opacity="0.8" />
            <path d="M40 40l13 13" stroke={`url(#${gGold})`} strokeWidth="6" strokeLinecap="round" />
          </g>
        );

      case 'notifications':
        return (
          <g filter={`url(#${fShadow})`}>
            <path
              d="M32 10c-9 0-15 6.8-15 16v9l-5 6h40l-5-6v-9c0-9.2-6-16-15-16z"
              fill={`url(#${gGold})`}
            />
            <path d="M22 18c2-3 5-5 10-5" stroke={`url(#${gGlass})`} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7" />
            <circle cx="32" cy="48" r="5" fill={`url(#${gEmerald})`} />
          </g>
        );

      case 'settings':
        return (
          <g filter={`url(#${fShadow})`}>
            <path
              d="M32 9l4.5 5.2 6.8-1 1.5 6.7 6.3 2.8-2.2 6.5 3.6 5.8-5.3 4.4.4 6.8-6.6 1.7-2.6 6.3-6.4-2-6.4 2-2.6-6.3-6.6-1.7.4-6.8-5.3-4.4 3.6-5.8-2.2-6.5 6.3-2.8 1.5-6.7 6.8 1z"
              fill={`url(#${gEmerald})`}
            />
            <circle cx="32" cy="32" r="9.5" fill={`url(#${gCream})`} />
            <circle cx="32" cy="32" r="4.5" fill={`url(#${gGold})`} />
          </g>
        );

      case 'about':
        return (
          <g filter={`url(#${fShadow})`}>
            <circle cx="32" cy="33" r="22" fill={`url(#${gGoldDark})`} />
            <circle cx="32" cy="31" r="22" fill={`url(#${gGold})`} />
            <circle cx="32" cy="25" r="7.5" fill={`url(#${gEmerald})`} />
            <path d="M19 45c2.5-6.5 7.5-9.5 13-9.5s10.5 3 13 9.5z" fill={`url(#${gEmeraldDark})`} />
          </g>
        );

      case 'admin':
      case 'shield':
        return (
          <g filter={`url(#${fShadow})`}>
            <path d="M32 8l20 7.5V31c0 12.5-8.5 21.5-20 25.5C20.5 52.5 12 43.5 12 31V15.5L32 8z" fill={`url(#${gEmerald})`} />
            <path d="M32 12l16 6V31c0 10-6.8 17.5-16 20.8V12z" fill={`url(#${gEmeraldDark})`} />
            <path d="M24 31l5.5 5.5L41 25" stroke={`url(#${gGold})`} strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        );

      case 'location':
        return (
          <g filter={`url(#${fShadow})`}>
            <path d="M32 8c-10 0-18 8-18 18 0 13.5 18 30 18 30s18-16.5 18-30c0-10-8-18-18-18z" fill={`url(#${gRose})`} />
            <circle cx="32" cy="26" r="7" fill={`url(#${gCream})`} />
          </g>
        );

      case 'sound':
        return (
          <g filter={`url(#${fShadow})`}>
            <path d="M12 24h10l14-11v38L22 40H12z" fill={`url(#${gEmerald})`} />
            <path d="M43 22c4 4 4 16 0 20" stroke={`url(#${gGold})`} strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M49 16c7 7 7 25 0 32" stroke={`url(#${gGold})`} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.7" />
          </g>
        );

      case 'offline':
        return (
          <g filter={`url(#${fShadow})`}>
            <rect x="10" y="12" width="44" height="40" rx="12" fill={`url(#${gEmerald})`} />
            <path d="M22 33l7 7 14-14" stroke={`url(#${gGold})`} strokeWidth="4.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        );

      case 'lock':
        return (
          <g filter={`url(#${fShadow})`}>
            <path d="M21 28v-6a11 11 0 0 1 22 0v6" stroke={`url(#${gGold})`} strokeWidth="5.5" fill="none" />
            <rect x="14" y="27" width="36" height="26" rx="7" fill={`url(#${gEmerald})`} />
            <circle cx="32" cy="40" r="4" fill={`url(#${gGold})`} />
          </g>
        );

      case 'download':
        return (
          <g filter={`url(#${fShadow})`}>
            <rect x="10" y="10" width="44" height="44" rx="12" fill={`url(#${gEmerald})`} />
            <path d="M32 19v19m0 0l-7-7m7 7l7-7" stroke={`url(#${gCream})`} strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <rect x="20" y="43" width="24" height="3.5" rx="1.75" fill={`url(#${gGold})`} />
          </g>
        );

      case 'upload':
        return (
          <g filter={`url(#${fShadow})`}>
            <rect x="10" y="10" width="44" height="44" rx="12" fill={`url(#${gBlue})`} />
            <path d="M32 41V22m0 0l-7 7m7-7l7 7" stroke={`url(#${gCream})`} strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <rect x="20" y="44" width="24" height="3.5" rx="1.75" fill={`url(#${gGold})`} />
          </g>
        );

      case 'moreModules':
      default:
        return (
          <g filter={`url(#${fShadow})`}>
            <rect x="10" y="10" width="19" height="19" rx="5" fill={`url(#${gEmerald})`} />
            <rect x="35" y="10" width="19" height="19" rx="5" fill={`url(#${gGold})`} />
            <rect x="10" y="35" width="19" height="19" rx="5" fill={`url(#${gBlue})`} />
            <rect x="35" y="35" width="19" height="19" rx="5" fill={`url(#${gRose})`} />
          </g>
        );
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={`shrink-0 inline-block select-none ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gEmerald} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="50%" stopColor="#0b5d43" />
          <stop offset="100%" stopColor="#063b2a" />
        </linearGradient>
        <linearGradient id={gEmeraldDark} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#15805d" />
          <stop offset="100%" stopColor="#04291d" />
        </linearGradient>
        <linearGradient id={gGold} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="45%" stopColor="#d9ac4c" />
          <stop offset="100%" stopColor="#926612" />
        </linearGradient>
        <linearGradient id={gGoldDark} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#b88a2e" />
          <stop offset="100%" stopColor="#5e400a" />
        </linearGradient>
        <linearGradient id={gBlue} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="55%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#0f2b6b" />
        </linearGradient>
        <linearGradient id={gRose} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="55%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#881337" />
        </linearGradient>
        <linearGradient id={gCream} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e8e2d2" />
        </linearGradient>
        <linearGradient id={gDark} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1f2937" />
          <stop offset="100%" stopColor="#030712" />
        </linearGradient>
        <linearGradient id={gGlass} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <filter id={fShadow} x="-15%" y="-15%" width="130%" height="135%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#042016" floodOpacity="0.28" />
        </filter>
      </defs>
      {renderGlyph()}
    </svg>
  );
};
