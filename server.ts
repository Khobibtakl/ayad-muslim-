import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

const EYAD_SYSTEM_PROMPT = `You are "مساعد إِيَاد" (Eyad Assistant), a scholarly, humble, and accurate Islamic knowledge & productivity assistant inside the "إِيَادُ المُسْلِم" (Eyad Al-Muslim) application.

STRICT SCHOLARLY & SAFETY PRINCIPLES:
1. Quranic verses MUST be quoted accurately in Arabic with exact Surah name and Ayah number.
2. Prophetic Hadiths MUST include their collection source (e.g., Sahih al-Bukhari, Sahih Muslim, Sunan Abi Dawud, etc.) and authenticity grade (Sahih, Hasan, Muttafaq Alayh).
3. NEVER fabricate, guess, or invent any Hadith, Quranic wording, or reference number. If uncertain of an exact reference, state clearly that verification from primary books is needed.
4. On matters of Islamic jurisprudence (Fiqh) where recognized scholarly schools (Hanafi, Shafi'i, Maliki, Hanbali) differ, explicitly present the differing viewpoints fairly without dogmatism.
5. For important personal, legal, marital, financial, or complex Shar'i rulings, clearly advise consulting a qualified local scholar or recognized Mufti.
6. NEVER claim the authority of a Mufti or issue binding religious Fatawa.
7. Respond clearly in the user's chosen language (Pashto, Arabic, Persian/Dari, or English) with respectful, warm, and well-structured formatting.`;

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  app.use(express.json({ limit: '2mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, aiConfigured: Boolean(ai), timestamp: Date.now() });
  });

  // Eyad AI Assistant endpoint
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { messages, language, contextNote } = req.body as {
        messages: Array<{ role: 'user' | 'model'; text: string }>;
        language?: string;
        contextNote?: string;
      };

      if (!ai) {
        return res.status(503).json({
          error: 'AI_NOT_CONFIGURED',
          message: 'GEMINI_API_KEY is not configured on the server.',
        });
      }

      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Messages array is required.' });
      }

      const langLabel =
        language === 'ps'
          ? 'Pashto (پښتو)'
          : language === 'ar'
          ? 'Arabic (العربية)'
          : language === 'fa'
          ? 'Persian/Dari (فارسی)'
          : 'English';

      const systemInstruction = `${EYAD_SYSTEM_PROMPT}\nPreferred response language: ${langLabel}.${
        contextNote ? `\nCurrent App Context: ${contextNote}` : ''
      }`;

      const contents = messages.map((m) => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }],
      }));

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('AI_REQUEST_TIMEOUT')), 25000)
      );

      const response = await Promise.race([
        ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents,
          config: {
            systemInstruction,
          },
        }),
        timeoutPromise,
      ]);

      res.json({
        reply: response.text ?? '',
      });
    } catch (error: unknown) {
      console.error('AI Chat Error:', error);
      const errMsg = error instanceof Error ? error.message : 'Unknown AI error';
      const status = errMsg === 'AI_REQUEST_TIMEOUT' ? 504 : 500;
      res.status(status).json({ error: errMsg === 'AI_REQUEST_TIMEOUT' ? 'AI_TIMEOUT' : 'AI_REQUEST_FAILED', message: errMsg });
    }
  });

  // Quran Surah + Translation + Tafsir fetcher for offline caching
  app.get('/api/quran/surah/:id', async (req, res) => {
    const surahId = Number(req.params.id);
    if (!Number.isInteger(surahId) || surahId < 1 || surahId > 114) {
      return res.status(400).json({ error: 'Invalid surah number (1-114).' });
    }

    try {
      const editionsUrl = `https://api.alquran.cloud/v1/surah/${surahId}/editions/quran-uthmani,ps.abdulwali,en.sahih,fa.ansarian,ar.muyassar,ar.jalalayn`;
      const mainRes = await fetch(editionsUrl, { signal: AbortSignal.timeout(15000) });
      if (!mainRes.ok) {
        throw new Error(`AlQuran Cloud responded with ${mainRes.status}`);
      }
      const mainData = (await mainRes.json()) as {
        code: number;
        data: Array<{
          number: number;
          name: string;
          englishName: string;
          revelationType: string;
          numberOfAyahs: number;
          ayahs: Array<{
            number: number;
            numberInSurah: number;
            juz: number;
            page: number;
            text: string;
          }>;
        }>;
      };

      const [uthmani, psTrans, enSahih, faTrans, arMuyassar, arJalalayn] = mainData.data;

      const ayahs = uthmani.ayahs.map((a, idx) => ({
        numberInSurah: a.numberInSurah,
        globalNumber: a.number,
        juz: a.juz,
        page: a.page,
        arabic: a.text,
        ps: psTrans?.ayahs?.[idx]?.text ?? '',
        en: enSahih?.ayahs?.[idx]?.text ?? '',
        fa: faTrans?.ayahs?.[idx]?.text ?? '',
        tafsirAr: arMuyassar?.ayahs?.[idx]?.text ?? '',
        tafsirJalalayn: arJalalayn?.ayahs?.[idx]?.text ?? '',
        tafsirSource: 'التفسير الميسر / تفسير الجلالين — AlQuran Cloud',
      }));

      res.json({
        number: uthmani.number,
        name: uthmani.name,
        englishName: uthmani.englishName,
        revelationType: uthmani.revelationType,
        numberOfAyahs: uthmani.numberOfAyahs,
        ayahs,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch Surah';
      res.status(502).json({ error: 'QURAN_FETCH_FAILED', message });
    }
  });

  // Nearby Mosques via OpenStreetMap Overpass API with mirror fallback
  app.get('/api/mosques/nearby', async (req, res) => {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    const radius = Math.min(Number(req.query.radius) || 5000, 15000);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.status(400).json({ error: 'Valid lat and lng query parameters are required.' });
    }

    const query = `
      [out:json][timeout:10];
      (
        node["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lng});
        way["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lng});
        node["building"="mosque"](around:${radius},${lat},${lng});
        way["building"="mosque"](around:${radius},${lat},${lng});
      );
      out center 25;
    `;

    const mirrors = [
      'https://overpass-api.de/api/interpreter',
      'https://overpass.kumi.systems/api/interpreter',
      'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
    ];

    interface OverpassElement {
      id: number;
      type: string;
      lat?: number;
      lon?: number;
      center?: { lat: number; lon: number };
      tags?: Record<string, string>;
    }
    interface OverpassResponse {
      elements?: OverpassElement[];
    }

    try {
      let data: OverpassResponse | null = null;
      let lastStatus = 'unreachable';

      for (const endpoint of mirrors) {
        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Accept: 'application/json',
              'User-Agent': 'EyadAlMuslimApp/1.0',
            },
            body: `data=${encodeURIComponent(query)}`,
            signal: AbortSignal.timeout(9000),
          });
          if (response.ok) {
            data = (await response.json()) as OverpassResponse;
            break;
          }
          lastStatus = `${endpoint}: HTTP ${response.status}`;
        } catch (err: unknown) {
          lastStatus = err instanceof Error ? err.message : 'network error';
        }
      }

      const toRad = (d: number) => (d * Math.PI) / 180;
      const calcDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      };

      if (data && Array.isArray(data.elements)) {
        const seen = new Set<string>();
        const mosques = data.elements
          .map((el) => {
            const mLat = el.lat ?? el.center?.lat;
            const mLng = el.lon ?? el.center?.lon;
            if (mLat === undefined || mLng === undefined) return null;
            const tags = el.tags || {};
            const name = tags.name || tags['name:ar'] || tags['name:ps'] || tags['name:en'] || 'Masjid';
            const key = `${name}-${mLat.toFixed(4)}-${mLng.toFixed(4)}`;
            if (seen.has(key)) return null;
            seen.add(key);

            const addressParts = [
              tags['addr:street'],
              tags['addr:housenumber'],
              tags['addr:neighbourhood'] || tags['addr:suburb'],
              tags['addr:city'],
            ].filter(Boolean);

            return {
              id: `${el.type}-${el.id}`,
              name,
              lat: mLat,
              lng: mLng,
              distanceKm: Number(calcDistanceKm(lat, lng, mLat, mLng).toFixed(2)),
              address: addressParts.join(', ') || tags['addr:full'] || '',
              openingHours: tags.opening_hours || '',
              wheelchair: tags.wheelchair || '',
              phone: tags.phone || '',
            };
          })
          .filter((x): x is NonNullable<typeof x> => x !== null)
          .sort((a, b) => a.distanceKm - b.distanceKm);

        return res.json({ mosques });
      }

      // Fallback to OpenStreetMap Nominatim bounding-box search if Overpass mirrors are congested
      const degDelta = Math.max(0.03, radius / 111000);
      const viewbox = `${lng - degDelta},${lat + degDelta},${lng + degDelta},${lat - degDelta}`;
      const nomUrl = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=mosque&bounded=1&viewbox=${viewbox}&limit=25&addressdetails=1`;
      const nomRes = await fetch(nomUrl, {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'EyadAlMuslimApp/1.0 (https://eyad-muslim.app)',
        },
        signal: AbortSignal.timeout(9000),
      });

      if (!nomRes.ok) {
        throw new Error(`Overpass (${lastStatus}) and Nominatim (HTTP ${nomRes.status}) unavailable`);
      }

      const nomData = (await nomRes.json()) as Array<{
        place_id: number;
        lat: string;
        lon: string;
        name?: string;
        display_name?: string;
      }>;

      const fallbackMosques = nomData
        .map((item) => {
          const mLat = Number(item.lat);
          const mLng = Number(item.lon);
          if (!Number.isFinite(mLat) || !Number.isFinite(mLng)) return null;
          return {
            id: `nom-${item.place_id}`,
            name: item.name || item.display_name?.split(',')[0] || 'Masjid',
            lat: mLat,
            lng: mLng,
            distanceKm: Number(calcDistanceKm(lat, lng, mLat, mLng).toFixed(2)),
            address: item.display_name || '',
            openingHours: '',
            wheelchair: '',
            phone: '',
          };
        })
        .filter((x): x is NonNullable<typeof x> => x !== null)
        .sort((a, b) => a.distanceKm - b.distanceKm);

      res.json({ mosques: fallbackMosques });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Overpass lookup failed';
      res.status(502).json({ error: 'MOSQUE_LOOKUP_FAILED', message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        ws: false,
      },
      plugins: [
        {
          name: 'disable-hmr-ws-client',
          transform(code, id) {
            if (id.includes('vite/dist/client/client.mjs')) {
              const startMarker = 'const transport = normalizeModuleRunnerTransport((() => {';
              const endMarker = 'let willUnload = false;';
              const startIdx = code.indexOf(startMarker);
              const endIdx = code.indexOf(endMarker);
              if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
                return (
                  code.slice(0, startIdx) +
                  'const transport = normalizeModuleRunnerTransport({ connect() {}, disconnect() {}, send() {} });\n' +
                  code.slice(endIdx)
                );
              }
            }
          },
        },
      ],
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Eyad Al-Muslim server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
