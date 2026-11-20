import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bookmark,
  Check,
  Copy,
  Heart,
  Image as ImageIcon,
  Moon,
  Pause,
  Play,
  Repeat,
  Search,
  SkipBack,
  SkipForward,
  Sun,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EMBEDDED_SURAHS, getSurahTitle, RECITERS, SURAH_META } from '../data/surahMeta';
import { getDB, todayKey } from '../db/database';
import { getText } from '../i18n/translations';
import type { CachedSurah, QuranAyah } from '../types';
import { matchesNormalized } from '../utils/searchNormalize';
import { downloadShareableCard } from '../utils/shareCard';
import { Icon3D } from './Icons3D';

const AUDIO_CACHE_NAME = 'eyad-audio-cache-v1';

export const QuranView: React.FC = () => {
  const {
    settings,
    t,
    updateSettings,
    quranProgress,
    updateQuranProgress,
    bookmarks,
    toggleBookmark,
    favorites,
    toggleFavorite,
    setActiveModule,
  } = useApp();
  const lang = settings.language;

  const [selectedSurah, setSelectedSurah] = useState<number>(quranProgress.lastSurah || 1);
  const [surahSearch, setSurahSearch] = useState('');
  const [ayahSearch, setAyahSearch] = useState('');
  const [juzFilter, setJuzFilter] = useState<number | 'all'>('all');
  const [cachedSurah, setCachedSurah] = useState<CachedSurah | null>(null);
  const [downloadedNumbers, setDownloadedNumbers] = useState<Set<number>>(
    new Set(Object.keys(EMBEDDED_SURAHS).map(Number))
  );
  const [loadingSurah, setLoadingSurah] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [batchProgress, setBatchProgress] = useState<{ active: boolean; done: number; total: number }>({
    active: false,
    done: 0,
    total: 0,
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedTafsirAyah, setSelectedTafsirAyah] = useState<QuranAyah | null>(null);

  // Audio player & CacheStorage state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [audioCached, setAudioCached] = useState(false);
  const [cachingAudio, setCachingAudio] = useState(false);
  const [speechPlaying, setSpeechPlaying] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [repeatSurah, setRepeatSurah] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

  const loadOfflineInventory = async () => {
    const db = await getDB();
    const keys = await db.getAllKeys('quran_surahs');
    setDownloadedNumbers(new Set(keys));
  };

  useEffect(() => {
    loadOfflineInventory();
  }, []);

  const fetchAndCacheSurah = async (surahNum: number, forceNetwork = false) => {
    setFetchError('');
    const db = await getDB();
    const local = await db.get('quran_surahs', surahNum);
    const needsPashtoRefresh =
      local && navigator.onLine && local.ayahs.every((a) => !a.ps);
    if (local && !forceNetwork && !needsPashtoRefresh) {
      setCachedSurah(local);
      return;
    }

    if (EMBEDDED_SURAHS[surahNum] && !forceNetwork) {
      await db.put('quran_surahs', EMBEDDED_SURAHS[surahNum]);
      setCachedSurah(EMBEDDED_SURAHS[surahNum]);
      await loadOfflineInventory();
      return;
    }

    setLoadingSurah(true);
    try {
      const res = await fetch(`/api/quran/surah/${surahNum}`);
      if (!res.ok) throw new Error('Network unavailable');
      const data = (await res.json()) as { ayahs: QuranAyah[] };
      const record: CachedSurah = {
        number: surahNum,
        ayahs: data.ayahs,
        downloadedAt: Date.now(),
        offlineReady: true,
      };
      await db.put('quran_surahs', record);
      setCachedSurah(record);
      await loadOfflineInventory();
    } catch {
      if (local) {
        setCachedSurah(local);
      } else if (EMBEDDED_SURAHS[surahNum]) {
        await db.put('quran_surahs', EMBEDDED_SURAHS[surahNum]);
        setCachedSurah(EMBEDDED_SURAHS[surahNum]);
        await loadOfflineInventory();
      } else {
        setCachedSurah(null);
        setFetchError(t.offlineBanner);
      }
    } finally {
      setLoadingSurah(false);
    }
  };

  useEffect(() => {
    fetchAndCacheSurah(selectedSurah);
  }, [selectedSurah]);

  const downloadEssentialBatch = async () => {
    const essentialIds = [1, 18, 36, 55, 56, 67, 78, 87, 93, 97, 103, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114];
    setBatchProgress({ active: true, done: 0, total: essentialIds.length });
    const db = await getDB();
    for (let i = 0; i < essentialIds.length; i++) {
      const id = essentialIds[i];
      try {
        const existing = await db.get('quran_surahs', id);
        if (!existing) {
          if (EMBEDDED_SURAHS[id]) {
            await db.put('quran_surahs', EMBEDDED_SURAHS[id]);
          } else {
            const res = await fetch(`/api/quran/surah/${id}`);
            if (res.ok) {
              const data = (await res.json()) as { ayahs: QuranAyah[] };
              await db.put('quran_surahs', {
                number: id,
                ayahs: data.ayahs,
                downloadedAt: Date.now(),
                offlineReady: true,
              });
            }
          }
        }
      } catch {
        // continue batch
      }
      setBatchProgress({ active: true, done: i + 1, total: essentialIds.length });
    }
    await loadOfflineInventory();
    setBatchProgress({ active: false, done: 0, total: 0 });
  };

  const currentMeta = SURAH_META.find((s) => s.number === selectedSurah) || SURAH_META[0];
  const lastMeta = SURAH_META[(quranProgress.lastSurah || 1) - 1] || SURAH_META[0];
  const currentSurahName = getSurahTitle(currentMeta, lang);
  const lastSurahName = getSurahTitle(lastMeta, lang);

  const filteredSurahs = useMemo(() => {
    return SURAH_META.filter((s, idx) => {
      const nextJuz = SURAH_META[idx + 1]?.juzStart ?? 30;
      const juzEnd = Math.max(s.juzStart, nextJuz);
      const matchesJuz =
        juzFilter === 'all' || (juzFilter >= s.juzStart && juzFilter <= juzEnd);
      const q = surahSearch.trim();
      const matchesText =
        !q ||
        matchesNormalized(s.arabicName, q) ||
        matchesNormalized(s.englishName, q) ||
        matchesNormalized(s.pashtoName, q) ||
        matchesNormalized(s.persianName, q) ||
        String(s.number) === q;
      return matchesJuz && matchesText;
    });
  }, [juzFilter, surahSearch]);

  const displayedAyahs = useMemo(() => {
    if (!cachedSurah) return [];
    const q = ayahSearch.trim();
    if (!q) return cachedSurah.ayahs;
    return cachedSurah.ayahs.filter(
      (a) =>
        matchesNormalized(a.arabic, q) ||
        matchesNormalized(a.ps, q) ||
        matchesNormalized(a.fa, q) ||
        matchesNormalized(a.en, q) ||
        String(a.numberInSurah) === q
    );
  }, [ayahSearch, cachedSurah]);

  const markAyahRead = async (ayahNum: number) => {
    const today = todayKey();
    const prevToday = quranProgress.todayDate === today ? quranProgress.todayAyahsRead : 0;
    const nextToday = prevToday + 1;
    const nextTotal = (quranProgress.totalAyahsRead || 0) + 1;
    const history = [...(quranProgress.history || [])];
    const existingIdx = history.findIndex((h) => h.date === today);
    if (existingIdx >= 0) {
      history[existingIdx] = { date: today, ayahs: nextToday, surah: selectedSurah };
    } else {
      history.push({ date: today, ayahs: nextToday, surah: selectedSurah });
    }
    const khatmahCount = Math.floor(nextTotal / 6236);

    await updateQuranProgress({
      lastSurah: selectedSurah,
      lastAyah: ayahNum,
      todayDate: today,
      todayAyahsRead: nextToday,
      totalAyahsRead: nextTotal,
      khatmahCount,
      history,
    });

    const db = await getDB();
    await db.put('reading_history', {
      id: `rh-quran-${Date.now()}`,
      type: 'quran',
      refId: `${selectedSurah}:${ayahNum}`,
      title: `${currentSurahName} (${selectedSurah}:${ayahNum})`,
      progressLabel: `${nextToday}/${quranProgress.dailyGoalAyahs}`,
      timestamp: Date.now(),
    });
  };

  // Remote MP3 audio URL + CacheStorage lookup
  const audioUrl = useMemo(() => {
    const padded = String(selectedSurah).padStart(3, '0');
    const slugMap: Record<string, string> = {
      'ar.alafasy': `https://server8.mp3quran.net/afs/${padded}.mp3`,
      'ar.abdulbasitmurattal': `https://server7.mp3quran.net/basit/${padded}.mp3`,
      'ar.husary': `https://server13.mp3quran.net/husr/${padded}.mp3`,
      'ar.mahermuaiqly': `https://server12.mp3quran.net/maher/${padded}.mp3`,
    };
    return slugMap[settings.reciterId] || slugMap['ar.alafasy'];
  }, [selectedSurah, settings.reciterId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      if ('caches' in window) {
        try {
          const cache = await caches.open(AUDIO_CACHE_NAME);
          const match = await cache.match(audioUrl);
          if (match && !cancelled) {
            const blob = await match.blob();
            const objUrl = URL.createObjectURL(blob);
            objectUrlRef.current = objUrl;
            setAudioSrc(objUrl);
            setAudioCached(true);
            return;
          }
        } catch {
          // ignore cache error
        }
      }
      if (!cancelled) {
        setAudioSrc(audioUrl);
        setAudioCached(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [audioUrl]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const cacheCurrentSurahAudio = async () => {
    if (!('caches' in window) || cachingAudio) return;
    setCachingAudio(true);
    try {
      const res = await fetch(audioUrl, { mode: 'cors' });
      if (res.ok) {
        const cache = await caches.open(AUDIO_CACHE_NAME);
        await cache.put(audioUrl, res.clone());
        const blob = await res.blob();
        if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
        const objUrl = URL.createObjectURL(blob);
        objectUrlRef.current = objUrl;
        setAudioSrc(objUrl);
        setAudioCached(true);
      }
    } catch {
      // Offline or blocked CORS fallback cleanly handled by speech readout
    } finally {
      setCachingAudio(false);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  useEffect(() => {
    setIsPlaying(false);
    setAudioProgress(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
    }
  }, [audioSrc]);

  const togglePlay = async () => {
    const el = audioRef.current;
    if (!el) return;
    if (isPlaying) {
      el.pause();
      setIsPlaying(false);
    } else {
      try {
        await el.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    }
  };

  const toggleOfflineSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !cachedSurah) return;
    const synth = window.speechSynthesis;
    if (speechPlaying) {
      synth.cancel();
      setSpeechPlaying(false);
      return;
    }
    synth.cancel();
    const combinedText = cachedSurah.ayahs
      .map((a) => (lang === 'en' ? a.en : a.arabic))
      .join('. ');
    const utt = new SpeechSynthesisUtterance(combinedText);
    utt.lang = lang === 'en' ? 'en-US' : 'ar-SA';
    utt.rate = Math.min(1.5, Math.max(0.75, playbackSpeed));
    utt.onend = () => setSpeechPlaying(false);
    utt.onerror = () => setSpeechPlaying(false);
    setSpeechPlaying(true);
    synth.speak(utt);
  };

  const handleCopy = (ayah: QuranAyah) => {
    const tr = lang === 'ar' ? ayah.ar || ayah.arabic : ayah[lang] || ayah.en || ayah.ps;
    navigator.clipboard.writeText(
      `${ayah.arabic}\n${tr}\n(${currentSurahName}: ${ayah.numberInSurah})`
    );
    setCopiedId(`${selectedSurah}:${ayah.numberInSurah}`);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const tafsirBookLabel =
    settings.tafsirBook === 'muyassar'
      ? t.quranModule.tafsirMuyassar
      : settings.tafsirBook === 'ibn-kathir'
      ? t.quranModule.tafsirIbnKathir
      : t.quranModule.tafsirJalalayn;

  const khatmahPct = Math.min(100, ((quranProgress.totalAyahsRead % 6236) / 6236) * 100);

  return (
    <div className="space-y-6">
      {/* Top Quran Status & Audio Player Bar */}
      <div className="surface-elevated rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <Icon3D kind="quran" size={34} className="mt-0.5 shrink-0" />
            <div className="space-y-1">
              <h2 className="text-xl font-bold">{t.nav.quran}</h2>
              <div className="flex flex-wrap items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span>
                  {t.quranModule.lastRead}: {lastSurahName} ({quranProgress.lastSurah}:{quranProgress.lastAyah})
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-tabular">
                  {t.quranModule.dailyGoal}: {quranProgress.todayAyahsRead}/{quranProgress.dailyGoalAyahs}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-tabular">
                  {t.quranModule.khatmah}: {khatmahPct.toFixed(1)}% ({quranProgress.khatmahCount})
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveModule('dictionary')}
              className="rounded-xl surface-alt px-3.5 py-2 text-xs font-semibold min-h-[40px] inline-flex items-center gap-1.5 hover:opacity-90"
            >
              <Icon3D kind="dictionary" size={16} />
              <span>{t.quranModule.wordDictionary}</span>
            </button>
            <button
              type="button"
              onClick={downloadEssentialBatch}
              disabled={batchProgress.active}
              className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold min-h-[40px] btn-primary"
            >
              <Icon3D kind="download" size={16} />
              <span>
                {batchProgress.active
                  ? `${batchProgress.done}/${batchProgress.total}`
                  : t.quranModule.downloadAllOffline}
              </span>
            </button>
          </div>
        </div>

        {/* Quran Audio Player + Offline Cache & Local Speech */}
        <div className="surface-alt rounded-2xl p-4 space-y-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <audio
              ref={audioRef}
              src={audioSrc || undefined}
              loop={repeatSurah}
              onTimeUpdate={(e) => setAudioProgress(e.currentTarget.currentTime)}
              onLoadedMetadata={(e) => setAudioDuration(e.currentTarget.duration || 0)}
              onEnded={() => {
                setIsPlaying(false);
                if (!repeatSurah && selectedSurah < 114) {
                  setSelectedSurah(selectedSurah + 1);
                }
              }}
            />

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Icon3D kind="sound" size={20} />
              <select
                value={settings.reciterId}
                onChange={(e) =>
                  updateSettings({ reciterId: e.target.value as typeof settings.reciterId })
                }
                className="rounded-lg border px-2.5 py-1.5 text-xs flex-1 md:flex-none"
                style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
              >
                {RECITERS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {getText(lang, r.name)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedSurah((s) => Math.max(1, s - 1))}
                className="p-2 rounded-xl border min-h-[38px] min-w-[38px] flex items-center justify-center hover:opacity-85"
                style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-surface)' }}
                aria-label={t.common.previous}
              >
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={togglePlay}
                className="px-4 py-2 rounded-xl flex items-center gap-1.5 text-xs font-semibold min-h-[38px] btn-primary"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{currentSurahName}</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedSurah((s) => Math.min(114, s + 1))}
                className="p-2 rounded-xl border min-h-[38px] min-w-[38px] flex items-center justify-center hover:opacity-85"
                style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-surface)' }}
                aria-label={t.common.next}
              >
                <SkipForward className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setRepeatSurah((r) => !r)}
                className="p-2 rounded-xl border min-h-[38px] min-w-[38px] flex items-center justify-center"
                style={{
                  borderColor: repeatSurah ? 'var(--accent-primary)' : 'var(--border-subtle)',
                  backgroundColor: repeatSurah ? 'var(--accent-soft)' : 'var(--bg-surface)',
                  color: repeatSurah ? 'var(--accent-primary)' : 'var(--text-secondary)',
                }}
                title={t.quranModule.repeat}
              >
                <Repeat className="w-4 h-4" />
              </button>
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="rounded-xl px-2.5 py-1.5 text-xs font-mono-tabular modern-input"
              >
                <option value={0.75}>0.75x</option>
                <option value={1}>1.0x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
              </select>
            </div>

            <div className="w-full md:w-44 flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={audioDuration || 100}
                value={audioProgress}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (audioRef.current) audioRef.current.currentTime = v;
                  setAudioProgress(v);
                }}
                className="w-full accent-emerald-700"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t text-xs" style={{ borderColor: 'var(--border-subtle)' }}>
            <button
              type="button"
              onClick={cacheCurrentSurahAudio}
              disabled={cachingAudio || audioCached}
              className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-medium"
              style={{
                borderColor: audioCached ? 'var(--accent-primary)' : 'var(--border-subtle)',
                backgroundColor: audioCached ? 'var(--accent-soft)' : 'var(--bg-surface)',
                color: audioCached ? 'var(--accent-primary)' : 'var(--text-primary)',
              }}
            >
              <Icon3D kind={audioCached ? 'offline' : 'download'} size={15} />
              <span>
                {cachingAudio
                  ? t.common.loading
                  : audioCached
                  ? t.quranModule.audioCachedBadge
                  : t.quranModule.cacheAudioBtn}
              </span>
            </button>

            {cachedSurah && typeof window !== 'undefined' && 'speechSynthesis' in window && (
              <button
                type="button"
                onClick={toggleOfflineSpeech}
                className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-medium"
                style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-surface)' }}
              >
                <Icon3D kind="sound" size={15} />
                <span>
                  {speechPlaying ? t.quranModule.offlineSpeechStop : t.quranModule.offlineSpeechPlay}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Split: 114 Surah Sidebar + Reader Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Surah & Juz Navigator */}
        <aside className="lg:col-span-4 surface-card rounded-3xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute top-3 start-3 opacity-50" />
              <input
                type="text"
                value={surahSearch}
                onChange={(e) => setSurahSearch(e.target.value)}
                placeholder={t.common.search}
                className="w-full rounded-xl ps-9 pe-3 py-2 text-xs modern-input"
              />
            </div>
            <select
              value={juzFilter}
              onChange={(e) => setJuzFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="rounded-xl px-2.5 py-2 text-xs modern-input"
            >
              <option value="all">{t.common.all} (30)</option>
              {Array.from({ length: 30 }, (_, i) => i + 1).map((j) => (
                <option key={j} value={j}>
                  {t.quranModule.juzWord} {j}
                </option>
              ))}
            </select>
          </div>

          <div className="max-h-[540px] overflow-y-auto divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {filteredSurahs.map((s) => {
              const active = s.number === selectedSurah;
              const isOffline = downloadedNumbers.has(s.number);
              const surahTitle = getSurahTitle(s, lang);
              return (
                <button
                  key={s.number}
                  type="button"
                  onClick={() => setSelectedSurah(s.number)}
                  className="w-full py-2.5 px-3 flex items-center justify-between text-start rounded-lg transition-colors"
                  style={{
                    backgroundColor: active ? 'var(--accent-soft)' : 'transparent',
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono-tabular font-semibold shrink-0"
                      style={{
                        backgroundColor: active ? 'var(--accent-primary)' : 'var(--bg-surface-alt)',
                        color: active ? '#ffffff' : 'var(--text-primary)',
                      }}
                    >
                      {s.number}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate">{surahTitle}</div>
                      <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        {s.revelationType === 'Meccan' ? t.quranModule.meccan : t.quranModule.medinan} ·{' '}
                        {s.ayahCount} {t.quranModule.ayahs} ·{' '}
                        {isOffline ? t.common.offlineReady : t.onlineStatus}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-semibold shrink-0 ${lang === 'en' ? 'font-mono-tabular' : 'font-arabic text-base'}`}
                    style={{ color: 'var(--accent-primary)' }}
                  >
                    {lang === 'en' ? `${t.quranModule.juzWord} ${s.juzStart}` : s.arabicName}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Surah Reading & Study Area */}
        <div
          className={`lg:col-span-8 rounded-3xl border p-5 sm:p-8 space-y-6 transition-colors ${
            settings.quranNightMode ? 'bg-zinc-950 text-zinc-100 border-zinc-800 shadow-2xl' : 'surface-elevated'
          }`}
        >
          {/* Reader Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <div>
              <h3 className={`text-2xl font-bold tracking-tight ${lang === 'en' ? '' : 'font-arabic'}`}>
                {t.quranModule.surahWord} {currentSurahName}
              </h3>
              <p className="text-xs opacity-75 font-mono-tabular mt-0.5">
                {currentMeta.revelationType === 'Meccan' ? t.quranModule.meccan : t.quranModule.medinan} ·{' '}
                {currentMeta.ayahCount} {t.quranModule.ayahs} · {t.quranModule.juzWord} {currentMeta.juzStart}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex rounded-xl p-1 border surface-alt" style={{ borderColor: 'var(--border-subtle)' }}>
                <button
                  type="button"
                  onClick={() => updateSettings({ quranReadingMode: 'reading' })}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    settings.quranReadingMode === 'reading' ? 'btn-primary' : ''
                  }`}
                >
                  {t.quranModule.readingMode}
                </button>
                <button
                  type="button"
                  onClick={() => updateSettings({ quranReadingMode: 'study' })}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    settings.quranReadingMode === 'study' ? 'btn-primary' : ''
                  }`}
                >
                  {t.quranModule.studyMode}
                </button>
              </div>

              <button
                type="button"
                onClick={() => updateSettings({ quranNightMode: !settings.quranNightMode })}
                className="p-2 rounded-xl border min-h-[38px] min-w-[38px] flex items-center justify-center hover:opacity-85"
                style={{ borderColor: 'var(--border-subtle)' }}
                title={t.quranModule.nightMode}
              >
                {settings.quranNightMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => fetchAndCacheSurah(selectedSurah, true)}
                className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold min-h-[38px] hover:opacity-85"
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                <Icon3D kind={downloadedNumbers.has(selectedSurah) ? 'offline' : 'download'} size={15} />
                <span>{downloadedNumbers.has(selectedSurah) ? t.common.downloaded : t.quranModule.downloadOffline}</span>
              </button>
            </div>
          </div>

          {/* Search inside Surah & Tafsir Selector */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute top-2.5 start-3 opacity-50" />
              <input
                type="text"
                value={ayahSearch}
                onChange={(e) => setAyahSearch(e.target.value)}
                placeholder={t.quranModule.searchAyahs}
                className="w-full rounded-xl ps-9 pe-3 py-2 text-xs modern-input"
              />
            </div>

            {settings.quranReadingMode === 'study' && (
              <select
                value={settings.tafsirBook}
                onChange={(e) => updateSettings({ tafsirBook: e.target.value as typeof settings.tafsirBook })}
                className="rounded-xl px-3 py-2 text-xs modern-input"
              >
                <option value="muyassar">{t.quranModule.tafsirMuyassar}</option>
                <option value="ibn-kathir">{t.quranModule.tafsirIbnKathir}</option>
                <option value="jalalayn">{t.quranModule.tafsirJalalayn}</option>
              </select>
            )}
          </div>

          {/* Ornamental Bismillah Banner */}
          {selectedSurah !== 1 && selectedSurah !== 9 && (
            <div
              className="text-center font-arabic text-2xl sm:text-3xl py-4 rounded-2xl border"
              style={{
                backgroundColor: settings.quranNightMode ? 'rgba(255,255,255,0.04)' : 'var(--accent-soft)',
                borderColor: 'var(--border-subtle)',
                color: settings.quranNightMode ? '#e5bd67' : 'var(--accent-primary)',
              }}
              dir="rtl"
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
          )}

          {loadingSurah && (
            <div className="py-12 text-center text-sm opacity-75">{t.common.loading}</div>
          )}

          {fetchError && !cachedSurah && (
            <div className="p-6 rounded-xl border text-center space-y-2" style={{ borderColor: 'var(--border-subtle)' }}>
              <p className="text-sm">{fetchError}</p>
              <button
                type="button"
                onClick={() => fetchAndCacheSurah(selectedSurah, true)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white"
                style={{ backgroundColor: 'var(--accent-primary)' }}
              >
                {t.common.download}
              </button>
            </div>
          )}

          {/* Ayah List */}
          {!loadingSurah && cachedSurah && (
            <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
              {displayedAyahs.map((ayah) => {
                const refId = `${selectedSurah}:${ayah.numberInSurah}`;
                const isBookmarked = bookmarks.some((b) => b.id === `bm-q-${refId}`);
                const isFav = favorites.some((f) => f.id === `fav-q-${refId}`);
                const translationText =
                  (lang === 'ps' ? ayah.ps : lang === 'fa' ? ayah.fa : lang === 'en' ? ayah.en : '') ||
                  ayah.en ||
                  ayah.ps;

                return (
                  <article key={ayah.numberInSurah} className="py-5 space-y-3">
                    <div className="flex items-center justify-between gap-2 text-xs opacity-70">
                      <span className="font-mono-tabular font-semibold">
                        {currentSurahName} · {selectedSurah}:{ayah.numberInSurah} · {t.quranModule.juzWord} {ayah.juz}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => markAyahRead(ayah.numberInSurah)}
                          className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10"
                          title={t.common.completed}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            toggleBookmark({
                              id: `bm-q-${refId}`,
                              type: 'quran',
                              refId,
                              title: `${currentSurahName} (${refId})`,
                              subtitle: ayah.arabic.slice(0, 60),
                            })
                          }
                          className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10"
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            toggleFavorite({
                              id: `fav-q-${refId}`,
                              type: 'quran',
                              refId,
                              title: `${currentSurahName} (${refId})`,
                            })
                          }
                          className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopy(ayah)}
                          className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10"
                        >
                          {copiedId === refId ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            downloadShareableCard({
                              arabicText: ayah.arabic,
                              translation: translationText,
                              reference: `${currentSurahName} · ${refId}`,
                              categoryLabel: t.nav.quran,
                              filename: `eyad-ayah-${selectedSurah}-${ayah.numberInSurah}`,
                              brandFooter: `${t.appName} – ${t.appSubtitle}`,
                            })
                          }
                          className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10"
                          title={t.quranModule.shareCard}
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="font-arabic text-2xl sm:text-3xl leading-[2.3] text-right" dir="rtl">
                      {ayah.arabic}{' '}
                      <span className="inline-block text-base opacity-70 font-sans">﴿{ayah.numberInSurah}﴾</span>
                    </p>

                    {settings.quranReadingMode === 'study' && (
                      <div className="space-y-2 pt-1">
                        {translationText && (
                          <p className="text-sm leading-relaxed opacity-90">{translationText}</p>
                        )}
                        <div className="surface-alt rounded-xl p-3.5 space-y-1.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold" style={{ color: 'var(--accent-primary)' }}>
                              {tafsirBookLabel}
                            </span>
                            <button
                              type="button"
                              onClick={() => setSelectedTafsirAyah(ayah)}
                              className="underline font-medium"
                            >
                              {t.common.source}
                            </button>
                          </div>
                          <p className="leading-relaxed opacity-85">
                            {settings.tafsirBook === 'jalalayn' && ayah.tafsirJalalayn
                              ? ayah.tafsirJalalayn
                              : lang === 'ps' && ayah.tafsirPs
                              ? ayah.tafsirPs
                              : ayah.tafsirAr}
                          </p>
                          {ayah.lexicalNote && (
                            <p className="opacity-75">
                              <strong>{t.quranModule.lexicalMeaning}:</strong> {ayah.lexicalNote}
                            </p>
                          )}
                          {ayah.asbabNuzul && (
                            <p className="opacity-75">
                              <strong>{t.quranModule.asbabNuzul}:</strong> {ayah.asbabNuzul}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Detailed Tafsir Source Modal */}
      {selectedTafsirAyah && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-4">
          <div className="surface-elevated w-full max-w-lg rounded-3xl p-6 space-y-4">
            <h4 className="text-lg font-bold">
              {currentSurahName} · {selectedSurah}:{selectedTafsirAyah.numberInSurah}
            </h4>
            <p className="font-arabic text-xl leading-loose" dir="rtl">
              {selectedTafsirAyah.arabic}
            </p>
            <div className="text-sm space-y-2" style={{ color: 'var(--text-secondary)' }}>
              <p>
                <strong>{t.quranModule.tafsir}:</strong> {selectedTafsirAyah.tafsirAr}
              </p>
              {selectedTafsirAyah.tafsirPs && <p>{selectedTafsirAyah.tafsirPs}</p>}
              <p>
                <strong>{t.common.source}:</strong>{' '}
                {selectedTafsirAyah.tafsirSource || t.quranModule.defaultTafsirSource}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedTafsirAyah(null)}
              className="w-full py-2.5 rounded-xl text-sm font-semibold btn-primary"
            >
              {t.common.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
