import { Copy, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function EmailDraftModal({ open, onClose, title, subject, body }) {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const message = `Subject: ${subject || ''}\n\n${body || ''}`.trim();

  useEffect(() => {
    if (open) setCopied(false);
  }, [open]);

  const handleCopy = async () => {
    if (!message) return;
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-rose-600">{title || 'Draft email / message'}</h3>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-rose-100 text-rose-500 hover:bg-rose-50"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-3 text-xs text-rose-700">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-rose-400">Subject</p>
            <p className="mt-1">{subject || ''}</p>
          </div>
          <div className="rounded-2xl border border-rose-100 bg-white p-3 text-xs text-rose-700">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-rose-400">Message</p>
            <pre className="mt-2 whitespace-pre-wrap font-sans text-xs text-rose-700">{body || ''}</pre>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-rose-600"
          >
            <Copy size={14} /> {copied ? 'Copied!' : 'Copy message'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-rose-500 hover:text-rose-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
