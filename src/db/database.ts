import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type {
  AdhkarProgressRecord,
  AdminAnnouncement,
  AppNotificationItem,
  BookmarkRecord,
  CachedSurah,
  DhikrItem,
  FavoriteRecord,
  HadithItem,
  LibraryBook,
  MosquePlace,
  PersonalDua,
  PrayerHistoryLog,
  QuranProgress,
  ReadingHistoryEntry,
  Routine,
  ScholarQuote,
  TasbeehEntry,
  TasbeehHistoryLog,
  TaskItem,
  UserSettings,
  ZakatRecord,
} from '../types';
import { INITIAL_ADHKAR } from '../data/adhkarData';
import { INITIAL_HADITHS } from '../data/hadithData';
import { INITIAL_BOOKS, INITIAL_SCHOLAR_QUOTES } from '../data/libraryAndQuotesData';
import { EMBEDDED_SURAHS } from '../data/surahMeta';
import {
  EXTRA_PRESET_TASBEEH,
  MULTILINGUAL_STARTER_DUAS,
  buildPresetTasks,
} from '../data/starterDuasAndTasks';

interface EyadDBSchema extends DBSchema {
  user_settings: { key: string; value: UserSettings };
  quran_surahs: { key: number; value: CachedSurah };
  quran_progress: { key: string; value: QuranProgress };
  bookmarks: { key: string; value: BookmarkRecord };
  favorites: { key: string; value: FavoriteRecord };
  adhkar_items: { key: string; value: DhikrItem };
  adhkar_progress: { key: string; value: AdhkarProgressRecord };
  tasbeeh_records: { key: string; value: TasbeehEntry };
  tasbeeh_history: { key: string; value: TasbeehHistoryLog };
  duas: { key: string; value: PersonalDua };
  prayer_history: { key: string; value: PrayerHistoryLog };
  tasks: { key: string; value: TaskItem };
  routines: { key: string; value: Routine };
  library_books: { key: string; value: LibraryBook };
  pdf_blobs: { key: string; value: { key: string; blob: Blob; filename: string; size: number } };
  reading_history: { key: string; value: ReadingHistoryEntry };
  hadiths: { key: string; value: HadithItem };
  quotes: { key: string; value: ScholarQuote };
  zakat_history: { key: string; value: ZakatRecord };
  notifications: { key: string; value: AppNotificationItem };
  mosques_cache: { key: string; value: MosquePlace };
  admin_announcements: { key: string; value: AdminAnnouncement };
  dictionary_history: { key: string; value: { id: string; wordId: string; viewedAt: number } };
}

const DB_NAME = 'eyad_al_muslim_db';
const DB_VERSION = 1;

export function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export const DEFAULT_SETTINGS: UserSettings = {
  id: 'default',
  userName: 'مسلمان ورور / خور',
  onboardingCompleted: false,
  language: 'ps',
  theme: 'emerald',
  wallpaper: 'madinah',
  fontFamily: 'plus-amiri',
  fontSize: 16,
  lineSpacing: 1.75,
  customBgTint: '',
  carouselEnabled: true,
  carouselIntervalSec: 10,
  statsPinHash: '',
  adminPinHash: '',
  cloudSyncConsent: false,
  autoBackupEnabled: false,
  city: 'Kabul',
  latitude: 34.5553,
  longitude: 69.2075,
  locationGranted: false,
  calcMethod: 'Karachi',
  madhab: 'Hanafi',
  prayerAdjustments: { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 },
  adhanEnabled: true,
  adhanVoice: 'tone',
  reciterId: 'ar.alafasy',
  quranReadingMode: 'study',
  quranNightMode: false,
  tafsirBook: 'muyassar',
  notifications: {
    prayer: true,
    morningAdhkar: true,
    eveningAdhkar: true,
    quranDaily: true,
    tasks: true,
    reading: false,
    friday: true,
    events: true,
  },
  appVersion: '1.0.0',
  updatedAt: Date.now(),
};

