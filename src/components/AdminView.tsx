import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BOOK_CATEGORIES } from '../data/libraryAndQuotesData';
import { getDB } from '../db/database';
import { getText } from '../i18n/translations';
import type {
  AdminAnnouncement,
  BookCategoryId,
  HadithCollectionId,
  HadithItem,
  LibraryBook,
} from '../types';
import { Icon3D } from './Icons3D';

const COLLECTION_IDS: HadithCollectionId[] = [
  'bukhari',
  'muslim',
  'abudawud',
  'tirmidhi',
  'nasai',
  'ibnmajah',
  'malik',
  'nawawi40',
  'adab',
  'qudsi',
];

export const AdminView: React.FC = () => {
  const { settings, t, updateSettings, pushNotification } = useApp();
  const lang = settings.language;

  const [tab, setTab] = useState<'hadith' | 'book' | 'announcement'>('hadith');
  const [announcements, setAnnouncements] = useState<AdminAnnouncement[]>([]);
  const [savedNotice, setSavedNotice] = useState('');

  // Add verified Hadith form
  const [collectionId, setCollectionId] = useState<HadithCollectionId>('bukhari');
  const [hadithNum, setHadithNum] = useState('');
  const [hadithArabic, setHadithArabic] = useState('');
  const [hadithTrans, setHadithTrans] = useState('');
  const [hadithGrade, setHadithGrade] = useState(t.hadithModule.gradeLabels['صحيح'] || t.common.verified);
  const [hadithSource, setHadithSource] = useState('');

  // Add Book form
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookCat, setBookCat] = useState<BookCategoryId>('aqeedah');
  const [bookContent, setBookContent] = useState('');

  // Announcement & Version form
  const [annTitle, setAnnTitle] = useState('');
  const [annBody, setAnnBody] = useState('');
  const [appVer, setAppVer] = useState(settings.appVersion);

  useEffect(() => {
    (async () => {
      const db = await getDB();
      setAnnouncements(await db.getAll('admin_announcements'));
    })();
  }, []);

  const addHadith = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hadithArabic.trim() || !hadithSource.trim()) return;
    const item: HadithItem = {
      id: `h-admin-${Date.now()}`,
      collectionId,
      bookName: {
        ps: t.adminModule.collectionNames[collectionId],
        ar: t.adminModule.collectionNames[collectionId],
        fa: t.adminModule.collectionNames[collectionId],
        en: t.adminModule.collectionNames[collectionId],
      },
      chapterName: {
        ps: t.adminModule.reviewedLabel,
        ar: t.adminModule.reviewedLabel,
        fa: t.adminModule.reviewedLabel,
        en: t.adminModule.reviewedLabel,
      },
      hadithNumber: hadithNum || '-',
      narrator: {
        ps: t.adminModule.seeSourceLabel,
        ar: t.adminModule.seeSourceLabel,
        fa: t.adminModule.seeSourceLabel,
        en: t.adminModule.seeSourceLabel,
      },
      topic: 'Reviewed',
      arabic: hadithArabic.trim(),
      ps: hadithTrans.trim(),
      fa: hadithTrans.trim(),
      en: hadithTrans.trim(),
      commentary: { ps: hadithSource, ar: hadithSource, fa: hadithSource, en: hadithSource },
      grade: hadithGrade,
      sourceRef: hadithSource.trim(),
      verified: true,
      isCustom: true,
    };
    const db = await getDB();
    await db.put('hadiths', item);
    setHadithNum('');
    setHadithArabic('');
    setHadithTrans('');
    setHadithSource('');
    setSavedNotice(t.common.verified);
  };

  const addBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitle.trim() || !bookContent.trim()) return;
    const item: LibraryBook = {
      id: `book-admin-${Date.now()}`,
      title: { ps: bookTitle, ar: bookTitle, fa: bookTitle, en: bookTitle },
      author: { ps: bookAuthor, ar: bookAuthor, fa: bookAuthor, en: bookAuthor },
      authorBio: { ps: bookAuthor, ar: bookAuthor, fa: bookAuthor, en: bookAuthor },
      category: bookCat,
      volumes: 1,
      pages: 1,
      publishInfo: t.adminModule.adminEditionLabel,
      licenseNote: t.adminModule.permittedLabel,
      language: lang,
      sections: [{ title: bookTitle, content: bookContent }],
      downloadedOffline: true,
      lastPage: 1,
      bookmarks: [],
      isCustom: true,
    };
    const db = await getDB();
    await db.put('library_books', item);
    setBookTitle('');
    setBookAuthor('');
    setBookContent('');
    setSavedNotice(t.common.verified);
  };

  const publishAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim()) return;
    const item: AdminAnnouncement = {
      id: `ann-${Date.now()}`,
      title: annTitle.trim(),
      message: annBody.trim(),
      version: appVer.trim(),
      createdAt: Date.now(),
    };
    const db = await getDB();
    await db.put('admin_announcements', item);
    await updateSettings({ appVersion: appVer.trim() });
    await pushNotification(item.title, item.message, 'admin', 'notifications');
    setAnnouncements((prev) => [item, ...prev]);
    setAnnTitle('');
    setAnnBody('');
    setSavedNotice(t.common.completed);
  };

  return (
    <div className="space-y-6">
      <div className="surface-elevated rounded-3xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Icon3D kind="admin" size={44} className="shrink-0" />
          <div>
            <h2 className="text-xl font-bold">{t.nav.admin}</h2>
            <p className="text-xs mt-1 flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
              <Icon3D kind="shield" size={16} className="shrink-0" />
              <span>{t.adminModule.subtitle}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(['hadith', 'book', 'announcement'] as const).map((tb) => (
            <button
              key={tb}
              type="button"
              onClick={() => setTab(tb)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border ${
                tab === tb ? 'btn-primary border-transparent' : ''
              }`}
              style={
                tab === tb
                  ? undefined
                  : {
                      backgroundColor: 'var(--bg-surface-alt)',
                      color: 'var(--text-primary)',
                      borderColor: 'var(--border-subtle)',
                    }
              }
            >
              {t.adminModule.tabs[tb]}
            </button>
          ))}
        </div>
      </div>

      {savedNotice && (
        <div className="surface-alt rounded-2xl px-4 py-2.5 text-xs font-semibold text-emerald-600">
          {savedNotice}
        </div>
      )}

      {tab === 'hadith' && (
        <form onSubmit={addHadith} className="surface-card rounded-3xl p-6 space-y-3">
          <h3 className="text-base font-bold">{t.common.add} · {t.nav.hadith}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <select value={collectionId} onChange={(e) => setCollectionId(e.target.value as HadithCollectionId)} className="rounded-xl border px-3 py-2" style={{ backgroundColor: 'var(--bg-surface-alt)', borderColor: 'var(--border-subtle)' }}>
              {COLLECTION_IDS.map((cid) => (
                <option key={cid} value={cid}>
                  {t.adminModule.collectionNames[cid]}
                </option>
              ))}
            </select>
            <input type="text" value={hadithNum} onChange={(e) => setHadithNum(e.target.value)} placeholder={t.hadithModule.hadithNum} className="rounded-xl border px-3 py-2" style={{ backgroundColor: 'var(--bg-surface-alt)', borderColor: 'var(--border-subtle)' }} />
            <input type="text" value={hadithGrade} onChange={(e) => setHadithGrade(e.target.value)} placeholder={t.hadithModule.grade} className="rounded-xl border px-3 py-2" style={{ backgroundColor: 'var(--bg-surface-alt)', borderColor: 'var(--border-subtle)' }} />
          </div>
          <textarea rows={3} value={hadithArabic} onChange={(e) => setHadithArabic(e.target.value)} placeholder={t.adminModule.arabicTextPlaceholder} className="w-full rounded-xl border px-3 py-2 text-sm font-arabic" style={{ backgroundColor: 'var(--bg-surface-alt)', borderColor: 'var(--border-subtle)' }} />
          <textarea rows={2} value={hadithTrans} onChange={(e) => setHadithTrans(e.target.value)} placeholder={t.adminModule.translationPlaceholder} className="w-full rounded-xl border px-3 py-2 text-sm" style={{ backgroundColor: 'var(--bg-surface-alt)', borderColor: 'var(--border-subtle)' }} />
          <input type="text" required value={hadithSource} onChange={(e) => setHadithSource(e.target.value)} placeholder={t.adminModule.sourceRequiredPlaceholder} className="w-full rounded-xl border px-3 py-2 text-xs" style={{ backgroundColor: 'var(--bg-surface-alt)', borderColor: 'var(--border-subtle)' }} />
          <button type="submit" className="rounded-xl px-5 py-2.5 text-xs font-semibold text-white inline-flex items-center gap-1.5" style={{ backgroundColor: 'var(--accent-primary)' }}>
            <Plus className="w-4 h-4" />
            <span>{t.common.save}</span>
          </button>
        </form>
      )}

      {tab === 'book' && (
        <form onSubmit={addBook} className="surface-card rounded-2xl p-6 space-y-3">
          <h3 className="text-base font-bold">{t.common.add} · {t.nav.library}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <input type="text" value={bookTitle} onChange={(e) => setBookTitle(e.target.value)} placeholder={t.adminModule.bookTitlePlaceholder} className="rounded-xl border px-3 py-2" style={{ backgroundColor: 'var(--bg-surface-alt)', borderColor: 'var(--border-subtle)' }} />
            <input type="text" value={bookAuthor} onChange={(e) => setBookAuthor(e.target.value)} placeholder={t.adminModule.bookAuthorPlaceholder} className="rounded-xl border px-3 py-2" style={{ backgroundColor: 'var(--bg-surface-alt)', borderColor: 'var(--border-subtle)' }} />
            <select value={bookCat} onChange={(e) => setBookCat(e.target.value as BookCategoryId)} className="rounded-xl border px-3 py-2" style={{ backgroundColor: 'var(--bg-surface-alt)', borderColor: 'var(--border-subtle)' }}>
              {BOOK_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{getText(lang, c.title)}</option>)}
            </select>
          </div>
          <textarea rows={5} value={bookContent} onChange={(e) => setBookContent(e.target.value)} placeholder={t.adminModule.bookContentPlaceholder} className="w-full rounded-xl border px-3 py-2 text-sm" style={{ backgroundColor: 'var(--bg-surface-alt)', borderColor: 'var(--border-subtle)' }} />
          <button type="submit" className="rounded-xl px-5 py-2.5 text-xs font-semibold text-white inline-flex items-center gap-1.5" style={{ backgroundColor: 'var(--accent-primary)' }}>
            <Plus className="w-4 h-4" />
            <span>{t.common.save}</span>
          </button>
        </form>
      )}

      {tab === 'announcement' && (
        <div className="space-y-4">
          <form onSubmit={publishAnnouncement} className="surface-card rounded-2xl p-6 space-y-3">
            <h3 className="text-base font-bold">{t.adminModule.publishAnnouncementTitle}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <input type="text" value={annTitle} onChange={(e) => setAnnTitle(e.target.value)} placeholder={t.adminModule.announcementTitlePlaceholder} className="rounded-xl border px-3 py-2" style={{ backgroundColor: 'var(--bg-surface-alt)', borderColor: 'var(--border-subtle)' }} />
              <input type="text" value={appVer} onChange={(e) => setAppVer(e.target.value)} placeholder={t.versionPrefix} className="rounded-xl border px-3 py-2 font-mono-tabular" style={{ backgroundColor: 'var(--bg-surface-alt)', borderColor: 'var(--border-subtle)' }} />
            </div>
            <textarea rows={3} value={annBody} onChange={(e) => setAnnBody(e.target.value)} placeholder={t.adminModule.announcementBodyPlaceholder} className="w-full rounded-xl border px-3 py-2 text-sm" style={{ backgroundColor: 'var(--bg-surface-alt)', borderColor: 'var(--border-subtle)' }} />
            <button type="submit" className="rounded-xl px-5 py-2.5 text-xs font-semibold text-white" style={{ backgroundColor: 'var(--accent-primary)' }}>
              {t.common.save}
            </button>
          </form>

          {announcements.length > 0 && (
            <div className="surface-card rounded-2xl p-5 divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
              {announcements.map((a) => (
                <div key={a.id} className="py-3 text-xs">
                  <div className="font-bold">{a.title} ({t.versionPrefix} {a.version})</div>
                  <p style={{ color: 'var(--text-secondary)' }}>{a.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
