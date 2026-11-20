import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  DEFAULT_SETTINGS,
  getDB,
  initializeDatabase,
  todayKey,
} from '../db/database';
import { INITIAL_ADHKAR } from '../data/adhkarData';
import { TRANSLATIONS, type TranslationStrings } from '../i18n/translations';
import type {
  AppNotificationItem,
  BookmarkRecord,
  FavoriteRecord,
  LanguageCode,
  ModuleId,
  QuranProgress,
  UserSettings,
} from '../types';
import {
  computePrayerTimesForDate,
  formatTimeShort,
  getNextIslamicOccasion,
} from '../utils/islamicCalc';

export type NotifPermissionState = NotificationPermission | 'unsupported';

export interface ScheduledAlertPreview {
  id: string;
  title: string;
  time: string;
  category: string;
  enabled: boolean;
  dueNow: boolean;
  targetModule: ModuleId;
}

interface AppContextValue {
  ready: boolean;
  settings: UserSettings;
  t: TranslationStrings;
  isRTL: boolean;
  activeModule: ModuleId;
  setActiveModule: (mod: ModuleId) => void;
  updateSettings: (patch: Partial<UserSettings>) => Promise<void>;
  quranProgress: QuranProgress;
  updateQuranProgress: (patch: Partial<QuranProgress>) => Promise<void>;
  bookmarks: BookmarkRecord[];
  toggleBookmark: (item: Omit<BookmarkRecord, 'createdAt'>) => Promise<boolean>;
  favorites: FavoriteRecord[];
  toggleFavorite: (item: Omit<FavoriteRecord, 'createdAt'>) => Promise<boolean>;
  notifications: AppNotificationItem[];
  notifPermission: NotifPermissionState;
  requestBrowserNotifPermission: () => Promise<NotifPermissionState>;
  toastNotification: AppNotificationItem | null;
  dismissToast: () => void;
  soundEnabled: boolean;
  toggleNotifSound: () => void;
  pushNotification: (
    title: string,
    body: string,
    category: string,
    targetModule?: ModuleId
  ) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearReadNotifications: () => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  runNotificationCheck: (manual?: boolean) => Promise<number>;
  getTodayScheduledAlerts: () => ScheduledAlertPreview[];
  refreshCoreState: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

const DARK_THEMES = new Set(['dark', 'night-black', 'royal-islamic']);

function playGentleChime(): void {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      void ctx.resume().catch(() => {});
    }
    const now = ctx.currentTime;

    const notes = [
      { freq: 587.33, start: 0, dur: 0.42, peak: 0.09 },
      { freq: 880.0, start: 0.16, dur: 0.55, peak: 0.08 },
    ];

    notes.forEach(({ freq, start, dur, peak }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + start);

      gain.gain.setValueAtTime(0.0001, now + start);
      gain.gain.linearRampToValueAtTime(peak, now + start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + start);
      osc.stop(now + start + dur + 0.02);
    });

    window.setTimeout(() => {
      void ctx.close().catch(() => {});
    }, 1200);
  } catch {
    // Ignore autoplay restrictions before first gesture
  }
}

