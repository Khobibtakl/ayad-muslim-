import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import heroArchImg from '../assets/images/hero_islamic_arch_1794571274965.jpg';
import libraryBooksImg from '../assets/images/islamic_library_books_1794571274883.jpg';
import quranIllumImg from '../assets/images/quran_illumination_1794571275112.jpg';
import { useApp } from '../context/AppContext';
import { EMBEDDED_SURAHS, getSurahTitle, SURAH_META } from '../data/surahMeta';
import { WALLPAPER_OPTIONS } from '../data/wallpapers';
import { getDB, todayKey } from '../db/database';
import { getLocalizedContent, getText } from '../i18n/translations';
import type {
  AdhkarProgressRecord,
  DhikrItem,
  HadithItem,
  LibraryBook,
  ModuleId,
  ScholarQuote,
  TaskItem,
} from '../types';
import {
  computePrayerTimesForDate,
  formatTimeShort,
  getHijriParts,
  getLocaleTag,
  getLocalizedCityName,
  getNextIslamicOccasion,
} from '../utils/islamicCalc';
import { Icon3D } from './Icons3D';

interface RadialRingProps {
  pct: number;
  color: string;
}

const RadialRing: React.FC<RadialRingProps> = ({ pct, color }) => {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(100, Math.max(0, pct)) / 100) * circ;
  return (
    <svg width="46" height="46" viewBox="0 0 46 46" className="shrink-0 -rotate-90">
      <circle
        cx="23"
        cy="23"
        r={r}
        fill="none"
        stroke="var(--border-subtle)"
        strokeWidth="4"
      />
      <circle
        cx="23"
        cy="23"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 450ms cubic-bezier(0.16, 1, 0.3, 1)' }}
      />
    </svg>
  );
};

