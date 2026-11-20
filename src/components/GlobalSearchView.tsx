import React, { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QURAN_DICTIONARY } from '../data/dictionaryData';
import { getSurahTitle, SURAH_META } from '../data/surahMeta';
import { getDB } from '../db/database';
import { getLocalizedContent, getText } from '../i18n/translations';
import type {
  CachedSurah,
  DhikrItem,
  HadithItem,
  LibraryBook,
  ModuleId,
  PersonalDua,
  ScholarQuote,
  TaskItem,
} from '../types';
import { matchesNormalized } from '../utils/searchNormalize';
import { Icon3D } from './Icons3D';

export const GlobalSearchView: React.FC = () => {
  const { settings, t, setActiveModule } = useApp();
  const lang = settings.language;
  const [query, setQuery] = useState('');

  const [cachedSurahs, setCachedSurahs] = useState<CachedSurah[]>([]);
  const [hadiths, setHadiths] = useState<HadithItem[]>([]);
  const [adhkar, setAdhkar] = useState<DhikrItem[]>([]);
  const [duas, setDuas] = useState<PersonalDua[]>([]);
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [quotes, setQuotes] = useState<ScholarQuote[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  useEffect(() => {
    (async () => {
      const db = await getDB();
      const [qs, hs, ads, ds, bks, sqs, tks] = await Promise.all([
        db.getAll('quran_surahs'),
        db.getAll('hadiths'),
        db.getAll('adhkar_items'),
        db.getAll('duas'),
        db.getAll('library_books'),
        db.getAll('quotes'),
        db.getAll('tasks'),
      ]);
      setCachedSurahs(qs);
      setHadiths(hs);
      setAdhkar(ads);
      setDuas(ds);
      setBooks(bks);
      setQuotes(sqs);
      setTasks(tks);
    })();
  }, []);

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return [];

    const groups: Array<{ category: string; module: ModuleId; items: Array<{ title: string; subtitle: string }> }> = [];

    const matchedSurahs = SURAH_META.filter(
      (s) =>
        matchesNormalized(s.arabicName, q) ||
        matchesNormalized(s.englishName, q) ||
        matchesNormalized(s.pashtoName, q) ||
        matchesNormalized(s.persianName, q)
    ).slice(0, 6);
    if (matchedSurahs.length > 0) {
      groups.push({
        category: t.quranModule.surahs,
        module: 'quran',
        items: matchedSurahs.map((s) => ({
          title: `${s.number}. ${getSurahTitle(s, lang)}`,
          subtitle: `${s.ayahCount} ${t.quranModule.ayahs}`,
        })),
      });
    }

    const matchedAyahs: Array<{ title: string; subtitle: string }> = [];
    for (const cs of cachedSurahs) {
      const meta = SURAH_META[cs.number - 1];
      for (const a of cs.ayahs) {
        if (
          matchesNormalized(a.arabic, q) ||
          matchesNormalized(a.ps, q) ||
          matchesNormalized(a.fa, q) ||
          matchesNormalized(a.en, q)
        ) {
          matchedAyahs.push({
            title: `${meta ? getSurahTitle(meta, lang) : cs.number} (${cs.number}:${a.numberInSurah})`,
            subtitle: a.arabic.slice(0, 90),
          });
        }
        if (matchedAyahs.length >= 6) break;
      }
      if (matchedAyahs.length >= 6) break;
    }
    if (matchedAyahs.length > 0) {
      groups.push({ category: t.nav.quran, module: 'quran', items: matchedAyahs });
    }

    const matchedWords = QURAN_DICTIONARY.filter(
      (w) =>
        matchesNormalized(w.arabic, q) ||
        matchesNormalized(getLocalizedContent(lang, w), q) ||
        matchesNormalized(w.root, q)
    );
    if (matchedWords.length > 0) {
      groups.push({
        category: t.nav.dictionary,
        module: 'dictionary',
        items: matchedWords.map((w) => ({
          title: `${w.arabic} (${w.root})`,
          subtitle: getLocalizedContent(lang, w),
        })),
      });
    }

    const matchedHadiths = hadiths.filter(
      (h) =>
        matchesNormalized(h.arabic, q) ||
        matchesNormalized(getLocalizedContent(lang, h), q) ||
        matchesNormalized(h.sourceRef, q)
    );
    if (matchedHadiths.length > 0) {
      groups.push({
        category: t.nav.hadith,
        module: 'hadith',
        items: matchedHadiths.map((h) => ({
          title: `${h.sourceRef} · ${t.hadithModule.gradeLabels[h.grade] || h.grade}`,
          subtitle: getLocalizedContent(lang, h).slice(0, 100),
        })),
      });
    }

    const matchedAdhkar = adhkar.filter(
      (d) => matchesNormalized(d.arabic, q) || matchesNormalized(getLocalizedContent(lang, d), q)
    );
    if (matchedAdhkar.length > 0) {
      groups.push({
        category: t.nav.adhkar,
        module: 'adhkar',
        items: matchedAdhkar.map((d) => ({
          title: d.source,
          subtitle: getLocalizedContent(lang, d).slice(0, 100),
        })),
      });
    }

    const matchedDuas = duas.filter((d) => {
      const dTitle = d.localizedTitle?.[lang] || d.title;
      const dTrans = d.localizedTranslation?.[lang] || d.translation;
      return (
        matchesNormalized(dTitle, q) ||
        matchesNormalized(d.arabic, q) ||
        matchesNormalized(dTrans, q)
      );
    });
    if (matchedDuas.length > 0) {
      groups.push({
        category: t.nav.duas,
        module: 'duas',
        items: matchedDuas.map((d) => ({
          title: d.localizedTitle?.[lang] || d.title,
          subtitle: d.localizedTranslation?.[lang] || d.translation || d.arabic,
        })),
      });
    }

    const matchedBooks = books.filter(
      (b) =>
        matchesNormalized(getText(lang, b.title), q) ||
        matchesNormalized(getText(lang, b.author), q) ||
        b.sections.some((sec) => matchesNormalized(sec.content, q))
    );
    if (matchedBooks.length > 0) {
      groups.push({
        category: t.nav.library,
        module: 'library',
        items: matchedBooks.map((b) => ({ title: getText(lang, b.title), subtitle: getText(lang, b.author) })),
      });
    }

    const matchedQuotes = quotes.filter(
      (sq) =>
        matchesNormalized(sq.arabic, q) ||
        matchesNormalized(getLocalizedContent(lang, sq), q) ||
        matchesNormalized(getText(lang, sq.scholarName), q)
    );
    if (matchedQuotes.length > 0) {
      groups.push({
        category: t.nav.quotes,
        module: 'quotes',
        items: matchedQuotes.map((sq) => ({
          title: getText(lang, sq.scholarName),
          subtitle: getLocalizedContent(lang, sq),
        })),
      });
    }

    const matchedTasks = tasks.filter((tk) => {
      const tTitle = tk.localizedTitle?.[lang] || tk.title;
      const tDesc = tk.localizedDescription?.[lang] || tk.description;
      return matchesNormalized(tTitle, q) || matchesNormalized(tDesc, q);
    });
    if (matchedTasks.length > 0) {
      groups.push({
        category: t.nav.tasks,
        module: 'tasks',
        items: matchedTasks.map((tk) => ({
          title: tk.localizedTitle?.[lang] || tk.title,
          subtitle: `${tk.dueDate} · ${tk.status === 'completed' ? t.common.completed : t.common.pending}`,
        })),
      });
    }

    return groups;
  }, [adhkar, books, cachedSurahs, duas, hadiths, lang, query, quotes, t, tasks]);

  return (
    <div className="space-y-6">
      <div className="surface-elevated rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-3.5">
          <Icon3D kind="search" size={44} className="shrink-0" />
          <h2 className="text-xl font-bold">{t.nav.search}</h2>
        </div>
        <div className="relative">
          <Search className="w-5 h-5 absolute top-3.5 start-3.5 opacity-50" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.common.search}
            className="w-full rounded-xl ps-11 pe-4 py-3 text-sm modern-input"
          />
        </div>
      </div>

      {query.trim() && results.length === 0 && (
        <div className="surface-card rounded-3xl p-10 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
          {t.common.empty}
        </div>
      )}

      <div className="space-y-4">
        {results.map((grp) => (
          <div key={grp.category} className="surface-card rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon3D kind={grp.module} size={24} className="shrink-0" />
                <h3 className="text-sm font-bold" style={{ color: 'var(--accent-primary)' }}>
                  {grp.category} ({grp.items.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModule(grp.module)}
                className="text-xs underline"
              >
                {grp.category}
              </button>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
              {grp.items.map((it, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveModule(grp.module)}
                  className="w-full py-2.5 text-start hover:opacity-80"
                >
                  <div className="text-sm font-semibold">{it.title}</div>
                  <div className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                    {it.subtitle}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