function getCurrentNotifPermission(): NotifPermissionState {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

const VALID_MODULES: ReadonlySet<string> = new Set<ModuleId>([
  'dashboard',
  'quran',
  'dictionary',
  'hadith',
  'adhkar',
  'tasbeeh',
  'duas',
  'prayer',
  'qibla',
  'mosques',
  'library',
  'quotes',
  'zakat',
  'calendar',
  'tasks',
  'routines',
  'statistics',
  'assistant',
  'search',
  'notifications',
  'settings',
  'about',
  'admin',
]);

function getInitialModuleFromUrl(): ModuleId {
  if (typeof window === 'undefined') return 'dashboard';
  try {
    const param = new URLSearchParams(window.location.search).get('module');
    if (param && VALID_MODULES.has(param)) {
      return param as ModuleId;
    }
  } catch {
    // Ignore URL parse error
  }
  return 'dashboard';
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [activeModule, setActiveModule] = useState<ModuleId>(getInitialModuleFromUrl);
  const [quranProgress, setQuranProgress] = useState<QuranProgress>({
    id: 'default',
    lastSurah: 1,
    lastAyah: 1,
    dailyGoalAyahs: 15,
    todayAyahsRead: 0,
    todayDate: todayKey(),
    totalAyahsRead: 0,
    khatmahCount: 0,
    history: [],
  });
  const [bookmarks, setBookmarks] = useState<BookmarkRecord[]>([]);
  const [favorites, setFavorites] = useState<FavoriteRecord[]>([]);
  const [notifications, setNotifications] = useState<AppNotificationItem[]>([]);
  const [notifPermission, setNotifPermission] = useState<NotifPermissionState>(
    getCurrentNotifPermission
  );
  const [toastNotification, setToastNotification] = useState<AppNotificationItem | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('eyad_notif_sound') !== 'false';
    } catch {
      return true;
    }
  });
  const toastTimerRef = useRef<number | null>(null);
  const checkLockRef = useRef(false);

  const lang = settings.language || 'ps';
  const t = TRANSLATIONS[lang];
  const isRTL = lang === 'ps' || lang === 'ar' || lang === 'fa';

  const dismissToast = useCallback(() => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    setToastNotification(null);
  }, []);

  const showToast = useCallback((item: AppNotificationItem) => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    setToastNotification(item);
    toastTimerRef.current = window.setTimeout(() => {
      setToastNotification(null);
      toastTimerRef.current = null;
    }, 6500);
  }, []);

  const refreshCoreState = useCallback(async () => {
    await initializeDatabase();
    const db = await getDB();
    const loadedSettings = (await db.get('user_settings', 'default')) || DEFAULT_SETTINGS;
    const loadedProg = await db.get('quran_progress', 'default');
    const loadedBookmarks = await db.getAll('bookmarks');
    const loadedFavorites = await db.getAll('favorites');
    const loadedNotifs = await db.getAll('notifications');

    setSettings(loadedSettings);
    if (loadedProg) {
      const today = todayKey();
      if (loadedProg.todayDate !== today) {
        const resetProg: QuranProgress = { ...loadedProg, todayDate: today, todayAyahsRead: 0 };
        await db.put('quran_progress', resetProg);
        setQuranProgress(resetProg);
      } else {
        setQuranProgress(loadedProg);
      }
    }
    setBookmarks(loadedBookmarks.sort((a, b) => b.createdAt - a.createdAt));
    setFavorites(loadedFavorites.sort((a, b) => b.createdAt - a.createdAt));
    setNotifications(loadedNotifs.sort((a, b) => b.createdAt - a.createdAt));
    setNotifPermission(getCurrentNotifPermission());
    setReady(true);
  }, []);

  useEffect(() => {
    refreshCoreState();
  }, [refreshCoreState]);

  // Apply RTL/LTR, theme, and typography variables to <html>
  useEffect(() => {
    const html = document.documentElement;
    const currentLang: LanguageCode = settings.language || 'ps';
    const rtl = currentLang === 'ps' || currentLang === 'ar' || currentLang === 'fa';
    html.lang = currentLang;
    html.dir = rtl ? 'rtl' : 'ltr';

    const prefersDark =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    const useDark =
      settings.theme === 'system' ? prefersDark : DARK_THEMES.has(settings.theme);

    if (useDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    if (settings.theme === 'light' || settings.theme === 'dark' || settings.theme === 'system') {
      html.removeAttribute('data-theme');
    } else {
      html.setAttribute('data-theme', settings.theme);
    }

    const bodyFont =
      settings.fontFamily === 'naskh'
        ? "'Noto Naskh Arabic', 'Plus Jakarta Sans', system-ui, sans-serif"
        : settings.fontFamily === 'scheherazade'
        ? "'Scheherazade New', 'Plus Jakarta Sans', system-ui, sans-serif"
        : settings.fontFamily === 'kufi'
        ? "'Noto Kufi Arabic', 'Plus Jakarta Sans', system-ui, sans-serif"
        : settings.fontFamily === 'lateef'
        ? "'Lateef', 'Noto Naskh Arabic', 'Plus Jakarta Sans', system-ui, sans-serif"
        : settings.fontFamily === 'vazirmatn'
        ? "'Vazirmatn', 'Plus Jakarta Sans', system-ui, sans-serif"
        : "'Plus Jakarta Sans', 'Noto Naskh Arabic', system-ui, sans-serif";

    const arabicFont =
      settings.fontFamily === 'naskh'
        ? "'Noto Naskh Arabic', serif"
        : settings.fontFamily === 'scheherazade'
        ? "'Scheherazade New', serif"
        : settings.fontFamily === 'kufi'
        ? "'Noto Kufi Arabic', sans-serif"
        : settings.fontFamily === 'lateef'
        ? "'Lateef', 'Amiri', serif"
        : settings.fontFamily === 'vazirmatn'
        ? "'Vazirmatn', 'Noto Naskh Arabic', serif"
        : "'Amiri', 'Noto Naskh Arabic', serif";

    html.style.setProperty('--app-font-body', bodyFont);
    html.style.setProperty('--app-font-arabic', arabicFont);
    html.style.setProperty('--app-font-size', `${settings.fontSize || 16}px`);
    html.style.setProperty('--app-line-height', `${settings.lineSpacing || 1.75}`);
  }, [settings]);

  const updateSettings = useCallback(
    async (patch: Partial<UserSettings>) => {
      const next: UserSettings = {
        ...settings,
        ...patch,
        updatedAt: Date.now(),
      };
      setSettings(next);
      const db = await getDB();
      await db.put('user_settings', next);
    },
    [settings]
  );

  const updateQuranProgress = useCallback(
    async (patch: Partial<QuranProgress>) => {
      const next: QuranProgress = {
        ...quranProgress,
        ...patch,
      };
      setQuranProgress(next);
      const db = await getDB();
      await db.put('quran_progress', next);
    },
    [quranProgress]
  );

  const toggleBookmark = useCallback(
    async (item: Omit<BookmarkRecord, 'createdAt'>) => {
      const db = await getDB();
      const exists = bookmarks.find((b) => b.id === item.id);
      if (exists) {
        await db.delete('bookmarks', item.id);
        setBookmarks((prev) => prev.filter((b) => b.id !== item.id));
        return false;
      } else {
        const record: BookmarkRecord = { ...item, createdAt: Date.now() };
        await db.put('bookmarks', record);
        setBookmarks((prev) => [record, ...prev]);
        return true;
      }
    },
    [bookmarks]
  );

  const toggleFavorite = useCallback(
    async (item: Omit<FavoriteRecord, 'createdAt'>) => {
      const db = await getDB();
      const exists = favorites.find((f) => f.id === item.id);
      if (exists) {
        await db.delete('favorites', item.id);
        setFavorites((prev) => prev.filter((f) => f.id !== item.id));
        return false;
      } else {
        const record: FavoriteRecord = { ...item, createdAt: Date.now() };
        await db.put('favorites', record);
        setFavorites((prev) => [record, ...prev]);
        return true;
      }
    },
    [favorites]
  );

  const toggleNotifSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('eyad_notif_sound', String(next));
      } catch {
        // Ignore storage error
      }
      if (next) playGentleChime();
      return next;
    });
  }, []);

  const requestBrowserNotifPermission = useCallback(async (): Promise<NotifPermissionState> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setNotifPermission('unsupported');
      return 'unsupported';
    }
    try {
      const result = await Notification.requestPermission();
      setNotifPermission(result);
      return result;
    } catch {
      const current = Notification.permission;
      setNotifPermission(current);
      return current;
    }
  }, []);

  const pushNotification = useCallback(
    async (title: string, body: string, category: string, targetModule?: ModuleId) => {
      const db = await getDB();
      const item: AppNotificationItem = {
        id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title,
        body,
        category,
        targetModule,
        createdAt: Date.now(),
        read: false,
      };
      await db.put('notifications', item);
      setNotifications((prev) => [item, ...prev]);
      showToast(item);

      if (soundEnabled) {
        playGentleChime();
      }

      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        let shownViaSW = false;
        if ('serviceWorker' in navigator) {
          try {
            const reg = await navigator.serviceWorker.ready;
            if (reg && typeof reg.showNotification === 'function') {
              await reg.showNotification(title, {
                body,
                tag: `eyad-${category}`,
              });
              shownViaSW = true;
            }
          } catch {
            // Fallback below
          }
        }
        if (!shownViaSW) {
          try {
            new Notification(title, { body });
          } catch {
            // Ignore iframe popup restrictions; in-app toast + bell already updated
          }
        }
      }
    },
    [showToast, soundEnabled]
  );

  const markNotificationRead = useCallback(async (id: string) => {
    const db = await getDB();
    const existing = await db.get('notifications', id);
    if (existing && !existing.read) {
      const updated = { ...existing, read: true };
      await db.put('notifications', updated);
      setNotifications((prev) => prev.map((n) => (n.id === id ? updated : n)));
    }
  }, []);

  const deleteNotification = useCallback(async (id: string) => {
    const db = await getDB();
    await db.delete('notifications', id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearReadNotifications = useCallback(async () => {
    const db = await getDB();
    const readItems = notifications.filter((n) => n.read);
    for (const item of readItems) {
      await db.delete('notifications', item.id);
    }
    setNotifications((prev) => prev.filter((n) => !n.read));
  }, [notifications]);

  const markAllNotificationsRead = useCallback(async () => {
    const db = await getDB();
    const updated = notifications.map((n) => ({ ...n, read: true }));
    for (const n of updated) {
      await db.put('notifications', n);
    }
    setNotifications(updated);
  }, [notifications]);

  const getTodayScheduledAlerts = useCallback((): ScheduledAlertPreview[] => {
    const now = new Date();
    const pt = computePrayerTimesForDate(now, settings);
    const hours = now.getHours();
    const currentMin = hours * 60 + now.getMinutes();
    const occ = getNextIslamicOccasion(now);

    const items: ScheduledAlertPreview[] = [
      {
        id: 'sched-prayer',
        title: `${t.prayers[pt.nextPrayer]} (${t.nav.prayer})`,
        time: formatTimeShort(pt.nextPrayerTime),
        category: 'prayer',
        enabled: settings.notifications.prayer,
        dueNow: Math.abs((pt.nextPrayerTime.getTime() - now.getTime()) / 60000) <= 15,
        targetModule: 'prayer',
      },
      {
        id: 'sched-morning-adhkar',
        title: t.notificationsModule.morningAdhkarLabel,
        time: '05:00 – 11:30',
        category: 'adhkar',
        enabled: settings.notifications.morningAdhkar,
        dueNow: currentMin >= 300 && currentMin <= 690,
        targetModule: 'adhkar',
      },
      {
        id: 'sched-evening-adhkar',
        title: t.notificationsModule.eveningAdhkarLabel,
        time: '15:30 – 21:30',
        category: 'adhkar',
        enabled: settings.notifications.eveningAdhkar,
        dueNow: currentMin >= 930 && currentMin <= 1290,
        targetModule: 'adhkar',
      },
      {
        id: 'sched-quran-daily',
        title: `${t.nav.quran} (${quranProgress.todayAyahsRead}/${quranProgress.dailyGoalAyahs})`,
        time: '12:00 – 22:00',
        category: 'quran',
        enabled: settings.notifications.quranDaily,
        dueNow:
          quranProgress.todayAyahsRead < quranProgress.dailyGoalAyahs &&
          hours >= 12 &&
          hours <= 22,
        targetModule: 'quran',
      },
    ];

    if (now.getDay() === 5) {
      items.push({
        id: 'sched-friday',
        title: t.calendarModule.friday,
        time: '08:00 – 17:00',
        category: 'friday',
        enabled: settings.notifications.friday,
        dueNow: true,
        targetModule: 'routines',
      });
    }

    if (occ.daysUntil <= 7) {
      items.push({
        id: 'sched-event',
        title: t.calendarModule[occ.key],
        time: `${occ.daysUntil} ${t.dashboard.daysLeft}`,
        category: 'events',
        enabled: settings.notifications.events,
        dueNow: occ.daysUntil <= 3,
        targetModule: 'calendar',
      });
    }

    return items;
  }, [quranProgress.dailyGoalAyahs, quranProgress.todayAyahsRead, settings, t]);

  const runNotificationCheck = useCallback(
    async (manual = false): Promise<number> => {
      if (!ready || checkLockRef.current) return 0;
      checkLockRef.current = true;
      let firedCount = 0;

      try {
        const db = await getDB();
        const now = new Date();
        const today = todayKey();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const totalMin = hours * 60 + minutes;
        const hhmm = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

        const hasKey = (k: string) => {
          try {
            return localStorage.getItem(`eyad_n_${today}_${k}`) === '1';
          } catch {
            return false;
          }
        };
        const markKey = (k: string) => {
          try {
            localStorage.setItem(`eyad_n_${today}_${k}`, '1');
          } catch {
            // Ignore storage errors
          }
        };

        const existingNotifs = await db.getAll('notifications');
        if (existingNotifs.length === 0) {
          let welcomeDone = false;
          try {
            welcomeDone = localStorage.getItem('eyad_n_welcome') === '1';
          } catch {
            welcomeDone = false;
          }
          if (!welcomeDone) {
            try {
              localStorage.setItem('eyad_n_welcome', '1');
            } catch {
              // Ignore
            }
            await pushNotification(
              t.notificationsModule.welcomeNotifTitle,
              t.notificationsModule.welcomeNotifBody,
              'system',
              'notifications'
            );
            firedCount++;
          }
        }

        // 1. Prayer Time Reminders (within 15 min before or 5 min after)
        if (settings.notifications.prayer) {
          const pt = computePrayerTimesForDate(now, settings);
          const prayerList: Array<'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'> = [
            'fajr',
            'dhuhr',
            'asr',
            'maghrib',
            'isha',
          ];
          for (const p of prayerList) {
            const diffMin = (pt[p].getTime() - now.getTime()) / 60000;
            if (diffMin >= -5 && diffMin <= 15 && !hasKey(`prayer_${p}`)) {
              markKey(`prayer_${p}`);
              await pushNotification(
                `${t.prayers[p]} — ${formatTimeShort(pt[p])}`,
                t.notificationsModule.prayerDueBody,
                'prayer',
                'prayer'
              );
              firedCount++;
            }
          }
        }

        // 2. Morning & Evening Adhkar
        const todayAdhkarRow = await db.get('adhkar_progress', today);
        const todayAdhkarDone = new Set(todayAdhkarRow?.completedIds || []);

        if (settings.notifications.morningAdhkar && totalMin >= 300 && totalMin <= 690 && !hasKey('morning_adhkar')) {
          const morningItems = INITIAL_ADHKAR.filter((d) => d.category === 'morning');
          const allDone = morningItems.every((d) => todayAdhkarDone.has(d.id));
          if (!allDone) {
            markKey('morning_adhkar');
            await pushNotification(
              t.notificationsModule.morningAdhkarTitle,
              t.notificationsModule.morningAdhkarBody,
              'adhkar',
              'adhkar'
            );
            firedCount++;
          }
        }

        if (settings.notifications.eveningAdhkar && totalMin >= 930 && totalMin <= 1290 && !hasKey('evening_adhkar')) {
          const eveningItems = INITIAL_ADHKAR.filter((d) => d.category === 'evening');
          const allDone = eveningItems.every((d) => todayAdhkarDone.has(d.id));
          if (!allDone) {
            markKey('evening_adhkar');
            await pushNotification(
              t.notificationsModule.eveningAdhkarTitle,
              t.notificationsModule.eveningAdhkarBody,
              'adhkar',
              'adhkar'
            );
            firedCount++;
          }
        }

        // 3. Daily Quran Goal
        if (
          settings.notifications.quranDaily &&
          hours >= 12 &&
          hours <= 22 &&
          quranProgress.todayAyahsRead < quranProgress.dailyGoalAyahs &&
          !hasKey('quran_daily')
        ) {
          markKey('quran_daily');
          await pushNotification(
            t.notificationsModule.quranReminderTitle,
            t.notificationsModule.quranReminderBody,
            'quran',
            'quran'
          );
          firedCount++;
        }

        // 4. Friday Reminder
        if (settings.notifications.friday && now.getDay() === 5 && !hasKey('friday')) {
          markKey('friday');
          await pushNotification(
            t.notificationsModule.fridayReminderTitle,
            t.notificationsModule.fridayReminderBody,
            'friday',
            'routines'
          );
          firedCount++;
        }

        // 5. Upcoming Islamic Occasion (<= 3 days)
        if (settings.notifications.events) {
          const occ = getNextIslamicOccasion(now);
          if (occ.daysUntil <= 3 && !hasKey(`event_${occ.key}`)) {
            markKey(`event_${occ.key}`);
            await pushNotification(
              t.notificationsModule.eventReminderTitle,
              `${t.calendarModule[occ.key]} (${occ.daysUntil} ${t.dashboard.daysLeft})`,
              'events',
              'calendar'
            );
            firedCount++;
          }
        }

        // 6. Due Tasks & Personal Duas
        if (settings.notifications.tasks) {
          const tasks = await db.getAll('tasks');
          for (const task of tasks) {
            if (
              task.status === 'pending' &&
              task.reminder &&
              task.dueDate === today &&
              task.time &&
              hhmm >= task.time &&
              !hasKey(`task_${task.id}`)
            ) {
              markKey(`task_${task.id}`);
              const taskTitle = task.localizedTitle?.[lang] || task.title;
              await pushNotification(
                `${t.notificationsModule.taskReminderTitle}: ${taskTitle}`,
                task.localizedDescription?.[lang] || task.description || task.time,
                'tasks',
                'tasks'
              );
              firedCount++;
            }
          }

          const duas = await db.getAll('duas');
          for (const dua of duas) {
            if (dua.reminderTime && hhmm >= dua.reminderTime && !hasKey(`dua_${dua.id}`)) {
              markKey(`dua_${dua.id}`);
              const duaTitle = dua.localizedTitle?.[lang] || dua.title;
              await pushNotification(
                duaTitle,
                dua.arabic,
                'duas',
                'duas'
              );
              firedCount++;
            }
          }
        }

        if (manual && firedCount === 0) {
          const pt = computePrayerTimesForDate(now, settings);
          showToast({
            id: `toast-check-${Date.now()}`,
            title: t.notificationsModule.checkReminders,
            body: `${t.prayers[pt.nextPrayer]} ${formatTimeShort(pt.nextPrayerTime)} — ${t.notificationsModule.inAppFallbackNote}`,
            category: 'system',
            targetModule: 'prayer',
            createdAt: Date.now(),
            read: true,
          });
          if (soundEnabled) playGentleChime();
        }
      } finally {
        checkLockRef.current = false;
      }
      return firedCount;
    },
    [
      lang,
      pushNotification,
      quranProgress.dailyGoalAyahs,
      quranProgress.todayAyahsRead,
      ready,
      settings,
      showToast,
      soundEnabled,
      t,
    ]
  );

  // Run check after ready & every 30s
  useEffect(() => {
    if (!ready) return;
    const initTimer = window.setTimeout(() => {
      void runNotificationCheck(false);
    }, 1200);
    const interval = window.setInterval(() => {
      void runNotificationCheck(false);
    }, 30000);
    return () => {
      window.clearTimeout(initTimer);
      window.clearInterval(interval);
    };
  }, [ready, runNotificationCheck]);

  return (
    <AppContext.Provider
      value={{
        ready,
        settings,
        t,
        isRTL,
        activeModule,
        setActiveModule,
        updateSettings,
        quranProgress,
        updateQuranProgress,
        bookmarks,
        toggleBookmark,
        favorites,
        toggleFavorite,
        notifications,
        notifPermission,
        requestBrowserNotifPermission,
        toastNotification,
        dismissToast,
        soundEnabled,
        toggleNotifSound,
        pushNotification,
        markNotificationRead,
        deleteNotification,
        clearReadNotifications,
        markAllNotificationsRead,
        runNotificationCheck,
        getTodayScheduledAlerts,
        refreshCoreState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
