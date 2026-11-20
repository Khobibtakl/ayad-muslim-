import React, { useState } from 'react';
import { Check, CheckCircle2, RefreshCw, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WALLPAPER_OPTIONS } from '../data/wallpapers';
import {
  clearAllUserData,
  exportAllUserData,
  restoreAllUserData,
} from '../db/database';
import { getText } from '../i18n/translations';
import type { FontFamilyOption, LanguageCode, ThemeId } from '../types';
import { createBackupFile, parseBackupFile, sha256Hex } from '../utils/cryptoBackup';
import { Icon3D } from './Icons3D';
import { PWAInstallButton } from './PWAInstallButton';

const THEMES: Array<{ id: ThemeId; bg: string; accent: string }> = [
  { id: 'light', bg: '#f7f8f6', accent: '#0b5d43' },
  { id: 'dark', bg: '#0b1110', accent: '#1f9d73' },
  { id: 'system', bg: '#e2e8f0', accent: '#0b5d43' },
  { id: 'emerald', bg: '#eff6f2', accent: '#0b5d43' },
  { id: 'gold', bg: '#faf7f0', accent: '#9a6e1c' },
  { id: 'islamic-blue', bg: '#f2f5fa', accent: '#164e8c' },
  { id: 'minimal-white', bg: '#ffffff', accent: '#155e47' },
  { id: 'night-black', bg: '#000000', accent: '#27a87d' },
  { id: 'desert-sand', bg: '#f5efe6', accent: '#7c582b' },
  { id: 'royal-islamic', bg: '#071b16', accent: '#d9ac4c' },
];

const BG_TINT_KEYS: Array<{
  key: 'default' | 'ivory' | 'mint' | 'cream' | 'slate' | 'forest';
  value: string;
}> = [
  { key: 'default', value: '' },
  { key: 'ivory', value: '#fbf8f1' },
  { key: 'mint', value: '#eef6f1' },
  { key: 'cream', value: '#f6f1e7' },
  { key: 'slate', value: '#f1f4f8' },
  { key: 'forest', value: '#091914' },
];

const LANGUAGE_CODES: LanguageCode[] = ['ps', 'ar', 'fa', 'en'];
const FONT_OPTIONS: FontFamilyOption[] = [
  'plus-amiri',
  'naskh',
  'scheherazade',
  'kufi',
  'lateef',
  'vazirmatn',
];

