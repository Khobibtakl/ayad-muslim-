import React, { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Bell,
  BellRing,
  Check,
  CheckCheck,
  Clock,
  RefreshCw,
  Trash2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { ModuleId, UserSettings } from '../types';
import { getLocaleTag } from '../utils/islamicCalc';
import { Icon3D } from './Icons3D';

export const NotificationsView: React.FC = () => {
  const {
    settings,
    t,
    updateSettings,
    notifications,
    notifPermission,
    requestBrowserNotifPermission,
    soundEnabled,
    toggleNotifSound,
    markNotificationRead,
    deleteNotification,
    clearReadNotifications,
    markAllNotificationsRead,
    pushNotification,
    runNotificationCheck,
    getTodayScheduledAlerts,
    setActiveModule,
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [checking, setChecking] = useState(false);

  const lang = settings.language;
  const locale = getLocaleTag(lang);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const visibleNotifications = useMemo(
    () => (filter === 'unread' ? notifications.filter((n) => !n.read) : notifications),
    [filter, notifications]
  );

  const scheduledToday = useMemo(() => getTodayScheduledAlerts(), [getTodayScheduledAlerts]);

  const togglePref = async (key: keyof UserSettings['notifications']) => {
    await updateSettings({
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key],
      },
    });
  };

  const prefs: Array<{ key: keyof UserSettings['notifications']; label: string }> = [
    { key: 'prayer', label: t.nav.prayer },
    { key: 'morningAdhkar', label: t.notificationsModule.morningAdhkarLabel },
    { key: 'eveningAdhkar', label: t.notificationsModule.eveningAdhkarLabel },
    { key: 'quranDaily', label: t.nav.quran },
    { key: 'tasks', label: t.nav.tasks },
    { key: 'reading', label: t.nav.library },
    { key: 'friday', label: t.calendarModule.friday },
    { key: 'events', label: t.calendarModule.eventsTitle },
  ];

  const permissionStatusText =
    notifPermission === 'granted'
      ? t.notificationsModule.permissionGranted
      : notifPermission === 'denied'
      ? t.notificationsModule.permissionBlocked
      : notifPermission === 'unsupported'
      ? t.notificationsModule.permissionUnsupported
      : t.notificationsModule.permissionDefault;

  const categoryLabel = (cat: string): string => {
    switch (cat) {
      case 'prayer':
        return t.nav.prayer;
      case 'adhkar':
        return t.nav.adhkar;
      case 'quran':
        return t.nav.quran;
      case 'tasks':
        return t.nav.tasks;
      case 'duas':
        return t.nav.duas;
      case 'friday':
        return t.calendarModule.friday;
      case 'events':
        return t.calendarModule.eventsTitle;
      default:
        return t.nav.notifications;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Primary Controls */}
      <div className="surface-card rounded-3xl p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Icon3D kind="notifications" size={44} className="shrink-0" />
            <div>
              <h2 className="text-xl font-bold">{t.nav.notifications}</h2>
              <p className="text-xs mt-1 font-mono-tabular" style={{ color: 'var(--text-secondary)' }}>
                {unreadCount} {t.notificationsModule.unreadLabel}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={toggleNotifSound}
              className="rounded-xl border px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors"
              style={{
                borderColor: soundEnabled ? 'var(--accent-primary)' : 'var(--border-subtle)',
                backgroundColor: soundEnabled ? 'var(--accent-soft)' : 'var(--bg-surface-alt)',
                color: soundEnabled ? 'var(--accent-primary)' : 'var(--text-secondary)',
              }}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{t.notificationsModule.soundChime}</span>
            </button>

            <button
              type="button"
              onClick={async () => {
                await pushNotification(
                  t.notificationsModule.testTitle,
                  t.notificationsModule.testBody,
                  'system',
                  'notifications'
                );
              }}
              className="rounded-xl border px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
              style={{
                borderColor: 'var(--border-strong)',
                backgroundColor: 'var(--bg-surface-alt)',
              }}
            >
              <BellRing className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
              <span>{t.notificationsModule.testAlert}</span>
            </button>

            <button
              type="button"
              disabled={checking}
              onClick={async () => {
                setChecking(true);
                await runNotificationCheck(true);
                setChecking(false);
              }}
              className="btn-primary rounded-xl px-4 py-2 text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
              <span>{t.notificationsModule.checkReminders}</span>
            </button>
          </div>
        </div>

        {/* Permission Status & Guidance */}
        <div
          className="surface-alt rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3"
        >
          <div className="space-y-1 min-w-0 flex-1">
            <div className="text-xs font-bold flex items-center gap-2">
              <Bell className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--accent-primary)' }} />
              <span>{permissionStatusText}</span>
            </div>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              {t.notificationsModule.inAppFallbackNote}
            </p>
          </div>

          {notifPermission !== 'granted' && notifPermission !== 'unsupported' && (
            <button
              type="button"
              onClick={() => void requestBrowserNotifPermission()}
              className="rounded-xl border px-3.5 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors"
              style={{
                borderColor: 'var(--accent-primary)',
                color: 'var(--accent-primary)',
                backgroundColor: 'var(--bg-surface)',
              }}
            >
              {t.onboarding.allowNotif}
            </button>
          )}
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Today's Schedule + Preferences */}
        <div className="lg:col-span-5 space-y-6">
          {/* Today's Scheduled Reminders */}
          <div className="surface-card rounded-3xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
              <h3 className="text-sm font-bold">{t.notificationsModule.scheduledTodayTitle}</h3>
            </div>

            <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
              {scheduledToday.map((item) => (
                <div
                  key={item.id}
                  className="py-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{item.title}</div>
                    <div className="text-[11px] font-mono-tabular mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {item.time} · {item.enabled ? t.common.enable : t.common.disable}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveModule(item.targetModule)}
                    className="rounded-xl border px-2.5 py-1.5 text-[11px] font-semibold flex items-center gap-1 whitespace-nowrap shrink-0 hover:opacity-85"
                    style={{
                      borderColor: 'var(--border-subtle)',
                      color: item.dueNow ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      backgroundColor: item.dueNow ? 'var(--accent-soft)' : 'transparent',
                    }}
                  >
                    <span>{t.notificationsModule.openModule}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div className="surface-card rounded-3xl p-5 space-y-3">
            <h3 className="text-sm font-bold">{t.notificationsModule.prefsTitle}</h3>
            <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
              {prefs.map((p) => {
                const on = settings.notifications[p.key];
                return (
                  <div key={p.key} className="py-3 flex items-center justify-between text-sm gap-3">
                    <span>{p.label}</span>
                    <button
                      type="button"
                      onClick={() => void togglePref(p.key)}
                      className="rounded-xl px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors"
                      style={{
                        backgroundColor: on ? 'var(--accent-primary)' : 'var(--bg-surface-alt)',
                        color: on ? '#ffffff' : 'var(--text-secondary)',
                      }}
                    >
                      {on ? t.common.enable : t.common.disable}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Notification Feed */}
        <div className="lg:col-span-7 surface-card rounded-3xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div
              className="inline-flex items-center p-1 rounded-xl gap-1"
              style={{ backgroundColor: 'var(--bg-surface-alt)' }}
            >
              <button
                type="button"
                onClick={() => setFilter('all')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap"
                style={{
                  backgroundColor: filter === 'all' ? 'var(--bg-surface)' : 'transparent',
                  color: filter === 'all' ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                {t.notificationsModule.filterAll} ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('unread')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap"
                style={{
                  backgroundColor: filter === 'unread' ? 'var(--bg-surface)' : 'transparent',
                  color: filter === 'unread' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                }}
              >
                {t.notificationsModule.filterUnread} ({unreadCount})
              </button>
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => void markAllNotificationsRead()}
                  className="rounded-xl border px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap"
                  style={{
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--accent-primary)',
                  }}
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>{t.notificationsModule.markAllRead}</span>
                </button>
              )}
              {notifications.some((n) => n.read) && (
                <button
                  type="button"
                  onClick={() => void clearReadNotifications()}
                  className="rounded-xl border px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap"
                  style={{
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t.notificationsModule.clearRead}</span>
                </button>
              )}
            </div>
          </div>

          {visibleNotifications.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                {t.common.empty}
              </p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
              {visibleNotifications.map((n) => (
                <div
                  key={n.id}
                  className="py-4 first:pt-1 last:pb-1 space-y-2 transition-opacity"
                  style={{ opacity: n.read ? 0.72 : 1 }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="text-sm font-bold flex items-center gap-2">
                        <span>{n.title}</span>
                      </div>
                      <div className="text-[11px] font-mono-tabular" style={{ color: 'var(--text-muted)' }}>
                        {categoryLabel(n.category)} · {new Date(n.createdAt).toLocaleString(locale)}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {n.targetModule && (
                        <button
                          type="button"
                          onClick={() => {
                            void markNotificationRead(n.id);
                            setActiveModule(n.targetModule as ModuleId);
                          }}
                          className="rounded-lg border px-2.5 py-1 text-[11px] font-semibold flex items-center gap-1 whitespace-nowrap"
                          style={{
                            borderColor: 'var(--border-subtle)',
                            color: 'var(--accent-primary)',
                          }}
                        >
                          <span>{t.notificationsModule.openModule}</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      )}
                      {!n.read && (
                        <button
                          type="button"
                          onClick={() => void markNotificationRead(n.id)}
                          aria-label={t.notificationsModule.markAllRead}
                          className="w-8 h-8 rounded-lg border flex items-center justify-center"
                          style={{ borderColor: 'var(--border-subtle)', color: 'var(--accent-primary)' }}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => void deleteNotification(n.id)}
                        aria-label={t.common.delete}
                        className="w-8 h-8 rounded-lg border flex items-center justify-center"
                        style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {n.body}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
