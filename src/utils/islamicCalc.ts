import { CalculationMethod, Coordinates, Madhab, PrayerTimes, Qibla } from 'adhan';
import type { LanguageCode, UserSettings } from '../types';

export interface PrayerTimesSummary {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
  nextPrayer: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  nextPrayerTime: Date;
}

export const PRESET_CITIES: Array<{ name: string; label: Record<LanguageCode, string>; lat: number; lng: number }> = [
  { name: 'Kabul', label: { ps: 'کابل، افغانستان', ar: 'كابل، أفغانستان', fa: 'کابل، افغانستان', en: 'Kabul, Afghanistan' }, lat: 34.5553, lng: 69.2075 },
  { name: 'Kandahar', label: { ps: 'کندهار، افغانستان', ar: 'قندهار، أفغانستان', fa: 'قندهار، افغانستان', en: 'Kandahar, Afghanistan' }, lat: 31.6289, lng: 65.7372 },
  { name: 'Herat', label: { ps: 'هرات، افغانستان', ar: 'هرات، أفغانستان', fa: 'هرات، افغانستان', en: 'Herat, Afghanistan' }, lat: 34.3529, lng: 62.204 },
  { name: 'Mazar-i-Sharif', label: { ps: 'مزارشریف، افغانستان', ar: 'مزار شريف', fa: 'مزار شریف', en: 'Mazar-i-Sharif' }, lat: 36.709, lng: 67.1109 },
  { name: 'Jalalabad', label: { ps: 'جلال‌آباد، افغانستان', ar: 'جلال آباد', fa: 'جلال‌آباد', en: 'Jalalabad' }, lat: 34.4265, lng: 70.4515 },
  { name: 'Peshawar', label: { ps: 'پېښور', ar: 'بيشاور', fa: 'پیشاور', en: 'Peshawar' }, lat: 34.0151, lng: 71.5249 },
  { name: 'Makkah', label: { ps: 'مکه مکرمه', ar: 'مكة المكرمة', fa: 'مکه مکرمه', en: 'Makkah, Saudi Arabia' }, lat: 21.4225, lng: 39.8262 },
  { name: 'Madinah', label: { ps: 'مدینه منوره', ar: 'المدينة المنورة', fa: 'مدینه منوره', en: 'Madinah, Saudi Arabia' }, lat: 24.4672, lng: 39.6112 },
  { name: 'Istanbul', label: { ps: 'استانبول، ترکیه', ar: 'إسطنبول، تركيا', fa: 'استانبول، ترکیه', en: 'Istanbul, Turkey' }, lat: 41.0082, lng: 28.9784 },
  { name: 'London', label: { ps: 'لندن، برتانیا', ar: 'لندن، بريطانيا', fa: 'لندن، بریتانیا', en: 'London, UK' }, lat: 51.5072, lng: -0.1276 },
  { name: 'Dubai', label: { ps: 'دبي، امارات', ar: 'دبي، الإمارات', fa: 'دبی، امارات', en: 'Dubai, UAE' }, lat: 25.2048, lng: 55.2708 },
  { name: 'Islamabad', label: { ps: 'اسلام‌آباد، پاکستان', ar: 'إسلام آباد، باكستان', fa: 'اسلام‌آباد، پاکستان', en: 'Islamabad, Pakistan' }, lat: 33.6844, lng: 73.0479 },
  { name: 'Riyadh', label: { ps: 'ریاض، سعودي عربستان', ar: 'الرياض، السعودية', fa: 'ریاض، عربستان', en: 'Riyadh, Saudi Arabia' }, lat: 24.7136, lng: 46.6753 },
  { name: 'Cairo', label: { ps: 'قاهره، مصر', ar: 'القاهرة، مصر', fa: 'قاهره، مصر', en: 'Cairo, Egypt' }, lat: 30.0444, lng: 31.2357 },
  { name: 'Al-Quds', label: { ps: 'بیت المقدس (قدس شریف)', ar: 'القدس الشريف', fa: 'بیت‌المقدس', en: 'Al-Quds (Jerusalem)' }, lat: 31.7683, lng: 35.2137 },
  { name: 'Kuala Lumpur', label: { ps: 'کوالالمپور، مالیزیا', ar: 'كوالالمبور، ماليزيا', fa: 'کوالالامپور، مالزی', en: 'Kuala Lumpur, Malaysia' }, lat: 3.139, lng: 101.6869 },
  { name: 'Jakarta', label: { ps: 'جاکارتا، اندونیزیا', ar: 'جاكرتا، إندونيسيا', fa: 'جاکارتا، اندونزی', en: 'Jakarta, Indonesia' }, lat: -6.2088, lng: 106.8456 },
];

