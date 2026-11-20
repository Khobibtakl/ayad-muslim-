import React, { useEffect, useState } from 'react';
import { Calculator, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getDB, todayKey } from '../db/database';
import type { ZakatRecord } from '../types';
import { Icon3D } from './Icons3D';

type CurrencyCode = 'USD' | 'AFN' | 'SAR' | 'EUR';

export const ZakatView: React.FC = () => {
  const { t } = useApp();
  const [cash, setCash] = useState(0);
  const [goldGrams, setGoldGrams] = useState(0);
  const [goldPrice, setGoldPrice] = useState(85);
  const [silverGrams, setSilverGrams] = useState(0);
  const [silverPrice, setSilverPrice] = useState(1.05);
  const [businessGoods, setBusinessGoods] = useState(0);
  const [otherAssets, setOtherAssets] = useState(0);
  const [debts, setDebts] = useState(0);
  const [standard, setStandard] = useState<'gold' | 'silver'>('silver');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [history, setHistory] = useState<ZakatRecord[]>([]);

  useEffect(() => {
    (async () => {
      const db = await getDB();
      const rows = await db.getAll('zakat_history');
      setHistory(rows.sort((a, b) => b.id.localeCompare(a.id)));
    })();
  }, []);

  const totalAssets =
    cash + goldGrams * goldPrice + silverGrams * silverPrice + businessGoods + otherAssets;
  const netZakatable = Math.max(0, totalAssets - debts);
  const nisabThreshold = standard === 'gold' ? 85 * goldPrice : 595 * silverPrice;
  const eligible = netZakatable >= nisabThreshold && netZakatable > 0;
  const zakatDue = eligible ? netZakatable * 0.025 : 0;

  const currencyLabel = t.zakatModule.currencies[currency];
  const standardLabel = standard === 'gold' ? t.zakatModule.goldShort : t.zakatModule.silverShort;

  const saveCalculation = async (e: React.FormEvent) => {
    e.preventDefault();
    const record: ZakatRecord = {
      id: `z-${Date.now()}`,
      date: todayKey(),
      standard,
      nisabThreshold: Number(nisabThreshold.toFixed(2)),
      totalAssets: Number(totalAssets.toFixed(2)),
      totalDebts: Number(debts.toFixed(2)),
      netZakatable: Number(netZakatable.toFixed(2)),
      zakatDue: Number(zakatDue.toFixed(2)),
      currency,
      notes: eligible ? t.zakatModule.zakatDue : t.zakatModule.belowNisab,
    };
    const db = await getDB();
    await db.put('zakat_history', record);
    setHistory((prev) => [record, ...prev]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <form onSubmit={saveCalculation} className="lg:col-span-7 surface-elevated rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon3D kind="zakat" size={40} className="shrink-0" />
              <h2 className="text-xl font-bold">{t.nav.zakat}</h2>
            </div>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="rounded-xl px-3 py-2 text-xs modern-input"
            >
              {(['USD', 'AFN', 'SAR', 'EUR'] as const).map((code) => (
                <option key={code} value={code}>
                  {t.zakatModule.currencies[code]}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold block">{t.zakatModule.nisabStandard}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStandard('silver')}
                className={`rounded-xl border px-3.5 py-2.5 text-xs font-semibold text-start min-h-[42px] ${
                  standard === 'silver' ? 'btn-primary border-transparent' : ''
                }`}
                style={
                  standard === 'silver'
                    ? undefined
                    : {
                        backgroundColor: 'var(--bg-surface-alt)',
                        color: 'var(--text-primary)',
                        borderColor: 'var(--border-subtle)',
                      }
                }
              >
                {t.zakatModule.silverStandard}
              </button>
              <button
                type="button"
                onClick={() => setStandard('gold')}
                className={`rounded-xl border px-3.5 py-2.5 text-xs font-semibold text-start min-h-[42px] ${
                  standard === 'gold' ? 'btn-primary border-transparent' : ''
                }`}
                style={
                  standard === 'gold'
                    ? undefined
                    : {
                        backgroundColor: 'var(--bg-surface-alt)',
                        color: 'var(--text-primary)',
                        borderColor: 'var(--border-subtle)',
                      }
                }
              >
                {t.zakatModule.goldStandard}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <label className="space-y-1">
              <span className="font-medium block">{t.zakatModule.cash}</span>
              <input type="number" min={0} step="any" value={cash} onChange={(e) => setCash(Number(e.target.value) || 0)} className="w-full rounded-xl px-3 py-2 font-mono-tabular modern-input" />
            </label>
            <label className="space-y-1">
              <span className="font-medium block">{t.zakatModule.businessGoods}</span>
              <input type="number" min={0} step="any" value={businessGoods} onChange={(e) => setBusinessGoods(Number(e.target.value) || 0)} className="w-full rounded-xl px-3 py-2 font-mono-tabular modern-input" />
            </label>
            <label className="space-y-1">
              <span className="font-medium block">{t.zakatModule.goldGrams}</span>
              <input type="number" min={0} step="any" value={goldGrams} onChange={(e) => setGoldGrams(Number(e.target.value) || 0)} className="w-full rounded-xl px-3 py-2 font-mono-tabular modern-input" />
            </label>
            <label className="space-y-1">
              <span className="font-medium block">{t.zakatModule.goldPricePerGram} ({currencyLabel})</span>
              <input type="number" min={0} step="any" value={goldPrice} onChange={(e) => setGoldPrice(Number(e.target.value) || 0)} className="w-full rounded-xl px-3 py-2 font-mono-tabular modern-input" />
            </label>
            <label className="space-y-1">
              <span className="font-medium block">{t.zakatModule.silverGrams}</span>
              <input type="number" min={0} step="any" value={silverGrams} onChange={(e) => setSilverGrams(Number(e.target.value) || 0)} className="w-full rounded-xl px-3 py-2 font-mono-tabular modern-input" />
            </label>
            <label className="space-y-1">
              <span className="font-medium block">{t.zakatModule.silverPricePerGram} ({currencyLabel})</span>
              <input type="number" min={0} step="any" value={silverPrice} onChange={(e) => setSilverPrice(Number(e.target.value) || 0)} className="w-full rounded-xl px-3 py-2 font-mono-tabular modern-input" />
            </label>
            <label className="space-y-1">
              <span className="font-medium block">{t.zakatModule.otherAssets}</span>
              <input type="number" min={0} step="any" value={otherAssets} onChange={(e) => setOtherAssets(Number(e.target.value) || 0)} className="w-full rounded-xl px-3 py-2 font-mono-tabular modern-input" />
            </label>
            <label className="space-y-1">
              <span className="font-medium block">{t.zakatModule.debts}</span>
              <input type="number" min={0} step="any" value={debts} onChange={(e) => setDebts(Number(e.target.value) || 0)} className="w-full rounded-xl px-3 py-2 font-mono-tabular modern-input" />
            </label>
          </div>

          <button
            type="submit"
            className="btn-primary w-full rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 min-h-[46px]"
          >
            <Calculator className="w-4 h-4" />
            <span>{t.zakatModule.calculate}</span>
          </button>
        </form>

        <div className="lg:col-span-5 space-y-4">
          <div className="surface-card rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold">{t.zakatModule.resultTitle}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>{t.zakatModule.totalAssets}</span>
                <span className="font-mono-tabular font-semibold">{totalAssets.toLocaleString()} {currencyLabel}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>{t.zakatModule.debts}</span>
                <span className="font-mono-tabular font-semibold">-{debts.toLocaleString()} {currencyLabel}</span>
              </div>
              <div className="flex justify-between pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{t.zakatModule.netZakatable}</span>
                <span className="font-mono-tabular font-bold">{netZakatable.toLocaleString()} {currencyLabel}</span>
              </div>
              <div className="flex justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                <span>{t.zakatModule.nisabLabel} ({standardLabel})</span>
                <span className="font-mono-tabular">{nisabThreshold.toLocaleString()} {currencyLabel}</span>
              </div>
            </div>

            <div className="surface-alt rounded-2xl p-4 text-center space-y-1">
              <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                {t.zakatModule.zakatDue}
              </div>
              <div className="font-mono-tabular text-3xl font-bold" style={{ color: 'var(--accent-primary)' }}>
                {zakatDue.toFixed(2)} {currencyLabel}
              </div>
              {!eligible && (
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {t.zakatModule.belowNisab}
                </div>
              )}
            </div>

            <div className="flex items-start gap-2 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <Info className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--accent-primary)' }} />
              <span>{t.zakatModule.fiqhNote}</span>
            </div>
          </div>

          {history.length > 0 && (
            <div className="surface-card rounded-3xl p-5 space-y-3">
              <h3 className="text-sm font-bold">{t.zakatModule.history}</h3>
              <div className="divide-y max-h-48 overflow-y-auto" style={{ borderColor: 'var(--border-subtle)' }}>
                {history.map((h) => {
                  const hStd = h.standard === 'gold' ? t.zakatModule.goldShort : t.zakatModule.silverShort;
                  const hCurr = t.zakatModule.currencies[h.currency as CurrencyCode] || h.currency;
                  return (
                    <div key={h.id} className="py-2 flex items-center justify-between text-xs">
                      <span className="font-mono-tabular">{h.date} · {hStd}</span>
                      <span className="font-mono-tabular font-bold" style={{ color: 'var(--accent-primary)' }}>
                        {h.zakatDue} {hCurr}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 8 Quranic Zakat Recipients & Zakat al-Fitr Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 surface-card rounded-3xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-bold">{t.zakatModule.recipientsTitle}</h3>
            <span className="text-xs font-medium" style={{ color: 'var(--accent-primary)' }}>
              {t.zakatModule.recipientsVerseRef}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {t.zakatModule.recipients.map((rec, idx) => (
              <div key={idx} className="surface-alt rounded-2xl p-3.5 flex items-start gap-2.5">
                <span className="font-mono-tabular font-bold shrink-0" style={{ color: 'var(--accent-primary)' }}>
                  {idx + 1}.
                </span>
                <span className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{rec}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 surface-card rounded-3xl p-6 space-y-3">
          <h3 className="text-base font-bold" style={{ color: 'var(--accent-primary)' }}>
            {t.zakatModule.fitrTitle}
          </h3>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {t.zakatModule.fitrDesc}
          </p>
        </div>
      </div>
    </div>
  );
};
