import { QURAN_DICTIONARY } from '../data/dictionaryData';
import { getSurahTitle, SURAH_META } from '../data/surahMeta';
import { getDB } from '../db/database';
import { getLocalizedContent, getText } from '../i18n/translations';
import type { LanguageCode, UserSettings } from '../types';
import { computePrayerTimesForDate, formatTimeShort } from './islamicCalc';
import { matchesNormalized, normalizeSearchText } from './searchNormalize';

const RESPONSE_LABELS: Record<
  LanguageCode,
  {
    headerOffline: string;
    quranSection: string;
    hadithSection: string;
    adhkarSection: string;
    dictionarySection: string;
    librarySection: string;
    quoteSection: string;
    prayerSection: string;
    khushuSection: string;
    planSection: string;
    fallbackIntro: string;
    sourceLabel: string;
    gradeLabel: string;
    scholarlyNote: string;
    scheduleBullets: string[];
    khushuBullets: string[];
  }
> = {
  ps: {
    headerOffline: 'د ایاد آفلاین علمي لټون پایله',
    quranSection: 'قرآني آیت او تفسیر',
    hadithSection: 'معتبر نبوي حدیث',
    adhkarSection: 'مسنون ذکر او دعا',
    dictionarySection: 'د قرآن کلمې تشریح',
    librarySection: 'له اسلامي کتابتون څخه',
    quoteSection: 'د علماوو اقوال او آثار',
    prayerSection: 'د نن ورځې د لمانځه وختونه',
    khushuSection: 'په لمانځه کې د خشوع عملي لارښوونې',
    planSection: 'د ورځني عبادت او مطالعې منظم مهالویش',
    fallbackIntro: 'ستاسو له محلّي اسلامي کتابتون، قرآن، حدیث او اذکارو څخه اړوند معتبر مواد:',
    sourceLabel: 'سرچینه',
    gradeLabel: 'درجه',
    scholarlyNote: 'یادونه: دا ځواب ستاسو له محلّي خوندي شويو معتبرو سرچینو چمتو شو. د خاصو فقهي مسایلو لپاره له معتبر عالم سره مشوره وکړئ.',
    scheduleBullets: [
      'سهار (فجر): فرض لمونځ + د سهار مسنون اذکار + د قرآن ۱۰–۱۵ آیتونه له لنډ تفسیر سره.',
      'ماسپښین / مازدیګر: د فرضي لمونځونو پابندي + د ورځې د ۳۳-۳۳-۳۴ تسبیحاتو بشپړول.',
      'ماښام / ماسختن: د ماښام اذکار + ۱۵ دقیقې د صحیح حدیث یا اسلامي کتاب مطالعه + د خوب مسنون اذکار او وتر.',
    ],
    khushuBullets: [
      'له اوداسه مخکې ذهن فارغ کړئ او په ارامه سره پوره اودس وکړئ.',
      'په دې پوه شئ چې د الله جل جلاله په حضور کې ولاړ یاست او هغه ستاسو مناجات اوري.',
      'د سورت الفاتحة او لنډو سورتونو پر معناوو تدبر وکړئ (کولای شئ د قرآن برخه کې یې ژباړه وګورئ).',
      'په رکوع او سجده کې بیړه مه کوئ او تسبیحات په سکون سره ولولئ.',
    ],
  },
  ar: {
    headerOffline: 'نتيجة البحث العلمي المحلي',
    quranSection: 'من القرآن الكريم والتفسير',
    hadithSection: 'من السنة النبوية الصحيحة',
    adhkarSection: 'من الأذكار المأثورة',
    dictionarySection: 'من معجم ألفاظ القرآن',
    librarySection: 'من المكتبة الإسلامية',
    quoteSection: 'من أقوال العلماء والآثار',
    prayerSection: 'مواقيت الصلاة لليوم',
    khushuSection: 'خطوات عملية للخشوع في الصلاة',
    planSection: 'برنامج يومي متوازن للعبادة والعلم',
    fallbackIntro: 'إليك ما تم استخراجه من مصادرك المحلية الموثقة في القرآن والحديث والأذكار:',
    sourceLabel: 'المصدر',
    gradeLabel: 'الدرجة',
    scholarlyNote: 'تنبيه: تم إعداد هذه الإجابة محلياً من المصادر الموثقة المحفوظة في التطبيق دون فتوى شرعية مستقلة.',
    scheduleBullets: [
      'بعد الفجر: صلاة الفجر في وقتها + أذكار الصباح + ورد القرآن اليومي (١٠ إلى ١٥ آية مع التفسير).',
      'وسط اليوم: المحافظة على الظهر والعصر مع السنن الرواتب والتسبيح بعد كل صلاة.',
      'المساء والليل: أذكار المساء + قراءة حديث صحيح أو ١٥ دقيقة من المكتبة + الوتر وسورة الملك قبل النوم.',
    ],
    khushuBullets: [
      'إسباغ الوضوء وتهيئة القلب قبل الدخول في الصلاة.',
      'استشعار الوقوف بين يدي الله تعالى ومناجاته.',
      'التدبر في معاني سورة الفاتحة وما يتيسر من السور (متاح في قسم التفسير).',
      'الطمأنينة في الركوع والسجود والرفع منهما دون استعجال.',
    ],
  },
  fa: {
    headerOffline: 'نتیجه جستجوی دانشی محلی',
    quranSection: 'آیه قرآن و تفسیر',
    hadithSection: 'حدیث معتبر نبوی',
    adhkarSection: 'ذکر و دعای مأثور',
    dictionarySection: 'معجم واژگان قرآن',
    librarySection: 'از کتابخانه اسلامی',
    quoteSection: 'از اقوال علما و آثار سلف',
    prayerSection: 'اوقات شرعی امروز',
    khushuSection: 'راهکارهای عملی حضور قلب در نماز',
    planSection: 'برنامه منظم روزانه برای عبادت و مطالعه',
    fallbackIntro: 'مطالب مستند زیر از میان قرآن، حدیث و کتابخانه محلی برنامه گردآوری شده است:',
    sourceLabel: 'منبع',
    gradeLabel: 'درجه صحت',
    scholarlyNote: 'یادآوری: این پاسخ به‌صورت آفلاین از منابع مستند داخلی برنامه استخراج شده است.',
    scheduleBullets: [
      'صبحگاه: نماز صبح در اول وقت + اذکار صبحگاه + تلاوت ۱۰ تا ۱۵ آیه قرآن با تفسیر.',
      'ظهر و عصر: ادای نمازهای یومیه با تسبیحات حضرت زهرا (۳۳ سبحان الله، ۳۳ الحمدلله، ۳۴ الله اکبر).',
      'شامگاه و شب: اذکار شامگاه + مطالعه یک حدیث صحیح یا بخشی از کتابخانه + نماز وتر و اذکار خواب.',
    ],
    khushuBullets: [
      'وضوی کامل همراه با آرامش دل پیش از تکبیرةالاحرام.',
      'توجه قلبی به اینکه در محضر خداوند متعال ایستاده‌اید.',
      'تأمل در معانی سوره فاتحه و آیات تلاوت‌شده.',
      'آرامش و طمأنینه کامل در رکوع و سجود.',
    ],
  },
  en: {
    headerOffline: 'Local Offline Knowledge Response',
    quranSection: 'From the Holy Quran & Tafsir',
    hadithSection: 'Verified Prophetic Hadith',
    adhkarSection: 'Authentic Remembrance (Adhkar)',
    dictionarySection: 'Quranic Lexicon',
    librarySection: 'From the Islamic Library',
    quoteSection: 'Scholarly Wisdom & Athar',
    prayerSection: "Today's Prayer Schedule",
    khushuSection: 'Practical Steps for Focus (Khushu) in Prayer',
    planSection: 'Balanced Daily Worship & Study Schedule',
    fallbackIntro: 'Relevant authenticated entries retrieved directly from your offline database:',
    sourceLabel: 'Source',
    gradeLabel: 'Grade',
    scholarlyNote: 'Note: Generated completely offline from verified local texts in your app. Consult a qualified scholar for personal legal rulings.',
    scheduleBullets: [
      'Dawn (Fajr): Pray Fajr on time + recite Morning Adhkar + read 10–15 verses of Quran with Tafsir.',
      'Midday (Dhuhr & Asr): Guard obligatory prayers + complete post-prayer Tasbeeh (33/33/34).',
      'Evening & Night: Recite Evening Adhkar + study one authentic Hadith or 15 minutes from the Library + Witr and Sleep Adhkar.',
    ],
    khushuBullets: [
      'Perform Wudu calmly and leave worldly distractions aside before starting prayer.',
      'Reflect that you are standing in direct conversation with Allah.',
      'Ponder the meanings of Surah Al-Fatiha and the verses you recite.',
      'Observe unhurried stillness (tumaninah) in bowing and prostration.',
    ],
  },
};