export const PRESET_TASBEEH: TasbeehEntry[] = [
  {
    id: 'tasbeeh-subhanallah',
    arabic: 'سُبْحَانَ اللَّهِ',
    title: { ps: 'سبحان الله', ar: 'سبحان الله', fa: 'سبحان الله', en: 'SubhanAllah' },
    target: 33,
    count: 0,
    totalLifetime: 0,
    isPreset: true,
  },
  {
    id: 'tasbeeh-alhamdulillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    title: { ps: 'الحمد لله', ar: 'الحمد لله', fa: 'الحمد لله', en: 'Alhamdulillah' },
    target: 33,
    count: 0,
    totalLifetime: 0,
    isPreset: true,
  },
  {
    id: 'tasbeeh-allahuakbar',
    arabic: 'اللَّهُ أَكْبَرُ',
    title: { ps: 'الله أكبر', ar: 'الله أكبر', fa: 'الله أكبر', en: 'Allahu Akbar' },
    target: 34,
    count: 0,
    totalLifetime: 0,
    isPreset: true,
  },
  {
    id: 'tasbeeh-tahlil',
    arabic: 'لَا إِلَهَ إِلَّا اللَّهُ',
    title: { ps: 'لا إله إلا الله', ar: 'لا إله إلا الله', fa: 'لا إله إلا الله', en: 'La ilaha illallah' },
    target: 100,
    count: 0,
    totalLifetime: 0,
    isPreset: true,
  },
  {
    id: 'tasbeeh-istighfar',
    arabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ',
    title: { ps: 'أستغفر الله العظيم', ar: 'أستغفر الله العظيم', fa: 'أستغفر الله العظیم', en: 'Astaghfirullah' },
    target: 100,
    count: 0,
    totalLifetime: 0,
    isPreset: true,
  },
  {
    id: 'tasbeeh-durood',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',
    title: { ps: 'درود شریف', ar: 'الصلاة على النبي ﷺ', fa: 'صلوات', en: 'Salawat' },
    target: 100,
    count: 0,
    totalLifetime: 0,
    isPreset: true,
  },
  {
    id: 'tasbeeh-subhanallah-bihamdihi',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    title: { ps: 'سبحان الله وبحمده', ar: 'سبحان الله وبحمده', fa: 'سبحان الله و بحمده', en: 'SubhanAllahi wa bihamdihi' },
    target: 100,
    count: 0,
    totalLifetime: 0,
    isPreset: true,
  },
  {
    id: 'tasbeeh-subhanallah-azim',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ',
    title: { ps: 'په تله درنې دوه کلمې', ar: 'كلمتان خفيفتان على اللسان ثقيلتان في الميزان', fa: 'تسبیح سنگین در میزان', en: 'Two Beloved Heavy Words' },
    target: 100,
    count: 0,
    totalLifetime: 0,
    isPreset: true,
  },
  {
    id: 'tasbeeh-hawqalah',
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    title: { ps: 'د جنت خزانه (حوقله)', ar: 'كنز من كنوز الجنة (الحوقلة)', fa: 'گنج بهشت (لا حول ولا قوة إلا بالله)', en: 'Treasure of Paradise (Hawqalah)' },
    target: 100,
    count: 0,
    totalLifetime: 0,
    isPreset: true,
  },
  {
    id: 'tasbeeh-yunus',
    arabic: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    title: { ps: 'د یونس علیه السلام تسبیح', ar: 'تسبيح ذي النون عليه السلام', fa: 'ذکر یونسیه', en: 'Tasbeeh of Prophet Yunus (AS)' },
    target: 100,
    count: 0,
    totalLifetime: 0,
    isPreset: true,
  },
  {
    id: 'tasbeeh-hasbunallah',
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    title: { ps: 'حسبنا الله ونعم الوكيل', ar: 'حسبنا الله ونعم الوكيل', fa: 'حسبنا الله و نعم الوکیل', en: 'HasbunAllahu wa ni’mal Wakil' },
    target: 33,
    count: 0,
    totalLifetime: 0,
    isPreset: true,
  },
  {
    id: 'tasbeeh-baqiyat',
    arabic: 'سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ',
    title: { ps: 'الباقيات الصالحات', ar: 'الباقيات الصالحات', fa: 'باقیات صالحات', en: 'Al-Baqiyat al-Salihat' },
    target: 100,
    count: 0,
    totalLifetime: 0,
    isPreset: true,
  },
  ...EXTRA_PRESET_TASBEEH,
];

