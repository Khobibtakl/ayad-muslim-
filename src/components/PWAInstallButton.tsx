import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useOnlineStatus, usePWAInstall } from '../hooks/usePWAInstall';
import { Icon3D } from './Icons3D';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { t } = useApp();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) return null;

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold text-white transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
        style={{ backgroundColor: 'var(--accent-primary)' }}
      >
        <Icon3D kind="download" size={16} />
        <span>{t.installApp}</span>
      </button>
    );
  }

  if (isIOS && !compact) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
          style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
        >
          <Icon3D kind="download" size={16} />
          <span>{t.installIOS}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="surface-card w-full max-w-sm rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold">{t.installIOS}</h3>
              <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                {t.iosInstallSteps}
              </p>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-lg py-2.5 text-sm font-medium text-white"
                style={{ backgroundColor: 'var(--accent-primary)' }}
              >
                {t.common.close}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { t } = useApp();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="fixed bottom-20 lg:bottom-4 start-4 z-50 flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium text-white shadow-lg bg-emerald-800"
    >
      <Icon3D kind="offline" size={16} />
      <span>{t.offlineBanner}</span>
    </div>
  );
};
