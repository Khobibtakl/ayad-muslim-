import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Circle, Edit3, Plus, Search, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getDB, todayKey } from '../db/database';
import type { TaskItem } from '../types';
import { matchesNormalized } from '../utils/searchNormalize';
import { Icon3D } from './Icons3D';

const CATEGORIES: Array<TaskItem['category']> = [
  'worship',
  'learning',
  'study',
  'work',
  'family',
  'health',
  'growth',
  'other',
];

export const TasksView: React.FC = () => {
  const { settings, t, pushNotification } = useApp();
  const lang = settings.language;

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [filterView, setFilterView] = useState<'today' | 'upcoming' | 'overdue' | 'completed' | 'all'>('today');
  const [catFilter, setCatFilter] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(todayKey());
  const [time, setTime] = useState('09:00');
  const [priority, setPriority] = useState<TaskItem['priority']>('medium');
  const [category, setCategory] = useState<TaskItem['category']>('worship');
  const [recurrence, setRecurrence] = useState<TaskItem['recurrence']>('none');
  const [reminder, setReminder] = useState(true);

  useEffect(() => {
    (async () => {
      const db = await getDB();
      const rows = await db.getAll('tasks');
      setTasks(rows.sort((a, b) => b.createdAt - a.createdAt));
    })();
  }, []);

  const getTaskTitle = (tk: TaskItem) => tk.localizedTitle?.[lang] || tk.title;
  const getTaskDesc = (tk: TaskItem) => tk.localizedDescription?.[lang] || tk.description;

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setDueDate(todayKey());
    setTime('09:00');
    setPriority('medium');
    setCategory('worship');
    setRecurrence('none');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const db = await getDB();
    const existing = editingId ? tasks.find((tk) => tk.id === editingId) : undefined;
    const nextTitle = title.trim();
    const nextDesc = description.trim();

    const item: TaskItem = {
      id: existing ? existing.id : `task-${Date.now()}`,
      title: nextTitle,
      localizedTitle: existing?.localizedTitle
        ? { ...existing.localizedTitle, [lang]: nextTitle }
        : undefined,
      description: nextDesc,
      localizedDescription: existing?.localizedDescription
        ? { ...existing.localizedDescription, [lang]: nextDesc }
        : undefined,
      startDate: existing?.startDate || todayKey(),
      dueDate,
      time,
      priority,
      reminder,
      status: existing?.status || 'pending',
      category,
      recurrence,
      completedAt: existing?.completedAt,
      createdAt: existing?.createdAt || Date.now(),
    };
    await db.put('tasks', item);
    setTasks((prev) => [item, ...prev.filter((x) => x.id !== item.id)]);
    if (reminder) {
      await pushNotification(nextTitle, `${item.dueDate} ${item.time}`, 'tasks', 'tasks');
    }
    resetForm();
  };

  const toggleStatus = async (tk: TaskItem) => {
    const db = await getDB();
    const nextStatus = tk.status === 'completed' ? 'pending' : 'completed';
    const updated: TaskItem = {
      ...tk,
      status: nextStatus,
      completedAt: nextStatus === 'completed' ? Date.now() : undefined,
    };
    await db.put('tasks', updated);

    let extra: TaskItem | null = null;
    if (nextStatus === 'completed' && tk.recurrence !== 'none') {
      const [y, m, day] = tk.dueDate.split('-').map(Number);
      const d = new Date(y || new Date().getFullYear(), (m || 1) - 1, day || 1);
      if (tk.recurrence === 'daily') d.setDate(d.getDate() + 1);
      else if (tk.recurrence === 'weekly') d.setDate(d.getDate() + 7);
      else if (tk.recurrence === 'monthly') d.setMonth(d.getMonth() + 1);
      const nextDue = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      extra = {
        ...tk,
        id: `task-${Date.now()}-rec`,
        dueDate: nextDue,
        status: 'pending',
        completedAt: undefined,
        createdAt: Date.now(),
      };
      await db.put('tasks', extra);
    }

    setTasks((prev) => {
      const base = prev.map((x) => (x.id === tk.id ? updated : x));
      return extra ? [extra, ...base] : base;
    });
  };

  const handleDelete = async (id: string) => {
    const db = await getDB();
    await db.delete('tasks', id);
    setTasks((prev) => prev.filter((x) => x.id !== id));
  };

  const today = todayKey();
  const filtered = useMemo(() => {
    const q = query.trim();
    return tasks.filter((tk) => {
      const viewOk =
        filterView === 'all' ||
        (filterView === 'completed' && tk.status === 'completed') ||
        (filterView === 'today' && tk.status === 'pending' && tk.dueDate === today) ||
        (filterView === 'upcoming' && tk.status === 'pending' && tk.dueDate > today) ||
        (filterView === 'overdue' && tk.status === 'pending' && tk.dueDate < today);
      const catOk = catFilter === 'all' || tk.category === catFilter;
      const tTitle = tk.localizedTitle?.[lang] || tk.title;
      const tDesc = tk.localizedDescription?.[lang] || tk.description;
      const qOk = !q || matchesNormalized(tTitle, q) || matchesNormalized(tDesc, q);
      return viewOk && catOk && qOk;
    });
  }, [catFilter, filterView, lang, query, tasks, today]);

  const catLabel = (c: TaskItem['category']) => {
    const map: Record<TaskItem['category'], Record<string, string>> = {
      worship: { ps: 'عبادت', ar: 'العبادة', fa: 'عبادت', en: 'Worship' },
      learning: { ps: 'زده‌کړه', ar: 'التعلم', fa: 'یادگیری', en: 'Learning' },
      study: { ps: 'مطالعه', ar: 'المطالعة', fa: 'مطالعه', en: 'Study' },
      work: { ps: 'کار', ar: 'العمل', fa: 'کار', en: 'Work' },
      family: { ps: 'کورنۍ', ar: 'الأسرة', fa: 'خانواده', en: 'Family' },
      health: { ps: 'روغ ژوند', ar: 'الصحة', fa: 'سلامتی', en: 'Health' },
      growth: { ps: 'شخصي پرمختګ', ar: 'التطوير', fa: 'رشد فردی', en: 'Personal Growth' },
      other: { ps: 'نور', ar: 'أخرى', fa: 'سایر', en: 'Other' },
    };
    return map[c][lang] || map[c].en;
  };

  const completedCount = tasks.filter((x) => x.status === 'completed').length;

  return (
    <div className="space-y-6">
      <div className="surface-elevated rounded-3xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Icon3D kind="tasks" size={44} className="shrink-0" />
          <div>
            <h2 className="text-xl font-bold">{t.nav.tasks}</h2>
            <p className="text-xs mt-1 font-mono-tabular" style={{ color: 'var(--text-secondary)' }}>
              {t.common.completed}: {completedCount}/{tasks.length}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(['today', 'upcoming', 'overdue', 'completed', 'all'] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setFilterView(v)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border min-h-[36px] whitespace-nowrap ${
                filterView === v ? 'btn-primary border-transparent' : ''
              }`}
              style={
                filterView === v
                  ? undefined
                  : {
                      backgroundColor: 'var(--bg-surface-alt)',
                      color: 'var(--text-primary)',
                      borderColor: 'var(--border-subtle)',
                    }
              }
            >
              {t.tasksModule.views[v]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <form onSubmit={handleSave} className="lg:col-span-4 surface-card rounded-3xl p-5 space-y-3">
          <h3 className="text-sm font-bold">{editingId ? t.common.edit : t.common.add}</h3>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t.nav.tasks}
            className="w-full rounded-xl px-3.5 py-2.5 text-sm modern-input"
          />
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t.tasksModule.descPlaceholder}
            className="w-full rounded-xl px-3.5 py-2 text-xs modern-input"
          />
          <div className="grid grid-cols-2 gap-2 text-xs">
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="rounded-xl px-2.5 py-2 font-mono-tabular modern-input" />
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="rounded-xl px-2.5 py-2 font-mono-tabular modern-input" />
            <select value={category} onChange={(e) => setCategory(e.target.value as TaskItem['category'])} className="rounded-xl px-2.5 py-2 modern-input">
              {CATEGORIES.map((c) => <option key={c} value={c}>{catLabel(c)}</option>)}
            </select>
            <select value={priority} onChange={(e) => setPriority(e.target.value as TaskItem['priority'])} className="rounded-xl px-2.5 py-2 modern-input">
              <option value="high">{t.tasksModule.priorities.high}</option>
              <option value="medium">{t.tasksModule.priorities.medium}</option>
              <option value="low">{t.tasksModule.priorities.low}</option>
            </select>
            <select value={recurrence} onChange={(e) => setRecurrence(e.target.value as TaskItem['recurrence'])} className="rounded-xl px-2.5 py-2 col-span-2 modern-input">
              <option value="none">{t.tasksModule.recurrences.none}</option>
              <option value="daily">{t.tasksModule.recurrences.daily}</option>
              <option value="weekly">{t.tasksModule.recurrences.weekly}</option>
              <option value="monthly">{t.tasksModule.recurrences.monthly}</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={reminder} onChange={(e) => setReminder(e.target.checked)} />
            <span>{t.nav.notifications}</span>
          </label>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary flex-1 rounded-xl py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 min-h-[42px]">
              <Plus className="w-4 h-4" />
              <span>{t.common.save}</span>
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="rounded-xl border px-3 text-xs" style={{ borderColor: 'var(--border-subtle)' }}>
                {t.common.cancel}
              </button>
            )}
          </div>
        </form>

        <div className="lg:col-span-8 space-y-4">
          <div className="surface-card rounded-3xl p-4 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="w-4 h-4 absolute top-3 start-3 opacity-50" />
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.common.search} className="w-full rounded-xl ps-9 pe-3 py-2 text-xs modern-input" />
            </div>
            <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="rounded-xl px-3 py-2 text-xs modern-input">
              <option value="all">{t.common.all}</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{catLabel(c)}</option>)}
            </select>
          </div>

          <div className="surface-card rounded-3xl divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {filtered.length === 0 ? (
              <div className="p-10 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                {t.common.empty}
              </div>
            ) : (
              filtered.map((tk) => {
                const tkTitle = getTaskTitle(tk);
                const tkDesc = getTaskDesc(tk);
                return (
                  <div key={tk.id} className="p-4 flex items-center justify-between gap-3">
                    <button type="button" onClick={() => toggleStatus(tk)} className="flex items-start gap-3 text-start flex-1">
                      {tk.status === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5 shrink-0 mt-0.5 opacity-50" />
                      )}
                      <div>
                        <div className={`text-sm font-semibold ${tk.status === 'completed' ? 'line-through opacity-60' : ''}`}>
                          {tkTitle}
                        </div>
                        {tkDesc && <p className="text-xs opacity-75">{tkDesc}</p>}
                        <div className="text-[11px] mt-1 font-mono-tabular" style={{ color: 'var(--text-muted)' }}>
                          {catLabel(tk.category)} · {tk.dueDate} {tk.time} · {t.tasksModule.priorities[tk.priority]}{' '}
                          {tk.recurrence !== 'none' ? `· ${t.tasksModule.recurrences[tk.recurrence]}` : ''}
                        </div>
                      </div>
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(tk.id);
                          setTitle(tkTitle);
                          setDescription(tkDesc);
                          setDueDate(tk.dueDate);
                          setTime(tk.time);
                          setPriority(tk.priority);
                          setCategory(tk.category);
                          setRecurrence(tk.recurrence);
                        }}
                        className="p-2"
                        aria-label={t.common.edit}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => handleDelete(tk.id)} className="p-2 text-rose-600" aria-label={t.common.delete}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
