import React, { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ExternalLink, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getDB } from '../db/database';
import { useOnlineStatus } from '../hooks/usePWAInstall';
import type { LanguageCode, MosquePlace } from '../types';
import { calcDistanceKm, getBearingDeg, getLocalizedCityName } from '../utils/islamicCalc';
import { Icon3D } from './Icons3D';

function localizeMosqueField(raw: string, lang: LanguageCode): string {
  if (!raw.includes(' / ')) return raw;
  const parts = raw.split(' / ').map((s) => s.trim());
  if (lang === 'en') return parts[1] || parts[0];
  return parts[0] || raw;
}

export const MosquesView: React.FC = () => {
  const { settings, t, updateSettings } = useApp();
  const lang = settings.language;
  const isOnline = useOnlineStatus();

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [mosques, setMosques] = useState<MosquePlace[]>([]);
  const [selected, setSelected] = useState<MosquePlace | null>(null);
  const [loading, setLoading] = useState(false);
  const [offlineFallback, setOfflineFallback] = useState(false);

  const computeDistances = (list: MosquePlace[], lat: number, lng: number): MosquePlace[] =>
    list
      .map((m) => ({
        ...m,
        distanceKm: Number(calcDistanceKm(lat, lng, m.lat, m.lng).toFixed(1)),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm);

  const loadMosques = async (lat: number, lng: number) => {
    const db = await getDB();
    if (!navigator.onLine) {
      setOfflineFallback(true);
      const cached = computeDistances(await db.getAll('mosques_cache'), lat, lng);
      setMosques(cached);
      if (cached.length > 0 && !selected) setSelected(cached[0]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/mosques/nearby?lat=${lat}&lng=${lng}&radius=5000`);
      if (!res.ok) throw new Error('Lookup failed');
      const data = (await res.json()) as { mosques: MosquePlace[] };
      if (data.mosques.length > 0) {
        const sorted = computeDistances(data.mosques, lat, lng);
        setMosques(sorted);
        setOfflineFallback(false);
        for (const m of sorted) {
          await db.put('mosques_cache', m);
        }
        setSelected(sorted[0]);
        return;
      }
      throw new Error('Empty live list');
    } catch {
      const cached = computeDistances(await db.getAll('mosques_cache'), lat, lng);
      setMosques(cached);
      setOfflineFallback(!navigator.onLine);
      if (cached.length > 0) setSelected(cached[0]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMosques(settings.latitude, settings.longitude);
  }, [settings.latitude, settings.longitude, isOnline]);

  // Initialize Leaflet map when online
  useEffect(() => {
    if (!isOnline || offlineFallback || !mapContainerRef.current) return;
    if (mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView([settings.latitude, settings.longitude], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);
    const layer = L.layerGroup().addTo(map);
    mapRef.current = map;
    markersLayerRef.current = layer;

    return () => {
      map.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
    };
  }, [isOnline, offlineFallback]);

  const localizedCity = getLocalizedCityName(settings.city, lang, t.gpsLabel);

  useEffect(() => {
    const map = mapRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    map.setView([settings.latitude, settings.longitude], 14);
    layer.clearLayers();

    L.circleMarker([settings.latitude, settings.longitude], {
      radius: 8,
      color: '#0b5d43',
      fillColor: '#1f9d73',
      fillOpacity: 0.9,
    })
      .bindPopup(localizedCity)
      .addTo(layer);

    mosques.forEach((m) => {
      const displayName = localizeMosqueField(m.name, lang);
      const marker = L.circleMarker([m.lat, m.lng], {
        radius: 9,
        color: '#b88a2e',
        fillColor: '#d9ac4c',
        fillOpacity: 0.9,
      }).bindPopup(`<strong>${displayName}</strong><br/>${m.distanceKm} ${t.kmUnit}`);
      marker.on('click', () => setSelected(m));
      marker.addTo(layer);
    });
  }, [mosques, localizedCity, settings.latitude, settings.longitude, lang, t.kmUnit]);

  const detectLocation = () => {
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

  // Offline SVG Radar pins scaled cleanly inside 160px radius
  const radarPins = useMemo(() => {
    const topEight = mosques.slice(0, 8);
    const maxDist = Math.max(1, ...topEight.map((m) => m.distanceKm));
    return topEight.map((m) => {
      const bearingDeg = getBearingDeg(settings.latitude, settings.longitude, m.lat, m.lng);
      const angleRad = ((bearingDeg - 90) * Math.PI) / 180;
      const normalized = 32 + Math.min(1, m.distanceKm / maxDist) * 112;
      const x = 180 + Math.cos(angleRad) * normalized;
      const y = 180 + Math.sin(angleRad) * normalized;
      return { mosque: m, x, y, bearingDeg: Math.round(bearingDeg) };
    });
  }, [mosques, settings.latitude, settings.longitude]);

  const showOfflineRadar = !isOnline || offlineFallback;

  return (
    <div className="space-y-6">
      <div className="surface-card rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Icon3D kind="mosques" size={30} className="mt-0.5" />
          <div>
            <h2 className="text-xl font-bold">{t.nav.mosques}</h2>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              {t.mosquesModule.sourceLabel} · {localizedCity} ({settings.latitude.toFixed(3)}, {settings.longitude.toFixed(3)})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={detectLocation}
            className="inline-flex items-center gap-1.5 rounded-xl surface-alt px-3.5 py-2 text-xs font-semibold min-h-[40px] hover:opacity-90"
          >
            <Icon3D kind="location" size={16} />
            <span>{t.prayers.detectLocation}</span>
          </button>
          <button
            type="button"
            onClick={() => loadMosques(settings.latitude, settings.longitude)}
            className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold min-h-[40px] btn-primary"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{t.common.search}</span>
          </button>
        </div>
      </div>

      {showOfflineRadar && (
        <div className="surface-alt rounded-2xl p-4 flex items-center gap-2.5 text-xs">
          <Icon3D kind="offline" size={18} />
          <span>{t.offlineBanner}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 surface-elevated rounded-3xl overflow-hidden">
          {showOfflineRadar ? (
            <div className="p-6 flex flex-col items-center space-y-3">
              <div className="text-center space-y-1">
                <h3 className="text-sm font-bold">{t.mosquesModule.offlineRadarTitle}</h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {t.mosquesModule.offlineRadarDesc}
                </p>
              </div>
              <svg viewBox="0 0 360 360" className="w-full max-w-[360px] h-auto select-none">
                <circle cx="180" cy="180" r="154" fill="var(--bg-surface-alt)" stroke="var(--border-subtle)" strokeWidth="1.5" />
                <circle cx="180" cy="180" r="110" fill="none" stroke="var(--border-subtle)" strokeDasharray="4 4" />
                <circle cx="180" cy="180" r="64" fill="none" stroke="var(--border-subtle)" strokeDasharray="4 4" />
                <line x1="180" y1="24" x2="180" y2="336" stroke="var(--border-subtle)" strokeWidth="1" />
                <line x1="24" y1="180" x2="336" y2="180" stroke="var(--border-subtle)" strokeWidth="1" />

                <text x="180" y="18" textAnchor="middle" fill="var(--accent-primary)" fontSize="12" fontWeight="700">
                  {t.qiblaModule.northShort}
                </text>
                <text x="180" y="352" textAnchor="middle" fill="var(--text-muted)" fontSize="12" fontWeight="600">
                  {t.qiblaModule.southShort}
                </text>
                <text x="348" y="184" textAnchor="middle" fill="var(--text-muted)" fontSize="12" fontWeight="600">
                  {t.qiblaModule.eastShort}
                </text>
                <text x="12" y="184" textAnchor="middle" fill="var(--text-muted)" fontSize="12" fontWeight="600">
                  {t.qiblaModule.westShort}
                </text>

                {/* User at radar center */}
                <circle cx="180" cy="180" r="9" fill="var(--accent-primary)" />
                <text x="180" y="202" textAnchor="middle" fill="var(--text-primary)" fontSize="10" fontWeight="700">
                  {t.mosquesModule.youAreHere}
                </text>

                {radarPins.map(({ mosque, x, y }) => {
                  const isSel = selected?.id === mosque.id;
                  return (
                    <g
                      key={mosque.id}
                      onClick={() => setSelected(mosque)}
                      className="cursor-pointer"
                    >
                      <line
                        x1="180"
                        y1="180"
                        x2={x}
                        y2={y}
                        stroke={isSel ? 'var(--accent-gold)' : 'var(--border-subtle)'}
                        strokeWidth={isSel ? 2 : 1}
                        opacity={0.7}
                      />
                      <circle
                        cx={x}
                        cy={y}
                        r={isSel ? 11 : 8}
                        fill={isSel ? 'var(--accent-gold)' : '#b88a2e'}
                        stroke="#ffffff"
                        strokeWidth="2"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>
          ) : (
            <div ref={mapContainerRef} className="w-full h-[420px]" />
          )}
        </div>

        <div className="lg:col-span-5 space-y-4">
          {selected && (
            <div className="surface-elevated rounded-3xl p-5 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-bold">{localizeMosqueField(selected.name, lang)}</h3>
                <span className="font-mono-tabular text-xs font-semibold shrink-0" style={{ color: 'var(--accent-primary)' }}>
                  {selected.distanceKm} {t.kmUnit}
                </span>
              </div>
              {selected.address && (
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {localizeMosqueField(selected.address, lang)}
                </p>
              )}
              {selected.openingHours && (
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {selected.openingHours}
                </p>
              )}
              {isOnline && (
                <a
                  href={`https://www.openstreetmap.org/directions?from=${settings.latitude},${settings.longitude}&to=${selected.lat},${selected.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold btn-primary"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{t.mosquesModule.openDirections}</span>
                </a>
              )}
            </div>
          )}

          <div
            className="surface-card rounded-3xl p-4 divide-y max-h-[300px] overflow-y-auto"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            {mosques.length === 0 ? (
              <p className="py-6 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                {loading ? t.common.loading : t.common.empty}
              </p>
            ) : (
              mosques.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setSelected(m);
                    mapRef.current?.setView([m.lat, m.lng], 16);
                  }}
                  className="w-full py-2.5 px-2 flex items-center justify-between gap-2 text-start hover:bg-black/5 dark:hover:bg-white/5 rounded-lg"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">
                      {localizeMosqueField(m.name, lang)}
                    </div>
                    {m.address && (
                      <div className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>
                        {localizeMosqueField(m.address, lang)}
                      </div>
                    )}
                  </div>
                  <span className="font-mono-tabular text-xs font-semibold shrink-0">
                    {m.distanceKm} {t.kmUnit}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