export function computePrayerTimesForDate(date: Date, settings: UserSettings): PrayerTimesSummary {
  const coords = new Coordinates(settings.latitude, settings.longitude);
  let params = CalculationMethod.Karachi();
  switch (settings.calcMethod) {
    case 'MuslimWorldLeague':
      params = CalculationMethod.MuslimWorldLeague();
      break;
    case 'UmmAlQura':
      params = CalculationMethod.UmmAlQura();
      break;
    case 'Egyptian':
      params = CalculationMethod.Egyptian();
      break;
    case 'NorthAmerica':
      params = CalculationMethod.NorthAmerica();
      break;
    case 'Tehran':
      params = CalculationMethod.Tehran();
      break;
    default:
      params = CalculationMethod.Karachi();
  }
  params.madhab = settings.madhab === 'Hanafi' ? Madhab.Hanafi : Madhab.Shafi;
  params.adjustments = {
    fajr: settings.prayerAdjustments.fajr || 0,
    sunrise: 0,
    dhuhr: settings.prayerAdjustments.dhuhr || 0,
    asr: settings.prayerAdjustments.asr || 0,
    maghrib: settings.prayerAdjustments.maghrib || 0,
    isha: settings.prayerAdjustments.isha || 0,
  };

  const pt = new PrayerTimes(coords, date, params);
  const now = new Date();
  let nextPrayer: PrayerTimesSummary['nextPrayer'] = 'fajr';
  let nextPrayerTime = pt.fajr;

  if (now < pt.fajr) {
    nextPrayer = 'fajr';
    nextPrayerTime = pt.fajr;
  } else if (now < pt.dhuhr) {
    nextPrayer = 'dhuhr';
    nextPrayerTime = pt.dhuhr;
  } else if (now < pt.asr) {
    nextPrayer = 'asr';
    nextPrayerTime = pt.asr;
  } else if (now < pt.maghrib) {
    nextPrayer = 'maghrib';
    nextPrayerTime = pt.maghrib;
  } else if (now < pt.isha) {
    nextPrayer = 'isha';
    nextPrayerTime = pt.isha;
  } else {
    const tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowPt = new PrayerTimes(coords, tomorrow, params);
    nextPrayer = 'fajr';
    nextPrayerTime = tomorrowPt.fajr;
  }

  return {
    fajr: pt.fajr,
    sunrise: pt.sunrise,
    dhuhr: pt.dhuhr,
    asr: pt.asr,
    maghrib: pt.maghrib,
    isha: pt.isha,
    nextPrayer,
    nextPrayerTime,
  };
}