export const PRESET_ROUTINES: Routine[] = [
  {
    id: 'routine-morning',
    presetType: 'morning',
    name: { ps: 'د سهار عبادتي روټین', ar: 'روتين الصباح التعبدي', fa: 'برنامه عبادی صبح', en: 'Morning Worship Routine' },
    items: [
      { id: 'rm-1', title: { ps: 'د سهار فرض لمونځ په جماعت/وخت', ar: 'صلاة الفجر في وقتها', fa: 'نماز صبح در اول وقت', en: 'Fajr Prayer on time' }, completedDates: [] },
      { id: 'rm-2', title: { ps: 'د سهار مسنون اذکار (سید الاستغفار او آیة الکرسي)', ar: 'أذكار الصباح المسنونة وآية الكرسي', fa: 'اذکار صبح و آیةالکرسی', en: 'Morning Adhkar & Ayat al-Kursi' }, completedDates: [] },
      { id: 'rm-3', title: { ps: 'د قرآن کریم ورځنی ورد (لږ تر لږه ۱۰–۱۵ آیتونه له تفسیره)', ar: 'ورد القرآن اليومي (١٠–١٥ آية مع التفسير)', fa: 'ورد روزانه قرآن با تفسیر', en: 'Daily Quran Recitation with Tafsir' }, completedDates: [] },
      { id: 'rm-4', title: { ps: 'د اشراق یا ضحی لمونځ (صدقة مفاصل)', ar: 'صلاة الضحى', fa: 'نماز ضحی (چاشت)', en: 'Duha Prayer' }, completedDates: [] },
    ],
  },
  {
    id: 'routine-evening',
    presetType: 'evening',
    name: { ps: 'د ماښام او شپې روټین', ar: 'روتين المساء والنوم', fa: 'برنامه شبانگاهی', en: 'Evening & Night Routine' },
    items: [
      { id: 're-1', title: { ps: 'د ماښام اذکار او معوذات', ar: 'أذكار المساء والمعوذات', fa: 'اذکار شام و معوذتین', en: 'Evening Adhkar & Mu’awwidhat' }, completedDates: [] },
      { id: 're-2', title: { ps: 'د حدیث او اسلامي کتاب ۱۵ دقیقې مطالعه', ar: 'مطالعة حديث نبوي أو ١٥ دقيقة من المكتبة', fa: 'مطالعه حدیث یا کتاب علمی', en: '15-min Hadith or Library Study' }, completedDates: [] },
      { id: 're-3', title: { ps: 'د نفس محاسبه، توبه او بخښنه', ar: 'محاسبة النفس والاستغفار قبل النوم', fa: 'محاسبه نفس و استغفار', en: 'Self-reflection & Evening Istighfar' }, completedDates: [] },
      { id: 're-4', title: { ps: 'د وتر لمونځ او د خوب اذکار (سورت الملک)', ar: 'صلاة الوتر وأذكار النوم وسورة الملك', fa: 'نماز وتر و اذکار خواب', en: 'Witr Prayer & Sleep Adhkar' }, completedDates: [] },
    ],
  },
  {
    id: 'routine-friday',
    presetType: 'friday',
    name: { ps: 'د جمعې مبارکې روټین', ar: 'روتين يوم الجمعة المبارك', fa: 'برنامه روز جمعه', en: 'Blessed Friday Routine' },
    items: [
      { id: 'rf-1', title: { ps: 'غسل، مسواک، پاکې جامې او خوشبويي', ar: 'الاغتسال والتطيب والتبكير للجمعة', fa: 'غسل جمعه و عطر زدن', en: 'Ghusl & Early Arrival to Jumuah' }, completedDates: [] },
      { id: 'rf-2', title: { ps: 'د سورت الکهف تلاوت', ar: 'قراءة سورة الكهف', fa: 'تلاوت سوره کهف', en: 'Recite Surah Al-Kahf' }, completedDates: [] },
      { id: 'rf-3', title: { ps: 'پر نبي کریم ﷺ ډېر درود شریف ویل', ar: 'الإكثار من الصلاة على النبي ﷺ', fa: 'صلوات فراوان بر پیامبر ﷺ', en: 'Abundant Salawat on the Prophet (ﷺ)' }, completedDates: [] },
      { id: 'rf-4', title: { ps: 'د صلة رحمي (خپلوانو پوښتنه) او صدقه', ar: 'صلة الرحم والصدقة يوم الجمعة', fa: 'صله رحم و صدقه در روز جمعه', en: 'Family Ties & Friday Charity' }, completedDates: [] },
      { id: 'rf-5', title: { ps: 'د جمعې په وروستۍ شېبه کې دعا', ar: 'الدعاء في ساعة الإجابة', fa: 'دعا در ساعت استجابت جمعه', en: 'Dua during the late afternoon hour' }, completedDates: [] },
    ],
  },
  {
    id: 'routine-study',
    presetType: 'custom',
    name: { ps: 'د علم، قرآن او اخلاقو ورځنی پلان', ar: 'روتين طلب العلم والأخلاق', fa: 'برنامه روزانه دانش و اخلاق', en: 'Knowledge & Character Routine' },
    items: [
      { id: 'rs-1', title: { ps: 'د یوې قرآني کلمې یا آیت تدبر', ar: 'تدبر كلمة قرآنية في المعجم', fa: 'تدبر یک واژه یا آیه قرآنی', en: 'Study one Quranic word in Lexicon' }, completedDates: [] },
      { id: 'rs-2', title: { ps: 'د یوه صحیح حدیث حفظ یا تکرار', ar: 'حفظ أو مراجعة حديث صحيح', fa: 'حفظ یا مرور یک حدیث صحیح', en: 'Review one authentic Hadith' }, completedDates: [] },
      { id: 'rs-3', title: { ps: 'د مور او پلار یا کورنۍ خدمت او مینه', ar: 'بر الوالدين وإدخال السرور على الأهل', fa: 'خدمت و خوشحال کردن والدین و خانواده', en: 'Serve parents or assist family kindly' }, completedDates: [] },
    ],
  },
];

