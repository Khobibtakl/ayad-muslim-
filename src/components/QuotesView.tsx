import React, { useEffect, useMemo, useState } from 'react';
import { Image as ImageIcon, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getDB } from '../db/database';
import { getLocalizedContent, getText } from '../i18n/translations';
import type { ScholarQuote } from '../types';
import { matchesNormalized } from '../utils/searchNormalize';
import { downloadShareableCard } from '../utils/shareCard';
import { Icon3D } from './Icons3D';

function formatCitationNumber(raw: string, normalizeAscii: boolean): string {
  const digitsOnly = raw.replace(/[^\d٠-٩]/g, '');
  if (!digitsOnly) return raw;
  if (!normalizeAscii) return digitsOnly;
  return digitsOnly.replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
}

export const QuotesView: React.FC = () => {
  const { settings, t } = useApp();
  const lang = settings.language;
  const [quotes, setQuotes] = useState<ScholarQuote[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    (async () => {
      const db = await getDB();
      setQuotes(await db.getAll('quotes'));
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return quotes;
    return quotes.filter(
      (item) =>
        matchesNormalized(item.arabic, q) ||
        matchesNormalized(getLocalizedContent(lang, item), q) ||
        matchesNormalized(getText(lang, item.scholarName), q) ||
        matchesNormalized(getText(lang, item.bookName), q)
    );
  }, [lang, query, quotes]);

  return (
    <div className="space-y-6">
      <div className="surface-elevated rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Icon3D kind="quotes" size={44} className="shrink-0" />
          <div>
            <h2 className="text-xl font-bold">{t.nav.quotes} ({quotes.length})</h2>
            <p className="text-xs mt-1 flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
              <Icon3D kind="shield" size={16} className="shrink-0" />
              <span>{t.quotesModule.authenticityBanner}</span>
            </p>
          </div>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute top-3 start-3 opacity-50" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.common.search}
            className="w-full rounded-xl ps-9 pe-4 py-2.5 text-xs modern-input"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="surface-card rounded-3xl p-10 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
          {t.common.empty}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((q) => {
            const volLabel = `${t.libraryModule.volumeShort} ${formatCitationNumber(q.volume, lang === 'en')}`;
            const pageLabel = `${t.libraryModule.pageShort} ${formatCitationNumber(q.page, lang === 'en')}`;
            return (
              <article key={q.id} className="surface-card interactive-tile rounded-3xl p-6 flex flex-col justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs gap-2" style={{ color: 'var(--accent-primary)' }}>
                    <span className="font-semibold">{getText(lang, q.scholarName)}</span>
                    <button
                      type="button"
                      onClick={() =>
                        downloadShareableCard({
                          arabicText: q.arabic,
                          translation: getLocalizedContent(lang, q),
                          reference: `${getText(lang, q.scholarName)} · ${getText(lang, q.bookName)} (${volLabel}, ${pageLabel})`,
                          categoryLabel: t.nav.quotes,
                          filename: `eyad-quote-${q.id}`,
                          brandFooter: `${t.appName} — ${t.appSubtitle}`,
                        })
                      }
                      className="inline-flex items-center gap-1 rounded-xl border px-2.5 py-1 text-xs shrink-0"
                      style={{ borderColor: 'var(--border-subtle)' }}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>{t.common.exportCard}</span>
                    </button>
                  </div>
                  <p className="font-arabic text-xl leading-loose" dir="rtl">
                    {q.arabic}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {getLocalizedContent(lang, q)}
                  </p>
                </div>

                <div className="surface-alt rounded-2xl p-3.5 text-xs space-y-1" style={{ color: 'var(--text-muted)' }}>
                  <div>
                    <strong>{t.common.source}:</strong> {getText(lang, q.bookName)} · {volLabel} · {pageLabel}
                  </div>
                  <div>{getText(lang, q.authenticityNote)}</div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
