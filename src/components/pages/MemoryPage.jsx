import { Copy, Link2, Mail, Send } from 'lucide-react';
import { useState } from 'react';

export default function MemoryPage({
  data,
  plan,
  theme,
  onSend,
  onReplay,
  isSubmitting,
  submitError,
  resultsLink,
  replyMailto,
}) {
  const [copiedResults, setCopiedResults] = useState(false);
  const [note, setNote] = useState('');

  const primary = '#BE3A5A';
  const mainPlan = plan.customPlan || plan.mainPlan || 'No choice yet';
  const place = plan.placeText || 'Anywhere with you 💕';
  const vibe = plan.vibe || 'No vibe yet';
  const placePref = plan.placePref || '';
  const submitLabel = resultsLink ? 'Update your answer' : 'Submit your answer';

  const handleCopyResults = async () => {
    if (!resultsLink) return;
    try {
      await navigator.clipboard.writeText(resultsLink);
      setCopiedResults(true);
      setTimeout(() => setCopiedResults(false), 2000);
    } catch {
      setCopiedResults(false);
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
            <span className="font-semibold">Vibe</span>
            <span className="font-semibold">{vibe}</span>
          </div>
          <div className="flex items-center justify-between border-b border-pink-200/70 py-3 text-black">
            <span className="font-semibold">Plan</span>
            <span className="font-semibold">{mainPlan}</span>
          </div>
          <div className="flex items-center justify-between border-b border-pink-200/70 py-3 text-black">
            <span className="font-semibold">Food</span>
            <span className="font-semibold">{plan.food || 'No choice yet'}</span>
          </div>
          <div className="flex items-center justify-between py-3 text-black">
            <span className="font-semibold">Place</span>
            <span className="font-semibold">{place}</span>
          </div>
          {placePref ? (
            <div className="flex items-center justify-between border-t border-pink-200/70 py-3 text-black">
              <span className="font-semibold">Place pref</span>
              <span className="font-semibold">{placePref}</span>
            </div>
          ) : null}
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
            onClick={() => onSend?.(note)}
            disabled={isSubmitting}
            className="w-full rounded-3xl px-6 py-3 text-sm font-semibold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-70"
            style={{ backgroundColor: primary }}
          >
            <Send size={16} className="mr-2 inline" />
            {isSubmitting ? 'Submitting…' : submitLabel}
          </button>
          {submitError ? <p className="text-xs text-rose-600">{submitError}</p> : null}
          <div className="flex flex-wrap gap-3">
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

        {resultsLink ? (
          <div className="mt-6 rounded-3xl bg-rose-50 px-6 py-5">
            <p className="text-sm font-semibold text-rose-600">Your results link:</p>
            <div className="mt-3 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
              <Link2 size={16} className="text-rose-300" />
              <input
                type="text"
                value={resultsLink}
                readOnly
                className="w-full bg-transparent text-xs text-rose-500 outline-none"
              />
              <button
                type="button"
                onClick={handleCopyResults}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rose-300 text-rose-500 transition hover:bg-rose-100"
                aria-label="Copy results link"
              >
                <Copy size={14} />
              </button>
            </div>
            {copiedResults ? <p className="mt-2 text-xs text-rose-400">Results link copied!</p> : null}
            <div className="mt-4">
              <a
                href={replyMailto}
                className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-5 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-rose-600"
              >
                <Mail size={14} /> Draft Reply Email 💌
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
