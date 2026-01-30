import { useState } from 'react';
import { Copy, Eye, Link2, Mail, Palette, PenLine, User, Users } from 'lucide-react';
import themes from '../../config/themes.js';

export default function HostCreation({ data, setData, onCreate, shareUrl, onPreview }) {
  const themeCards = [
    { key: 'Normal', emoji: '💗' },
    { key: 'Snoopy', emoji: '🐶' },
    { key: 'BUBUDUDU', emoji: '🧸' },
    { key: 'Chiikawa', emoji: '🐰' },
    { key: 'Piggy', emoji: '🐷' },
    { key: 'Sosojojo', emoji: '✨' },
  ];

  const [copied, setCopied] = useState(false);

  const handleChange = (field) => (event) => {
    setData({ ...data, [field]: event.target.value });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      setCopied(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-4 py-12">
      <div className="w-full rounded-3xl border bg-white/80 p-8 shadow-xl">
        <div className="text-center">
          <h1 className="font-cursive text-[70px] text-rose-600">Create your Valentine</h1>
          <p className="mt-2 text-sm text-gray-600">
            Fill in the details and we will craft a shareable link for your special someone.
          </p>
        </div>

        <div className="mt-8 grid gap-5">
          <label className="grid gap-2 text-sm font-semibold text-gray-700">
            <span className="flex items-center gap-2">
              <User size={16} /> Your name
            </span>
            <input
              type="text"
              value={data.from}
              onChange={handleChange('from')}
              placeholder="Alex"
              className="rounded-2xl border px-4 py-3 text-sm outline-none"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-gray-700">
            <span className="flex items-center gap-2">
              <Mail size={16} /> Your email
            </span>
            <input
              type="email"
              value={data.fromEmail}
              onChange={handleChange('fromEmail')}
              placeholder="alex@email.com"
              className="rounded-2xl border px-4 py-3 text-sm outline-none"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-gray-700">
            <span className="flex items-center gap-2">
              <Users size={16} /> Their name
            </span>
            <input
              type="text"
              value={data.to}
              onChange={handleChange('to')}
              placeholder="Jamie"
              className="rounded-2xl border px-4 py-3 text-sm outline-none"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-gray-700">
            <span className="flex items-center gap-2">
              <Mail size={16} /> Their email
            </span>
            <input
              type="email"
              value={data.email}
              onChange={handleChange('email')}
              placeholder="jamie@email.com"
              className="rounded-2xl border px-4 py-3 text-sm outline-none"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-gray-700">
            <span className="flex items-center gap-2">
              <PenLine size={16} /> Intro message
            </span>
            <textarea
              rows={4}
              value={data.intro}
              onChange={handleChange('intro')}
              placeholder="I've been wanting to ask you something…"
              className="rounded-2xl border px-4 py-3 text-sm outline-none"
            />
          </label>

          <div className="grid gap-2 text-sm font-semibold text-gray-700">
            <span className="flex items-center gap-2">
              <Palette size={16} /> Theme
            </span>
            <div className="grid gap-3 sm:grid-cols-3">
              {themeCards.map((themeCard) => {
                const isActive = data.theme === themeCard.key;
                const theme = themes[themeCard.key];
                return (
                  <button
                    key={themeCard.key}
                    type="button"
                    onClick={() => setData({ ...data, theme: themeCard.key })}
                    className="flex h-24 flex-col items-center justify-center gap-2 rounded-2xl border text-xs font-semibold transition"
                    style={{
                      borderColor: isActive ? theme?.primary : '#e5e7eb',
                      backgroundColor: isActive ? theme?.secondary : 'white',
                      boxShadow: isActive ? `0 0 0 3px ${theme?.primary}40` : 'none',
                    }}
                    aria-pressed={isActive}
                  >
                    <span className="text-2xl">{themeCard.emoji}</span>
                    <span>{themeCard.key}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onCreate}
          className="mt-8 w-full rounded-full bg-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-rose-600"
        >
          Generate Valentine Link
        </button>

        {shareUrl ? (
          <div className="mt-6 rounded-3xl bg-rose-50 px-6 py-5">
            <p className="text-sm font-semibold text-rose-600">Your Valentine link:</p>
            <div className="mt-3 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
              <Link2 size={16} className="text-rose-300" />
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="w-full bg-transparent text-xs text-rose-500 outline-none"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rose-300 text-rose-500 transition hover:bg-rose-100"
                aria-label="Copy link"
              >
                <Copy size={14} />
              </button>
            </div>
            <button
              type="button"
              onClick={onPreview}
              className="mt-4 inline-flex items-center justify-center gap-2 text-sm font-semibold text-rose-600"
            >
              <Eye size={16} />
              Preview Experience ✨
            </button>
            {copied ? <p className="mt-2 text-xs text-rose-400">Link copied!</p> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