export function calcDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getBearingDeg(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const toDeg = (v: number) => (v * 180) / Math.PI;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δλ = toRad(lng2 - lng1);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

export function getLocalizedCityName(city: string, lang: LanguageCode, gpsLabel: string): string {
  if (!city) return gpsLabel;
  if (city === 'GPS') return gpsLabel;
  const found = PRESET_CITIES.find((c) => c.name.toLowerCase() === city.toLowerCase());
  return found ? found.label[lang] : city;
}

export function getLocaleTag(lang: LanguageCode): string {
  switch (lang) {
    case 'ar':
      return 'ar-SA';
    case 'fa':
      return 'fa-IR';
    case 'ps':
      return 'ps-AF';
    default:
      return 'en-US';
  }
}

export function getQiblaBearing(lat: number, lng: number): number {
  return Qibla(new Coordinates(lat, lng));
}

export function getDistanceToMakkahKm(lat: number, lng: number): number {
  return Math.round(calcDistanceKm(lat, lng, 21.4225, 39.8262));
}

export function formatTimeShort(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

export interface HijriDateParts {
  day: number;
  month: number; // 1-12
  year: number;
}

export function getHijriParts(date: Date): HijriDateParts {
  try {
    const fmt = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
    const parts = fmt.formatToParts(date);
    const day = Number(parts.find((p) => p.type === 'day')?.value || 1);
    const month = Number(parts.find((p) => p.type === 'month')?.value || 1);
    const yearRaw = parts.find((p) => p.type === 'year')?.value || '1448';
    const year = Number(yearRaw.replace(/\D/g, '')) || 1448;
    return { day, month, year };
  } catch {
    return { day: 1, month: 1, year: 1448 };
  }
}

export type IslamicOccasionKey =
  | 'ramadan'
  | 'laylatulQadr'
  | 'eidFitr'
  | 'dhulHijjahTen'
  | 'arafah'
  | 'eidAdha'
  | 'hijriNewYear'
  | 'tasua'
  | 'ashura'
  | 'rabiAwwal12'
  | 'israMiraj'
  | 'midShaban';

export interface IslamicOccasionItem {
  key: IslamicOccasionKey;
  hijriMonth: number;
  hijriDay: number;
  daysUntil: number;
  gregorianDate: Date;
}

const OCCASION_TARGETS: Array<{
  key: IslamicOccasionKey;
  hijriMonth: number;
  hijriDay: number;
}> = [
  { key: 'hijriNewYear', hijriMonth: 1, hijriDay: 1 },
  { key: 'tasua', hijriMonth: 1, hijriDay: 9 },
  { key: 'ashura', hijriMonth: 1, hijriDay: 10 },
  { key: 'rabiAwwal12', hijriMonth: 3, hijriDay: 12 },
  { key: 'israMiraj', hijriMonth: 7, hijriDay: 27 },
  { key: 'midShaban', hijriMonth: 8, hijriDay: 15 },
  { key: 'ramadan', hijriMonth: 9, hijriDay: 1 },
  { key: 'laylatulQadr', hijriMonth: 9, hijriDay: 27 },
  { key: 'eidFitr', hijriMonth: 10, hijriDay: 1 },
  { key: 'dhulHijjahTen', hijriMonth: 12, hijriDay: 1 },
  { key: 'arafah', hijriMonth: 12, hijriDay: 9 },
  { key: 'eidAdha', hijriMonth: 12, hijriDay: 10 },
];

export function getUpcomingIslamicOccasions(fromDate: Date, limit = 12): IslamicOccasionItem[] {
  const results: IslamicOccasionItem[] = [];
  const seen = new Set<IslamicOccasionKey>();
  const base = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  for (let offset = 0; offset <= 365 && results.length < limit; offset++) {
    const probe = new Date(base);
    probe.setDate(base.getDate() + offset);
    const h = getHijriParts(probe);
    for (const target of OCCASION_TARGETS) {
      if (!seen.has(target.key) && target.hijriMonth === h.month && target.hijriDay === h.day) {
        seen.add(target.key);
        results.push({
          ...target,
          daysUntil: offset,
          gregorianDate: probe,
        });
      }
    }
  }
  return results;
}

export function getNextIslamicOccasion(fromDate: Date): IslamicOccasionItem {
  const list = getUpcomingIslamicOccasions(fromDate, 1);
  if (list.length > 0) return list[0];
  return {
    key: 'ramadan',
    hijriMonth: 9,
    hijriDay: 1,
    daysUntil: 120,
    gregorianDate: fromDate,
  };
}

