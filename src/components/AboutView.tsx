import React, { useState } from 'react';
import { Check, CheckCircle2, ExternalLink, HeartHandshake, Share2, ShieldCheck } from 'lucide-react';
import emblemImg from '../assets/images/eyad_app_emblem_1794571275194.jpg';
import { useApp } from '../context/AppContext';
import { Icon3D } from './Icons3D';

interface AboutViewProps {
  onReplaySplash?: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onReplaySplash }) => {
  const { t, settings } = useApp();
  const about = t.aboutModule;
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const shareText = `${t.appName} – ${t.appSubtitle}\n${about.privacyBody}`;
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: `${t.appName} – ${t.appSubtitle}`,
          text: shareText,
          url: shareUrl,
        });
        setShared(true);
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        setShared(true);
      }
      window.setTimeout(() => setShared(false), 3000);
    } catch {
      // Ignore cancelled share dialog
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Developer Hero Card */}
      <div className="surface-elevated rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="p-1.5 rounded-2xl surface-alt shrink-0">
          <img
            src={emblemImg}
            alt={t.appName}
            className="w-24 h-24 rounded-xl object-cover"
          />
        </div>

        <div className="space-y-2 text-center sm:text-start flex-1">
          <div
            className="text-xs font-semibold flex items-center justify-center sm:justify-start gap-1.5"
            style={{ color: 'var(--accent-gold)' }}
          >
            <Icon3D kind="about" size={20} />
            <span>{about.developerLabel}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: 'var(--accent-primary)' }}>
            {about.developerName}
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {about.developerRole}
          </p>
          <div className="pt-1 text-xs font-mono-tabular" style={{ color: 'var(--text-muted)' }}>
            {t.appName} · {t.settingsModule.version}: {settings.appVersion}
          </div>
        </div>

        <div className="flex flex-wrap sm:flex-col gap-2.5 shrink-0">
          {onReplaySplash && (
            <button
              type="button"
              onClick={onReplaySplash}
              className="rounded-xl px-4 py-2.5 text-xs font-semibold inline-flex items-center justify-center gap-2 min-h-[44px] btn-primary"
            >
              <Icon3D kind="sparkles" size={18} />
              <span>{about.replaySplash}</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleShare}
            className="rounded-xl px-4 py-2.5 text-xs font-semibold inline-flex items-center justify-center gap-2 min-h-[44px] surface-alt hover:opacity-90 transition-opacity"
          >
            {shared ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Share2 className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
            )}
            <span>{shared ? about.shareCopied : about.shareApp}</span>
          </button>
        </div>
      </div>

      {/* Biographical & Mission Essay */}
      <article className="surface-card rounded-3xl p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <Icon3D kind="hadith" size={26} />
          <h3 className="text-lg font-bold">{about.essayTitle}</h3>
        </div>

        <div className="space-y-4 text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          {about.essayParagraphs.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>
      </article>

      {/* Core Pillars */}
      <div className="surface-card rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5">
          <Icon3D kind="shield" size={24} />
          <h3 className="text-base font-bold">{about.pillarsTitle}</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {about.pillars.map((pillar) => (
            <div key={pillar} className="surface-alt rounded-2xl p-4 flex items-start gap-3 text-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--accent-primary)' }} />
              <span>{pillar}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Google Play Privacy Policy & Data Safety */}
      <div className="surface-card rounded-3xl p-6 sm:p-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 shrink-0" style={{ color: 'var(--accent-primary)' }} />
            <h3 className="text-base sm:text-lg font-bold">{about.privacyTitle}</h3>
          </div>
          <a
            href="/privacy.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold min-h-[44px] btn-primary"
          >
            <span>{about.openPrivacyPolicy}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {about.privacyBody}
        </p>

        <div className="space-y-3">
          <h4 className="text-sm font-bold" style={{ color: 'var(--accent-primary)' }}>
            {about.dataSafetyTitle}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {about.dataSafetyItems.map((item) => (
              <div key={item} className="surface-alt rounded-2xl p-3.5 flex items-start gap-2.5 text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--accent-primary)' }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Play Store Release Readiness Checklist */}
      <div className="surface-card rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5">
          <Icon3D kind="sparkles" size={24} />
          <h3 className="text-base sm:text-lg font-bold">{about.playStoreReadyTitle}</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {about.playStoreChecklist.map((checkItem) => (
            <div key={checkItem} className="surface-alt rounded-2xl p-3.5 flex items-start gap-2.5 text-xs sm:text-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--accent-gold)' }} />
              <span>{checkItem}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Closing Dua */}
      <div
        className="surface-elevated rounded-3xl p-6 sm:p-8 text-center space-y-3"
        style={{ borderColor: 'var(--accent-gold)' }}
      >
        <HeartHandshake className="w-6 h-6 mx-auto" style={{ color: 'var(--accent-gold)' }} />
        <p className="font-arabic text-xl sm:text-2xl leading-loose" dir="rtl">
          {about.closingDua}
        </p>
      </div>
    </div>
  );
};
