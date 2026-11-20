import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import emblemImg from '../assets/images/eyad_app_emblem_1794571275194.jpg';
import { useApp } from '../context/AppContext';
import { getWallpaperById } from '../data/wallpapers';
import { Icon3D } from './Icons3D';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const { t, settings } = useApp();
  const wp = getWallpaperById(settings.wallpaper);

  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-8 overflow-hidden"
      style={{ color: 'var(--text-primary)' }}
    >
      {/* Atmospheric Wallpaper + Scrim */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 pointer-events-none">
        {wp.image ? (
          <img src={wp.image} alt="" className="w-full h-full object-cover scale-[1.03]" />
        ) : (
          <div className="w-full h-full" style={{ backgroundColor: 'var(--bg-canvas)' }} />
        )}
        <div className="absolute inset-0" style={{ background: 'var(--backdrop-scrim)' }} />
        <div className="absolute inset-0 islamic-pattern-bg opacity-45" />
      </div>

      {/* Top Bismillah */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="pt-4 text-center flex items-center gap-2.5 surface-alt rounded-2xl px-5 py-2.5"
      >
        <Icon3D kind="sparkles" size={22} />
        <p
          className="font-arabic text-lg sm:text-2xl opacity-95"
          style={{ color: 'var(--accent-primary)' }}
        >
          {settings.language === 'en'
            ? 'In the Name of Allah, the Entirely Merciful'
            : 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'}
        </p>
      </motion.div>

      {/* Architectural Frosted Glass Emblem Hero */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="surface-elevated rounded-[32px] px-8 py-9 sm:px-12 sm:py-11 flex flex-col items-center text-center space-y-6 max-w-md w-full relative"
      >
        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute -inset-6 rounded-full blur-2xl opacity-45 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, var(--accent-soft), transparent 70%)',
            }}
          />
          <div className="relative p-2.5 rounded-[28px] surface-alt">
            <img
              src={emblemImg}
              alt={t.appName}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-[20px] object-cover"
            />
            <div className="absolute -bottom-2.5 -end-2.5 drop-shadow-md">
              <Icon3D kind="quran" size={34} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h1
            className="font-arabic text-4xl sm:text-5xl font-bold tracking-tight"
            style={{ color: 'var(--accent-primary)' }}
          >
            {t.appName}
          </h1>
          <p className="text-base sm:text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>
            {t.appSubtitle}
          </p>
        </div>

        {/* Sleek Shimmer Bar */}
        <div className="w-36 h-1.5 rounded-full shimmer-bar-track">
          <div className="shimmer-bar-fill" />
        </div>

        <button
          type="button"
          onClick={onFinish}
          className="mt-1 inline-flex items-center gap-2 rounded-xl px-6 py-3 min-h-[44px] text-xs font-semibold btn-primary"
        >
          <Icon3D kind="dashboard" size={18} />
          <span>{t.onboarding.startApp}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>

      {/* Bottom Attribution */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, delay: 0.15 }}
        className="pb-3 text-center space-y-1 text-xs surface-alt rounded-2xl px-5 py-2.5"
        style={{ color: 'var(--text-muted)' }}
      >
        <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
          {t.aboutModule.developerLabel}: {t.aboutModule.developerName}
        </div>
        <div className="font-mono-tabular">
          {t.versionPrefix} {settings.appVersion} · {t.offlineZeroAdsBadge}
        </div>
      </motion.div>
    </div>
  );
};
