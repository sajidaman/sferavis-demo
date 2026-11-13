import React, { useEffect, useRef, useState } from 'react';
import { Bot, LoaderCircle, Send, Sparkles, X } from 'lucide-react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const initialMessage: Message = {
  role: 'assistant',
  content: 'Hi! I’m Redium, your Sferavis science assistant. Ask me about astronomy, SPHEREx, or exploring the site.',
};

const suggestions = [
  'What is SPHEREx?',
  'What can I explore on Sferavis?',
];

export const RediumChat: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (value: string) => {
    const content = value.trim();
    if (!content || loading) return;

    const conversation = [...messages, { role: 'user' as const, content }].slice(-20);
    setMessages(conversation);
    setInput('');
    setError('');
    setLoading(true);

    try {
      const endpoint = new URL(`${import.meta.env.BASE_URL}api/chat`, window.location.href);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversation.slice(-12) }),
      });
      const result = await response.json() as { reply?: unknown; error?: unknown };
      if (!response.ok || typeof result.reply !== 'string' || !result.reply.trim()) {
        throw new Error(typeof result.error === 'string' ? result.error : 'Redium could not reply. Please try again.');
      }

      const reply = result.reply.trim();
      setMessages(current => [...current, { role: 'assistant' as const, content: reply }].slice(-20));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Redium could not reply. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[80] flex flex-col items-end gap-3">
      {open && (
        <section
          id="redium-chat-panel"
          role="dialog"
          aria-labelledby="redium-chat-title"
          aria-modal="false"
          className="flex h-[min(30rem,calc(100dvh-7rem))] w-[min(21rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl dark:border-slate-700 dark:bg-[#101722] dark:text-slate-100"
        >
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-[#111a27]">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#A30000] text-white">
                <Sparkles size={19} aria-hidden="true" />
              </span>
              <div>
                <h2 id="redium-chat-title" className="text-sm font-bold">Redium</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">AI Assistant</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close Redium chat"
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A30000] dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </header>

          <div ref={messagesRef} role="log" aria-live="polite" aria-label="Chat messages" className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4 dark:bg-[#0b111a]">
            {messages.map((message, index) => (
              <div key={`${index}-${message.role}`} className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.role === 'assistant' && (
                  <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#A30000] text-white">
                    <Bot size={15} aria-hidden="true" />
                  </span>
                )}
                <p className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  message.role === 'user'
                    ? 'rounded-br-md bg-[#A30000] text-white'
                    : 'rounded-bl-md border border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-[#151f2c] dark:text-slate-100'
                }`}>
                  {message.content}
                </p>
              </div>
            ))}

            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pl-9">
                {suggestions.map(suggestion => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => void sendMessage(suggestion)}
                    className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-left text-xs text-slate-700 transition hover:border-[#A30000] hover:text-[#A30000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A30000] dark:border-slate-600 dark:bg-[#151f2c] dark:text-slate-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="flex items-center gap-2 pl-9 text-xs text-slate-500 dark:text-slate-400" role="status">
                <LoaderCircle size={15} className="animate-spin" aria-hidden="true" />
                Redium is thinking…
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-[#111a27]">
            {error && <p role="alert" className="mb-2 px-1 text-xs text-red-700 dark:text-red-300">{error}</p>}
            <form
              onSubmit={event => {
                event.preventDefault();
                void sendMessage(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={event => setInput(event.target.value)}
                maxLength={2000}
                aria-label="Message Redium"
                placeholder="Ask a science question…"
                className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#A30000] focus:ring-2 focus:ring-[#A30000]/20 dark:border-slate-600 dark:bg-[#0b111a] dark:text-white"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#A30000] text-white transition hover:bg-[#8B0000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A30000] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45 dark:focus-visible:ring-offset-[#111a27]"
              >
                <Send size={17} aria-hidden="true" />
              </button>
            </form>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        aria-label={open ? 'Close Redium chat' : 'Open Redium chat'}
        aria-expanded={open}
        aria-controls={open ? 'redium-chat-panel' : undefined}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#A30000] text-white shadow-xl transition hover:scale-105 hover:bg-[#8B0000] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-300"
      >
        {open ? <X size={23} aria-hidden="true" /> : <Bot size={26} strokeWidth={2.1} aria-hidden="true" />}
      </button>
    </div>
  );
};
