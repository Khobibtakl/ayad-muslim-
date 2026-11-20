import React, { useEffect, useMemo, useState } from 'react';
import { Bell, Edit3, Heart, Plus, Search, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getDB } from '../db/database';
import type { PersonalDua } from '../types';
import { matchesNormalized } from '../utils/searchNormalize';
import { Icon3D } from './Icons3D';

export const PersonalDuasView: React.FC = () => {
  const { settings, t, pushNotification } = useApp();
  const lang = settings.language;

  const [duas, setDuas] = useState<PersonalDua[]>([]);
  const [query, setQuery] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Personal');
  const [arabic, setArabic] = useState('');
  const [translation, setTranslation] = useState('');
  const [notes, setNotes] = useState('');
  const [reminderTime, setReminderTime] = useState('');

  useEffect(() => {
    (async () => {
      const db = await getDB();
      const rows = await db.getAll('duas');
      setDuas(rows.sort((a, b) => b.updatedAt - a.updatedAt));
    })();
  }, []);

  const categories = useMemo(() => {
    const s = new Set(['Personal', 'Family', 'Knowledge', 'Rizq', 'Healing']);
    duas.forEach((d) => s.add(d.category));
    return Array.from(s);
  }, [duas]);

  const getCategoryLabel = (cat: string) =>
    (t.duasModule.categories as Record<string, string>)[cat] || cat;

  const getDuaTitle = (d: PersonalDua) => d.localizedTitle?.[lang] || d.title;
  const getDuaTranslation = (d: PersonalDua) => d.localizedTranslation?.[lang] || d.translation;
  const getDuaNotes = (d: PersonalDua) => d.localizedNotes?.[lang] || d.notes;

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setCategory('Personal');
    setArabic('');
    setTranslation('');
    setNotes('');
    setReminderTime('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !arabic.trim()) return;
    const db = await getDB();
    const existing = editingId ? duas.find((d) => d.id === editingId) : undefined;
    const nextTitle = title.trim() || arabic.trim().slice(0, 32);
    const nextTrans = translation.trim();
    const nextNotes = notes.trim();

    const item: PersonalDua = {
      id: existing ? existing.id : `dua-${Date.now()}`,
      title: nextTitle,
      localizedTitle: existing?.localizedTitle
        ? { ...existing.localizedTitle, [lang]: nextTitle }
        : undefined,
      category,
      arabic: arabic.trim(),
      translation: nextTrans,
      localizedTranslation: existing?.localizedTranslation
        ? { ...existing.localizedTranslation, [lang]: nextTrans }
        : undefined,
      notes: nextNotes,
      localizedNotes: existing?.localizedNotes
        ? { ...existing.localizedNotes, [lang]: nextNotes }
        : undefined,
      isFavorite: existing?.isFavorite ?? false,
      reminderTime: reminderTime || undefined,
      createdAt: existing?.createdAt ?? Date.now(),
      updatedAt: Date.now(),
    };
    await db.put('duas', item);
    setDuas((prev) => [item, ...prev.filter((d) => d.id !== item.id)]);
    if (reminderTime) {
      await pushNotification(
        nextTitle,
        `${reminderTime} — ${nextTrans || item.arabic}`,
        'duas',
        'duas'
      );
    }
    resetForm();
  };

  const startEdit = (d: PersonalDua) => {
    setEditingId(d.id);
    setTitle(getDuaTitle(d));
    setCategory(d.category);
    setArabic(d.arabic);
    setTranslation(getDuaTranslation(d));
    setNotes(getDuaNotes(d));
    setReminderTime(d.reminderTime || '');
  };

  const toggleFav = async (d: PersonalDua) => {
    const next = { ...d, isFavorite: !d.isFavorite, updatedAt: Date.now() };
    const db = await getDB();
    await db.put('duas', next);
    setDuas((prev) => prev.map((x) => (x.id === d.id ? next : x)));
  };

  const handleDelete = async (id: string) => {
    const db = await getDB();
    await db.delete('duas', id);
    setDuas((prev) => prev.filter((x) => x.id !== id));
  };

  const filtered = useMemo(() => {
    const q = query.trim();
    return duas.filter((d) => {
      const catOk = catFilter === 'all' || (catFilter === 'fav' ? d.isFavorite : d.category === catFilter);
      const dTitle = d.localizedTitle?.[lang] || d.title;
      const dTrans = d.localizedTranslation?.[lang] || d.translation;
      const dNotes = d.localizedNotes?.[lang] || d.notes;
      const qOk =
        !q ||
        matchesNormalized(dTitle, q) ||
        matchesNormalized(d.arabic, q) ||
        matchesNormalized(dTrans, q) ||
        matchesNormalized(dNotes, q);
      return catOk && qOk;
    });
  }, [catFilter, duas, lang, query]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <form onSubmit={handleSave} className="lg:col-span-5 surface-elevated rounded-3xl p-6 space-y-3">
        <div className="flex items-center gap-3">
          <Icon3D kind="duas" size={38} className="shrink-0" />
          <h2 className="text-lg font-bold">{editingId ? t.common.edit : t.common.add} · {t.nav.duas}</h2>
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t.nav.duas}
          className="w-full rounded-xl px-3.5 py-2.5 text-sm modern-input"
        />
        <div className="grid grid-cols-2 gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl px-3 py-2 text-xs modern-input"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{getCategoryLabel(c)}</option>
            ))}
          </select>
          <input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="rounded-xl px-3 py-2 text-xs font-mono-tabular modern-input"
          />
        </div>
        <textarea
          rows={3}
          value={arabic}
          onChange={(e) => setArabic(e.target.value)}
          placeholder="رَبِّ اشْرَحْ لِي صَدْرِي..."
          dir="rtl"
          className="w-full rounded-xl px-3.5 py-2.5 text-sm font-arabic modern-input"
        />
        <textarea
          rows={2}
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
          placeholder={t.duasModule.translationPlaceholder}
          className="w-full rounded-xl px-3.5 py-2.5 text-sm modern-input"
        />
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t.duasModule.notesPlaceholder}
          className="w-full rounded-xl px-3.5 py-2 text-xs modern-input"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="btn-primary flex-1 rounded-xl py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 min-h-[42px]"
          >
            <Plus className="w-4 h-4" />
            <span>{t.common.save}</span>
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border px-4 py-2 text-xs font-medium"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              {t.common.cancel}
            </button>
          )}
        </div>
      </form>

      <div className="lg:col-span-7 space-y-4">
        <div className="surface-card rounded-3xl p-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-4 h-4 absolute top-3 start-3 opacity-50" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.common.search}
              className="w-full rounded-xl ps-9 pe-3 py-2 text-xs modern-input"
            />
          </div>
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="rounded-xl px-3 py-2 text-xs modern-input"
          >
            <option value="all">{t.common.all}</option>
            <option value="fav">{t.common.favorites}</option>
            {categories.map((c) => (
              <option key={c} value={c}>{getCategoryLabel(c)}</option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="surface-card rounded-3xl p-10 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            {t.common.empty}
          </div>
        ) : (
          filtered.map((d) => {
            const dTitle = getDuaTitle(d);
            const dTrans = getDuaTranslation(d);
            const dNotes = getDuaNotes(d);
            return (
              <div key={d.id} className="surface-card rounded-3xl p-5 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold">{dTitle}</h3>
                    <span className="text-xs font-mono-tabular" style={{ color: 'var(--text-muted)' }}>
                      {getCategoryLabel(d.category)} {d.reminderTime ? `· ${d.reminderTime}` : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {d.reminderTime && <Bell className="w-3.5 h-3.5 opacity-60" />}
                    <button type="button" onClick={() => toggleFav(d)} className="p-2 rounded-lg" aria-label={t.common.favorite}>
                      <Heart className={`w-4 h-4 ${d.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                    <button type="button" onClick={() => startEdit(d)} className="p-2 rounded-lg" aria-label={t.common.edit}>
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => handleDelete(d.id)} className="p-2 rounded-lg text-rose-600" aria-label={t.common.delete}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {d.arabic && <p className="font-arabic text-xl leading-loose" dir="rtl">{d.arabic}</p>}
                {dTrans && <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{dTrans}</p>}
                {dNotes && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{dNotes}</p>}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
