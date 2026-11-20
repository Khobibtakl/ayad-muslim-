import React, { useEffect, useMemo, useState } from 'react';
import { Bell, CheckCircle2, RotateCcw, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ADHKAR_CATEGORIES } from '../data/adhkarData';
import { getDB, todayKey } from '../db/database';
import { getLocalizedContent, getText } from '../i18n/translations';
import type { AdhkarCategoryId, AdhkarProgressRecord, DhikrItem } from '../types';
import { matchesNormalized } from '../utils/searchNormalize';
import { Icon3D } from './Icons3D';

export const AdhkarView: React.FC = () => {
  const { settings, t, pushNotification } = useApp();
  const lang = settings.language;

  const [items, setItems] = useState<DhikrItem[]>([]);
  const [selectedCat, setSelectedCat] = useState<AdhkarCategoryId>('morning');
  const [query, setQuery] = useState('');
  const [progress, setProgress] = useState<AdhkarProgressRecord>({
    date: todayKey(),
    counts: {},
    completedIds: [],
  });
  const [history, setHistory] = useState<AdhkarProgressRecord[]>([]);

  useEffect(() => {
    (async () => {
      const db = await getDB();
      const [allItems, todayProg, allHistory] = await Promise.all([
        db.getAll('adhkar_items'),
        db.get('adhkar_progress', todayKey()),
        db.getAll('adhkar_progress'),
      ]);
      setItems(allItems);
      if (todayProg) setProgress(todayProg);
      setHistory(allHistory.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7));
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return items.filter((d) => d.category === selectedCat);
    return items.filter(
      (d) =>
        matchesNormalized(d.arabic, q) ||
        matchesNormalized(getLocalizedContent(lang, d), q) ||
        matchesNormalized(getText(lang, d.virtue), q) ||
        matchesNormalized(d.source, q)
    );
  }, [items, lang, query, selectedCat]);

  const incrementDhikr = async (item: DhikrItem) => {
    const current = progress.counts[item.id] || 0;
    const nextCount = Math.min(item.repeatCount, current + 1);
    const nextCounts = { ...progress.counts, [item.id]: nextCount };
    const nextCompleted =
      nextCount >= item.repeatCount && !progress.completedIds.includes(item.id)
        ? [...progress.completedIds, item.id]
        : progress.completedIds;

    const updated: AdhkarProgressRecord = {
      date: todayKey(),
      counts: nextCounts,
      completedIds: nextCompleted,
    };
    setProgress(updated);
    const db = await getDB();
    await db.put('adhkar_progress', updated);
  };

  const resetDhikr = async (item: DhikrItem) => {
    const nextCounts = { ...progress.counts, [item.id]: 0 };
    const nextCompleted = progress.completedIds.filter((id) => id !== item.id);
    const updated: AdhkarProgressRecord = {
      date: todayKey(),
      counts: nextCounts,
      completedIds: nextCompleted,
    };
    setProgress(updated);
    const db = await getDB();
    await db.put('adhkar_progress', updated);
  };

  const completedInCat = filtered.filter((d) => progress.completedIds.includes(d.id)).length;
  const totalCompletedToday = progress.completedIds.length;

  return (
    <div className="space-y-6">
      <div className="surface-elevated rounded-3xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Icon3D kind="adhkar" size={40} className="shrink-0" />
            <div>
              <h2 className="text-xl font-bold">{t.nav.adhkar}</h2>
              <p className="text-xs mt-1 font-mono-tabular" style={{ color: 'var(--text-secondary)' }}>
                {t.common.today}: {totalCompletedToday}/{items.length} {t.common.completed} ·{' '}
                {getText(lang, ADHKAR_CATEGORIES.find((c) => c.id === selectedCat)!.title)}: {completedInCat}/{filtered.length}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute top-3 start-3 opacity-50" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.common.search}
                className="w-full rounded-xl ps-9 pe-3 py-2 text-xs modern-input"
              />
            </div>
            <button
              type="button"
              onClick={() =>
                pushNotification(
                  t.nav.adhkar,
                  getText(lang, ADHKAR_CATEGORIES.find((c) => c.id === selectedCat)!.title),
                  'adhkar',
                  'adhkar'
                )
              }
              className="inline-flex items-center gap-1.5 rounded-xl surface-alt px-3.5 py-2 text-xs font-semibold min-h-[40px] hover:opacity-90"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{t.nav.notifications}</span>
            </button>
          </div>
        </div>

        {/* 15 Adhkar Categories */}
        <div className="flex flex-wrap gap-1.5">
          {ADHKAR_CATEGORIES.map((cat) => {
            const active = cat.id === selectedCat;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCat(cat.id)}
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
                {getText(lang, cat.title)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dhikr Cards */}
      <div className="space-y-4">
        {filtered.map((d) => {
          const count = progress.counts[d.id] || 0;
          const isDone = count >= d.repeatCount;
          return (
            <div key={d.id} className="surface-card rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                <span>{d.source}</span>
                <span className="font-mono-tabular font-semibold">
                  {count} / {d.repeatCount}
                </span>
              </div>

              <p className="font-arabic text-2xl leading-loose" dir="rtl">
                {d.arabic}
              </p>

              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {getLocalizedContent(lang, d)}
              </p>

              <p className="text-xs surface-alt rounded-xl p-3" style={{ color: 'var(--text-secondary)' }}>
                {getText(lang, d.virtue)}
              </p>

              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => incrementDhikr(d)}
                  className={`flex-1 min-h-[46px] rounded-xl px-4 py-2.5 text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                    isDone ? '' : 'btn-primary'
                  }`}
                  style={isDone ? { backgroundColor: '#15803d' } : undefined}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {isDone
                      ? t.common.completed
                      : `${t.common.confirm} (${count}/${d.repeatCount})`}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => resetDhikr(d)}
                  className="min-h-[46px] min-w-[46px] rounded-xl surface-alt flex items-center justify-center hover:opacity-85"
                  title={t.common.reset}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Adhkar History */}
      {history.length > 0 && (
        <div className="surface-card rounded-3xl p-5 sm:p-6 space-y-3">
          <h3 className="text-sm font-bold">{t.dashboard.adhkarProgress}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {history.map((h) => (
              <div key={h.date} className="surface-alt rounded-2xl p-3.5 text-xs">
                <div className="font-mono-tabular font-semibold">{h.date}</div>
                <div className="mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {h.completedIds.length} {t.common.completed}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