export const PRESET_DUAS: PersonalDua[] = MULTILINGUAL_STARTER_DUAS;

export const PRESET_MOSQUES: MosquePlace[] = [
  {
    id: 'preset-kabul-pul-e-khishti',
    name: 'مسجد جامع پل خشتی / Pul-e-Khishti Grand Mosque',
    lat: 34.5139,
    lng: 69.1778,
    distanceKm: 0,
    address: 'Kabul Center, Afghanistan',
  },
  {
    id: 'preset-kabul-abdul-rahman',
    name: 'مسجد جامع عبدالرحمن / Abdul Rahman Grand Mosque',
    lat: 34.5256,
    lng: 69.1782,
    distanceKm: 0,
    address: 'Deh Afghanan, Kabul',
  },
  {
    id: 'preset-kabul-eidgah',
    name: 'مسجد عیدگاه / Id Gah Mosque',
    lat: 34.5112,
    lng: 69.1924,
    distanceKm: 0,
    address: 'Chaman-e-Huzoori, Kabul',
  },
  {
    id: 'preset-kabul-wazir',
    name: 'مسجد وزیر اکبر خان / Wazir Akbar Khan Mosque',
    lat: 34.5356,
    lng: 69.1839,
    distanceKm: 0,
    address: 'Wazir Akbar Khan, Kabul',
  },
  {
    id: 'preset-kandahar-khirqa',
    name: 'خرقه مبارکه جامع جومات / Mosque of the Sacred Cloak',
    lat: 31.6164,
    lng: 65.7069,
    distanceKm: 0,
    address: 'Kandahar, Afghanistan',
  },
  {
    id: 'preset-kandahar-omar',
    name: 'مسجد جامع حضرت عمر فاروق / Umar Farooq Grand Mosque',
    lat: 31.6228,
    lng: 65.7145,
    distanceKm: 0,
    address: 'Shahr-e-Naw, Kandahar',
  },
  {
    id: 'preset-herat-jami',
    name: 'مسجد جامع بزرگ هرات / Great Mosque of Herat',
    lat: 34.3435,
    lng: 62.1965,
    distanceKm: 0,
    address: 'Old City, Herat',
  },
  {
    id: 'preset-mazar-rawza',
    name: 'روضه مبارک جامع / Rawza Sharif Mosque',
    lat: 36.7072,
    lng: 67.1103,
    distanceKm: 0,
    address: 'Mazar-i-Sharif',
  },
  {
    id: 'preset-jalalabad-jami',
    name: 'د جلال‌آباد لوی جامع جومات / Jalalabad Grand Mosque',
    lat: 34.4289,
    lng: 70.4496,
    distanceKm: 0,
    address: 'Jalalabad, Nangarhar',
  },
  {
    id: 'preset-peshawar-mahabat',
    name: 'مسجد مهابت خان / Mahabat Khan Mosque',
    lat: 34.0114,
    lng: 71.5692,
    distanceKm: 0,
    address: 'Old City, Peshawar',
  },
  {
    id: 'preset-islamabad-faisal',
    name: 'مسجد فیصل / Shah Faisal Mosque',
    lat: 33.7295,
    lng: 73.0372,
    distanceKm: 0,
    address: 'Islamabad, Pakistan',
  },
  {
    id: 'preset-makkah-haram',
    name: 'المسجد الحرام / Al-Masjid Al-Haram',
    lat: 21.4225,
    lng: 39.8262,
    distanceKm: 0,
    address: 'Makkah Al-Mukarramah',
  },
  {
    id: 'preset-madinah-nabawi',
    name: 'المسجد النبوي الشريف / Al-Masjid An-Nabawi',
    lat: 24.4672,
    lng: 39.6112,
    distanceKm: 0,
    address: 'Al-Madinah Al-Munawwarah',
  },
  {
    id: 'preset-quds-aqsa',
    name: 'المسجد الأقصى المبارك / Al-Aqsa Mosque',
    lat: 31.7761,
    lng: 35.2358,
    distanceKm: 0,
    address: 'Al-Quds (Jerusalem)',
  },
  {
    id: 'preset-cairo-azhar',
    name: 'الجامع الأزهر الشريف / Al-Azhar Mosque',
    lat: 30.0457,
    lng: 31.2627,
    distanceKm: 0,
    address: 'Cairo, Egypt',
  },
  {
    id: 'preset-istanbul-sultanahmet',
    name: 'جامع السلطان أحمد / Sultanahmet Mosque',
    lat: 41.0054,
    lng: 28.9768,
    distanceKm: 0,
    address: 'Istanbul, Turkey',
  },
];