export async function generateOfflineAssistantReply(
  prompt: string,
  lang: LanguageCode,
  settings: UserSettings
): Promise<string> {
  const L = RESPONSE_LABELS[lang];
  const q = prompt.trim().toLowerCase();
  const db = await getDB();

  const sections: string[] = [];

  // 1. Worship plan / schedule intent
  if (
    /plan|schedule|routine|پلان|مهالویش|جدول|برنامه|روتين|خطة/.test(q)
  ) {
    sections.push(
      `◆ ${L.planSection}\n${L.scheduleBullets.map((b, i) => `${i + 1}. ${b}`).join('\n')}`
    );
  }

  // 2. Prayer / Khushu / times intent
  if (/prayer|salah|fajr|dhuhr|asr|maghrib|isha|لمونځ|خشوع|صلاة|نماز|حضور قلب|اوقات/.test(q)) {
    const pt = computePrayerTimesForDate(new Date(), settings);
    sections.push(
      `◆ ${L.prayerSection}\n` +
        `${formatTimeShort(pt.fajr)} · ${formatTimeShort(pt.dhuhr)} · ${formatTimeShort(pt.asr)} · ${formatTimeShort(pt.maghrib)} · ${formatTimeShort(pt.isha)}`
    );
    if (/خشوع|focus|khushu|حضور قلب/.test(q)) {
      sections.push(
        `◆ ${L.khushuSection}\n${L.khushuBullets.map((b, i) => `${i + 1}. ${b}`).join('\n')}`
      );
    }
  }

  // 3. Search cached Surahs & Ayahs
  const surahs = await db.getAll('quran_surahs');
  const tokens = normalizeSearchText(prompt)
    .split(/\s+/)
    .filter((tok) => tok.length >= 2);
  const matchedAyahs: string[] = [];

  for (const s of surahs) {
    const meta = SURAH_META.find((m) => m.number === s.number);
    const metaNames = meta
      ? `${meta.arabicName} ${meta.pashtoName} ${meta.persianName} ${meta.englishName}`
      : '';
    const surahNameHit = tokens.some((tok) => matchesNormalized(metaNames, tok));

    for (const a of s.ayahs) {
      const tr = getLocalizedContent(lang, a);
      const tafsir = lang === 'ps' ? a.tafsirPs || a.tafsirAr : a.tafsirAr;
      const haystack = `${a.arabic} ${tr} ${tafsir}`;
      if (surahNameHit || tokens.some((tok) => matchesNormalized(haystack, tok))) {
        const title = meta ? getSurahTitle(meta, lang) : `#${s.number}`;
        matchedAyahs.push(
          `• ${title} (${a.numberInSurah}):\n${a.arabic}\n${tr}\n${tafsir ? `(${tafsir})` : ''}`
        );
        if (matchedAyahs.length >= 3) break;
      }
    }
    if (matchedAyahs.length >= 3) break;
  }

  if (matchedAyahs.length > 0) {
    sections.push(`◆ ${L.quranSection}\n${matchedAyahs.join('\n\n')}`);
  }

  // 4. Search Hadiths
  const hadiths = await db.getAll('hadiths');
  const matchedHadiths = hadiths
    .filter((h) => {
      const hay = `${h.arabic} ${h.ps} ${h.fa} ${h.en} ${h.topic} ${getText(lang, h.commentary)}`;
      return tokens.some((tok) => matchesNormalized(hay, tok));
    })
    .slice(0, 2);

  if (matchedHadiths.length > 0 || (/hadith|حدیث|حديث|امانت|رښتینول|honest|صادق/.test(q) && hadiths.length > 0)) {
    const list = matchedHadiths.length > 0 ? matchedHadiths : [hadiths[0]];
    sections.push(
      `◆ ${L.hadithSection}\n` +
        list
          .map(
            (h) =>
              `${h.arabic}\n${getLocalizedContent(lang, h)}\n[${L.sourceLabel}: ${h.sourceRef} · ${L.gradeLabel}: ${h.grade}]`
          )
          .join('\n\n')
    );
  }

  // 5. Search Adhkar
  const adhkar = await db.getAll('adhkar_items');
  const matchedAdhkar = adhkar
    .filter((d) => {
      const hay = `${d.arabic} ${d.ps} ${d.fa} ${d.en} ${d.category}`;
      return tokens.some((tok) => matchesNormalized(hay, tok));
    })
    .slice(0, 2);

  if (matchedAdhkar.length > 0) {
    sections.push(
      `◆ ${L.adhkarSection}\n` +
        matchedAdhkar
          .map((d) => `${d.arabic}\n${getLocalizedContent(lang, d)} [${L.sourceLabel}: ${d.source}]`)
          .join('\n\n')
    );
  }

  // 6. Search Dictionary
  const matchedWords = QURAN_DICTIONARY.filter((w) => {
    const hay = `${w.arabic} ${w.ar || ''} ${w.root} ${w.ps} ${w.fa} ${w.en}`;
    return tokens.some((tok) => matchesNormalized(hay, tok));
  }).slice(0, 2);

  if (matchedWords.length > 0) {
    sections.push(
      `◆ ${L.dictionarySection}\n` +
        matchedWords
          .map((w) => `${w.arabic} (${w.root}): ${getLocalizedContent(lang, w)} — ${w.relatedAyahArabic}`)
          .join('\n')
    );
  }

  // 7. Search Library Books
  const books = await db.getAll('library_books');
  const matchedBooks = books
    .filter((b) => {
      const hay = `${getText(lang, b.title)} ${getText(lang, b.author)} ${b.sections.map((s) => `${s.title} ${s.content}`).join(' ')}`;
      return tokens.some((tok) => matchesNormalized(hay, tok));
    })
    .slice(0, 2);

  if (matchedBooks.length > 0) {
    sections.push(
      `◆ ${L.librarySection}\n` +
        matchedBooks
          .map((b) => `• ${getText(lang, b.title)} (${getText(lang, b.author)}): ${b.sections[0]?.content.slice(0, 220)}...`)
          .join('\n\n')
    );
  }

  // 8. Search Scholarly Quotes & Athar
  const quotes = await db.getAll('quotes');
  const matchedQuotes = quotes
    .filter((sq) => {
      const hay = `${sq.arabic} ${sq.ps} ${sq.fa} ${sq.en} ${getText(lang, sq.scholarName)}`;
      return tokens.some((tok) => matchesNormalized(hay, tok));
    })
    .slice(0, 2);

  if (matchedQuotes.length > 0) {
    sections.push(
      `◆ ${L.quoteSection}\n` +
        matchedQuotes
          .map((sq) => `${sq.arabic}\n${getLocalizedContent(lang, sq)} — ${getText(lang, sq.scholarName)} [${getText(lang, sq.bookName)}, ${sq.volume} ${sq.page}]`)
          .join('\n\n')
    );
  }

  // Guarantee helpful non-empty response even on broad queries
  if (sections.length === 0) {
    const fallbackAyah = surahs[0]?.ayahs?.[0];
    const fallbackHadith = hadiths[0];
    const fallbackItems: string[] = [L.fallbackIntro];
    if (fallbackAyah) {
      fallbackItems.push(
        `◆ ${L.quranSection}\n${fallbackAyah.arabic}\n${getLocalizedContent(lang, fallbackAyah)}`
      );
    }
    if (fallbackHadith) {
      fallbackItems.push(
        `◆ ${L.hadithSection}\n${fallbackHadith.arabic}\n${getLocalizedContent(lang, fallbackHadith)}\n[${L.sourceLabel}: ${fallbackHadith.sourceRef}]`
      );
    }
    sections.push(fallbackItems.join('\n\n'));
  }

  return `${L.headerOffline}\n\n${sections.join('\n\n')}\n\n— ${L.scholarlyNote}`;
}
