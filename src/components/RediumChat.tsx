import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { Bot, LoaderCircle, MessageCircle, Send, X } from 'lucide-react';

type ChatMessage = { id: string; role: 'user' | 'model'; text: string };

const welcome: ChatMessage = {
  id: 'redium-welcome',
  role: 'model',
  text: "Hello! I'm Redium, the Sferavis website assistant. Ask me about Sferavis, astronomy, SPHEREx, or finding your way around the site.",
};

export const RediumChat: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([welcome]);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages, sending]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const messageText = draft.trim();
    if (!messageText || sending) return;

    const userMessage: ChatMessage = { id: 'user-' + Date.now(), role: 'user', text: messageText };
    const conversation = [...messages, userMessage];
    setMessages(conversation);
    setDraft('');
    setSending(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversation.slice(1).map(({ role, text }) => ({ role, content: text })),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Redium is temporarily unavailable.');
      setMessages(current => [...current, {
        id: 'redium-' + Date.now(),
        role: 'model',
        text: typeof data.reply === 'string' ? data.reply : 'I could not form a response. Please try again.',
      }]);
    } catch (error) {
      setMessages(current => [...current, {
        id: 'redium-error-' + Date.now(),
        role: 'model',
        text: error instanceof Error ? error.message : 'Connection error. Please try again.',
      }]);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[80]">
      {open && (
        <section id="redium-chat-panel" role="dialog" aria-modal="false" aria-labelledby="redium-title" className="mb-3 flex h-[min(36rem,calc(100dvh-7rem))] w-[min(23rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl dark:border-slate-700 dark:bg-[#10141d] dark:text-slate-100">
          <header className="flex items-center justify-between gap-3 bg-[#8B0000] px-4 py-3 text-white">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15"><Bot size={20} aria-hidden="true" /></span>
              <div className="min-w-0">
                <h2 id="redium-title" className="text-sm font-bold tracking-wide">Redium</h2>
                <p className="text-[11px] text-white/80">Sferavis AI assistant</p>
              </div>
            </div>
            <button type="button" onClick={() => { setOpen(false); toggleRef.current?.focus(); }} aria-label="Close Redium chat" className="rounded-lg p-2 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              <X size={18} aria-hidden="true" />
            </button>
          </header>

          <div ref={logRef} role="log" aria-label="Redium conversation" aria-live="polite" aria-relevant="additions" className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-3 dark:bg-[#0b0e14]">
            {messages.map(message => (
              <div key={message.id} className={'flex ' + (message.role === 'user' ? 'justify-end' : 'justify-start')}>
                <p className={'max-w-[88%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2.5 text-sm leading-relaxed ' + (message.role === 'user' ? 'rounded-br-md bg-[#8B0000] text-white' : 'rounded-bl-md border border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-[#171d29] dark:text-slate-100')}>
                  {message.text}
                </p>
              </div>
            ))}
            {sending && <div className="flex items-center gap-2 px-2 py-1 text-xs text-slate-500 dark:text-slate-400"><LoaderCircle size={15} className="animate-spin" aria-hidden="true" /> Redium is thinking…</div>}
          </div>

          <form onSubmit={sendMessage} className="flex items-end gap-2 border-t border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-[#10141d]">
            <label className="sr-only" htmlFor="redium-message">Message Redium</label>
            <input ref={inputRef} id="redium-message" value={draft} onChange={event => setDraft(event.target.value)} maxLength={2000} placeholder="Ask Redium a question…" disabled={sending} className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-[#8B0000] focus:ring-2 focus:ring-red-100 disabled:opacity-60 dark:border-slate-600 dark:bg-[#0b0e14] dark:text-white dark:placeholder:text-slate-400" />
            <button type="submit" disabled={sending || !draft.trim()} aria-label="Send message to Redium" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#8B0000] text-white hover:bg-[#700000] disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400">
              <Send size={17} aria-hidden="true" />
            </button>
          </form>
          <p className="bg-white px-3 pb-2 text-[10px] text-slate-500 dark:bg-[#10141d] dark:text-slate-400">AI-generated responses may be inaccurate. Do not share private information.</p>
        </section>
      )}
      <button ref={toggleRef} type="button" aria-label={open ? 'Close Redium assistant' : 'Open Redium assistant'} aria-expanded={open} aria-controls="redium-chat-panel" onClick={() => setOpen(value => !value)} className="ml-auto flex h-14 w-14 items-center justify-center rounded-full border border-white bg-[#8B0000] text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-[#700000] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-300">
        {open ? <X size={23} aria-hidden="true" /> : <MessageCircle size={23} aria-hidden="true" />}
      </button>
    </div>
  );
};