let dbPromise: Promise<IDBPDatabase<EyadDBSchema>> | null = null;

export async function getDB(): Promise<IDBPDatabase<EyadDBSchema>> {
  if (!dbPromise) {
    dbPromise = openDB<EyadDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const stores: Array<keyof EyadDBSchema> = [
          'user_settings',
          'quran_surahs',
          'quran_progress',
          'bookmarks',
          'favorites',
          'adhkar_items',
          'adhkar_progress',
          'tasbeeh_records',
          'tasbeeh_history',
          'duas',
          'prayer_history',
          'tasks',
          'routines',
          'library_books',
          'pdf_blobs',
          'reading_history',
          'hadiths',
          'quotes',
          'zakat_history',
          'notifications',
          'mosques_cache',
          'admin_announcements',
          'dictionary_history',
        ];
        for (const s of stores) {
          if (!db.objectStoreNames.contains(s as never)) {
            const keyPath =
              s === 'quran_surahs'
                ? 'number'
                : s === 'adhkar_progress' || s === 'tasbeeh_history' || s === 'prayer_history'
                ? 'date'
                : s === 'pdf_blobs'
                ? 'key'
                : 'id';
            db.createObjectStore(s as never, { keyPath });
          }
        }
      },
    });
  }
  return dbPromise;
}

