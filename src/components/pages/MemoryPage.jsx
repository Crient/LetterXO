import { Copy, RotateCcw, Send } from 'lucide-react';
import { useState } from 'react';
import LetterBackground from '../LetterBackground.jsx';

export default function MemoryPage({ data, plan, theme, onSend, onReplay, pageIndex, total, onDotClick }) {
  const [copied, setCopied] = useState(false);

  const summary = `From: ${data.from || 'Anonymous'}\nFrom email: ${data.fromEmail || 'Not provided'}\nTo: ${data.to || 'Valentine'}\nRecipient email: ${data.email || 'Not provided'}\nTheme: ${data.theme}\nMessage: ${data.intro || 'No intro message'}\nFood: ${plan.food || 'Not chosen'}\nLocation: ${plan.location || 'Not set'}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      setCopied(false);
    }
  };

  return (
    <LetterBackground theme={theme} page={pageIndex} total={total} onDotClick={onDotClick}>
      <div className="space-y-6 text-center">
        <div>
          <h2 className="font-cursive text-4xl" style={{ color: theme?.accent }}>
            A memory to keep
          </h2>
          <p className="mt-2 text-sm text-gray-600">Here is a quick recap of your Valentine moment.</p>
        </div>

        <div className="rounded-2xl border px-6 py-4 text-left text-sm" style={{ borderColor: theme?.primary }}>
          <p>
            <span className="font-semibold">From:</span> {data.from || 'Anonymous'}
          </p>
          <p>
            <span className="font-semibold">From email:</span> {data.fromEmail || 'Not provided'}
          </p>
          <p>
            <span className="font-semibold">To:</span> {data.to || 'Valentine'}
          </p>
          <p>
            <span className="font-semibold">Recipient email:</span> {data.email || 'Not provided'}
          </p>
          <p>
            <span className="font-semibold">Theme:</span> {data.theme}
          </p>
          <p>
            <span className="font-semibold">Message:</span> {data.intro || 'No intro message'}
          </p>
          <p>
            <span className="font-semibold">Food:</span> {plan.food || 'Not chosen'}
          </p>
          <p>
            <span className="font-semibold">Location:</span> {plan.location || 'Not set'}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={onSend}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold shadow-md transition"
            style={{ backgroundColor: theme?.primary, color: theme?.buttonText }}
          >
            <Send size={14} />
            Send to host
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2 text-xs font-semibold shadow-sm transition"
            style={{ borderColor: theme?.primary, color: theme?.accent }}
          >
            <Copy size={14} />
            {copied ? 'Copied!' : 'Copy summary'}
          </button>
          <button
            type="button"
            onClick={onReplay}
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2 text-xs font-semibold shadow-sm transition"
            style={{ borderColor: theme?.primary, color: theme?.accent }}
          >
            <RotateCcw size={14} />
            Replay
          </button>
        </div>
      </div>
    </LetterBackground>
  );
}
