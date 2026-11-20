import React, { useEffect, useMemo, useState } from 'react';
import { Bell, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getDB, todayKey } from '../db/database';
import type { PrayerHistoryLog, UserSettings } from '../types';
import {
  computePrayerTimesForDate,
  formatTimeShort,
  getHijriParts,
  getLocaleTag,
  getLocalizedCityName,
  PRESET_CITIES,
} from '../utils/islamicCalc';
import { Icon3D } from './Icons3D';

export const PrayerTimesView: React.FC = () => {
  const { settings, t, updateSettings, pushNotification } = useApp();
  const lang = settings.language;

  const [now, setNow] = useState(() => new Date());
  const [prayerLog, setPrayerLog] = useState<PrayerHistoryLog>({
    date: todayKey(),
    fajr: false,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false,
  });
  const [showMonthly, setShowMonthly] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    (async () => {
      const db = await getDB();
      const row = await db.get('prayer_history', todayKey());
      if (row) setPrayerLog(row);
    })();
  }, []);

  const times = useMemo(() => computePrayerTimesForDate(now, settings), [now, settings]);

  const countdown = useMemo(() => {
    const diff = Math.max(0, times.nextPrayerTime.getTime() - now.getTime());
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }, [now, times]);

  const detectGPS = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await updateSettings({
          latitude: Number(pos.coords.latitude.toFixed(4)),
          longitude: Number(pos.coords.longitude.toFixed(4)),
          locationGranted: true,
          city: 'GPS',
        });
      },
      undefined,
      { timeout: 8000 }
    );
  };

  const togglePrayerDone = async (key: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha') => {
    const updated: PrayerHistoryLog = {
      ...prayerLog,
      date: todayKey(),
      [key]: !prayerLog[key],
    };
    setPrayerLog(updated);
    const db = await getDB();
    await db.put('prayer_history', updated);
  };

  const playAdhanChime = () => {
    try {
      const AudioCtx =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const notes = [440, 523.25, 587.33, 659.25];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.25);
        gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.25);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.25 + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.25);
        osc.stop(ctx.currentTime + idx * 0.25 + 0.48);
      });
      pushNotification(
        t.prayers.adhanAlert,
        `${t.prayers[times.nextPrayer]} · ${formatTimeShort(times.nextPrayerTime)}`,
        'prayer',
        'prayer'
      );
    } catch {
      // ignore
    }
  };

  const monthlyRows = useMemo(() => {
    if (!showMonthly) return [];
    const rows = [];
    const locale = getLocaleTag(lang);
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const pt = computePrayerTimesForDate(d, settings);
      const h = getHijriParts(d);
      rows.push({
        gDate: d.toLocaleDateString(locale, { month: 'short', day: 'numeric' }),
        hDate: `${h.day} ${t.hijriMonths[(h.month - 1) % 12]}`,
        pt,
      });
    }
    return rows;
  }, [lang, settings, showMonthly, t.hijriMonths]);

  const fivePrayers: Array<{ key: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'; label: string; time: Date }> = [
    { key: 'fajr', label: t.prayers.fajr, time: times.fajr },
    { key: 'dhuhr', label: t.prayers.dhuhr, time: times.dhuhr },
    { key: 'asr', label: t.prayers.asr, time: times.asr },
    { key: 'maghrib', label: t.prayers.maghrib, time: times.maghrib },
    { key: 'isha', label: t.prayers.isha, time: times.isha },
  ];

  const cityDisplay = getLocalizedCityName(settings.city, lang, t.gpsLabel);

  return (
    <div className="space-y-6">
      {/* Top Countdown & Location */}
      <div className="surface-elevated rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Icon3D kind="prayer" size={42} className="shrink-0" />
          <div className="space-y-1">
            <h2 className="text-xl font-bold">{t.nav.prayer}</h2>
            <p className="text-xs font-mono-tabular" style={{ color: 'var(--text-secondary)' }}>
              {t.prayers.city}: {cityDisplay} ({settings.latitude.toFixed(2)}, {settings.longitude.toFixed(2)}) ·{' '}
              {t.prayers.sunrise}: {formatTimeShort(times.sunrise)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="surface-alt rounded-2xl px-4 py-2 text-center">
            <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              {t.dashboard.nextPrayer}: {t.prayers[times.nextPrayer]}
            </div>
            <div className="font-mono-tabular text-2xl font-bold tracking-tight" style={{ color: 'var(--accent-primary)' }}>
              {countdown}
            </div>
          </div>

          <button
            type="button"
            onClick={detectGPS}
            className="inline-flex items-center gap-1.5 rounded-xl surface-alt px-3.5 py-2.5 text-xs font-semibold min-h-[42px] hover:opacity-90"
          >
            <Icon3D kind="location" size={18} />
            <span>{t.prayers.detectLocation}</span>
          </button>

          <button
            type="button"
            onClick={playAdhanChime}
            className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold min-h-[42px] btn-primary"
          >
            <Icon3D kind="sound" size={18} />
            <span>{t.prayers.adhanAlert}</span>
          </button>
        </div>
      </div>

      {/* 5 Prayers Interactive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {fivePrayers.map((p) => {
          const isNext = p.key === times.nextPrayer;
          const done = prayerLog[p.key];
          return (
            <div
              key={p.key}
              className="surface-card rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all"
              style={{
                borderColor: isNext ? 'var(--accent-primary)' : 'var(--border-subtle)',
                backgroundColor: isNext ? 'var(--accent-soft)' : 'var(--bg-surface)',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">{p.label}</span>
                {isNext && <Bell className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />}
              </div>
              <div className="font-mono-tabular text-3xl font-bold tracking-tight" style={{ color: 'var(--accent-primary)' }}>
                {formatTimeShort(p.time)}
              </div>
              <button
                type="button"
                onClick={() => togglePrayerDone(p.key)}
                className={`w-full rounded-xl py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border min-h-[42px] transition-all ${
                  done ? 'btn-primary border-transparent' : ''
                }`}
                style={
                  done
                    ? undefined
                    : {
                        backgroundColor: 'var(--bg-surface-alt)',
                        color: 'var(--text-primary)',
                        borderColor: 'var(--border-subtle)',
                      }
                }
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{done ? t.prayers.prayed : t.prayers.markPrayed}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Calculation Method, Madhab, City & Minute Adjustments */}
      <div className="surface-card rounded-3xl p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold block">{t.prayers.selectCity}</label>
          <select
            value={PRESET_CITIES.some((c) => c.name === settings.city) ? settings.city : 'GPS'}
            onChange={(e) => {
              const found = PRESET_CITIES.find((c) => c.name === e.target.value);
              if (found) {
                updateSettings({ city: found.name, latitude: found.lat, longitude: found.lng });
              }
            }}
            className="w-full rounded-xl px-3.5 py-2.5 text-sm modern-input"
          >
            {!PRESET_CITIES.some((c) => c.name === settings.city) && (
              <option value="GPS">{cityDisplay}</option>
            )}
            {PRESET_CITIES.map((c) => (
              <option key={c.name} value={c.name}>{c.label[lang]}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold block">{t.prayers.calcMethod}</label>
          <select
            value={settings.calcMethod}
            onChange={(e) => updateSettings({ calcMethod: e.target.value as UserSettings['calcMethod'] })}
            className="w-full rounded-xl px-3.5 py-2.5 text-sm modern-input"
          >
            <option value="Karachi">{t.prayers.methods.Karachi}</option>
            <option value="MuslimWorldLeague">{t.prayers.methods.MuslimWorldLeague}</option>
            <option value="UmmAlQura">{t.prayers.methods.UmmAlQura}</option>
            <option value="Egyptian">{t.prayers.methods.Egyptian}</option>
            <option value="NorthAmerica">{t.prayers.methods.NorthAmerica}</option>
            <option value="Tehran">{t.prayers.methods.Tehran}</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold block">{t.prayers.madhab}</label>
          <select
            value={settings.madhab}
            onChange={(e) => updateSettings({ madhab: e.target.value as UserSettings['madhab'] })}
            className="w-full rounded-xl px-3.5 py-2.5 text-sm modern-input"
          >
            <option value="Hanafi">{t.prayers.hanafi}</option>
            <option value="Shafi">{t.prayers.shafi}</option>
          </select>
        </div>

        <div className="md:col-span-3 pt-3 border-t space-y-2.5" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="text-xs font-semibold">{t.prayers.adjustments}</div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const).map((k) => (
              <div key={k} className="surface-alt rounded-xl p-3 flex items-center justify-between text-xs">
                <span className="font-medium">{t.prayers[k].split(' ')[0]}</span>
                <input
                  type="number"
                  min={-30}
                  max={30}
                  value={settings.prayerAdjustments[k]}
                  onChange={(e) =>
                    updateSettings({
                      prayerAdjustments: {
                        ...settings.prayerAdjustments,
                        [k]: Number(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-16 rounded-lg px-2 py-1 text-center font-mono-tabular modern-input"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 30-Day Monthly Timetable */}
      <div className="surface-card rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold">{t.prayers.monthlyCalendar}</h3>
          <button
            type="button"
            onClick={() => setShowMonthly((v) => !v)}
            className="rounded-xl surface-alt px-4 py-2 text-xs font-semibold hover:opacity-90"
          >
            {showMonthly ? t.common.close : t.prayers.monthlyCalendar}
          </button>
        </div>

        {showMonthly && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th className="py-2.5 px-2 text-start">{t.dashboard.gregorianDate}</th>
                  <th className="py-2.5 px-2 text-start">{t.dashboard.hijriDate}</th>
                  <th className="py-2.5 px-2 font-mono-tabular">{t.prayers.fajr.split(' ')[0]}</th>
                  <th className="py-2.5 px-2 font-mono-tabular">{t.prayers.dhuhr.split(' ')[0]}</th>
                  <th className="py-2.5 px-2 font-mono-tabular">{t.prayers.asr.split(' ')[0]}</th>
                  <th className="py-2.5 px-2 font-mono-tabular">{t.prayers.maghrib.split(' ')[0]}</th>
                  <th className="py-2.5 px-2 font-mono-tabular">{t.prayers.isha.split(' ')[0]}</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                {monthlyRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                    <td className="py-2.5 px-2">{row.gDate}</td>
                    <td className="py-2.5 px-2">{row.hDate}</td>
                    <td className="py-2.5 px-2 text-center font-mono-tabular">{formatTimeShort(row.pt.fajr)}</td>
                    <td className="py-2.5 px-2 text-center font-mono-tabular">{formatTimeShort(row.pt.dhuhr)}</td>
                    <td className="py-2.5 px-2 text-center font-mono-tabular">{formatTimeShort(row.pt.asr)}</td>
                    <td className="py-2.5 px-2 text-center font-mono-tabular">{formatTimeShort(row.pt.maghrib)}</td>
                    <td className="py-2.5 px-2 text-center font-mono-tabular">{formatTimeShort(row.pt.isha)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
