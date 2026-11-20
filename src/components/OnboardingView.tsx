import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { motion } from 'motion/react';
import emblemImg from '../assets/images/eyad_app_emblem_1794571275194.jpg';
import { useApp } from '../context/AppContext';
import { getWallpaperById, WALLPAPER_OPTIONS } from '../data/wallpapers';
import { getText } from '../i18n/translations';
import type { LanguageCode, ThemeId } from '../types';
import { Icon3D } from './Icons3D';

const THEMES: Array<{ id: ThemeId; bg: string; accent: string }> = [
  { id: 'emerald', bg: '#eef5f1', accent: '#0b5d43' },
  { id: 'light', bg: '#f5f7f5', accent: '#0b5d43' },
  { id: 'dark', bg: '#09100e', accent: '#1fa376' },
  { id: 'gold', bg: '#faf6ee', accent: '#9a6e1c' },
  { id: 'islamic-blue', bg: '#f0f4fa', accent: '#164e8c' },
  { id: 'minimal-white', bg: '#ffffff', accent: '#155e47' },
  { id: 'night-black', bg: '#030404', accent: '#27a87d' },
  { id: 'desert-sand', bg: '#f4ede3', accent: '#7c582b' },
  { id: 'royal-islamic', bg: '#061813', accent: '#d9ac4c' },
  { id: 'system', bg: '#e2e8f0', accent: '#0b5d43' },
];

const LANGUAGE_CODES: LanguageCode[] = ['ps', 'ar', 'fa', 'en'];

