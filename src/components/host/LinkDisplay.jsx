import { ArrowLeft, Copy, Eye, Link2 } from 'lucide-react';
import { useState } from 'react';

export default function LinkDisplay({ link, onPreview, onBack }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      setCopied(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-4 py-12">
      <div className="w-full rounded-3xl border bg-white/80 p-8 shadow-xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500"
        >
          <ArrowLeft size={14} />
          Edit details
        </button>

        <div className="text-center">
          <h2 className="font-cursive text-4xl text-rose-600">Your link is ready</h2>
          <p className="mt-2 text-sm text-gray-600">
            Share this with your Valentine or preview the experience first.
          </p>
        </div>

        <div className="mt-6 flex items-center gap-2 rounded-2xl border px-4 py-3">
          <Link2 size={16} className="text-gray-400" />
          <input
            type="text"
            value={link}
            readOnly
            className="w-full bg-transparent text-xs text-gray-600 outline-none"
          />
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2 text-xs font-semibold shadow-sm transition"
          >
            <Copy size={14} />
            {copied ? 'Copied!' : 'Copy link'}
          </button>
          <button
            type="button"
            onClick={onPreview}
            className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-5 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-rose-600"
          >
            <Eye size={14} />
            Preview
          </button>
        </div>
      </div>
    </div>
  );
}
