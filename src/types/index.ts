export type LanguageCode = 'ps' | 'ar' | 'fa' | 'en';

export type ThemeId =
  | 'light'
  | 'dark'
  | 'system'
  | 'emerald'
  | 'gold'
  | 'islamic-blue'
  | 'minimal-white'
  | 'night-black'
  | 'desert-sand'
  | 'royal-islamic';

export type WallpaperId =
  | 'madinah'
  | 'emerald'
  | 'mashrabiya'
  | 'sanctuary'
  | 'quran'
  | 'arch'
  | 'clean';

export type FontFamilyOption =
  | 'plus-amiri'
  | 'naskh'
  | 'scheherazade'
  | 'kufi'
  | 'lateef'
  | 'vazirmatn';

export type ModuleId =
  | 'dashboard'
  | 'quran'
  | 'dictionary'
  | 'hadith'
  | 'adhkar'
  | 'tasbeeh'
  | 'duas'
  | 'prayer'
  | 'qibla'
  | 'mosques'
  | 'library'
  | 'quotes'
  | 'zakat'
  | 'calendar'
  | 'tasks'
  | 'routines'
  | 'statistics'
  | 'assistant'
  | 'search'
  | 'notifications'
  | 'settings'
  | 'about'
  | 'admin';

export interface LocalizedText {
  ps: string;
  ar: string;
  fa: string;
  en: string;
}

export interface UserSettings {
  id: 'default';
  userName: string;
  onboardingCompleted: boolean;
  language: LanguageCode;
  theme: ThemeId;
  wallpaper?: WallpaperId;
  fontFamily: FontFamilyOption;
  fontSize: number;
  lineSpacing: number;
  customBgTint: string;
  carouselEnabled: boolean;
  carouselIntervalSec: number;
  statsPinHash: string;
  adminPinHash: string;
  cloudSyncConsent: boolean;
  autoBackupEnabled: boolean;
  city: string;
  latitude: number;
  longitude: number;
  locationGranted: boolean;
  calcMethod: 'MuslimWorldLeague' | 'UmmAlQura' | 'Karachi' | 'Egyptian' | 'NorthAmerica' | 'Tehran';
  madhab: 'Hanafi' | 'Shafi';
  prayerAdjustments: {
    fajr: number;
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
  };
  adhanEnabled: boolean;
  adhanVoice: 'makkah' | 'madinah' | 'alafasy' | 'tone';
  reciterId: 'ar.alafasy' | 'ar.abdulbasitmurattal' | 'ar.husary' | 'ar.mahermuaiqly';
  quranReadingMode: 'reading' | 'study';
  quranNightMode: boolean;
  tafsirBook: 'muyassar' | 'ibn-kathir' | 'jalalayn';
  notifications: {
    prayer: boolean;
    morningAdhkar: boolean;
    eveningAdhkar: boolean;
    quranDaily: boolean;
    tasks: boolean;
    reading: boolean;
    friday: boolean;
    events: boolean;
  };
  appVersion: string;
  updatedAt: number;
}

export interface SurahMeta {
  number: number;
  arabicName: string;
  englishName: string;
  pashtoName: string;
  persianName: string;
  revelationType: 'Meccan' | 'Medinan';
  ayahCount: number;
  juzStart: number;
}

export interface QuranAyah {
  numberInSurah: number;
  globalNumber?: number;
  juz: number;
  page?: number;
  arabic: string;
  ar?: string;
  ps: string;
  fa: string;
  en: string;
  tafsirAr: string;
  tafsirJalalayn?: string;
  tafsirPs?: string;
  tafsirEn?: string;
  lexicalNote?: string;
  asbabNuzul?: string;
  tafsirSource?: string;
}

export interface CachedSurah {
  number: number;
  ayahs: QuranAyah[];
  downloadedAt: number;
  offlineReady: boolean;
}

export interface QuranProgress {
  id: 'default';
  lastSurah: number;
  lastAyah: number;
  dailyGoalAyahs: number;
  todayAyahsRead: number;
  todayDate: string;
  totalAyahsRead: number;
  khatmahCount: number;
  history: Array<{ date: string; ayahs: number; surah: number }>;
}

export interface QuranWordEntry {
  id: string;
  arabic: string;
  root: string;
  morphology: string;
  frequency: number;
  ar?: string;
  ps: string;
  fa: string;
  en: string;
  relatedAyahRef: string;
  relatedAyahArabic: string;
}

export type HadithCollectionId =
  | 'bukhari'
  | 'muslim'
  | 'abudawud'
  | 'tirmidhi'
  | 'nasai'
  | 'ibnmajah'
  | 'malik'
  | 'nawawi40'
  | 'adab'
  | 'qudsi';

export interface HadithItem {
  id: string;
  collectionId: HadithCollectionId;
  bookName: LocalizedText;
  chapterName: LocalizedText;
  hadithNumber: string;
  narrator: LocalizedText;
  topic: string;
  arabic: string;
  ar?: string;
  ps: string;
  fa: string;
  en: string;
  commentary: LocalizedText;
  grade: string;
  sourceRef: string;
  verified: boolean;
  isCustom?: boolean;
}

