import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { getDB } from '../db/database';
import { sha256Hex } from '../utils/cryptoBackup';
import { Icon3D } from './Icons3D';

export const StatisticsView: React.FC = () => {
  const { settings, t, quranProgress, updateSettings } = useApp();
  const [unlocked, setUnlocked] = useState(!settings.statsPinHash);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [showPinForm, setShowPinForm] = useState(false);
  const [newPinValue, setNewPinValue] = useState('');
  const [pinFormError, setPinFormError] = useState('');

  const [metrics, setMetrics] = useState({
    prayersLogged: 0,
    adhkarCompleted: 0,
    tasbeehTotal: 0,
    booksOpened: 0,
    tasksCompleted: 0,
    weeklySeries: [] as Array<{ label: string; value: number }>,
  });

  useEffect(() => {
    setUnlocked(!settings.statsPinHash);
  }, [settings.statsPinHash]);

  useEffect(() => {
    (async () => {
      const db = await getDB();
      const [prayers, adhkarProg, tasbeehRecs, tasbeehHist, readingHist, tasks] = await Promise.all([
        db.getAll('prayer_history'),
        db.getAll('adhkar_progress'),
        db.getAll('tasbeeh_records'),
        db.getAll('tasbeeh_history'),
        db.getAll('reading_history'),
        db.getAll('tasks'),
      ]);

      let prayerCount = 0;
      prayers.forEach((p) => {
        if (p.fajr) prayerCount++;
        if (p.dhuhr) prayerCount++;
        if (p.asr) prayerCount++;
        if (p.maghrib) prayerCount++;
        if (p.isha) prayerCount++;
      });

      const adhkarCount = adhkarProg.reduce((sum, r) => sum + r.completedIds.length, 0);
      const tasbeehTotal = tasbeehRecs.reduce((sum, r) => sum + r.totalLifetime, 0);
      const booksOpened = readingHist.filter((r) => r.type === 'book').length;
      const tasksCompleted = tasks.filter((tk) => tk.status === 'completed').length;

      // Build 7-day real activity chart from prayer_history + tasbeeh_history + quran_progress
      const series: Array<{ label: string; value: number }> = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const pRow = prayers.find((x) => x.date === key);
        const pScore = pRow
          ? [pRow.fajr, pRow.dhuhr, pRow.asr, pRow.maghrib, pRow.isha].filter(Boolean).length
          : 0;
        const tRow = tasbeehHist.find((x) => x.date === key);
        const aRow = adhkarProg.find((x) => x.date === key);
        const qRow = quranProgress.history?.find((x) => x.date === key);
        const totalActivity =
          pScore * 10 + (aRow?.completedIds.length || 0) * 5 + (qRow?.ayahs || 0) + Math.min(30, tRow?.total || 0);
        series.push({ label: key.slice(5), value: totalActivity });
      }

      setMetrics({
        prayersLogged: prayerCount,
        adhkarCompleted: adhkarCount,
        tasbeehTotal,
        booksOpened,
        tasksCompleted,
        weeklySeries: series,
      });
    })();
  }, [quranProgress]);

  const verifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    const hashed = await sha256Hex(pinInput);
    if (hashed === settings.statsPinHash) {
      setUnlocked(true);
      setPinError('');
      setPinInput('');
    } else {
      setPinError(t.settingsModule.wrongPin);
    }
  };

  if (!unlocked) {
    return (
      <div className="surface-elevated rounded-3xl p-8 max-w-md mx-auto text-center space-y-4">
        <div className="flex justify-center">
          <Icon3D kind="lock" size={52} />
        </div>
        <h2 className="text-lg font-bold">{t.nav.statistics}</h2>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {t.settingsModule.unlockStats}
        </p>
        <form onSubmit={verifyPin} className="space-y-3">
          <input
            type="password"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            placeholder={t.statsModule.pinPlaceholder}
            className="w-full rounded-xl px-4 py-2.5 text-center font-mono-tabular modern-input"
          />
          {pinError && <p className="text-xs text-rose-600">{pinError}</p>}
          <button
            type="submit"
            className="btn-primary w-full rounded-xl py-2.5 text-xs font-semibold"
          >
            {t.common.confirm}
          </button>
        </form>
      </div>
    );
  }

  const maxVal = Math.max(10, ...metrics.weeklySeries.map((s) => s.value));

  return (
    <div className="space-y-6">
      <div className="surface-elevated rounded-3xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Icon3D kind="statistics" size={44} className="shrink-0" />
          <div>
            <h2 className="text-xl font-bold">{t.nav.statistics}</h2>
            <p className="text-xs mt-1 flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
              <Icon3D kind="shield" size={16} />
              <span>{t.statsModule.localRealData}</span>
            </p>
          </div>
        </div>
        {settings.statsPinHash && (
          <button
            type="button"
            onClick={() => setUnlocked(false)}
            className="rounded-xl border px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <Icon3D kind="lock" size={16} />
            <span>{t.statsModule.lockBtn}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: t.nav.prayer, value: metrics.prayersLogged },
          { label: t.nav.quran, value: quranProgress.totalAyahsRead },
          { label: t.nav.adhkar, value: metrics.adhkarCompleted },
          { label: t.nav.tasbeeh, value: metrics.tasbeehTotal },
          { label: t.nav.library, value: metrics.booksOpened },
          { label: t.nav.tasks, value: metrics.tasksCompleted },
        ].map((card) => (
          <div key={card.label} className="surface-card rounded-2xl p-4 space-y-1">
            <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
              {card.label}
            </div>
            <div className="font-mono-tabular text-2xl font-bold" style={{ color: 'var(--accent-primary)' }}>
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Real 7-Day Activity Bar Chart */}
      <div className="surface-card rounded-3xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold">{t.statsModule.weeklyChartTitle}</h3>
          {!settings.statsPinHash && !showPinForm && (
            <button
              type="button"
              onClick={() => setShowPinForm(true)}
              className="text-xs underline"
              style={{ color: 'var(--accent-primary)' }}
            >
              {t.settingsModule.setPin}
            </button>
          )}
          {showPinForm && (
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="password"
                value={newPinValue}
                onChange={(e) => {
                  setNewPinValue(e.target.value);
                  setPinFormError('');
                }}
                placeholder={t.statsModule.pinLengthHint}
                className="rounded-lg border px-2.5 py-1 text-xs font-mono-tabular w-32"
                style={{ backgroundColor: 'var(--bg-surface-alt)', borderColor: 'var(--border-subtle)' }}
              />
              <button
                type="button"
                onClick={async () => {
                  if (newPinValue.trim().length >= 4) {
                    await updateSettings({ statsPinHash: await sha256Hex(newPinValue.trim()) });
                    setNewPinValue('');
                    setPinFormError('');
                    setShowPinForm(false);
                  } else {
                    setPinFormError(t.statsModule.pinLengthHint);
                  }
                }}
                className="rounded-lg px-3 py-1 text-xs font-semibold text-white"
                style={{ backgroundColor: 'var(--accent-primary)' }}
              >
                {t.common.save}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPinFormError('');
                  setShowPinForm(false);
                }}
                className="text-xs"
              >
                {t.common.cancel}
              </button>
              {pinFormError && <span className="text-xs text-rose-600">{pinFormError}</span>}
            </div>
          )}
        </div>

        <div className="h-48 flex items-end justify-between gap-2 pt-4">
          {metrics.weeklySeries.map((bar) => {
            const hPct = Math.round((bar.value / maxVal) * 100);
            return (
              <div key={bar.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="font-mono-tabular text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  {bar.value}
                </span>
                <div className="w-full max-w-[44px] h-32 surface-alt rounded-lg flex items-end overflow-hidden">
                  <div
                    className="w-full rounded-lg transition-all"
                    style={{ height: `${Math.max(4, hPct)}%`, backgroundColor: 'var(--accent-primary)' }}
                  />
                </div>
                <span className="font-mono-tabular text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                  {bar.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
