import { Copy, Send } from 'lucide-react';
import { useState } from 'react';

export default function MemoryPage({ data, plan, theme, onSend, onReplay }) {
  const [copied, setCopied] = useState(false);
  const [note, setNote] = useState('');

  const primary = '#BE3A5A';
  const accent = theme?.accent || '#3b1f2a';
  const place = plan.customPlan || 'Anywhere with you 💕';
  const summaryText = `From: ${data.from || 'Anonymous'}\nTo: ${data.to || 'Valentine'}\nFood: ${
    plan.food || 'Not chosen'
  }\nPlace: ${place}\nNote: ${note || 'No note'}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex w-full items-center justify-center px-4 py-6">
      <div
        className="w-full max-w-xl rounded-[2.5rem] p-8 shadow-[0_30px_70px_rgba(233,77,140,0.25)]"
        style={{ backgroundColor: '#FAF7F5' }}
      >
        <div className="space-y-2 text-center">
          <h1 className="valentine-title text-7xl font-bold" style={{ color: primary }}>
            Your Valentine
          </h1>
          <div className="mx-auto -mt-1 -mb-1 h-8 w-56 overflow-hidden sm:h-10 sm:w-72">
            <img
              src="/underline_xo.png"
              alt="XOXO underline"
              className="h-full w-full object-cover object-center"
            />
          </div>
          <p className="text-sm text-gray-500">This was made just for you.</p>
        </div>

        <div className="mt-5 rounded-[2rem] px-6 py-4 text-sm" style={{ backgroundColor: '#F5E4E8' }}>
          <div className="flex items-center justify-between border-b border-pink-200/70 py-3 text-black">
            <span className="font-semibold">For</span>
            <span className="font-cursive text-lg" style={{ color: '#E54A7B' }}>
              {data.to || 'Valentine'}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-pink-200/70 py-3 text-black">
            <span className="font-semibold">Food</span>
            <span className="font-semibold">
              {plan.food || 'No choice yet'}
            </span>
          </div>
          <div className="flex items-center justify-between py-3 text-black">
            <span className="font-semibold">Place</span>
            <span className="font-semibold">
              {place}
            </span>
          </div>
        </div>

        <div className="mt-6 space-y-2 text-left">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: primary }}>
            Add a little note? (optional)
          </p>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Write something sweet..."
            className="min-h-[140px] w-full resize-none rounded-2xl border border-pink-200 bg-white px-4 py-4 text-sm shadow-sm outline-none transition focus:border-pink-400"
          />
        </div>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={onSend}
            className="w-full rounded-3xl px-6 py-3 text-sm font-semibold text-white shadow-lg transition"
            style={{ backgroundColor: primary }}
          >
            <Send size={16} className="mr-2 inline" />
            Send to Your Valentine
          </button>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="flex-1 rounded-full border px-4 py-2 text-center text-xs font-semibold transition hover:bg-rose-50"
              style={{ borderColor: primary, color: primary }}
            >
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <button
              type="button"
              onClick={onReplay}
              className="flex-1 rounded-full border px-4 py-2 text-center text-xs font-semibold transition hover:bg-rose-50"
              style={{ borderColor: primary, color: primary }}
            >
              Replay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