export const OnboardingView: React.FC = () => {
  const { settings, t, updateSettings, pushNotification } = useApp();
  const [name, setName] = useState(
    settings.userName === 'مسلمان ورور / خور' ? '' : settings.userName
  );
  const [locStatus, setLocStatus] = useState<'idle' | 'ok' | 'denied'>('idle');
  const [notifStatus, setNotifStatus] = useState<'idle' | 'ok' | 'denied'>('idle');
  const activeWp = getWallpaperById(settings.wallpaper);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocStatus('denied');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setLocStatus('ok');
        await updateSettings({
          latitude: Number(pos.coords.latitude.toFixed(4)),
          longitude: Number(pos.coords.longitude.toFixed(4)),
          locationGranted: true,
          city: 'GPS',
        });
      },
      () => setLocStatus('denied'),
      { timeout: 8000 }
    );
  };

  const requestNotifs = async () => {
    if (typeof Notification === 'undefined') {
      setNotifStatus('denied');
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      setNotifStatus('ok');
      await pushNotification(t.appName, t.onboarding.notifDesc, 'system');
    } else {
      setNotifStatus('denied');
    }
  };

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({
      userName: name.trim() || t.onboarding.defaultUserName,
      onboardingCompleted: true,
    });
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-8">
      {/* Live Atmospheric Islamic Backdrop */}
      <div aria-hidden="true" className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        {activeWp.image ? (
          <img
            src={activeWp.image}
            alt=""
            className="w-full h-full object-cover scale-[1.03] transition-opacity duration-500"
          />
        ) : (
          <div className="w-full h-full" style={{ backgroundColor: 'var(--bg-canvas)' }} />
        )}
        <div className="absolute inset-0" style={{ background: 'var(--backdrop-scrim)' }} />
        <div className="absolute inset-0 islamic-pattern-bg opacity-45" />
      </div>

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onSubmit={handleFinish}
        className="surface-elevated w-full max-w-3xl rounded-3xl p-6 sm:p-10 space-y-7"
      >
        {/* Header with Emblem */}
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-start">
          <div className="p-1.5 rounded-2xl surface-alt shrink-0">
            <img
              src={emblemImg}
              alt={t.appName}
              className="w-20 h-20 rounded-xl object-cover"
            />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: 'var(--accent-primary)' }}>
              {t.onboarding.title}
            </h1>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {t.onboarding.subtitle}
            </p>
          </div>
        </div>

        <hr style={{ borderColor: 'var(--border-subtle)' }} />

        {/* Language Selector */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold">{t.onboarding.chooseLang}</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {LANGUAGE_CODES.map((code) => {
              const active = settings.language === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => updateSettings({ language: code })}
                  className={`min-h-[46px] rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                    active ? 'btn-primary' : 'surface-alt hover:opacity-90'
                  }`}
                >
                  {t.languageNames[code]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Visual Atmospheric Glass Backdrop Selector */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold">{t.settingsModule.wallpaper}</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {WALLPAPER_OPTIONS.map((wp) => {
              const active = (settings.wallpaper || 'madinah') === wp.id;
              return (
                <button
                  key={wp.id}
                  type="button"
                  onClick={() => updateSettings({ wallpaper: wp.id, customBgTint: '' })}
                  className="group relative rounded-2xl overflow-hidden border text-start transition-all min-h-[72px] flex flex-col justify-end"
                  style={{
                    borderColor: active ? 'var(--accent-primary)' : 'var(--glass-border)',
                    boxShadow: active ? '0 0 0 2px var(--accent-primary)' : undefined,
                  }}
                >
                  {wp.image ? (
                    <img
                      src={wp.image}
                      alt={getText(settings.language, wp.label)}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 w-full h-full islamic-pattern-bg"
                      style={{ backgroundColor: wp.previewTint }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                  <div className="relative z-10 p-2 flex items-center justify-between gap-1">
                    <span className="text-[10px] font-semibold text-white line-clamp-1">
                      {getText(settings.language, wp.label)}
                    </span>
                    {active && <Check className="w-3.5 h-3.5 text-amber-300 shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Visual Swatch Theme Selector */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold">{t.onboarding.chooseTheme}</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {THEMES.map((th) => {
              const active = settings.theme === th.id;
              return (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => updateSettings({ theme: th.id })}
                  className="min-h-[46px] rounded-xl px-3 py-2 text-xs font-medium border flex items-center gap-2 transition-all text-start surface-alt"
                  style={{
                    backgroundColor: active ? 'var(--accent-soft)' : undefined,
                    color: active ? 'var(--accent-primary)' : 'var(--text-primary)',
                    borderColor: active ? 'var(--accent-primary)' : undefined,
                  }}
                >
                  <span
                    className="w-4 h-4 rounded-full border shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: th.bg, borderColor: th.accent }}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: th.accent }} />
                  </span>
                  <span className="truncate font-semibold">{t.themes[th.id]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* User Name */}
        <div className="space-y-2">
          <label htmlFor="onboarding-name" className="block text-sm font-semibold">
            {t.onboarding.yourName}
          </label>
          <input
            id="onboarding-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.onboarding.namePlaceholder}
            className="w-full rounded-xl px-4 py-3 text-sm modern-input"
          />
        </div>

        {/* Optional Permissions with 3D Icons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="surface-alt rounded-2xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <Icon3D kind="location" size={26} className="mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold">{t.onboarding.locationOpt}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {t.onboarding.locationDesc}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={requestLocation}
              className="w-full min-h-[44px] rounded-xl surface-card px-3 py-2 text-xs font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{
                borderColor: locStatus === 'ok' ? 'var(--accent-primary)' : undefined,
              }}
            >
              {locStatus === 'ok' ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Icon3D kind="location" size={16} />
              )}
              <span>{t.onboarding.allowLocation}</span>
            </button>
          </div>

          <div className="surface-alt rounded-2xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <Icon3D kind="notifications" size={26} className="mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold">{t.onboarding.notifOpt}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {t.onboarding.notifDesc}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={requestNotifs}
              className="w-full min-h-[44px] rounded-xl surface-card px-3 py-2 text-xs font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{
                borderColor: notifStatus === 'ok' ? 'var(--accent-primary)' : undefined,
              }}
            >
              {notifStatus === 'ok' ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Icon3D kind="notifications" size={16} />
              )}
              <span>{t.onboarding.allowNotif}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            <Icon3D kind="shield" size={20} />
            <span>{t.onboarding.noSignupNote}</span>
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto min-h-[48px] rounded-xl px-8 py-3 text-sm font-semibold whitespace-nowrap shrink-0 inline-flex items-center justify-center gap-2 btn-primary"
          >
            <Icon3D kind="sparkles" size={18} />
            <span>{t.onboarding.startApp}</span>
          </button>
        </div>

        <div
          className="pt-3 border-t text-center text-xs"
          style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
        >
          {t.aboutModule.developerLabel}:{' '}
          <strong style={{ color: 'var(--text-primary)' }}>{t.aboutModule.developerName}</strong>
        </div>
      </motion.form>
    </div>
  );
};
