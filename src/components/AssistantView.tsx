import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useOnlineStatus } from '../hooks/usePWAInstall';
import { generateOfflineAssistantReply } from '../utils/offlineAssistant';
import { Icon3D } from './Icons3D';

interface ChatMsg {
  role: 'user' | 'model';
  text: string;
}

export const AssistantView: React.FC = () => {
  const { settings, t } = useApp();
  const isOnline = useOnlineStatus();
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (textToSend?: string) => {
    const content = (textToSend ?? input).trim();
    if (!content || loading) return;

    const nextHistory: ChatMsg[] = [...messages, { role: 'user', text: content }];
    setMessages(nextHistory);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      if (navigator.onLine) {
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: nextHistory,
            language: settings.language,
            contextNote: `User Name: ${settings.userName}, City: ${settings.city}`,
          }),
        });
        if (res.ok) {
          const data = (await res.json()) as { reply?: string };
          if (data.reply) {
            setMessages((prev) => [...prev, { role: 'model', text: data.reply! }]);
            return;
          }
        }
      }
      const offlineReply = await generateOfflineAssistantReply(content, settings.language, settings);
      setMessages((prev) => [...prev, { role: 'model', text: offlineReply }]);
    } catch {
      const offlineReply = await generateOfflineAssistantReply(content, settings.language, settings);
      setMessages((prev) => [...prev, { role: 'model', text: offlineReply }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="surface-card rounded-3xl p-6 space-y-3.5">
        <div className="flex items-center gap-3.5">
          <Icon3D kind="assistant" size={34} className="shrink-0" />
          <div>
            <h2 className="text-xl font-bold">{t.assistantModule.title}</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              {t.assistantModule.subtitle}
            </p>
          </div>
        </div>

        <div className="surface-alt rounded-2xl p-3.5 flex items-start gap-2.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
          <Icon3D kind="shield" size={18} className="mt-0.5 shrink-0" />
          <span>{t.assistantModule.scholarlyNotice}</span>
        </div>

        {!isOnline && (
          <div className="rounded-2xl p-3.5 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 flex items-center gap-2.5 text-xs">
            <Icon3D kind="offline" size={18} />
            <span>{t.assistantModule.offlineLocalNotice}</span>
          </div>
        )}
      </div>

      {/* Chat Transcript */}
      <div className="surface-elevated rounded-3xl p-5 sm:p-6 space-y-4 min-h-[400px] flex flex-col justify-between">
        <div className="space-y-4 max-h-[480px] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="py-8 space-y-5">
              <p className="text-sm text-center" style={{ color: 'var(--text-muted)' }}>
                {t.assistantModule.subtitle}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {t.assistantModule.quickPrompts.map((qp) => (
                  <button
                    key={qp}
                    type="button"
                    disabled={loading}
                    onClick={() => sendMessage(qp)}
                    className="interactive-tile rounded-2xl p-4 text-start text-xs font-medium disabled:opacity-50"
                  >
                    {qp}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                    m.role === 'user' ? 'btn-primary' : 'surface-alt'
                  }`}
                  style={m.role === 'user' ? undefined : { color: 'var(--text-primary)' }}
                >
                  {m.text}
                </div>
              </div>
            ))
          )}
          {loading && <div className="text-xs opacity-70">{t.common.loading}</div>}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex items-center gap-2.5 pt-3 border-t"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder={t.assistantModule.placeholder}
            className="flex-1 rounded-xl px-4 py-3 text-sm modern-input disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-xl px-5 py-3 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 min-h-[46px] btn-primary"
          >
            <Send className="w-4 h-4" />
            <span>{t.assistantModule.send}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