export type AdhkarCategoryId =
  | 'morning'
  | 'evening'
  | 'sleep'
  | 'waking'
  | 'after_prayer'
  | 'food'
  | 'travel'
  | 'mosque'
  | 'home'
  | 'istighfar'
  | 'durood'
  | 'anxiety'
  | 'sickness'
  | 'quranic_duas'
  | 'prophetic_duas';

export interface DhikrItem {
  id: string;
  category: AdhkarCategoryId;
  arabic: string;
  ar?: string;
  ps: string;
  fa: string;
  en: string;
  repeatCount: number;
  virtue: LocalizedText;
  source: string;
  isCustom?: boolean;
}

export interface AdhkarProgressRecord {
  date: string; // YYYY-MM-DD
  counts: Record<string, number>;
  completedIds: string[];
}

export interface TasbeehEntry {
  id: string;
  arabic: string;
  title: LocalizedText;
  target: number;
  count: number;
  totalLifetime: number;
  isPreset: boolean;
}

export interface TasbeehHistoryLog {
  date: string;
  total: number;
  byId: Record<string, number>;
}

export interface PersonalDua {
  id: string;
  title: string;
  category: string;
  arabic: string;
  translation: string;
  notes: string;
  localizedTitle?: LocalizedText;
  localizedTranslation?: LocalizedText;
  localizedNotes?: LocalizedText;
  isFavorite: boolean;
  reminderTime?: string;
  createdAt: number;
  updatedAt: number;
}

export interface BookmarkRecord {
  id: string;
  type: 'quran' | 'hadith' | 'book' | 'adhkar' | 'quote';
  refId: string;
  title: string;
  subtitle: string;
  createdAt: number;
}

export interface FavoriteRecord {
  id: string;
  type: 'quran' | 'hadith' | 'book' | 'adhkar' | 'quote' | 'dua';
  refId: string;
  title: string;
  createdAt: number;
}

export type BookCategoryId =
  | 'quran_tafsir'
  | 'hadith'
  | 'aqeedah'
  | 'fiqh'
  | 'usul_fiqh'
  | 'seerah'
  | 'history'
  | 'politics'
  | 'akhlaq'
  | 'tazkiyah'
  | 'dawah'
  | 'arabic'
  | 'sarf_nahw'
  | 'ulum_hadith'
  | 'ulum_quran'
  | 'biographies';

export interface LibraryBook {
  id: string;
  title: LocalizedText;
  author: LocalizedText;
  authorBio: LocalizedText;
  category: BookCategoryId;
  volumes: number;
  pages: number;
  publishInfo: string;
  licenseNote: string;
  language: string;
  sections: Array<{ title: string; content: string }>;
  pdfBlobKey?: string;
  downloadedOffline: boolean;
  lastPage: number;
  bookmarks: number[];
  isCustom?: boolean;
}

export interface ReadingHistoryEntry {
  id: string;
  type: 'quran' | 'book' | 'hadith';
  refId: string;
  title: string;
  progressLabel: string;
  timestamp: number;
}

export interface ScholarQuote {
  id: string;
  arabic: string;
  ar?: string;
  ps: string;
  fa: string;
  en: string;
  scholarName: LocalizedText;
  bookName: LocalizedText;
  volume: string;
  page: string;
  printInfo: string;
  authenticityNote: LocalizedText;
  isCustom?: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  localizedTitle?: LocalizedText;
  localizedDescription?: LocalizedText;
  startDate: string;
  dueDate: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
  reminder: boolean;
  status: 'pending' | 'completed';
  category:
    | 'worship'
    | 'learning'
    | 'study'
    | 'work'
    | 'family'
    | 'health'
    | 'growth'
    | 'other';
  recurrence: 'none' | 'daily' | 'weekly' | 'monthly';
  completedAt?: number;
  createdAt: number;
}

export interface RoutineItem {
  id: string;
  title: LocalizedText;
  completedDates: string[];
}

export interface Routine {
  id: string;
  name: LocalizedText;
  presetType: 'morning' | 'evening' | 'friday' | 'custom';
  items: RoutineItem[];
}

export interface PrayerHistoryLog {
  date: string;
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
}

export interface ZakatRecord {
  id: string;
  date: string;
  standard: 'gold' | 'silver';
  nisabThreshold: number;
  totalAssets: number;
  totalDebts: number;
  netZakatable: number;
  zakatDue: number;
  currency: string;
  notes: string;
}

export interface MosquePlace {
  id: string;
  name: string;
  lat: number;
  lng: number;
  distanceKm: number;
  address: string;
  openingHours?: string;
  wheelchair?: string;
  phone?: string;
}

export interface AppNotificationItem {
  id: string;
  title: string;
  body: string;
  category: string;
  targetModule?: ModuleId;
  createdAt: number;
  read: boolean;
}

export interface AdminAnnouncement {
  id: string;
  title: string;
  message: string;
  version: string;
  createdAt: number;
}
