import React, { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  getDistanceToMakkahKm,
  getLocalizedCityName,
  getQiblaBearing,
  PRESET_CITIES,
} from '../utils/islamicCalc';
import { Icon3D } from './Icons3D';

export const QiblaView: React.FC = () => {
  const { settings, t, updateSettings } = useApp();
  const lang = settings.language;

  const [heading, setHeading] = useState<number | null>(null);
  const [manualHeading, setManualHeading] = useState<number>(0);
  const [sensorAvailable, setSensorAvailable] = useState<boolean>(true);
  const [needsIOSPerm, setNeedsIOSPerm] = useState<boolean>(false);

  const qiblaBearing = getQiblaBearing(settings.latitude, settings.longitude);
  const distanceKm = getDistanceToMakkahKm(settings.latitude, settings.longitude);
  const cityDisplay = getLocalizedCityName(settings.city, lang, t.gpsLabel);

  useEffect(() => {
    const devOrient = window.DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };
    if (typeof devOrient?.requestPermission === 'function') {
      setNeedsIOSPerm(true);
    }

    let gotEvent = false;
    const handler = (e: DeviceOrientationEvent) => {
      const ev = e as DeviceOrientationEvent & { webkitCompassHeading?: number };
      const deg =
        typeof ev.webkitCompassHeading === 'number'
          ? ev.webkitCompassHeading
          : e.alpha !== null
          ? (360 - e.alpha) % 360
          : null;
      if (deg !== null && Number.isFinite(deg)) {
        gotEvent = true;
        setHeading(Math.round(deg));
        setSensorAvailable(true);
      }
    };

    window.addEventListener('deviceorientation', handler, true);
    const timeout = setTimeout(() => {
      if (!gotEvent) setSensorAvailable(false);
    }, 1800);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('deviceorientation', handler, true);
    };
  }, []);

  const requestCompassPermission = async () => {
    const devOrient = window.DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };
    if (typeof devOrient?.requestPermission === 'function') {
      try {
        const res = await devOrient.requestPermission();
        if (res === 'granted') {
          setNeedsIOSPerm(false);
          setSensorAvailable(true);
        }
      } catch {
        setSensorAvailable(false);
      }
    }
  };

  const refreshGPS = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      updateSettings({
        latitude: Number(pos.coords.latitude.toFixed(4)),
        longitude: Number(pos.coords.longitude.toFixed(4)),
        locationGranted: true,
        city: 'GPS',
      });
    });
  };

  const effectiveHeading = heading !== null ? heading : manualHeading;
  const relativeRotation = qiblaBearing - effectiveHeading;
  const normalizedDelta = Math.abs((((relativeRotation % 360) + 540) % 360) - 180);
  const isAligned = normalizedDelta <= 6;

  return (
    <div className="space-y-6">
      <div className="surface-card rounded-3xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Icon3D kind="qibla" size={44} className="shrink-0" />
          <div>
            <h2 className="text-xl font-bold">{t.nav.qibla}</h2>
            <p className="text-xs mt-1 font-mono-tabular" style={{ color: 'var(--text-secondary)' }}>
              {cityDisplay} ({settings.latitude.toFixed(3)}, {settings.longitude.toFixed(3)}) · {t.qiblaModule.makkahLabel}: {distanceKm.toLocaleString()} {t.kmUnit}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={refreshGPS}
          className="inline-flex items-center gap-1.5 rounded-xl surface-alt px-4 py-2.5 text-xs font-semibold min-h-[42px] hover:opacity-90"
        >
          <Icon3D kind="location" size={18} />
          <span>{t.prayers.detectLocation}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6 surface-elevated rounded-3xl p-8 flex flex-col items-center justify-center space-y-6">
          {/* Precision SVG 360° Compass Rose Dial */}
          <div className="relative w-72 h-72 flex items-center justify-center">
            <svg viewBox="0 0 300 300" className="w-full h-full select-none">
              {/* Outer Bezel */}
              <circle
                cx="150"
                cy="150"
                r="142"
                fill="var(--bg-surface-alt)"
                stroke={isAligned ? 'var(--accent-gold)' : 'var(--border-strong)'}
                strokeWidth={isAligned ? 3 : 1.5}
              />
              <circle
                cx="150"
                cy="150"
                r="116"
                fill="var(--bg-surface)"
                stroke="var(--border-subtle)"
                strokeWidth="1"
              />

              {/* 72 Degree Tick Marks */}
              {Array.from({ length: 72 }, (_, i) => {
                const angle = i * 5;
                const isMajor = angle % 30 === 0;
                const isCardinal = angle % 90 === 0;
                const rOuter = 138;
                const rInner = isCardinal ? 123 : isMajor ? 128 : 133;
                const rad = ((angle - 90) * Math.PI) / 180;
                return (
                  <line
                    key={angle}
                    x1={150 + rInner * Math.cos(rad)}
                    y1={150 + rInner * Math.sin(rad)}
                    x2={150 + rOuter * Math.cos(rad)}
                    y2={150 + rOuter * Math.sin(rad)}
                    stroke={isCardinal ? 'var(--accent-primary)' : 'var(--text-muted)'}
                    strokeWidth={isCardinal ? 2.2 : isMajor ? 1.4 : 0.8}
                    opacity={isCardinal ? 0.95 : isMajor ? 0.7 : 0.4}
                  />
                );
              })}

              {/* Cardinal Labels */}
              <text x="150" y="38" textAnchor="middle" fill="var(--accent-primary)" fontSize="13" fontWeight="800">
                {t.qiblaModule.northShort}
              </text>
              <text x="150" y="271" textAnchor="middle" fill="var(--text-muted)" fontSize="12" fontWeight="700">
                {t.qiblaModule.southShort}
              </text>
              <text x="268" y="154" textAnchor="middle" fill="var(--text-muted)" fontSize="12" fontWeight="700">
                {t.qiblaModule.eastShort}
              </text>
              <text x="32" y="154" textAnchor="middle" fill="var(--text-muted)" fontSize="12" fontWeight="700">
                {t.qiblaModule.westShort}
              </text>

              {/* Rotating Qibla Needle + Kaaba Marker */}
              <g
                transform={`rotate(${relativeRotation} 150 150)`}
                style={{ transition: 'transform 220ms cubic-bezier(0.16, 1, 0.3, 1)' }}
              >
                <line
                  x1="150"
                  y1="150"
                  x2="150"
                  y2="220"
                  stroke="var(--text-muted)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.45"
                />
                <polygon
                  points="150,48 139,86 150,79 161,86"
                  fill={isAligned ? 'var(--accent-gold)' : 'var(--accent-primary)'}
                />
                <line
                  x1="150"
                  y1="78"
                  x2="150"
                  y2="150"
                  stroke={isAligned ? 'var(--accent-gold)' : 'var(--accent-primary)'}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                {/* Kaaba Emblem at center */}
                <rect
                  x="139"
                  y="139"
                  width="22"
                  height="22"
                  rx="5"
                  fill="#18140e"
                  stroke="var(--accent-gold)"
                  strokeWidth="2.5"
                />
                <line x1="142" y1="146" x2="158" y2="146" stroke="var(--accent-gold)" strokeWidth="2" />
              </g>
            </svg>
          </div>

          <div className="text-center space-y-1">
            <div className="font-mono-tabular text-4xl font-bold tracking-tight" style={{ color: 'var(--accent-primary)' }}>
              {qiblaBearing.toFixed(1)}°
            </div>
            <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              {heading !== null ? `${t.qiblaModule.compassHeading}: ${heading}°` : t.qiblaModule.bearingTrueNorth}
            </div>
          </div>

          {/* Manual Heading Preview Dial when sensor is unavailable */}
          {heading === null && (
            <div className="w-full max-w-xs surface-alt rounded-2xl p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between font-medium">
                <span>{t.qiblaModule.previewDialLabel}</span>
                <span className="font-mono-tabular font-bold">{manualHeading}°</span>
              </div>
              <input
                type="range"
                min={0}
                max={359}
                value={manualHeading}
                onChange={(e) => setManualHeading(Number(e.target.value))}
                className="w-full accent-emerald-700"
              />
            </div>
          )}

          {needsIOSPerm && (
            <button
              type="button"
              onClick={requestCompassPermission}
              className="rounded-xl px-5 py-2.5 text-xs font-semibold inline-flex items-center gap-2 btn-primary"
            >
              <Icon3D kind="qibla" size={18} />
              <span>{t.qiblaModule.enableSensor}</span>
            </button>
          )}
        </div>

        <div className="lg:col-span-6 space-y-4">
          {!sensorAvailable && (
            <div className="surface-card rounded-3xl p-5 flex items-start gap-3 bg-amber-500/10">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-semibold">{t.qiblaModule.sensorMissingTitle}</p>
                <p style={{ color: 'var(--text-secondary)' }}>
                  {t.qiblaModule.sensorMissingDesc} ({qiblaBearing.toFixed(1)}°)
                </p>
              </div>
            </div>
          )}

          <div className="surface-card rounded-3xl p-6 space-y-2.5 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              {t.qiblaModule.calibrationTitle}
            </h3>
            <p>{t.qiblaModule.calibrationSteps}</p>
          </div>

          {/* World Cities Qibla Bearings */}
          <div className="surface-card rounded-3xl p-6 space-y-3">
            <h3 className="text-sm font-bold">{t.qiblaModule.worldCitiesTitle}</h3>
            <div className="divide-y max-h-[300px] overflow-y-auto" style={{ borderColor: 'var(--border-subtle)' }}>
              {PRESET_CITIES.map((city) => {
                const bearing = getQiblaBearing(city.lat, city.lng);
                const dist = getDistanceToMakkahKm(city.lat, city.lng);
                const isSelected = settings.city === city.name;
                return (
                  <button
                    key={city.name}
                    type="button"
                    onClick={() =>
                      updateSettings({
                        city: city.name,
                        latitude: city.lat,
                        longitude: city.lng,
                      })
                    }
                    className="w-full py-2.5 px-2 flex items-center justify-between text-xs text-start rounded-lg transition-colors"
                    style={{
                      backgroundColor: isSelected ? 'var(--accent-soft)' : 'transparent',
                    }}
                  >
                    <div>
                      <div className="font-semibold">{city.label[lang]}</div>
                      <div className="font-mono-tabular text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        {dist.toLocaleString()} {t.kmUnit}
                      </div>
                    </div>
                    <span className="font-mono-tabular font-bold" style={{ color: 'var(--accent-primary)' }}>
                      {bearing.toFixed(1)}°
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
