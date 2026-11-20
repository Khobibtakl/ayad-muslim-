import React, { useEffect, useState } from 'react';
import { CheckCircle2, Circle, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getDB, todayKey } from '../db/database';
import { getText } from '../i18n/translations';
import type { Routine } from '../types';
import { Icon3D } from './Icons3D';

export const RoutinesView: React.FC = () => {
  const { settings, t } = useApp();
  const lang = settings.language;
  const today = todayKey();

  const [routines, setRoutines] = useState<Routine[]>([]);
  const [newRoutineName, setNewRoutineName] = useState('');
  const [newItemTexts, setNewItemTexts] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      const db = await getDB();
      setRoutines(await db.getAll('routines'));
    })();
  }, []);

  const toggleItem = async (routineId: string, itemId: string) => {
    const db = await getDB();
    const target = routines.find((r) => r.id === routineId);
    if (!target) return;

    const updated: Routine = {
      ...target,
      items: target.items.map((it) => {
        if (it.id !== itemId) return it;
        const done = it.completedDates.includes(today);
        return {
          ...it,
          completedDates: done
            ? it.completedDates.filter((d) => d !== today)
            : [...it.completedDates, today],
        };
      }),
    };
    await db.put('routines', updated);
    setRoutines((prev) => prev.map((r) => (r.id === routineId ? updated : r)));
  };

  const addRoutine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoutineName.trim()) return;
    const item: Routine = {
      id: `routine-${Date.now()}`,
      presetType: 'custom',
      name: { ps: newRoutineName.trim(), ar: newRoutineName.trim(), fa: newRoutineName.trim(), en: newRoutineName.trim() },
      items: [],
    };
    const db = await getDB();
    await db.put('routines', item);
    setRoutines((prev) => [...prev, item]);
    setNewRoutineName('');
  };

  const addStep = async (routineId: string) => {
    const txt = (newItemTexts[routineId] || '').trim();
    if (!txt) return;
    const target = routines.find((r) => r.id === routineId);
    if (!target) return;
    const updated: Routine = {
      ...target,
      items: [
        ...target.items,
        {
          id: `ri-${Date.now()}`,
          title: { ps: txt, ar: txt, fa: txt, en: txt },
          completedDates: [],
        },
      ],
    };
    const db = await getDB();
    await db.put('routines', updated);
    setRoutines((prev) => prev.map((r) => (r.id === routineId ? updated : r)));
    setNewItemTexts((prev) => ({ ...prev, [routineId]: '' }));
  };

  return (
    <div className="space-y-6">
      <div className="surface-elevated rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Icon3D kind="routines" size={44} className="shrink-0" />
          <div>
            <h2 className="text-xl font-bold">{t.nav.routines}</h2>
            <p className="text-xs mt-1 font-mono-tabular" style={{ color: 'var(--text-secondary)' }}>
              {today}
            </p>
          </div>
        </div>

        <form onSubmit={addRoutine} className="flex items-center gap-2">
          <input
            type="text"
            value={newRoutineName}
            onChange={(e) => setNewRoutineName(e.target.value)}
            placeholder={t.nav.routines}
            className="rounded-xl px-3.5 py-2 text-xs modern-input"
          />
          <button
            type="submit"
            className="btn-primary rounded-xl px-4 py-2 text-xs font-semibold flex items-center gap-1 min-h-[38px]"
          >
            <Plus className="w-4 h-4" />
            <span>{t.common.add}</span>
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {routines.map((r) => {
          const total = r.items.length;
          const done = r.items.filter((i) => i.completedDates.includes(today)).length;
          const pct = total === 0 ? 0 : Math.round((done / total) * 100);
          return (
            <div key={r.id} className="surface-card rounded-3xl p-5 flex flex-col justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold">{getText(lang, r.name)}</h3>
                  <span className="font-mono-tabular text-xs font-semibold" style={{ color: 'var(--accent-primary)' }}>
                    {done}/{total} ({pct}%)
                  </span>
                </div>

                <div className="h-2 rounded-full overflow-hidden surface-alt">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: 'var(--accent-primary)' }} />
                </div>

                <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                  {r.items.map((it) => {
                    const checked = it.completedDates.includes(today);
                    return (
                      <button
                        key={it.id}
                        type="button"
                        onClick={() => toggleItem(r.id, it.id)}
                        className="w-full py-2.5 flex items-center gap-2.5 text-start text-sm"
                      >
                        {checked ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 opacity-50 shrink-0" />
                        )}
                        <span className={checked ? 'line-through opacity-60' : ''}>{getText(lang, it.title)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <input
                  type="text"
                  value={newItemTexts[r.id] || ''}
                  onChange={(e) => setNewItemTexts((p) => ({ ...p, [r.id]: e.target.value }))}
                  placeholder={t.common.add}
                  className="flex-1 rounded-xl px-3 py-2 text-xs modern-input"
                />
                <button
                  type="button"
                  onClick={() => addStep(r.id)}
                  className="btn-primary rounded-xl px-3.5 py-2 text-xs font-semibold"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
