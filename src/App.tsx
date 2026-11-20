import React, { useMemo, useState } from 'react';
import { ArrowUpRight, BellRing, Globe, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import emblemImg from './assets/images/eyad_app_emblem_1794571275194.jpg';
import { AboutView } from './components/AboutView';
import { AdhkarView } from './components/AdhkarView';
import { AdminView } from './components/AdminView';
import { AssistantView } from './components/AssistantView';
import { CalendarView } from './components/CalendarView';
import { DashboardView } from './components/DashboardView';
import { DictionaryView } from './components/DictionaryView';
import { GlobalSearchView } from './components/GlobalSearchView';
import { HadithView } from './components/HadithView';
import { Icon3D } from './components/Icons3D';
import { LibraryView } from './components/LibraryView';
import { MosquesView } from './components/MosquesView';
import { NotificationsView } from './components/NotificationsView';
import { OnboardingView } from './components/OnboardingView';
import { OfflineIndicator, PWAInstallButton } from './components/PWAInstallButton';
import { PersonalDuasView } from './components/PersonalDuasView';
import { PrayerTimesView } from './components/PrayerTimesView';
import { QiblaView } from './components/QiblaView';
import { QuotesView } from './components/QuotesView';
import { QuranView } from './components/QuranView';
import { RoutinesView } from './components/RoutinesView';
import { SettingsView } from './components/SettingsView';
import { SplashScreen } from './components/SplashScreen';
import { StatisticsView } from './components/StatisticsView';
import { TasbeehView } from './components/TasbeehView';
import { TasksView } from './components/TasksView';
import { ZakatView } from './components/ZakatView';
import { AppProvider, useApp } from './context/AppContext';
import { getWallpaperById } from './data/wallpapers';
import type { LanguageCode, ModuleId } from './types';

interface NavItem {
  id: ModuleId;
  group: 'worship' | 'quran' | 'tools' | 'system';
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', group: 'worship' },
  { id: 'prayer', group: 'worship' },
  { id: 'adhkar', group: 'worship' },
  { id: 'tasbeeh', group: 'worship' },
  { id: 'duas', group: 'worship' },

  { id: 'quran', group: 'quran' },
  { id: 'dictionary', group: 'quran' },
  { id: 'hadith', group: 'quran' },

  { id: 'library', group: 'tools' },
  { id: 'quotes', group: 'tools' },
  { id: 'qibla', group: 'tools' },
  { id: 'mosques', group: 'tools' },
  { id: 'zakat', group: 'tools' },
  { id: 'calendar', group: 'tools' },

  { id: 'tasks', group: 'system' },
  { id: 'routines', group: 'system' },
  { id: 'statistics', group: 'system' },
  { id: 'assistant', group: 'system' },
  { id: 'search', group: 'system' },
  { id: 'notifications', group: 'system' },
  { id: 'settings', group: 'system' },
  { id: 'about', group: 'system' },
  { id: 'admin', group: 'system' },
];

const LANGUAGE_CODES: LanguageCode[] = ['ps', 'ar', 'fa', 'en'];

const AppShell: React.FC = () => {
  const {
    ready,
    settings,
    t,
    activeModule,
    setActiveModule,
    updateSettings,
    notifications,
    toastNotification,
    dismissToast,
    markNotificationRead,
  } = useApp();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const navLabel = (id: ModuleId): string => {
    return t.nav[id] || id;
  };

  const displayUserName =
    settings.userName && settings.userName !== 'مسلمان ورور / خور'
      ? settings.userName
      : t.onboarding.defaultUserName;

  const activeWallpaper = getWallpaperById(settings.wallpaper);

  const renderAtmosphericBackdrop = () => (
    <div aria-hidden="true" className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {activeWallpaper.image ? (
        <img
          src={activeWallpaper.image}
          alt=""
          className="w-full h-full object-cover scale-[1.03] transition-opacity duration-500"
        />
      ) : (
        <div
          className="w-full h-full"
          style={{ backgroundColor: settings.customBgTint || 'var(--bg-canvas)' }}
        />
      )}
      <div
        className="absolute inset-0"
        style={{
          background: settings.customBgTint
            ? `linear-gradient(155deg, ${settings.customBgTint}bf 0%, ${settings.customBgTint}dc 100%)`
            : 'var(--backdrop-scrim)',
        }}
      />
      <div className="absolute inset-0 islamic-pattern-bg opacity-45" />
    </div>
  );

  if (!ready) {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center p-6">
        {renderAtmosphericBackdrop()}
        <div className="surface-elevated rounded-3xl p-8 flex flex-col items-center gap-5 text-center max-w-xs w-full">
          <div className="p-1.5 rounded-2xl surface-alt">
            <img
              src={emblemImg}
              alt={t.appName}
              className="w-16 h-16 rounded-xl object-cover"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold font-arabic">{t.appName}</h1>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              {t.common.loading}
            </p>
          </div>
          <div className="w-24 h-1 rounded-full shimmer-bar-track">
            <div className="shimmer-bar-fill" />
          </div>
        </div>
      </div>
    );
  }

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (!settings.onboardingCompleted) {
    return <OnboardingView />;
  }

  const navigateTo = (mod: ModuleId) => {
    setActiveModule(mod);
    setMobileDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardView />;
      case 'quran':
        return <QuranView />;
      case 'dictionary':
        return <DictionaryView />;
      case 'hadith':
        return <HadithView />;
      case 'adhkar':
        return <AdhkarView />;
      case 'tasbeeh':
        return <TasbeehView />;
      case 'duas':
        return <PersonalDuasView />;
      case 'prayer':
        return <PrayerTimesView />;
      case 'qibla':
        return <QiblaView />;
      case 'mosques':
        return <MosquesView />;
      case 'library':
        return <LibraryView />;
      case 'quotes':
        return <QuotesView />;
      case 'zakat':
        return <ZakatView />;
      case 'calendar':
        return <CalendarView />;
      case 'tasks':
        return <TasksView />;
      case 'routines':
        return <RoutinesView />;
      case 'statistics':
        return <StatisticsView />;
      case 'assistant':
        return <AssistantView />;
      case 'search':
        return <GlobalSearchView />;
      case 'notifications':
        return <NotificationsView />;
      case 'settings':
        return <SettingsView />;
      case 'about':
        return <AboutView onReplaySplash={() => setShowSplash(true)} />;
      case 'admin':
        return <AdminView />;
      default:
        return <DashboardView />;
    }
  };

  const groups: Array<{ key: NavItem['group']; label: string; items: NavItem[] }> = [
    { key: 'worship', label: t.navGroups.worship, items: NAV_ITEMS.filter((i) => i.group === 'worship') },
    { key: 'quran', label: t.navGroups.quranHadith, items: NAV_ITEMS.filter((i) => i.group === 'quran') },
    { key: 'tools', label: t.navGroups.knowledgeTools, items: NAV_ITEMS.filter((i) => i.group === 'tools') },
    { key: 'system', label: t.navGroups.system, items: NAV_ITEMS.filter((i) => i.group === 'system') },
  ];

  return (
    <div className="min-h-screen relative flex">
      {renderAtmosphericBackdrop()}

      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex lg:flex-col w-[268px] shrink-0 border-e sticky top-0 h-screen glass-bar"
        style={{ borderColor: 'var(--glass-border)' }}
      >
        {/* Brand Header */}
        <div
          className="px-4 py-4 border-b flex items-center gap-3"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <div className="p-0.5 rounded-xl shrink-0 shadow-sm surface-alt">
            <img
              src={emblemImg}
              alt={t.appName}
              className="w-10 h-10 rounded-[10px] object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-base truncate font-arabic leading-tight">{t.appName}</div>
            <div className="text-[11px] truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {t.appSubtitle}
            </div>
          </div>
        </div>

        {/* Navigation Groups with Sculpted 3D Icons */}
        <nav className="flex-1 overflow-y-auto px-3 py-3.5 space-y-3.5" aria-label={t.nav.moreModules}>
          {groups.map((grp, idx) => (
            <div
              key={grp.key}
              className={idx > 0 ? 'pt-3 border-t space-y-1' : 'space-y-1'}
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              <div
                className="px-3 pb-1 text-[11px] font-semibold tracking-tight truncate"
                style={{ color: 'var(--text-muted)' }}
              >
                {grp.label}
              </div>
              {grp.items.map((item) => {
                const active = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigateTo(item.id)}
                    className={`w-full relative flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl text-xs transition-all ${
                      active ? 'font-semibold' : 'font-medium hover:bg-black/[0.03] dark:hover:bg-white/[0.04]'
                    }`}
                    style={{
                      backgroundColor: active ? 'var(--accent-soft)' : 'transparent',
                      color: active ? 'var(--accent-primary)' : 'var(--text-primary)',
                    }}
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <Icon3D kind={item.id} size={20} />
                      <span className="truncate">{navLabel(item.id)}</span>
                    </span>
                    {item.id === 'notifications' && unreadCount > 0 && (
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white font-mono-tabular"
                        style={{ backgroundColor: 'var(--accent-primary)' }}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div
          className="m-3 p-3 rounded-2xl surface-alt text-[11px] space-y-1.5"
          style={{ color: 'var(--text-muted)' }}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="truncate font-semibold" style={{ color: 'var(--text-primary)' }}>
              {displayUserName}
            </span>
            <span className="font-mono-tabular shrink-0 opacity-80">
              {t.versionPrefix} {settings.appVersion}
            </span>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('about')}
            className="text-[11px] font-medium hover:underline block truncate text-start w-full"
            style={{ color: 'var(--accent-primary)' }}
          >
            {t.aboutModule.developerName}
          </button>
        </div>
      </aside>

      {/* Main Content Column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar (3-zone glass header) */}
        <header className="sticky top-0 z-30 h-15 border-b glass-bar px-4 sm:px-6 flex items-center justify-between gap-3">
          {/* Zone 1: Menu toggle (mobile) & Current Module Title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              aria-label={t.nav.moreModules}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl surface-alt transition-transform active:scale-95"
            >
              <Menu className="w-5 h-5" />
            </button>
            <img
              src={emblemImg}
              alt={t.appName}
              className="lg:hidden w-8 h-8 rounded-lg object-cover border shrink-0"
              style={{ borderColor: 'var(--border-subtle)' }}
            />
            <span className="hidden sm:inline-flex">
              <Icon3D kind={activeModule} size={24} />
            </span>
            <h1 className="text-sm sm:text-base font-bold truncate tracking-tight">
              {navLabel(activeModule)}
            </h1>
          </div>

          {/* Zone 2: Desktop Quick Shortcuts (Clean Single-Line Navigation) */}
          <div className="hidden xl:flex items-center gap-1 h-full">
            {(['dashboard', 'quran', 'prayer', 'assistant'] as ModuleId[]).map((mod) => {
              const active = activeModule === mod;
              return (
                <button
                  key={mod}
                  type="button"
                  onClick={() => navigateTo(mod)}
                  className="relative h-full px-3.5 text-xs font-medium transition-colors inline-flex items-center gap-2 whitespace-nowrap"
                  style={{
                    color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontWeight: active ? 600 : 500,
                  }}
                >
                  <Icon3D kind={mod} size={17} />
                  <span>{navLabel(mod)}</span>
                  {active && (
                    <span
                      className="absolute bottom-0 inset-x-3 h-0.5 rounded-t-full"
                      style={{ backgroundColor: 'var(--accent-primary)' }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Zone 3: Search, Notifications, Language, Install */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => navigateTo('search')}
              aria-label={t.nav.search}
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl surface-alt transition-all hover:opacity-90 active:scale-95"
              style={{
                borderColor: activeModule === 'search' ? 'var(--accent-primary)' : undefined,
                backgroundColor: activeModule === 'search' ? 'var(--accent-soft)' : undefined,
              }}
            >
              <Icon3D kind="search" size={18} />
            </button>

            <button
              type="button"
              onClick={() => navigateTo('notifications')}
              aria-label={t.nav.notifications}
              className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl surface-alt transition-all hover:opacity-90 active:scale-95"
              style={{
                borderColor: activeModule === 'notifications' ? 'var(--accent-primary)' : undefined,
                backgroundColor: activeModule === 'notifications' ? 'var(--accent-soft)' : undefined,
              }}
            >
              <Icon3D kind="notifications" size={18} />
              {unreadCount > 0 && (
                <span
                  className="absolute -top-1 -end-1 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center font-mono-tabular shadow-sm"
                  style={{ backgroundColor: 'var(--accent-primary)' }}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <div className="hidden sm:flex items-center gap-1.5 rounded-xl surface-alt px-2.5 py-2">
              <Globe className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
              <select
                aria-label={t.settingsModule.language}
                value={settings.language}
                onChange={(e) => updateSettings({ language: e.target.value as LanguageCode })}
                className="bg-transparent text-xs font-semibold outline-none cursor-pointer"
              >
                {LANGUAGE_CODES.map((code) => (
                  <option key={code} value={code} style={{ color: '#0f1f1a' }}>
                    {t.languageNames[code]}
                  </option>
                ))}
              </select>
            </div>

            <PWAInstallButton compact />
          </div>
        </header>

        {/* Active Module Viewport with smooth Motion transition */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            >
              {renderModule()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Bottom Tab Bar (Compact Frosted Dock) */}
      <nav
        aria-label={t.nav.moreModules}
        className="lg:hidden fixed bottom-0 inset-x-0 z-30 h-16 border-t glass-bar grid grid-cols-4"
      >
        {(['dashboard', 'quran', 'prayer'] as ModuleId[]).map((tabId) => {
          const active = activeModule === tabId;
          return (
            <button
              key={tabId}
              type="button"
              onClick={() => navigateTo(tabId)}
              className="relative flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium min-h-[44px] transition-colors"
              style={{
                color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: active ? 700 : 500,
              }}
            >
              {active && (
                <span
                  className="absolute top-0 w-8 h-0.5 rounded-b-full"
                  style={{ backgroundColor: 'var(--accent-primary)' }}
                />
              )}
              <Icon3D kind={tabId} size={22} />
              <span className="truncate max-w-[74px]">{navLabel(tabId)}</span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          className="relative flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium min-h-[44px]"
          style={{
            color: mobileDrawerOpen ? 'var(--accent-primary)' : 'var(--text-secondary)',
          }}
        >
          <Icon3D kind="moreModules" size={22} />
          <span className="truncate max-w-[74px]">{t.nav.moreModules}</span>
        </button>
      </nav>

      {/* Mobile All-Modules Drawer */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 bg-black/55 backdrop-blur-xs"
              onClick={() => setMobileDrawerOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 12 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-sm h-full overflow-y-auto p-5 space-y-5 shadow-2xl glass-bar border-e"
            >
              <div className="flex items-center justify-between pb-3.5 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="flex items-center gap-3">
                  <img
                    src={emblemImg}
                    alt={t.appName}
                    className="w-10 h-10 rounded-xl object-cover border"
                    style={{ borderColor: 'var(--border-subtle)' }}
                  />
                  <div>
                    <div className="font-bold text-sm font-arabic">{t.appName}</div>
                    <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                      {displayUserName}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  aria-label={t.common.close}
                  className="w-11 h-11 rounded-xl surface-alt flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Language Quick Picker */}
              <div className="grid grid-cols-4 gap-1.5">
                {LANGUAGE_CODES.map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => updateSettings({ language: code })}
                    className={`min-h-[44px] py-2 rounded-xl text-xs font-semibold truncate px-1 transition-all ${
                      settings.language === code ? 'btn-primary' : 'surface-alt'
                    }`}
                  >
                    {t.languageNames[code]}
                  </button>
                ))}
              </div>

              {/* All 23 Modules Grid with 3D Icons */}
              <div className="grid grid-cols-2 gap-2.5 pb-6">
                {NAV_ITEMS.map((item) => {
                  const active = activeModule === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => navigateTo(item.id)}
                      className="flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-medium text-start min-h-[48px] transition-all active:scale-95 surface-alt"
                      style={{
                        backgroundColor: active ? 'var(--accent-soft)' : undefined,
                        borderColor: active ? 'var(--accent-primary)' : undefined,
                        color: active ? 'var(--accent-primary)' : 'var(--text-primary)',
                      }}
                    >
                      <Icon3D kind={item.id} size={22} />
                      <span className="truncate">{navLabel(item.id)}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating In-App Notification Toast */}
      <AnimatePresence>
        {toastNotification && (
          <motion.div
            initial={{ opacity: 0, y: -18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-20 end-4 sm:end-6 z-50 w-[min(92vw,360px)] surface-elevated rounded-2xl p-4 shadow-2xl space-y-2"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <BellRing className="w-4 h-4 shrink-0" style={{ color: 'var(--accent-primary)' }} />
                <span className="text-xs font-bold truncate">{toastNotification.title}</span>
              </div>
              <button
                type="button"
                onClick={dismissToast}
                aria-label={t.common.close}
                className="w-7 h-7 rounded-lg surface-alt flex items-center justify-center shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
              {toastNotification.body}
            </p>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  if (toastNotification.id && !toastNotification.id.startsWith('toast-check-')) {
                    void markNotificationRead(toastNotification.id);
                  }
                  const target = toastNotification.targetModule || 'notifications';
                  dismissToast();
                  navigateTo(target);
                }}
                className="rounded-lg px-2.5 py-1 text-[11px] font-semibold flex items-center gap-1"
                style={{
                  backgroundColor: 'var(--accent-soft)',
                  color: 'var(--accent-primary)',
                }}
              >
                <span>{t.notificationsModule.openModule}</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <OfflineIndicator />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
