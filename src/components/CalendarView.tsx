import React, { useMemo, useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  getHijriParts,
  getLocaleTag,
  getNextIslamicOccasion,
  getUpcomingIslamicOccasions,
} from '../utils/islamicCalc';
import { Icon3D } from './Icons3D';

export const CalendarView: React.FC = () => {
  const { settings, t, isRTL } = useApp();
  const lang = settings.language;
  const locale = getLocaleTag(lang);
  const [viewDate, setViewDate] = useState(() => new Date());

  const today = new Date();
  const hijriToday = getHijriParts(today);
  const nextOccasion = useMemo(() => getNextIslamicOccasion(today), []);
  const upcomingList = useMemo(() => getUpcomingIslamicOccasions(today, 12), []);

  const isAyyamAlBid = hijriToday.day >= 13 && hijriToday.day <= 15;
  const isMonThu = today.getDay() === 1 || today.getDay() === 4;
  const isAshuraOrTasua = hijriToday.month === 1 && (hijriToday.day === 9 || hijriToday.day === 10);
  const isArafah = hijriToday.month === 12 && hijriToday.day === 9;

  const monthGrid = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const first = new Date(year, month, 1);
    const startOffset = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: Array<{ date: Date | null; hijriDay?: number; hijriMonth?: number }> = [];
    for (let i = 0; i < startOffset; i++) cells.push({ date: null });
    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(year, month, d);
      const hp = getHijriParts(dt);
      cells.push({ date: dt, hijriDay: hp.day, hijriMonth: hp.month });
    }
    return cells;
  }, [viewDate]);

  const headerHijri = getHijriParts(new Date(viewDate.getFullYear(), viewDate.getMonth(), 15));

  return (
    <div className="space-y-6">
      <div className="surface-elevated rounded-3xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Icon3D kind="calendar" size={44} className="shrink-0" />
            <div>
              <h2 className="text-xl font-bold">{t.nav.calendar}</h2>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                {hijriToday.day} {t.hijriMonths[(hijriToday.month - 1) % 12]} {hijriToday.year} {t.hijriYearSuffix} ·{' '}
                {today.toLocaleDateString(locale, { dateStyle: 'full' })}
              </p>
            </div>
          </div>
          <div className="surface-alt rounded-2xl px-4 py-2.5 text-xs">
            <span className="font-semibold" style={{ color: 'var(--accent-primary)' }}>
              {t.calendarModule[nextOccasion.key]}
            </span>{' '}
            · <span className="font-mono-tabular font-bold">{nextOccasion.daysUntil} {t.dashboard.daysLeft}</span>
          </div>
        </div>

        {/* Sunnah Fasting Indicators */}
        <div className="surface-alt rounded-2xl p-4 space-y-2">
          <div className="text-xs font-bold" style={{ color: 'var(--accent-primary)' }}>
            {t.calendarModule.fastingIndicatorsTitle}
          </div>
          <div className="flex flex-wrap gap-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <span className={isAyyamAlBid ? 'font-bold' : ''} style={{ color: isAyyamAlBid ? 'var(--accent-primary)' : undefined }}>
              • {t.calendarModule.ayyamAlBidLabel}
            </span>
            <span className={isMonThu ? 'font-bold' : ''} style={{ color: isMonThu ? 'var(--accent-primary)' : undefined }}>
              • {t.calendarModule.sunnahFastMonThu}
            </span>
            {isAshuraOrTasua && (
              <span className="font-bold" style={{ color: 'var(--accent-primary)' }}>
                • {hijriToday.day === 9 ? t.calendarModule.tasua : t.calendarModule.ashura}
              </span>
            )}
            {isArafah && (
              <span className="font-bold" style={{ color: 'var(--accent-primary)' }}>
                • {t.calendarModule.arafah}
              </span>
            )}
          </div>
        </div>

        <div className="surface-alt rounded-2xl p-3.5 flex items-start gap-2.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
          <Info className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--accent-primary)' }} />
          <span>{t.calendarModule.sightingNote}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Dual Month Grid */}
        <div className="lg:col-span-7 surface-card rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
              className="p-2 rounded-xl border"
              style={{ borderColor: 'var(--border-subtle)' }}
              aria-label={t.common.previous}
            >
              {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
            <div className="text-center">
              <div className="text-base font-bold">
                {viewDate.toLocaleDateString(locale, { month: 'long', year: 'numeric' })}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {t.hijriMonths[(headerHijri.month - 1) % 12]} {headerHijri.year} {t.hijriYearSuffix}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
              className="p-2 rounded-xl border"
              style={{ borderColor: 'var(--border-subtle)' }}
              aria-label={t.common.next}
            >
              {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>
            {t.weekdays.map((wd) => (
              <div key={wd} className="py-1 truncate">{wd}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {monthGrid.map((cell, i) => {
              if (!cell.date) return <div key={i} className="h-14" />;
              const isToday =
                cell.date.getDate() === today.getDate() &&
                cell.date.getMonth() === today.getMonth() &&
                cell.date.getFullYear() === today.getFullYear();
              const isFriday = cell.date.getDay() === 5;
              const isWhiteDay = (cell.hijriDay || 0) >= 13 && (cell.hijriDay || 0) <= 15;

              return (
                <div
                  key={i}
                  className="h-14 rounded-xl border p-1.5 flex flex-col justify-between text-center"
                  style={{
                    backgroundColor: isToday
                      ? 'var(--accent-primary)'
                      : isFriday || isWhiteDay
                      ? 'var(--accent-soft)'
                      : 'var(--bg-surface-alt)',
                    color: isToday ? '#ffffff' : 'var(--text-primary)',
                    borderColor: isToday ? 'var(--accent-primary)' : 'var(--border-subtle)',
                  }}
                >
                  <span className="font-mono-tabular text-xs font-bold">{cell.date.getDate()}</span>
                  <span className="font-mono-tabular text-[10px] opacity-80">{cell.hijriDay}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* All 12 Upcoming Islamic Occasions & Hijri Months */}
        <div className="lg:col-span-5 space-y-4">
          <div className="surface-card rounded-3xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold">
              <CalendarIcon className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
              <span>{t.calendarModule.eventsTitle} ({upcomingList.length})</span>
            </div>
            <div className="divide-y max-h-[380px] overflow-y-auto" style={{ borderColor: 'var(--border-subtle)' }}>
              {upcomingList.map((ev) => (
                <div key={ev.key} className="py-2.5 flex items-center justify-between text-xs gap-2">
                  <div>
                    <div className="font-semibold">{t.calendarModule[ev.key]}</div>
                    <div style={{ color: 'var(--text-muted)' }}>
                      {ev.hijriDay} {t.hijriMonths[(ev.hijriMonth - 1) % 12]} · {ev.gregorianDate.toLocaleDateString(locale)}
                    </div>
                  </div>
                  <span className="font-mono-tabular font-bold shrink-0" style={{ color: 'var(--accent-primary)' }}>
                    {ev.daysUntil} {t.daysShortUnit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card rounded-3xl p-5 space-y-2.5">
            <h3 className="text-sm font-bold">{t.calendarModule.hijriMonthsCount}</h3>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {t.hijriMonths.map((m, idx) => (
                <div key={m} className="surface-alt rounded-xl px-2.5 py-1.5 flex items-center justify-between">
                  <span>{m}</span>
                  <span className="font-mono-tabular opacity-60">{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
