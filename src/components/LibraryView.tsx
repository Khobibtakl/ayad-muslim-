import React, { useEffect, useMemo, useState } from 'react';
import {
  Bookmark,
  BookOpen,
  FileText,
  Heart,
  Maximize2,
  Minimize2,
  Moon,
  Search,
  Sun,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BOOK_CATEGORIES } from '../data/libraryAndQuotesData';
import { getDB } from '../db/database';
import { getText } from '../i18n/translations';
import type { BookCategoryId, LibraryBook } from '../types';
import { matchesNormalized } from '../utils/searchNormalize';
import { Icon3D } from './Icons3D';

export const LibraryView: React.FC = () => {
  const { settings, t, favorites, toggleFavorite } = useApp();
  const lang = settings.language;

  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [selectedCat, setSelectedCat] = useState<BookCategoryId | 'all'>('all');
  const [query, setQuery] = useState('');
  const [activeBook, setActiveBook] = useState<LibraryBook | null>(null);
  const [pageIdx, setPageIdx] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [nightMode, setNightMode] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [readingHistory, setReadingHistory] = useState<Array<{ id: string; title: string; progressLabel: string }>>([]);

  const loadBooks = async () => {
    const db = await getDB();
    const [allBooks, rh] = await Promise.all([
      db.getAll('library_books'),
      db.getAll('reading_history'),
    ]);
    setBooks(allBooks);
    setReadingHistory(
      rh
        .filter((r) => r.type === 'book')
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 6)
    );
  };

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    let url: string | null = null;
    (async () => {
      if (activeBook?.pdfBlobKey) {
        const db = await getDB();
        const rec = await db.get('pdf_blobs', activeBook.pdfBlobKey);
        if (rec) {
          url = URL.createObjectURL(rec.blob);
          setPdfUrl(url);
          return;
        }
      }
      setPdfUrl(null);
    })();
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [activeBook]);

  const filtered = useMemo(() => {
    const q = query.trim();
    return books.filter((b) => {
      const catOk = selectedCat === 'all' || b.category === selectedCat;
      const qOk =
        !q ||
        matchesNormalized(getText(lang, b.title), q) ||
        matchesNormalized(getText(lang, b.author), q) ||
        matchesNormalized(getText(lang, b.authorBio), q) ||
        b.sections.some((sec) => matchesNormalized(`${sec.title} ${sec.content}`, q));
      return catOk && qOk;
    });
  }, [books, lang, query, selectedCat]);

  const getReaderTotalPages = (b: LibraryBook) =>
    b.pdfBlobKey ? Math.max(1, b.pages) : Math.max(1, b.sections.length);

  const openBook = async (b: LibraryBook) => {
    const total = getReaderTotalPages(b);
    const initialPage = Math.max(1, Math.min(total, b.lastPage || 1));
    setActiveBook(b);
    setPageIdx(initialPage);
    const db = await getDB();
    await db.put('reading_history', {
      id: `rh-book-${b.id}`,
      type: 'book',
      refId: b.id,
      title: getText(lang, b.title),
      progressLabel: `${initialPage}/${total}`,
      timestamp: Date.now(),
    });
    await loadBooks();
  };

  const updateBookPage = async (nextPage: number) => {
    if (!activeBook) return;
    const total = getReaderTotalPages(activeBook);
    const bounded = Math.max(1, Math.min(total, nextPage));
    setPageIdx(bounded);
    const updated: LibraryBook = { ...activeBook, lastPage: bounded };
    setActiveBook(updated);
    setBooks((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
    const db = await getDB();
    await db.put('library_books', updated);
  };

  const toggleBookBookmark = async () => {
    if (!activeBook) return;
    const has = activeBook.bookmarks.includes(pageIdx);
    const nextBms = has
      ? activeBook.bookmarks.filter((p) => p !== pageIdx)
      : [...activeBook.bookmarks, pageIdx].sort((a, b) => a - b);
    const updated: LibraryBook = { ...activeBook, bookmarks: nextBms };
    setActiveBook(updated);
    setBooks((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
    const db = await getDB();
    await db.put('library_books', updated);
  };

  const toggleOfflineDownload = async (b: LibraryBook) => {
    const updated: LibraryBook = { ...b, downloadedOffline: !b.downloadedOffline };
    const db = await getDB();
    await db.put('library_books', updated);
    setBooks((prev) => prev.map((x) => (x.id === b.id ? updated : x)));
    if (activeBook?.id === b.id) setActiveBook(updated);
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const blobKey = `pdf-${Date.now()}`;
    const db = await getDB();
    await db.put('pdf_blobs', {
      key: blobKey,
      blob: file,
      filename: file.name,
      size: file.size,
    });
    const cleanTitle = file.name.replace(/\.pdf$/i, '');
    const newBook: LibraryBook = {
      id: `book-pdf-${Date.now()}`,
      title: { ps: cleanTitle, ar: cleanTitle, fa: cleanTitle, en: cleanTitle },
      author: { ps: 'شخصي PDF فایل', ar: 'ملف PDF محلي', fa: 'فایل PDF محلی', en: 'Local PDF Document' },
      authorBio: { ps: 'د کاروونکي له خوا اضافه شوی PDF کتاب', ar: 'كتاب PDF مضاف من المستخدم', fa: 'کتاب PDF افزوده‌شده توسط کاربر', en: 'User-imported local PDF book' },
      category: selectedCat === 'all' ? 'quran_tafsir' : selectedCat,
      volumes: 1,
      pages: 100,
      publishInfo: `${(file.size / 1024 / 1024).toFixed(2)} ${t.libraryModule.sizeUnitMB}`,
      licenseNote: t.libraryModule.localUserDoc,
      language: lang,
      sections: [],
      pdfBlobKey: blobKey,
      downloadedOffline: true,
      lastPage: 1,
      bookmarks: [],
      isCustom: true,
    };
    await db.put('library_books', newBook);
    setBooks((prev) => [newBook, ...prev]);
    openBook(newBook);
  };

  // Reader View
  if (activeBook) {
    const totalPages = getReaderTotalPages(activeBook);
    const currentSection =
      activeBook.sections[pageIdx - 1] || activeBook.sections[0];
    return (
      <div
        className={`${
          fullScreen ? 'fixed inset-0 z-50 overflow-y-auto p-4 sm:p-8' : 'rounded-3xl border p-5 sm:p-8'
        } space-y-5 transition-colors ${
          nightMode ? 'bg-zinc-950 text-zinc-100 border-zinc-800 shadow-2xl' : 'surface-elevated'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div>
            <button
              type="button"
              onClick={() => {
                setActiveBook(null);
                setFullScreen(false);
              }}
              className="text-xs font-semibold underline mb-1 block"
              style={{ color: 'var(--accent-primary)' }}
            >
              {t.common.back} · {t.nav.library}
            </button>
            <h2 className="text-xl font-bold">{getText(lang, activeBook.title)}</h2>
            <p className="text-xs opacity-75">
              {getText(lang, activeBook.author)} ·{' '}
              {activeBook.pdfBlobKey ? activeBook.publishInfo : t.libraryModule.publicDomainLabel}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button type="button" onClick={() => setZoom((z) => Math.max(70, z - 10))} className="p-2 rounded-xl border min-h-[38px] min-w-[38px] flex items-center justify-center" style={{ borderColor: 'var(--border-subtle)' }} title={t.libraryModule.zoomOut}>
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono-tabular px-2">{zoom}%</span>
            <button type="button" onClick={() => setZoom((z) => Math.min(180, z + 10))} className="p-2 rounded-xl border min-h-[38px] min-w-[38px] flex items-center justify-center" style={{ borderColor: 'var(--border-subtle)' }} title={t.libraryModule.zoomIn}>
              <ZoomIn className="w-4 h-4" />
            </button>
            <button type="button" onClick={toggleBookBookmark} className="p-2 rounded-xl border min-h-[38px] min-w-[38px] flex items-center justify-center" style={{ borderColor: 'var(--border-subtle)' }} title={t.common.bookmark}>
              <Bookmark className={`w-4 h-4 ${activeBook.bookmarks.includes(pageIdx) ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>
            <button type="button" onClick={() => setNightMode((n) => !n)} className="p-2 rounded-xl border min-h-[38px] min-w-[38px] flex items-center justify-center" style={{ borderColor: 'var(--border-subtle)' }} title={t.quranModule.nightMode}>
              {nightMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button type="button" onClick={() => setFullScreen((f) => !f)} className="p-2 rounded-xl border min-h-[38px] min-w-[38px] flex items-center justify-center" style={{ borderColor: 'var(--border-subtle)' }} title={t.libraryModule.fullscreen}>
              {fullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Author Bio */}
        {getText(lang, activeBook.authorBio) && (
          <div className="surface-alt rounded-2xl p-3.5 text-xs space-y-1">
            <div className="font-semibold" style={{ color: 'var(--accent-primary)' }}>
              {t.libraryModule.aboutAuthorLabel}: {getText(lang, activeBook.author)}
            </div>
            <p className="opacity-85 leading-relaxed">{getText(lang, activeBook.authorBio)}</p>
          </div>
        )}

        {/* Chapter / Page Jump Bar */}
        {!pdfUrl && (
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={pageIdx <= 1}
                onClick={() => updateBookPage(pageIdx - 1)}
                className="px-3.5 py-2 rounded-xl border disabled:opacity-40 font-semibold"
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                {t.common.previous}
              </button>
              <span className="font-mono-tabular px-2 font-semibold">
                {t.libraryModule.chapterLabel} {pageIdx} / {totalPages}
              </span>
              <button
                type="button"
                disabled={pageIdx >= totalPages}
                onClick={() => updateBookPage(pageIdx + 1)}
                className="px-3.5 py-2 rounded-xl border disabled:opacity-40 font-semibold"
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                {t.common.next}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span>{t.libraryModule.chapterLabel}:</span>
              <input
                type="number"
                min={1}
                max={totalPages}
                value={pageIdx}
                onChange={(e) => updateBookPage(Number(e.target.value) || 1)}
                className="w-16 rounded-xl px-2 py-1.5 text-center font-mono-tabular modern-input"
              />
            </div>
          </div>
        )}

        {/* Content Surface: Native PDF Blob or Classical Text Reader with Table of Contents */}
        {pdfUrl ? (
          <div className="w-full h-[650px] rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--border-subtle)' }}>
            <iframe
              src={`${pdfUrl}#page=${pageIdx}&zoom=${zoom}`}
              title={getText(lang, activeBook.title)}
              className="w-full h-full"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {activeBook.sections.length > 1 && (
              <aside className="lg:col-span-4 surface-alt rounded-2xl p-4 space-y-2">
                <h4 className="text-xs font-bold" style={{ color: 'var(--accent-primary)' }}>
                  {t.libraryModule.chaptersListTitle} ({activeBook.sections.length})
                </h4>
                <div className="space-y-1">
                  {activeBook.sections.map((sec, idx) => {
                    const chNum = idx + 1;
                    const active = pageIdx === chNum;
                    return (
                      <button
                        key={chNum}
                        type="button"
                        onClick={() => updateBookPage(chNum)}
                        className="w-full text-start px-3 py-2 rounded-xl text-xs transition-colors flex items-start gap-2"
                        style={{
                          backgroundColor: active ? 'var(--accent-soft)' : 'transparent',
                          color: active ? 'var(--accent-primary)' : 'var(--text-primary)',
                          fontWeight: active ? 700 : 500,
                        }}
                      >
                        <span className="font-mono-tabular opacity-70 shrink-0">{chNum}.</span>
                        <span className="line-clamp-2">{sec.title}</span>
                      </button>
                    );
                  })}
                </div>
              </aside>
            )}

            <div
              className={`${activeBook.sections.length > 1 ? 'lg:col-span-8' : 'lg:col-span-12 mx-auto max-w-3xl w-full'} py-2 space-y-4 leading-loose`}
              style={{ fontSize: `${Math.round((settings.fontSize * zoom) / 100)}px` }}
            >
              {currentSection ? (
                <>
                  <h3 className="text-xl font-bold" style={{ color: 'var(--accent-primary)' }}>
                    {currentSection.title}
                  </h3>
                  <p className="whitespace-pre-line font-arabic text-lg leading-[2.1]">
                    {currentSection.content}
                  </p>
                </>
              ) : (
                <p className="text-sm opacity-75">{t.common.empty}</p>
              )}
            </div>
          </div>
        )}

        {activeBook.bookmarks.length > 0 && (
          <div className="pt-3 border-t flex flex-wrap items-center gap-2 text-xs" style={{ borderColor: 'var(--border-subtle)' }}>
            <span className="opacity-70">{t.common.bookmarks}:</span>
            {activeBook.bookmarks.map((bmPage) => (
              <button
                key={bmPage}
                type="button"
                onClick={() => updateBookPage(bmPage)}
                className="px-2.5 py-1 rounded-md border font-mono-tabular"
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                {t.libraryModule.pageShort} {bmPage}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Local PDF Import */}
      <div className="surface-elevated rounded-3xl p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Icon3D kind="library" size={44} className="shrink-0" />
            <div>
              <h2 className="text-xl font-bold">{t.nav.library}</h2>
              <p className="text-xs mt-1 font-mono-tabular" style={{ color: 'var(--text-secondary)' }}>
                {books.length} {t.libraryModule.subtitleSuffix}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute top-3 start-3 opacity-50" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.common.search}
                className="w-full rounded-xl ps-9 pe-3 py-2.5 text-xs modern-input"
              />
            </div>
            <label className="btn-primary inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold cursor-pointer min-h-[40px]">
              <Icon3D kind="upload" size={16} />
              <span>{t.libraryModule.addDocumentBtn}</span>
              <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} />
            </label>
          </div>
        </div>

        {/* All 16 Book Categories */}
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedCat('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border min-h-[36px] ${
              selectedCat === 'all' ? 'btn-primary border-transparent' : ''
            }`}
            style={
              selectedCat === 'all'
                ? undefined
                : {
                    backgroundColor: 'var(--bg-surface-alt)',
                    color: 'var(--text-primary)',
                    borderColor: 'var(--border-subtle)',
                  }
            }
          >
            {t.common.all}
          </button>
          {BOOK_CATEGORIES.map((c) => {
            const active = selectedCat === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCat(c.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border min-h-[36px] ${
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
                {getText(lang, c.title)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3 surface-card rounded-3xl p-10 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            {t.common.empty}
          </div>
        ) : (
          filtered.map((b) => {
            const isFav = favorites.some((f) => f.id === `fav-book-${b.id}`);
            const catObj = BOOK_CATEGORIES.find((c) => c.id === b.category);
            const totalChapters = getReaderTotalPages(b);
            return (
              <div key={b.id} className="surface-card interactive-tile rounded-3xl p-5 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span>{catObj ? getText(lang, catObj.title) : b.category}</span>
                    <button
                      type="button"
                      onClick={() =>
                        toggleFavorite({
                          id: `fav-book-${b.id}`,
                          type: 'book',
                          refId: b.id,
                          title: getText(lang, b.title),
                        })
                      }
                      aria-label={t.common.favorite}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>
                  <h3 className="text-base font-bold leading-snug">{getText(lang, b.title)}</h3>
                  <p className="text-xs font-medium" style={{ color: 'var(--accent-primary)' }}>
                    {getText(lang, b.author)}
                  </p>
                  <p className="text-xs line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                    {getText(lang, b.authorBio)}
                  </p>
                  <div className="text-[11px] font-mono-tabular" style={{ color: 'var(--text-muted)' }}>
                    {b.volumes} {t.libraryModule.volumeShort} · {totalChapters}{' '}
                    {b.pdfBlobKey ? t.libraryModule.pageShort : t.libraryModule.chapterLabel} ·{' '}
                    {b.pdfBlobKey ? t.libraryModule.localUserDoc : t.libraryModule.publicDomainLabel}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <button
                    type="button"
                    onClick={() => openBook(b)}
                    className="btn-primary flex-1 rounded-xl py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 min-h-[40px]"
                  >
                    {b.pdfBlobKey ? <FileText className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
                    <span>
                      {b.lastPage > 1
                        ? `${t.libraryModule.chapterLabel} ${Math.min(b.lastPage, totalChapters)}`
                        : t.quranModule.continueReading}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleOfflineDownload(b)}
                    className="p-2.5 rounded-xl border min-h-[40px]"
                    style={{
                      borderColor: 'var(--border-subtle)',
                      opacity: b.downloadedOffline ? 1 : 0.55,
                    }}
                    title={b.downloadedOffline ? t.common.offlineReady : t.common.download}
                  >
                    <Icon3D kind="download" size={18} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {readingHistory.length > 0 && (
        <div className="surface-card rounded-3xl p-5 space-y-2">
          <h3 className="text-sm font-bold">{t.quranModule.lastRead}</h3>
          <div className="divide-y text-xs" style={{ borderColor: 'var(--border-subtle)' }}>
            {readingHistory.map((r) => (
              <div key={r.id} className="py-2 flex items-center justify-between gap-3">
                <span className="font-medium">{r.title}</span>
                <span className="font-mono-tabular" style={{ color: 'var(--text-muted)' }}>
                  {r.progressLabel}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