export async function initializeDatabase(): Promise<void> {
  const db = await getDB();

  const existingSettings = await db.get('user_settings', 'default');
  if (!existingSettings) {
    await db.put('user_settings', DEFAULT_SETTINGS);
  }

  const existingProgress = await db.get('quran_progress', 'default');
  if (!existingProgress) {
    await db.put('quran_progress', {
      id: 'default',
      lastSurah: 1,
      lastAyah: 1,
      dailyGoalAyahs: 15,
      todayAyahsRead: 0,
      todayDate: todayKey(),
      totalAyahsRead: 0,
      khatmahCount: 0,
      history: [],
    });
  }

  // Upsert missing preset entries by individual key so existing users automatically receive expanded content
  // without overwriting user progress, custom edits, or lifetime counters.
  for (const surah of Object.values(EMBEDDED_SURAHS)) {
    if (!(await db.get('quran_surahs', surah.number))) {
      await db.put('quran_surahs', surah);
    }
  }

  for (const h of INITIAL_HADITHS) {
    if (!(await db.get('hadiths', h.id))) {
      await db.put('hadiths', h);
    }
  }

  for (const d of INITIAL_ADHKAR) {
    if (!(await db.get('adhkar_items', d.id))) {
      await db.put('adhkar_items', d);
    }
  }

  for (const t of PRESET_TASBEEH) {
    if (!(await db.get('tasbeeh_records', t.id))) {
      await db.put('tasbeeh_records', t);
    }
  }

  for (const r of PRESET_ROUTINES) {
    if (!(await db.get('routines', r.id))) {
      await db.put('routines', r);
    }
  }

  for (const b of INITIAL_BOOKS) {
    const existingBook = await db.get('library_books', b.id);
    if (!existingBook) {
      await db.put('library_books', b);
    } else if (!existingBook.isCustom && existingBook.pages !== b.pages) {
      await db.put('library_books', {
        ...b,
        downloadedOffline: existingBook.downloadedOffline,
        lastPage: Math.min(existingBook.lastPage || 1, b.pages),
        bookmarks: existingBook.bookmarks || [],
      });
    }
  }

  for (const q of INITIAL_SCHOLAR_QUOTES) {
    if (!(await db.get('quotes', q.id))) {
      await db.put('quotes', q);
    }
  }

  for (const m of PRESET_MOSQUES) {
    if (!(await db.get('mosques_cache', m.id))) {
      await db.put('mosques_cache', m);
    }
  }

  for (const dua of PRESET_DUAS) {
    const existingDua = await db.get('duas', dua.id);
    if (!existingDua) {
      await db.put('duas', dua);
    } else if (!existingDua.localizedTitle && dua.localizedTitle) {
      await db.put('duas', {
        ...existingDua,
        localizedTitle: dua.localizedTitle,
        localizedTranslation: dua.localizedTranslation,
        localizedNotes: dua.localizedNotes,
      });
    }
  }

  const tasksSeeded = typeof localStorage !== 'undefined' && localStorage.getItem('eyad_tasks_seeded_v1') === 'true';
  if (!tasksSeeded && (await db.count('tasks')) === 0) {
    for (const task of buildPresetTasks(todayKey())) {
      await db.put('tasks', task);
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('eyad_tasks_seeded_v1', 'true');
    }
  }
}

export async function exportAllUserData(): Promise<Record<string, unknown>> {
  const db = await getDB();
  return {
    user_settings: await db.getAll('user_settings'),
    quran_progress: await db.getAll('quran_progress'),
    bookmarks: await db.getAll('bookmarks'),
    favorites: await db.getAll('favorites'),
    adhkar_items: await db.getAll('adhkar_items'),
    adhkar_progress: await db.getAll('adhkar_progress'),
    tasbeeh_records: await db.getAll('tasbeeh_records'),
    tasbeeh_history: await db.getAll('tasbeeh_history'),
    duas: await db.getAll('duas'),
    prayer_history: await db.getAll('prayer_history'),
    tasks: await db.getAll('tasks'),
    routines: await db.getAll('routines'),
    library_books: await db.getAll('library_books'),
    reading_history: await db.getAll('reading_history'),
    hadiths: await db.getAll('hadiths'),
    quotes: await db.getAll('quotes'),
    zakat_history: await db.getAll('zakat_history'),
    notifications: await db.getAll('notifications'),
    admin_announcements: await db.getAll('admin_announcements'),
    dictionary_history: await db.getAll('dictionary_history'),
  };
}

export async function restoreAllUserData(payload: Record<string, unknown>): Promise<void> {
  const db = await getDB();
  const storeNames: Array<keyof EyadDBSchema> = [
    'user_settings',
    'quran_progress',
    'bookmarks',
    'favorites',
    'adhkar_items',
    'adhkar_progress',
    'tasbeeh_records',
    'tasbeeh_history',
    'duas',
    'prayer_history',
    'tasks',
    'routines',
    'library_books',
    'reading_history',
    'hadiths',
    'quotes',
    'zakat_history',
    'notifications',
    'admin_announcements',
    'dictionary_history',
  ];

  for (const store of storeNames) {
    const records = payload[store];
    if (Array.isArray(records)) {
      await db.clear(store as never);
      for (const item of records) {
        await db.put(store as never, item as never);
      }
    }
  }
}

export async function clearAllUserData(): Promise<void> {
  const db = await getDB();
  const names = Array.from(db.objectStoreNames);
  for (const name of names) {
    await db.clear(name as never);
  }
  await initializeDatabase();
}