export const DashboardView: React.FC = () => {
  const { settings, t, isRTL, quranProgress, setActiveModule, updateSettings } = useApp();
  const lang = settings.language;

  const [now, setNow] = useState(() => new Date());
  const [hadith, setHadith] = useState<HadithItem | null>(null);
  const [adhkarList, setAdhkarList] = useState<DhikrItem[]>([]);
  const [adhkarProg, setAdhkarProg] = useState<AdhkarProgressRecord | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [book, setBook] = useState<LibraryBook | null>(null);
  const [quotes, setQuotes] = useState<ScholarQuote[]>([]);
  const [carouselIdx, setCarouselIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    (async () => {
      const db = await getDB();
      const [hs, ads, ap, tks, bks, sqs] = await Promise.all([
        db.getAll('hadiths'),
        db.getAll('adhkar_items'),
        db.get('adhkar_progress', todayKey()),
        db.getAll('tasks'),
        db.getAll('library_books'),
        db.getAll('quotes'),
      ]);
      const dayIndex = new Date().getDate();
      if (hs.length > 0) setHadith(hs[dayIndex % hs.length]);
      setAdhkarList(ads);
      setAdhkarProg(ap || null);
      setTasks(tks);
      if (bks.length > 0) setBook(bks[dayIndex % bks.length]);
      setQuotes(sqs);
    })();
  }, []);

  const prayerTimes = useMemo(() => computePrayerTimesForDate(now, settings), [now, settings]);
  const hijri = useMemo(() => getHijriParts(now), [now]);
  const occasion = useMemo(() => getNextIslamicOccasion(now), [now]);

  const countdownStr = useMemo(() => {
    const diffMs = Math.max(0, prayerTimes.nextPrayerTime.getTime() - now.getTime());
    const hrs = Math.floor(diffMs / 3600000);
    const mins = Math.floor((diffMs % 3600000) / 60000);
    const secs = Math.floor((diffMs % 60000) / 1000);
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, [now, prayerTimes]);

  const adhkarTotal = adhkarList.length || 1;
  const adhkarCompletedCount = adhkarProg?.completedIds?.length || 0;
  const adhkarPct = Math.min(100, Math.round((adhkarCompletedCount / adhkarTotal) * 100));

  const quranGoal = Math.max(1, quranProgress.dailyGoalAyahs || 15);
  const quranPct = Math.min(100, Math.round((quranProgress.todayAyahsRead / quranGoal) * 100));

  const todayStr = todayKey();
  const todayTasks = tasks.filter((tk) => tk.dueDate === todayStr || tk.status === 'pending');
  const doneTasks = tasks.filter((tk) => tk.status === 'completed').length;
  const taskTotal = Math.max(1, tasks.length);
  const tasksPct = tasks.length === 0 ? 0 : Math.min(100, Math.round((doneTasks / taskTotal) * 100));

  const overallDailyPct = Math.round((adhkarPct + quranPct + tasksPct) / 3);

  const dailyAyah = useMemo(() => {
    const refs = [
      { surah: 1, ayah: 5 },
      { surah: 55, ayah: 60 },
      { surah: 67, ayah: 2 },
      { surah: 94, ayah: 5 },
      { surah: 97, ayah: 3 },
      { surah: 103, ayah: 2 },
      { surah: 36, ayah: 58 },
      { surah: 112, ayah: 1 },
    ];
    const pick = refs[now.getDate() % refs.length];
    const surahObj = EMBEDDED_SURAHS[pick.surah];
    const meta = SURAH_META.find((m) => m.number === pick.surah);
    const ayahObj = surahObj?.ayahs.find((a) => a.numberInSurah === pick.ayah) || surahObj?.ayahs[0];
    return {
      surahTitle: meta ? getSurahTitle(meta, lang) : `${pick.surah}`,
      ref: `${pick.surah}:${pick.ayah}`,
      arabic: ayahObj?.arabic || 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
      translation: ayahObj
        ? (lang === 'ar' ? ayahObj.tafsirAr : getLocalizedContent(lang, ayahObj)) || ayahObj.en || ayahObj.ps
        : '',
    };
  }, [lang, now]);

  const carouselSlides = useMemo(() => {
    const firstQuote = quotes[0];
    const secondQuote = quotes[1 % Math.max(1, quotes.length)];
    const easeSurah = EMBEDDED_SURAHS[94];
    const easeAyah = easeSurah?.ayahs.find((a) => a.numberInSurah === 5);
    const dhikrSample = adhkarList.find((d) => d.category === 'durood') || adhkarList[0];

    return [
      {
        kind: lang === 'en' ? 'Quranic Verse' : lang === 'ar' ? 'آية قرآنية' : lang === 'fa' ? 'آیه قرآنی' : 'قرآني آیت',
        image: quranIllumImg,
        arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
        text:
          lang === 'ps'
            ? 'خبر اوسئ! یوازې د الله په یاد سره زړونه آرام مومي. (سورت الرعد: ۲۸)'
            : lang === 'ar'
            ? 'سورة الرعد: ٢٨ — الطمأنينة الحقيقية في ذكر الله تعالى.'
            : lang === 'fa'
            ? 'آگاه باشید! تنها با یاد خدا دل‌ها آرام می‌گیرد. (رعد: ۲۸)'
            : 'Unquestionably, by the remembrance of Allah hearts are assured. (Surah Ar-Ra’d 13:28)',
        action: () => setActiveModule('quran'),
      },
      {
        kind: lang === 'en' ? 'Prophetic Hadith' : lang === 'ar' ? 'حديث نبوي شريف' : lang === 'fa' ? 'حدیث نبوی' : 'نبوي حدیث',
        image: heroArchImg,
        arabic: hadith?.arabic || 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
        text: hadith
          ? `${getLocalizedContent(lang, hadith)} (${hadith.sourceRef})`
          : t.common.verified,
        action: () => setActiveModule('hadith'),
      },
      {
        kind: lang === 'en' ? 'Scholarly Wisdom' : lang === 'ar' ? 'من أقوال العلماء' : lang === 'fa' ? 'حکمت علما' : 'د علماوو وینا',
        image: libraryBooksImg,
        arabic: firstQuote?.arabic || 'لَيْسَ الْعِلْمُ مَا حُفِظَ، الْعِلْمُ مَا نَفَعَ.',
        text: firstQuote
          ? `${getLocalizedContent(lang, firstQuote)} — ${getText(lang, firstQuote.scholarName)}`
          : t.nav.quotes,
        action: () => setActiveModule('quotes'),
      },
      {
        kind: t.nav.library,
        image: libraryBooksImg,
        arabic: book ? getText(lang, book.title) : t.nav.library,
        text: book ? `${getText(lang, book.author)} · ${book.publishInfo}` : '',
        action: () => setActiveModule('library'),
      },
      {
        kind: lang === 'en' ? 'Worship Encouragement' : lang === 'ar' ? 'حث على العبادة' : lang === 'fa' ? 'تشویق به عبادت' : 'عبادتي هڅونه',
        image: heroArchImg,
        arabic: 'أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ',
        text:
          lang === 'ps'
            ? 'الله ته تر ټولو خوښ عمل هغه دی چې دوامدار وي که څه هم لږ وي. (صحيح البخاري ۶۴۶۴)'
            : lang === 'ar'
            ? 'أحب الأعمال إلى الله أدومها وإن قل — متفق عليه (البخاري ٦٤٦٤).'
            : lang === 'fa'
            ? 'محبوب‌ترین عمل نزد خدا پایدارترین آن است، هرچند اندک باشد. (بخاری ۶۴۶۴)'
            : 'The most beloved deeds to Allah are those done consistently, even if small. (Sahih al-Bukhari 6464)',
        action: () => setActiveModule('routines'),
      },
      {
        kind: t.nav.adhkar,
        image: heroArchImg,
        arabic: dhikrSample?.arabic || 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ',
        text: dhikrSample ? `${getLocalizedContent(lang, dhikrSample)} (${dhikrSample.source})` : t.nav.adhkar,
        action: () => setActiveModule('adhkar'),
      },
      {
        kind: lang === 'en' ? 'Hope & Relief' : lang === 'ar' ? 'بشارة قرآنية' : lang === 'fa' ? 'بشارت قرآنی' : 'قرآني بشارت',
        image: quranIllumImg,
        arabic: easeAyah?.arabic || 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
        text: easeAyah
          ? `${lang === 'ar' ? easeAyah.tafsirAr : getLocalizedContent(lang, easeAyah)} (94:5)`
          : '',
        action: () => setActiveModule('quran'),
      },
      {
        kind: lang === 'en' ? 'Classical Guidance' : lang === 'ar' ? 'نصيحة علمية' : lang === 'fa' ? 'اندرز علما' : 'علمي نصيحت',
        image: libraryBooksImg,
        arabic: secondQuote?.arabic || 'الْوَقْتُ أَنفَسُ مَا عُنِيتَ بِحِفْظِهِ',
        text: secondQuote
          ? `${getLocalizedContent(lang, secondQuote)} — ${getText(lang, secondQuote.scholarName)}`
          : t.nav.quotes,
        action: () => setActiveModule('quotes'),
      },
    ];
  }, [adhkarList, book, hadith, lang, quotes, setActiveModule, t.common.verified, t.nav.adhkar, t.nav.library, t.nav.quotes]);

  useEffect(() => {
    if (!settings.carouselEnabled) return;
    const intervalMs = Math.max(4, settings.carouselIntervalSec || 10) * 1000;
    const id = setInterval(() => {
      setCarouselIdx((prev) => (prev + 1) % carouselSlides.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [settings.carouselEnabled, settings.carouselIntervalSec, carouselSlides.length]);

  const activeSlideIndex = carouselIdx % carouselSlides.length;
  const currentSlide = carouselSlides[activeSlideIndex];
  const hijriMonthName = t.hijriMonths[(hijri.month - 1) % 12] || '';
  const gregorianStr = now.toLocaleDateString(getLocaleTag(lang), {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const displayCity = getLocalizedCityName(settings.city, lang, t.gpsLabel);
  const displayName =
    settings.userName && settings.userName !== 'مسلمان ورور / خور'
      ? settings.userName
      : t.onboarding.defaultUserName;

  const prayerList: Array<{ key: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'; label: string; time: Date }> = [
    { key: 'fajr', label: t.prayers.fajr, time: prayerTimes.fajr },
    { key: 'dhuhr', label: t.prayers.dhuhr, time: prayerTimes.dhuhr },
    { key: 'asr', label: t.prayers.asr, time: prayerTimes.asr },
    { key: 'maghrib', label: t.prayers.maghrib, time: prayerTimes.maghrib },
    { key: 'isha', label: t.prayers.isha, time: prayerTimes.isha },
  ];

  const duaOfDay = adhkarList.find((d) => d.category === 'quranic_duas') || adhkarList[0];

  const quickModules: ModuleId[] = [
    'quran',
    'hadith',
    'adhkar',
    'tasbeeh',
    'qibla',
    'mosques',
    'calendar',
    'assistant',
  ];

  const metricCards = [
    {
      mod: 'adhkar' as ModuleId,
      label: t.dashboard.adhkarProgress,
      stat: `${adhkarCompletedCount}/${adhkarTotal}`,
      pct: adhkarPct,
      color: 'var(--accent-primary)',
    },
    {
      mod: 'quran' as ModuleId,
      label: t.dashboard.quranProgress,
      stat: `${quranProgress.todayAyahsRead}/${quranGoal}`,
      pct: quranPct,
      color: 'var(--accent-gold)',
    },
    {
      mod: 'tasks' as ModuleId,
      label: t.dashboard.tasksProgress,
      stat: `${doneTasks}/${tasks.length}`,
      pct: tasksPct,
      color: 'var(--accent-primary)',
    },
    {
      mod: 'statistics' as ModuleId,
      label: t.dashboard.dailyGoals,
      stat: `${todayTasks.length} ${t.common.pending}`,
      pct: overallDailyPct,
      color: 'var(--accent-gold)',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Architectural Hero: Welcome + Prayer Command Strip + Carousel */}
      <section className="surface-elevated rounded-3xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <Icon3D kind="calendar" size={16} />
                  <span>
                    {t.dashboard.hijriDate}: {hijri.day} {hijriMonthName} {hijri.year} {t.hijriYearSuffix}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{gregorianStr}</span>
                </div>

                {/* Quick Glass Backdrop Switcher */}
                <div
                  className="flex items-center gap-1.5 surface-alt rounded-xl p-1"
                  role="group"
                  aria-label={t.settingsModule.wallpaper}
                >
                  {WALLPAPER_OPTIONS.map((wp) => {
                    const active = (settings.wallpaper || 'madinah') === wp.id && !settings.customBgTint;
                    const wpLabel = getText(lang, wp.label);
                    return (
                      <button
                        key={wp.id}
                        type="button"
                        title={wpLabel}
                        aria-label={wpLabel}
                        onClick={() => updateSettings({ wallpaper: wp.id, customBgTint: '' })}
                        className="relative w-7 h-7 rounded-lg overflow-hidden border transition-transform hover:scale-105 active:scale-95"
                        style={{
                          borderColor: active ? 'var(--accent-primary)' : 'var(--glass-border)',
                          boxShadow: active ? '0 0 0 1.5px var(--accent-primary)' : undefined,
                        }}
                      >
                        {wp.image ? (
                          <img src={wp.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span
                            className="block w-full h-full"
                            style={{ backgroundColor: wp.previewTint }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {t.greetingPrefix} {displayName}
              </h2>
              <p className="text-sm flex flex-wrap items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                <Icon3D kind="location" size={16} />
                <span>
                  {t.prayers.city}: {displayCity} · {t.dashboard.upcomingEvent}:{' '}
                  {t.calendarModule[occasion.key]} ({occasion.daysUntil} {t.dashboard.daysLeft})
                </span>
              </p>
            </div>

            {/* Prayer Command Strip */}
            <div className="surface-alt rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <Icon3D kind="prayer" size={38} />
                  <div>
                    <span className="text-xs font-medium block" style={{ color: 'var(--text-muted)' }}>
                      {t.dashboard.nextPrayer}
                    </span>
                    <div className="text-xl font-bold tracking-tight" style={{ color: 'var(--accent-primary)' }}>
                      {t.prayers[prayerTimes.nextPrayer]} · {formatTimeShort(prayerTimes.nextPrayerTime)}
                    </div>
                  </div>
                </div>
                <div className="text-end">
                  <span className="text-xs block" style={{ color: 'var(--text-muted)' }}>
                    {t.common.pending}
                  </span>
                  <span className="font-mono-tabular text-2xl sm:text-3xl font-bold tracking-tight">
                    {countdownStr}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-1.5 sm:gap-2 pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                {prayerList.map((p) => {
                  const isNext = p.key === prayerTimes.nextPrayer;
                  return (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => setActiveModule('prayer')}
                      className={`rounded-xl p-2 sm:p-2.5 text-center transition-all min-h-[48px] ${
                        isNext ? 'btn-primary' : 'hover:bg-black/[0.04] dark:hover:bg-white/[0.05]'
                      }`}
                      style={
                        isNext
                          ? undefined
                          : { color: 'var(--text-primary)' }
                      }
                    >
                      <div className="text-[11px] truncate opacity-85">{p.label.split(' ')[0]}</div>
                      <div className="font-mono-tabular text-xs sm:text-sm font-semibold mt-0.5">
                        {formatTimeShort(p.time)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 10-Second Auto-Rotating Spiritual Carousel */}
          <div className="lg:col-span-5 relative min-h-[280px] flex flex-col justify-between overflow-hidden bg-black">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentSlide.image + activeSlideIndex}
                src={currentSlide.image}
                alt={currentSlide.kind}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/55 to-black/30" />

            <div className="relative z-10 p-5 flex items-center justify-between text-white">
              <span className="text-xs font-medium tracking-wide text-white/90">
                {t.dashboard.carouselTitle} · {currentSlide.kind}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => updateSettings({ carouselEnabled: !settings.carouselEnabled })}
                  title={settings.carouselEnabled ? t.dashboard.carouselPlaying : t.dashboard.carouselPaused}
                  className="p-2 rounded-full bg-white/15 backdrop-blur-md hover:bg-white/25 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                >
                  {settings.carouselEnabled ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setCarouselIdx((i) => (i - 1 + carouselSlides.length) % carouselSlides.length)}
                  aria-label={t.common.previous}
                  className="p-2 rounded-full bg-white/15 backdrop-blur-md hover:bg-white/25 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                >
                  {isRTL ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setCarouselIdx((i) => (i + 1) % carouselSlides.length)}
                  aria-label={t.common.next}
                  className="p-2 rounded-full bg-white/15 backdrop-blur-md hover:bg-white/25 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                >
                  {isRTL ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={currentSlide.action}
              className="relative z-10 p-5 sm:p-6 text-start text-white space-y-2.5 hover:bg-black/15 transition-colors"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlideIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-2"
                >
                  <p className="font-arabic text-lg sm:text-xl leading-loose line-clamp-2">
                    {currentSlide.arabic}
                  </p>
                  <p className="text-xs sm:text-sm text-white/85 line-clamp-2">
                    {currentSlide.text}
                  </p>
                </motion.div>
              </AnimatePresence>
              <div className="flex items-center gap-1.5 pt-1">
                {carouselSlides.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1 rounded-full transition-all ${
                      idx === activeSlideIndex ? 'w-6 bg-amber-400' : 'w-2 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Daily Progress Metrics with SVG Radial Rings */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((m) => (
          <button
            key={m.mod}
            type="button"
            onClick={() => setActiveModule(m.mod)}
            className="interactive-tile rounded-2xl p-4 sm:p-5 text-start flex flex-col justify-between gap-3.5"
          >
            <div className="flex items-center justify-between gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span className="flex items-center gap-2 font-medium">
                <Icon3D kind={m.mod} size={22} />
                <span>{m.label}</span>
              </span>
              <span className="font-mono-tabular font-semibold">{m.stat}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="text-2xl font-bold font-mono-tabular tracking-tight">{m.pct}%</div>
              <RadialRing pct={m.pct} color={m.color} />
            </div>
            <div className="h-1.5 rounded-full overflow-hidden surface-alt">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${m.pct}%`, backgroundColor: m.color }}
              />
            </div>
          </button>
        ))}
      </section>

      {/* 3. Quick Access Bento Tiles with Sculpted 3D Icons */}
      <section className="space-y-3">
        <h3 className="text-base font-bold tracking-tight">{t.dashboard.quickAccess}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {quickModules.map((modId) => (
            <button
              key={modId}
              type="button"
              onClick={() => setActiveModule(modId)}
              className="interactive-tile rounded-2xl p-3.5 flex flex-col items-center justify-center gap-2.5 text-center min-h-[92px]"
            >
              <Icon3D kind={modId} size={38} />
              <span className="text-xs font-semibold line-clamp-1">{t.nav[modId]}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 4. Editorial Daily Cards (Ayah, Hadith, Dua, Book) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="surface-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between gap-4">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--accent-primary)' }}>
                <Icon3D kind="quran" size={22} />
                <span>{t.dashboard.dailyAyah}</span>
              </h3>
              <span className="text-xs font-mono-tabular" style={{ color: 'var(--text-muted)' }}>
                {dailyAyah.surahTitle} · {dailyAyah.ref}
              </span>
            </div>
            <p className="font-arabic text-xl sm:text-2xl leading-loose" dir="rtl">
              {dailyAyah.arabic}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {dailyAyah.translation}
            </p>
          </div>
          <div>
            <button
              type="button"
              onClick={() => setActiveModule('quran')}
              className="text-xs font-semibold hover:underline"
              style={{ color: 'var(--accent-primary)' }}
            >
              {t.quranModule.continueReading}
            </button>
          </div>
        </div>

        <div className="surface-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between gap-4">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--accent-primary)' }}>
                <Icon3D kind="hadith" size={22} />
                <span>{t.dashboard.dailyHadith}</span>
              </h3>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {hadith?.sourceRef} · {hadith ? t.hadithModule.gradeLabels[hadith.grade] || hadith.grade : ''}
              </span>
            </div>
            <p className="font-arabic text-lg sm:text-xl leading-loose">{hadith?.arabic}</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {hadith ? getLocalizedContent(lang, hadith) : ''}
            </p>
          </div>
          <div>
            <button
              type="button"
              onClick={() => setActiveModule('hadith')}
              className="text-xs font-semibold hover:underline"
              style={{ color: 'var(--accent-primary)' }}
            >
              {t.nav.hadith}
            </button>
          </div>
        </div>

        <div className="surface-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between gap-4">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--accent-primary)' }}>
                <Icon3D kind="duas" size={22} />
                <span>{t.dashboard.dailyDua}</span>
              </h3>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {duaOfDay?.source}
              </span>
            </div>
            <p className="font-arabic text-lg sm:text-xl leading-loose">{duaOfDay?.arabic}</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {duaOfDay ? getLocalizedContent(lang, duaOfDay) : ''}
            </p>
          </div>
          <div>
            <button
              type="button"
              onClick={() => setActiveModule('adhkar')}
              className="text-xs font-semibold hover:underline"
              style={{ color: 'var(--accent-primary)' }}
            >
              {t.nav.adhkar}
            </button>
          </div>
        </div>

        <div className="surface-card rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row gap-5 items-start">
          <img
            src={libraryBooksImg}
            alt={book ? getText(lang, book.title) : t.nav.library}
            className="w-full sm:w-36 h-36 rounded-2xl object-cover shrink-0 border"
            style={{ borderColor: 'var(--border-subtle)' }}
          />
          <div className="space-y-2.5 flex-1">
            <div className="text-xs flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
              <Icon3D kind="library" size={18} />
              <span>
                {t.dashboard.recommendedBook} · {t.libraryModule.publicDomainLabel}
              </span>
            </div>
            <h4 className="text-lg font-bold tracking-tight">{book ? getText(lang, book.title) : ''}</h4>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {book ? getText(lang, book.author) : ''}
            </p>
            <button
              type="button"
              onClick={() => setActiveModule('library')}
              className="mt-1 inline-flex items-center rounded-xl px-4 py-2.5 text-xs font-semibold btn-primary"
            >
              {t.nav.library}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
