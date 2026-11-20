import React, { useEffect, useMemo, useState } from 'react';
import { History, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QURAN_DICTIONARY } from '../data/dictionaryData';
import { getDB } from '../db/database';
import { getLocalizedContent } from '../i18n/translations';
import type { QuranWordEntry } from '../types';
import { matchesNormalized } from '../utils/searchNormalize';
import { Icon3D } from './Icons3D';

export const DictionaryView: React.FC = () => {
  const { settings, t } = useApp();
  const lang = settings.language;
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<QuranWordEntry>(QURAN_DICTIONARY[0]);
  const [historyIds, setHistoryIds] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const db = await getDB();
      const rows = await db.getAll('dictionary_history');
      const sorted = rows.sort((a, b) => b.viewedAt - a.viewedAt);
      setHistoryIds(sorted.map((r) => r.wordId));
    })();
  }, []);

  const wordOfDay = QURAN_DICTIONARY[new Date().getDate() % QURAN_DICTIONARY.length];

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return QURAN_DICTIONARY;
    return QURAN_DICTIONARY.filter(
      (w) =>
        matchesNormalized(w.arabic, q) ||
        matchesNormalized(w.ar || '', q) ||
        matchesNormalized(w.root, q) ||
        matchesNormalized(w.ps, q) ||
        matchesNormalized(w.fa, q) ||
        matchesNormalized(w.en, q)
    );
  }, [query]);

  const selectWord = async (word: QuranWordEntry) => {
    setSelected(word);
    const db = await getDB();
    await db.put('dictionary_history', {
      id: `dh-${word.id}`,
      wordId: word.id,
      viewedAt: Date.now(),
    });
    setHistoryIds((prev) => [word.id, ...prev.filter((id) => id !== word.id)].slice(0, 12));
  };

  return (
    <div className="space-y-6">
      <div className="surface-elevated rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Icon3D kind="dictionary" size={44} className="shrink-0" />
          <div>
            <h2 className="text-xl font-bold">{t.nav.dictionary}</h2>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              {wordOfDay.arabic} — {getLocalizedContent(lang, wordOfDay)} ({wordOfDay.root}) ·{' '}
              <span className="font-mono-tabular">{QURAN_DICTIONARY.length}</span>
            </p>
          </div>
        </div>
        <div className="relative w-full sm:w-80">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 surface-card rounded-3xl p-4 divide-y max-h-[540px] overflow-y-auto" style={{ borderColor: 'var(--border-subtle)' }}>
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
              {t.common.empty}
            </div>
          ) : (
            filtered.map((w) => {
              const active = w.id === selected.id;
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => selectWord(w)}
                  className="w-full py-3 px-3 flex items-center justify-between text-start rounded-xl transition-colors"
                  style={{ backgroundColor: active ? 'var(--accent-soft)' : 'transparent' }}
                >
                  <div>
                    <div className="font-arabic text-xl font-bold" style={{ color: 'var(--accent-primary)' }}>
                      {w.arabic}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                      {getLocalizedContent(lang, w)}
                    </div>
                  </div>
                  <span className="text-xs font-mono-tabular" style={{ color: 'var(--text-muted)' }}>
                    {w.frequency}×
                  </span>
                </button>
              );
            })
          )}
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="surface-card rounded-3xl p-6 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-arabic text-4xl font-bold" style={{ color: 'var(--accent-primary)' }}>
                  {selected.arabic}
                </div>
                <div className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                  {selected.root} · {selected.morphology} · {selected.frequency}×
                </div>
              </div>
              <Icon3D kind="dictionary" size={30} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selected.ar && (
                <div className="surface-alt rounded-xl p-3.5">
                  <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>{t.languageNames.ar}</div>
                  <div className="text-sm font-arabic">{selected.ar}</div>
                </div>
              )}
              <div className="surface-alt rounded-xl p-3.5">
                <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>{t.languageNames.ps}</div>
                <div className="text-sm">{selected.ps}</div>
              </div>
              <div className="surface-alt rounded-xl p-3.5">
                <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>{t.languageNames.fa}</div>
                <div className="text-sm">{selected.fa}</div>
              </div>
              <div className="surface-alt rounded-xl p-3.5">
                <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>{t.languageNames.en}</div>
                <div className="text-sm">{selected.en}</div>
              </div>
            </div>

            <div className="surface-alt rounded-xl p-4 space-y-1">
              <div className="text-xs font-semibold" style={{ color: 'var(--accent-primary)' }}>
                {selected.relatedAyahRef}
              </div>
              <p className="font-arabic text-xl leading-loose">{selected.relatedAyahArabic}</p>
            </div>
          </div>

          {historyIds.length > 0 && (
            <div className="surface-card rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <History className="w-4 h-4" />
                <span>{t.dictionaryModule.learningHistory}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {historyIds.map((id) => {
                  const word = QURAN_DICTIONARY.find((x) => x.id === id);
                  if (!word) return null;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => selectWord(word)}
                      className="surface-alt rounded-lg px-3 py-1.5 text-sm font-arabic"
                    >
                      {word.arabic}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
