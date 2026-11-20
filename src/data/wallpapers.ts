import emeraldArabesqueImg from '../assets/images/bg_emerald_arabesque_1795165352845.jpg';
import goldenMashrabiyaImg from '../assets/images/bg_golden_mashrabiya_1795165369024.jpg';
import nightSanctuaryImg from '../assets/images/bg_kaaba_night_sanctuary_1795165353486.jpg';
import madinahTwilightImg from '../assets/images/bg_madinah_twilight_1795165353798.jpg';
import heroArchImg from '../assets/images/hero_islamic_arch_1794571274965.jpg';
import quranIllumImg from '../assets/images/quran_illumination_1794571275112.jpg';
import type { LocalizedText, WallpaperId } from '../types';

export interface WallpaperOption {
  id: WallpaperId;
  image: string | null;
  label: LocalizedText;
  previewTint: string;
}

export const WALLPAPER_OPTIONS: WallpaperOption[] = [
  {
    id: 'madinah',
    image: madinahTwilightImg,
    label: {
      ps: 'د ماښام روښانه محرابونه',
      ar: 'أقواس المسجد المضيئة',
      fa: 'طاق‌های نورانی شامگاه',
      en: 'Luminous Mosque Arches',
    },
    previewTint: '#0b4f3a',
  },
  {
    id: 'emerald',
    image: emeraldArabesqueImg,
    label: {
      ps: 'زمرد او طلایي نقاشي',
      ar: 'الزخرفة الزمردية والذهبية',
      fa: 'اسلیمی زمرد و طلا',
      en: 'Emerald & Gold Lattice',
    },
    previewTint: '#0a3a2b',
  },
  {
    id: 'mashrabiya',
    image: goldenMashrabiyaImg,
    label: {
      ps: 'د سهار طلایي مشربیه',
      ar: 'مشربية الضحى الذهبية',
      fa: 'مشبک طلایی صبحگاه',
      en: 'Golden Courtyard Dawn',
    },
    previewTint: '#9a6e1c',
  },
  {
    id: 'sanctuary',
    image: nightSanctuaryImg,
    label: {
      ps: 'د شپې ستورې او حرم',
      ar: 'أروقة الليل والنجوم',
      fa: 'صحن شبانه و ستارگان',
      en: 'Starlit Night Sanctuary',
    },
    previewTint: '#11254a',
  },
  {
    id: 'quran',
    image: quranIllumImg,
    label: {
      ps: 'قرآني تذهیب',
      ar: 'الزخرفة القرآنية المذهبة',
      fa: 'تذهیب قرآنی',
      en: 'Quranic Illumination',
    },
    previewTint: '#1c4f3d',
  },
  {
    id: 'arch',
    image: heroArchImg,
    label: {
      ps: 'اسلامي معماري',
      ar: 'العمارة الإسلامية',
      fa: 'معماری اسلامی',
      en: 'Sacred Archways',
    },
    previewTint: '#1a3830',
  },
  {
    id: 'clean',
    image: null,
    label: {
      ps: 'ساده شیشه‌يي',
      ar: 'زجاجي هادئ نقي',
      fa: 'شیشه‌ای ساده و آرام',
      en: 'Minimal Pure Glass',
    },
    previewTint: '#1f5e48',
  },
];

export function getWallpaperById(id?: WallpaperId): WallpaperOption {
  return WALLPAPER_OPTIONS.find((w) => w.id === id) || WALLPAPER_OPTIONS[0];
}
