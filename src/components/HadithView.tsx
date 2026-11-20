import React, { useEffect, useMemo, useState } from 'react';
import {
  Bookmark,
  Check,
  Copy,
  Heart,
  Image as ImageIcon,
  Search,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HADITH_COLLECTIONS } from '../data/hadithData';
import { getDB } from '../db/database';
import { getLocalizedContent, getText } from '../i18n/translations';
import type { HadithCollectionId, HadithItem } from '../types';
import { matchesNormalized } from '../utils/searchNormalize';
import { downloadShareableCard } from '../utils/shareCard';
import { Icon3D } from './Icons3D';

export const HadithView: React.FC = () => {
  const { settings, t, bookmarks, toggleBookmark, favorites, toggleFavorite } = useApp();
  const lang = settings.language;

  const [hadiths, setHadiths] = useState<HadithItem[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<HadithCollectionId | 'all'>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const db = await getDB();
      setHadiths(await db.getAll('hadiths'));
    })();
  }, []);

  const topics = useMemo(() => {
    const set = new Set<string>();
    hadiths.forEach((h) => set.add(h.topic));
    return Array.from(set);
  }, [hadiths]);

  const hadithOfDay = useMemo(() => {
    if (hadiths.length === 0) return null;
    return hadiths[new Date().getDate() % hadiths.length];
  }, [hadiths]);

  const filtered = useMemo(() => {
    const q = query.trim();
    return hadiths.filter((h) => {
      const colOk = selectedCollection === 'all' || h.collectionId === selectedCollection;
      const topOk = selectedTopic === 'all' || h.topic === selectedTopic;
      const txtOk =
        !q ||
        matchesNormalized(h.arabic, q) ||
        matchesNormalized(h.ps, q) ||
        matchesNormalized(h.fa, q) ||
        matchesNormalized(h.en, q) ||
        matchesNormalized(h.sourceRef, q) ||
        matchesNormalized(getText(lang, h.commentary), q);
      return colOk && topOk && txtOk;
    });
  }, [hadiths, lang, query, selectedCollection, selectedTopic]);

  const getGradeLabel = (grade: string) => t.hadithModule.gradeLabels[grade] || grade;
  const getTopicLabel = (tp: string) => t.hadithModule.topicLabels[tp] || tp;

  const copyHadith = (h: HadithItem) => {
    navigator.clipboard.writeText(
      `${h.arabic}\n\n${getLocalizedContent(lang, h)}\n\n(${h.sourceRef} — ${getGradeLabel(h.grade)})`
    );
    setCopiedId(h.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Header & Authenticity Commitment */}
      <div className="surface-elevated rounded-3xl p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Icon3D kind="hadith" size={40} className="shrink-0" />
            <div>
              <h2 className="text-xl font-bold">{t.nav.hadith}</h2>
              <p className="text-xs mt-1 flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                <Icon3D kind="shield" size={16} className="shrink-0" />
                <span>{t.hadithModule.authenticityNotice}</span>
              </p>
            </div>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute top-3 start-3 opacity-50" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.common.search}
              className="w-full rounded-xl ps-9 pe-4 py-2.5 text-sm modern-input"
            />
          </div>
        </div>

        {/* 10 Collections Tabs */}
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedCollection('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all min-h-[36px] ${
              selectedCollection === 'all' ? 'btn-primary border-transparent' : ''
            }`}
            style={
              selectedCollection === 'all'
                ? undefined
                : {
                    backgroundColor: 'var(--bg-surface-alt)',
                    color: 'var(--text-primary)',
                    borderColor: 'var(--border-subtle)',
                  }
            }
          >
            {t.common.all} ({hadiths.length})
          </button>
          {HADITH_COLLECTIONS.map((c) => {
            const active = selectedCollection === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCollection(c.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all min-h-[36px] ${
                  active ? 'btn-primary border-transparent' : ''
                }`}
                style={
                  active
                    ? undefined
                    : {
                        backgroundColor: 'var(--bg-surface-alt)',
                        color: 'var(--text-primary)',
                        borderColor: 'var(--border-subtle)',
                      }
                }
              >
                {getText(lang, c.name)}
              </button>
            );
          })}
        </div>

        {/* Topic filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-medium shrink-0" style={{ color: 'var(--text-muted)' }}>
            {t.hadithModule.topics}:
          </span>
          <button
            type="button"
            onClick={() => setSelectedTopic('all')}
            className="text-xs px-2.5 py-1 rounded-md"
            style={{
              backgroundColor: selectedTopic === 'all' ? 'var(--accent-soft)' : 'transparent',
              color: selectedTopic === 'all' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            }}
          >
            {t.common.all}
          </button>
          {topics.map((tp) => (
            <button
              key={tp}
              type="button"
              onClick={() => setSelectedTopic(tp)}
              className="text-xs px-2.5 py-1 rounded-md whitespace-nowrap"
              style={{
                backgroundColor: selectedTopic === tp ? 'var(--accent-soft)' : 'transparent',
                color: selectedTopic === tp ? 'var(--accent-primary)' : 'var(--text-secondary)',
              }}
            >
              {getTopicLabel(tp)}
            </button>
          ))}
        </div>
      </div>

      {/* Hadith of the Day Banner */}
      {hadithOfDay && selectedCollection === 'all' && !query && (
        <div className="surface-alt rounded-3xl p-6 space-y-2.5 border" style={{ borderColor: 'var(--border-strong)' }}>
          <div className="flex items-center justify-between text-xs" style={{ color: 'var(--accent-primary)' }}>
            <span className="font-bold">{t.hadithModule.hadithOfDay}</span>
            <span className="font-mono-tabular">{hadithOfDay.sourceRef} · {getGradeLabel(hadithOfDay.grade)}</span>
          </div>
          <p className="font-arabic text-xl sm:text-2xl leading-loose">{hadithOfDay.arabic}</p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{getLocalizedContent(lang, hadithOfDay)}</p>
        </div>
      )}

      {/* Hadith Cards */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="surface-card rounded-3xl p-10 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            {t.common.empty}
          </div>
        ) : (
          filtered.map((h) => {
            const isBm = bookmarks.some((b) => b.id === `bm-h-${h.id}`);
            const isFav = favorites.some((f) => f.id === `fav-h-${h.id}`);
            return (
              <article key={h.id} className="surface-card rounded-3xl p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <div>
                    <span className="font-semibold" style={{ color: 'var(--accent-primary)' }}>
                      {getText(lang, h.bookName)}
                    </span>
                    <span className="mx-1.5">·</span>
                    <span>{getText(lang, h.chapterName)}</span>
                    <span className="mx-1.5">·</span>
                    <span>{t.hadithModule.hadithNum} {h.hadithNumber}</span>
                    <span className="mx-1.5">·</span>
                    <span>{getGradeLabel(h.grade)}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        toggleBookmark({
                          id: `bm-h-${h.id}`,
                          type: 'hadith',
                          refId: h.id,
                          title: `${getText(lang, h.bookName)} (${h.hadithNumber})`,
                          subtitle: h.arabic.slice(0, 60),
                        })
                      }
                      className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
                    >
                      <Bookmark className={`w-4 h-4 ${isBm ? 'fill-amber-500 text-amber-500' : ''}`} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        toggleFavorite({
                          id: `fav-h-${h.id}`,
                          type: 'hadith',
                          refId: h.id,
                          title: `${getText(lang, h.bookName)} (${h.hadithNumber})`,
                        })
                      }
                      className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                    <button
                      type="button"
                      onClick={() => copyHadith(h)}
                      className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
                    >
                      {copiedId === h.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        downloadShareableCard({
                          arabicText: h.arabic,
                          translation: getLocalizedContent(lang, h),
                          reference: `${h.sourceRef} · ${getGradeLabel(h.grade)}`,
                          categoryLabel: getText(lang, h.bookName),
                          filename: `eyad-hadith-${h.id}`,
                          brandFooter: `${t.appName} — ${t.appSubtitle}`,
                        })
                      }
                      className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
                      title={t.common.exportCard}
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="font-arabic text-2xl leading-loose" dir="rtl">
                  {h.arabic}
                </p>

                <div className="space-y-2 text-sm">
                  <p style={{ color: 'var(--text-primary)' }}>{getLocalizedContent(lang, h)}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <strong>{t.hadithModule.narrator}:</strong> {getText(lang, h.narrator)} ·{' '}
                    <strong>{t.common.source}:</strong> {h.sourceRef}
                  </p>
                </div>

                <div className="surface-alt rounded-xl p-3.5 text-xs space-y-1" style={{ color: 'var(--text-secondary)' }}>
                  <div className="font-semibold" style={{ color: 'var(--accent-primary)' }}>
                    {t.hadithModule.commentary}
                  </div>
                  <p>{getText(lang, h.commentary)}</p>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