export const SettingsView: React.FC = () => {
  const { settings, t, updateSettings, quranProgress, updateQuranProgress, refreshCoreState, setActiveModule } = useApp();

  const [backupPassword, setBackupPassword] = useState('');
  const [restorePassword, setRestorePassword] = useState('');
  const [pendingRestorePayload, setPendingRestorePayload] = useState<Record<string, unknown> | null>(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');

  const handleExportBackup = async () => {
    const raw = await exportAllUserData();
    const envelope = await createBackupFile(raw, backupPassword);
    const blob = new Blob([JSON.stringify(envelope, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eyad-al-muslim-backup-${new Date().toISOString().slice(0, 10)}.eyad.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMsg(t.common.downloaded);
  };

  const handleRestoreFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const parsed = await parseBackupFile(text, restorePassword);
    if (!parsed.valid || !parsed.data) {
      setStatusMsg(t.settingsModule.wrongPin);
      return;
    }
    setPendingRestorePayload(parsed.data);
  };

  const confirmRestore = async () => {
    if (!pendingRestorePayload) return;
    await restoreAllUserData(pendingRestorePayload);
    setPendingRestorePayload(null);
    await refreshCoreState();
    setStatusMsg(t.common.completed);
  };

  const saveStatsPin = async () => {
    if (!pinInput.trim()) {
      await updateSettings({ statsPinHash: '' });
      setStatusMsg(t.settingsModule.pinCleared);
      return;
    }
    const hash = await sha256Hex(pinInput.trim());
    await updateSettings({ statsPinHash: hash });
    setPinInput('');
    setStatusMsg(t.settingsModule.pinSaved);
  };

  const checkUpdates = async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) setUpdateMsg(t.settingsModule.upToDate);
      else setUpdateMsg(t.offlineBanner);
    } catch {
      setUpdateMsg(t.offlineBanner);
    }
  };

  const displayNameInput =
    settings.userName === 'مسلمان ورور / خور' ? t.onboarding.defaultUserName : settings.userName;

  return (
    <div className="space-y-6">
      {/* Profile & Appearance */}
      <div className="surface-elevated rounded-3xl p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Icon3D kind="settings" size={30} />
            <h2 className="text-xl font-bold">{t.nav.settings}</h2>
          </div>
          <PWAInstallButton />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="space-y-1.5 text-xs">
            <span className="font-semibold block">{t.onboarding.yourName}</span>
            <input
              type="text"
              value={displayNameInput}
              onChange={(e) => updateSettings({ userName: e.target.value })}
              className="w-full rounded-xl px-3.5 py-2.5 text-sm modern-input"
            />
          </label>

          <label className="space-y-1.5 text-xs">
            <span className="font-semibold block">{t.settingsModule.language}</span>
            <select
              value={settings.language}
              onChange={(e) => updateSettings({ language: e.target.value as LanguageCode })}
              className="w-full rounded-xl px-3.5 py-2.5 text-sm modern-input"
            >
              {LANGUAGE_CODES.map((code) => (
                <option key={code} value={code}>
                  {t.languageNames[code]}
                </option>
              ))}
            </select>
          </label>

          <div className="md:col-span-2 space-y-2 text-xs">
            <span className="font-semibold block">{t.settingsModule.theme}</span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {THEMES.map((th) => {
                const active = settings.theme === th.id;
                return (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => updateSettings({ theme: th.id })}
                    className="rounded-xl border p-2.5 flex items-center gap-2 text-start transition-all min-h-[44px] surface-alt"
                    style={{
                      backgroundColor: active ? 'var(--accent-soft)' : undefined,
                      borderColor: active ? 'var(--accent-primary)' : undefined,
                    }}
                  >
                    <span
                      className="w-5 h-5 rounded-full border shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: th.bg, borderColor: th.accent }}
                    >
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: th.accent }} />
                    </span>
                    <span className="text-[11px] font-medium truncate">{t.themes[th.id]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="md:col-span-2 space-y-2 text-xs">
            <span className="font-semibold block">{t.settingsModule.wallpaper}</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
              {WALLPAPER_OPTIONS.map((wp) => {
                const active = (settings.wallpaper || 'madinah') === wp.id;
                const wpLabel = getText(settings.language, wp.label);
                return (
                  <button
                    key={wp.id}
                    type="button"
                    onClick={() => updateSettings({ wallpaper: wp.id, customBgTint: '' })}
                    className="group relative rounded-2xl overflow-hidden border text-start transition-all aspect-video min-h-[68px] flex flex-col justify-end"
                    style={{
                      borderColor: active ? 'var(--accent-primary)' : 'var(--glass-border)',
                      boxShadow: active ? '0 0 0 2px var(--accent-primary)' : undefined,
                    }}
                  >
                    {wp.image ? (
                      <img
                        src={wp.image}
                        alt={wpLabel}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div
                        className="absolute inset-0 w-full h-full islamic-pattern-bg"
                        style={{ backgroundColor: wp.previewTint }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="relative z-10 p-2 flex items-center justify-between gap-1">
                      <span className="text-[10px] font-semibold text-white line-clamp-1">
                        {wpLabel}
                      </span>
                      {active && <Check className="w-3.5 h-3.5 text-amber-300 shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <label className="space-y-1.5 text-xs">
            <span className="font-semibold block">{t.settingsModule.fontFamily}</span>
            <select
              value={settings.fontFamily}
              onChange={(e) => updateSettings({ fontFamily: e.target.value as FontFamilyOption })}
              className="w-full rounded-xl px-3.5 py-2.5 text-sm modern-input"
            >
              {FONT_OPTIONS.map((font) => (
                <option key={font} value={font}>
                  {t.fontNames[font]}
                </option>
              ))}
            </select>
          </label>

          <div className="space-y-1.5 text-xs">
            <span className="font-semibold block">{t.settingsModule.customBgTint}</span>
            <div className="flex flex-wrap items-center gap-2">
              {BG_TINT_KEYS.map((tint) => {
                const active = settings.customBgTint === tint.value;
                return (
                  <button
                    key={tint.key}
                    type="button"
                    onClick={() => updateSettings({ customBgTint: tint.value })}
                    className="rounded-lg border px-2.5 py-1.5 text-[11px] font-medium flex items-center gap-1.5"
                    style={{
                      borderColor: active ? 'var(--accent-primary)' : 'var(--border-subtle)',
                      backgroundColor: active ? 'var(--accent-soft)' : 'var(--bg-surface-alt)',
                    }}
                  >
                    {tint.value && (
                      <span
                        className="w-3 h-3 rounded-full border"
                        style={{ backgroundColor: tint.value, borderColor: 'var(--border-subtle)' }}
                      />
                    )}
                    <span>{t.settingsModule.tints[tint.key]}</span>
                  </button>
                );
              })}
              <input
                type="color"
                aria-label={t.settingsModule.customBgTint}
                value={settings.customBgTint || '#f7f8f6'}
                onChange={(e) => updateSettings({ customBgTint: e.target.value })}
                className="w-8 h-8 rounded cursor-pointer border"
                style={{ borderColor: 'var(--border-subtle)' }}
              />
            </div>
          </div>

          <label className="space-y-1.5 text-xs">
            <span className="font-semibold block">{t.settingsModule.fontSize}: {settings.fontSize}</span>
            <input
              type="range"
              min={14}
              max={22}
              value={settings.fontSize}
              onChange={(e) => updateSettings({ fontSize: Number(e.target.value) })}
              className="w-full accent-emerald-700"
            />
          </label>

          <label className="space-y-1.5 text-xs">
            <span className="font-semibold block">{t.settingsModule.lineSpacing}: {settings.lineSpacing}</span>
            <input
              type="range"
              min={1.4}
              max={2.2}
              step={0.05}
              value={settings.lineSpacing}
              onChange={(e) => updateSettings({ lineSpacing: Number(e.target.value) })}
              className="w-full accent-emerald-700"
            />
          </label>

          <label className="space-y-1.5 text-xs">
            <span className="font-semibold block">{t.quranModule.dailyGoal} ({t.quranModule.ayahs})</span>
            <input
              type="number"
              min={1}
              max={500}
              value={quranProgress.dailyGoalAyahs}
              onChange={(e) => updateQuranProgress({ dailyGoalAyahs: Math.max(1, Number(e.target.value) || 10) })}
              className="w-full rounded-xl px-3.5 py-2 text-sm font-mono-tabular modern-input"
            />
          </label>

          <div className="flex items-center justify-between surface-alt rounded-xl p-3.5 text-xs">
            <span className="font-semibold">{t.dashboard.carouselTitle}</span>
            <button
              type="button"
              onClick={() => updateSettings({ carouselEnabled: !settings.carouselEnabled })}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white"
              style={{ backgroundColor: settings.carouselEnabled ? 'var(--accent-primary)' : '#64748b' }}
            >
              {settings.carouselEnabled ? t.common.enable : t.common.disable}
            </button>
          </div>
        </div>
      </div>

      {/* Security, PIN & Encrypted Backup */}
      <div className="surface-card rounded-3xl p-6 space-y-5">
        <div className="flex items-center gap-2.5">
          <Icon3D kind="shield" size={26} />
          <h3 className="text-base font-bold">{t.settingsModule.securityBackup}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="surface-alt rounded-2xl p-4 space-y-3">
            <div className="text-xs font-semibold">
              {t.settingsModule.createBackup} · {t.settingsModule.encryptedNote}
            </div>
            <input
              type="password"
              value={backupPassword}
              onChange={(e) => setBackupPassword(e.target.value)}
              placeholder={t.settingsModule.backupPassword}
              className="w-full rounded-xl px-3 py-2 text-xs modern-input"
            />
            <button
              type="button"
              onClick={handleExportBackup}
              className="w-full rounded-xl py-2.5 text-xs font-semibold flex items-center justify-center gap-2 btn-primary"
            >
              <Icon3D kind="download" size={18} />
              <span>{t.settingsModule.createBackup}</span>
            </button>
          </div>

          <div className="surface-alt rounded-2xl p-4 space-y-3">
            <div className="text-xs font-semibold">{t.settingsModule.restoreBackup}</div>
            <input
              type="password"
              value={restorePassword}
              onChange={(e) => setRestorePassword(e.target.value)}
              placeholder={t.settingsModule.backupPassword}
              className="w-full rounded-xl px-3 py-2 text-xs modern-input"
            />
            <label className="w-full rounded-xl surface-card py-2.5 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer min-h-[44px]">
              <Icon3D kind="upload" size={18} />
              <span>{t.settingsModule.restoreBackup}</span>
              <input type="file" accept=".json,.eyad" className="hidden" onChange={handleRestoreFileSelect} />
            </label>
          </div>
        </div>

        {pendingRestorePayload && (
          <div className="rounded-xl border p-4 bg-amber-500/10 space-y-3">
            <p className="text-xs font-semibold">{t.settingsModule.restoreConfirm}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={confirmRestore}
                className="rounded-lg px-4 py-2 text-xs font-semibold text-white"
                style={{ backgroundColor: 'var(--accent-primary)' }}
              >
                {t.common.confirm}
              </button>
              <button
                type="button"
                onClick={() => setPendingRestorePayload(null)}
                className="rounded-lg border px-4 py-2 text-xs"
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                {t.common.cancel}
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <Icon3D kind="lock" size={20} />
          <input
            type="password"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            placeholder={t.settingsModule.statsPin}
            className="rounded-xl px-3 py-2 text-xs font-mono-tabular modern-input"
          />
          <button
            type="button"
            onClick={saveStatsPin}
            className="rounded-xl surface-alt px-3.5 py-2 text-xs font-semibold min-h-[40px]"
          >
            {t.settingsModule.setPin}
          </button>
        </div>

        {statusMsg && (
          <div className="text-xs flex items-center gap-1.5 text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
            <span>{statusMsg}</span>
          </div>
        )}
      </div>

      {/* About, Updates & Reset */}
      <div className="surface-card rounded-3xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1 text-xs">
          <div className="text-sm font-bold flex items-center gap-2">
            <Icon3D kind="about" size={20} />
            <span>{t.settingsModule.aboutTitle} · {t.appName}</span>
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>
            {t.aboutModule.developerLabel}: <strong>{t.aboutModule.developerName}</strong>
          </div>
          <div style={{ color: 'var(--text-muted)' }}>
            {t.settingsModule.version}: {settings.appVersion} · {t.offlineZeroAdsBadge}
          </div>
          {updateMsg && <div style={{ color: 'var(--accent-primary)' }}>{updateMsg}</div>}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveModule('about')}
            className="rounded-xl px-4 py-2 text-xs font-semibold btn-primary"
          >
            {t.nav.about}
          </button>

          <button
            type="button"
            onClick={checkUpdates}
            className="rounded-xl border px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t.settingsModule.checkUpdates}</span>
          </button>

          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="rounded-xl border px-3.5 py-2 text-xs font-semibold text-rose-600 flex items-center gap-1.5"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.settingsModule.deleteAllData}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-rose-600">{t.settingsModule.deleteConfirm}</span>
              <button
                type="button"
                onClick={async () => {
                  await clearAllUserData();
                  setConfirmDelete(false);
                  await refreshCoreState();
                }}
                className="rounded-lg bg-rose-600 text-white px-3 py-1.5 text-xs font-semibold"
              >
                {t.common.confirm}
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="rounded-lg border px-3 py-1.5 text-xs"
              >
                {t.common.cancel}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
