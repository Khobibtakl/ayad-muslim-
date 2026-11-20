import React, { useEffect, useState } from 'react';
import { Minus, Plus, RotateCcw, Smartphone, Volume2, VolumeX } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getDB, todayKey } from '../db/database';
import { getText } from '../i18n/translations';
import type { TasbeehEntry, TasbeehHistoryLog } from '../types';
import { Icon3D } from './Icons3D';

export const TasbeehView: React.FC = () => {
  const { settings, t } = useApp();
  const lang = settings.language;

  const [entries, setEntries] = useState<TasbeehEntry[]>([]);
  const [selectedId, setSelectedId] = useState<string>('tasbeeh-subhanallah');
  const [soundOn, setSoundOn] = useState(true);
  const [vibrateOn, setVibrateOn] = useState(true);
  const [todayLog, setTodayLog] = useState<TasbeehHistoryLog>({
    date: todayKey(),
    total: 0,
    byId: {},
  });
  const [historyLogs, setHistoryLogs] = useState<TasbeehHistoryLog[]>([]);
  const [newArabic, setNewArabic] = useState('');
  const [newTarget, setNewTarget] = useState(100);

  useEffect(() => {
    (async () => {
      const db = await getDB();
      const [recs, todayRec, allHist] = await Promise.all([
        db.getAll('tasbeeh_records'),
        db.get('tasbeeh_history', todayKey()),
        db.getAll('tasbeeh_history'),
      ]);
      setEntries(recs);
      if (recs.length > 0) setSelectedId(recs[0].id);
      if (todayRec) setTodayLog(todayRec);
      setHistoryLogs(allHist.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7));
    })();
  }, []);

  const current = entries.find((e) => e.id === selectedId) || entries[0];

  const playSoftTick = () => {
    if (!soundOn || typeof window === 'undefined') return;
    try {
      const AudioCtx =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(680, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {
      // Ignore audio policy errors
    }
  };

  const handleStep = async (delta: 1 | -1) => {
    if (!current) return;
    if (delta === -1 && current.count === 0) return;

    if (delta === 1) {
      playSoftTick();
      if (vibrateOn && navigator.vibrate) {
        navigator.vibrate(current.count + 1 >= current.target ? [30, 40, 30] : 18);
      }
    }

    const updatedEntry: TasbeehEntry = {
      ...current,
      count: Math.max(0, current.count + delta),
      totalLifetime: Math.max(0, current.totalLifetime + delta),
    };

    const nextEntries = entries.map((e) => (e.id === current.id ? updatedEntry : e));
    setEntries(nextEntries);

    const today = todayKey();
    const updatedToday: TasbeehHistoryLog = {
      date: today,
      total: Math.max(0, todayLog.total + delta),
      byId: {
        ...todayLog.byId,
        [current.id]: Math.max(0, (todayLog.byId[current.id] || 0) + delta),
      },
    };
    setTodayLog(updatedToday);

    const db = await getDB();
    await db.put('tasbeeh_records', updatedEntry);
    await db.put('tasbeeh_history', updatedToday);
  };

  const handleReset = async () => {
    if (!current) return;
    const updatedEntry: TasbeehEntry = { ...current, count: 0 };
    setEntries((prev) => prev.map((e) => (e.id === current.id ? updatedEntry : e)));
    const db = await getDB();
    await db.put('tasbeeh_records', updatedEntry);
  };

  const handleTargetChange = async (val: number) => {
    if (!current) return;
    const target = Math.max(1, val);
    const updatedEntry: TasbeehEntry = { ...current, target };
    setEntries((prev) => prev.map((e) => (e.id === current.id ? updatedEntry : e)));
    const db = await getDB();
    await db.put('tasbeeh_records', updatedEntry);
  };

  const addCustomDhikr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArabic.trim()) return;
    const entry: TasbeehEntry = {
      id: `tasbeeh-custom-${Date.now()}`,
      arabic: newArabic.trim(),
      title: { ps: newArabic.trim(), ar: newArabic.trim(), fa: newArabic.trim(), en: newArabic.trim() },
      target: Math.max(1, newTarget),
      count: 0,
      totalLifetime: 0,
      isPreset: false,
    };
    const db = await getDB();
    await db.put('tasbeeh_records', entry);
    setEntries((prev) => [...prev, entry]);
    setSelectedId(entry.id);
    setNewArabic('');
  };

  const pct = current ? Math.min(100, Math.round((current.count / current.target) * 100)) : 0;
  const ringRadius = 104;
  const ringCirc = 2 * Math.PI * ringRadius;
  const ringOffset = ringCirc - (pct / 100) * ringCirc;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Counter Card with SVG Radial Progress Ring */}
        <div className="lg:col-span-7 surface-elevated rounded-3xl p-6 sm:p-8 space-y-6 text-center">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon3D kind="tasbeeh" size={38} className="shrink-0" />
              <h2 className="text-xl font-bold">{t.nav.tasbeeh}</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSoundOn((s) => !s)}
                className="p-2 rounded-xl border min-h-[40px] min-w-[40px] flex items-center justify-center transition-colors"
                style={{
                  borderColor: soundOn ? 'var(--accent-primary)' : 'var(--border-subtle)',
                  backgroundColor: soundOn ? 'var(--accent-soft)' : 'var(--bg-surface-alt)',
                  color: soundOn ? 'var(--accent-primary)' : 'var(--text-muted)',
                }}
                aria-label={t.prayers.adhanAlert}
              >
                {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setVibrateOn((v) => !v)}
                className="p-2 rounded-xl border min-h-[40px] min-w-[40px] flex items-center justify-center transition-colors"
                style={{
                  borderColor: vibrateOn ? 'var(--accent-primary)' : 'var(--border-subtle)',
                  backgroundColor: vibrateOn ? 'var(--accent-soft)' : 'var(--bg-surface-alt)',
                  color: vibrateOn ? 'var(--accent-primary)' : 'var(--text-muted)',
                }}
                aria-label={t.nav.tasbeeh}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>

          {current && (
            <>
              <div className="space-y-2">
                <p className="font-arabic text-3xl sm:text-4xl font-bold" style={{ color: 'var(--accent-primary)' }}>
                  {current.arabic}
                </p>
                <p className="text-xs font-mono-tabular" style={{ color: 'var(--text-muted)' }}>
                  {getText(lang, current.title)} · {t.common.today}: {todayLog.total} · {t.common.total}: {current.totalLifetime}
                </p>
              </div>

              {/* Precision Animated SVG Radial Tap Button */}
              <div className="flex justify-center py-3">
                <div className="relative w-60 h-60 flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 240 240">
                    <circle
                      cx="120"
                      cy="120"
                      r={ringRadius}
                      fill="none"
                      stroke="var(--bg-surface-alt)"
                      strokeWidth="10"
                    />
                    <circle
                      cx="120"
                      cy="120"
                      r={ringRadius}
                      fill="none"
                      stroke={pct >= 100 ? 'var(--accent-gold)' : 'var(--accent-primary)'}
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={ringCirc}
                      strokeDashoffset={ringOffset}
                      style={{ transition: 'stroke-dashoffset 240ms cubic-bezier(0.16, 1, 0.3, 1)' }}
                    />
                  </svg>
                  <button
                    type="button"
                    onClick={() => handleStep(1)}
                    className="w-44 h-44 rounded-full surface-card flex flex-col items-center justify-center active:scale-[0.96] transition-transform cursor-pointer select-none"
                    style={{
                      backgroundColor: 'var(--accent-soft)',
                      borderColor: 'var(--border-strong)',
                    }}
                  >
                    <span className="font-mono-tabular text-5xl font-bold tracking-tight" style={{ color: 'var(--accent-primary)' }}>
                      {current.count}
                    </span>
                    <span className="text-xs mt-1.5 font-mono-tabular font-semibold" style={{ color: 'var(--text-secondary)' }}>
                      / {current.target} · {pct}%
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => handleStep(-1)}
                  className="px-4 py-2.5 rounded-xl surface-alt text-xs font-semibold flex items-center gap-1.5 min-h-[44px] hover:opacity-85 active:scale-95 transition-all"
                >
                  <Minus className="w-4 h-4" />
                  <span>-1</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-xl surface-alt text-xs font-semibold flex items-center gap-1.5 min-h-[44px] hover:opacity-85 active:scale-95 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t.common.reset}</span>
                </button>
                <select
                  value={current.target}
                  onChange={(e) => handleTargetChange(Number(e.target.value))}
                  className="rounded-xl px-3.5 py-2.5 text-xs font-mono-tabular font-semibold min-h-[44px] modern-input"
                >
                  <option value={33}>33</option>
                  <option value={34}>34</option>
                  <option value={99}>99</option>
                  <option value={100}>100</option>
                  <option value={300}>300</option>
                  <option value={1000}>1000</option>
                </select>
              </div>
            </>
          )}
        </div>

        {/* Dhikr Selector & Custom Form */}
        <div className="lg:col-span-5 space-y-5">
          <div className="surface-card rounded-3xl p-5 sm:p-6 space-y-3">
            <h3 className="text-sm font-bold">{t.nav.tasbeeh}</h3>
            <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
              {entries.map((item) => {
                const active = item.id === current?.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className="w-full py-2.5 px-3.5 flex items-center justify-between text-start rounded-xl border transition-all"
                    style={{
                      backgroundColor: active ? 'var(--accent-soft)' : 'transparent',
                      borderColor: active ? 'var(--accent-primary)' : 'transparent',
                    }}
                  >
                    <div>
                      <div className="font-arabic text-base font-semibold">{item.arabic}</div>
                      <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        {getText(lang, item.title)}
                      </div>
                    </div>
                    <span className="font-mono-tabular text-xs font-semibold" style={{ color: active ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
                      {item.count}/{item.target}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={addCustomDhikr} className="surface-card rounded-3xl p-5 sm:p-6 space-y-3">
            <h3 className="text-sm font-bold">{t.common.add}</h3>
            <input
              type="text"
              value={newArabic}
              onChange={(e) => setNewArabic(e.target.value)}
              placeholder="سُبْحَانَ اللَّهِ الْعَظِيمِ"
              className="w-full rounded-xl px-3.5 py-2.5 text-sm modern-input"
            />
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={newTarget}
                onChange={(e) => setNewTarget(Number(e.target.value))}
                className="w-28 rounded-xl px-3.5 py-2.5 text-sm font-mono-tabular modern-input"
              />
              <button
                type="submit"
                className="flex-1 rounded-xl py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 min-h-[44px] btn-primary"
              >
                <Plus className="w-4 h-4" />
                <span>{t.common.add}</span>
              </button>
            </div>
          </form>

          {historyLogs.length > 0 && (
            <div className="surface-card rounded-3xl p-5 sm:p-6 space-y-3">
              <h3 className="text-sm font-bold">{t.common.today}</h3>
              <div className="grid grid-cols-2 gap-2.5">
                {historyLogs.map((log) => (
                  <div key={log.date} className="surface-alt rounded-xl p-3 text-xs flex justify-between">
                    <span className="font-mono-tabular">{log.date}</span>
                    <span className="font-mono-tabular font-semibold" style={{ color: 'var(--accent-primary)' }}>
                      {log.total}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
