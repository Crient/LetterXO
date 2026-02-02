import { useEffect, useMemo, useRef, useState } from 'react';
import { Copy, ChevronDown, Link2, Mail, PenLine, User, Users } from 'lucide-react';
import EmailDraftModal from '../EmailDraftModal.jsx';
import { buildHostToReceiverDraft, buildHostToReceiverGmail } from '../../utils/mailto.js';

const DEFAULT_MESSAGE = "I've been wanting to ask you something…";

const initialData = {
  senderName: '',
  senderEmail: '',
  receiverName: '',
  receiverEmail: '',
  letterMessage: DEFAULT_MESSAGE,
};

export default function HostCreation() {
  const [data, setData] = useState(initialData);
  const [links, setLinks] = useState(null);
  const [copied, setCopied] = useState({ receiver: false, results: false });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailMenuOpen, setEmailMenuOpen] = useState(false);
  const emailMenuRef = useRef(null);

  const handleChange = (field) => (event) => {
    setData({ ...data, [field]: event.target.value });
  };

  const receiverLink = links?.receiverLink || '';
  const resultsLink = links?.resultsLink || '';

  const draftContent = useMemo(() => {
    if (!receiverLink) return null;
    return buildHostToReceiverDraft({
      senderName: data.senderName.trim(),
      receiverName: data.receiverName.trim(),
      receiverLink,
      letterMessage: data.letterMessage.trim(),
    });
  }, [data, receiverLink]);

  const draftGmail = useMemo(() => {
    if (!receiverLink) return '';
    return buildHostToReceiverGmail({
      senderName: data.senderName.trim(),
      receiverName: data.receiverName.trim(),
      receiverEmail: data.receiverEmail.trim(),
      receiverLink,
      letterMessage: data.letterMessage.trim(),
    });
  }, [data, receiverLink]);

  const [draftOpen, setDraftOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emailMenuRef.current && !emailMenuRef.current.contains(event.target)) {
        setEmailMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopy = async (type, value) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied((prev) => ({ ...prev, [type]: true }));
      setTimeout(() => setCopied((prev) => ({ ...prev, [type]: false })), 2000);
    } catch {
      setCopied((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleCreate = async () => {
    setError('');

    const senderName = data.senderName.trim();
    const receiverName = data.receiverName.trim();

    if (!senderName || !receiverName) {
      setError('Your name and their name are required.');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        sender_name: senderName,
        sender_email: data.senderEmail.trim(),
        receiver_name: receiverName,
        receiver_email: data.receiverEmail.trim(),
        letter_message: data.letterMessage.trim(),
      };

      const response = await fetch('/api/valentine/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || 'Unable to create your link.');
      }

      const origin = window.location.origin;
      setLinks({
        receiverLink: `${origin}/v/${result.id}?t=${result.edit_token}`,
        resultsLink: `${origin}/r/${result.id}?t=${result.view_token}`,
      });
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
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
              value={data.senderName}
              onChange={handleChange('senderName')}
              placeholder="Alex"
              className="rounded-2xl border px-4 py-3 text-sm outline-none"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-gray-700">
            <span className="flex items-center gap-2">
              <Mail size={16} /> Your email (optional)
            </span>
            <input
              type="email"
              value={data.senderEmail}
              onChange={handleChange('senderEmail')}
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
              value={data.receiverName}
              onChange={handleChange('receiverName')}
              placeholder="Jamie"
              className="rounded-2xl border px-4 py-3 text-sm outline-none"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-gray-700">
            <span className="flex items-center gap-2">
              <Mail size={16} /> Their email (optional)
            </span>
            <input
              type="email"
              value={data.receiverEmail}
              onChange={handleChange('receiverEmail')}
              placeholder="jamie@email.com"
              className="rounded-2xl border px-4 py-3 text-sm outline-none"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-gray-700">
            <span className="flex items-center gap-2">
              <PenLine size={16} /> Letter message (optional)
            </span>
            <textarea
              rows={4}
              value={data.letterMessage}
              onChange={handleChange('letterMessage')}
              placeholder="I've been wanting to ask you something…"
              className="rounded-2xl border px-4 py-3 text-sm outline-none"
            />
          </label>
        </div>

        {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}

        <button
          type="button"
          onClick={handleCreate}
          disabled={isLoading}
          className="mt-6 w-full rounded-full bg-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? 'Generating…' : 'Generate Valentine Link'}
        </button>

        {links ? (
          <div className="mt-6 rounded-3xl bg-rose-50 px-6 py-5">
            <p className="text-sm font-semibold text-rose-600">Receiver link (send this):</p>
            <div className="mt-3 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
              <Link2 size={16} className="text-rose-300" />
              <input
                type="text"
                value={receiverLink}
                readOnly
                className="w-full bg-transparent text-xs text-rose-500 outline-none"
              />
              <button
                type="button"
                onClick={() => handleCopy('receiver', receiverLink)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rose-300 text-rose-500 transition hover:bg-rose-100"
                aria-label="Copy receiver link"
              >
                <Copy size={14} />
              </button>
            </div>
            {copied.receiver ? <p className="mt-2 text-xs text-rose-400">Receiver link copied!</p> : null}

            <p className="mt-5 text-sm font-semibold text-rose-600">Results link (keep for you):</p>
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
                onClick={() => handleCopy('results', resultsLink)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rose-300 text-rose-500 transition hover:bg-rose-100"
                aria-label="Copy results link"
              >
                <Copy size={14} />
              </button>
            </div>
            {copied.results ? <p className="mt-2 text-xs text-rose-400">Results link copied!</p> : null}

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <div className="relative" ref={emailMenuRef}>
                <button
                  type="button"
                  onClick={() => setEmailMenuOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-5 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-rose-600"
                >
                  <Mail size={14} /> Send email 💌 <ChevronDown size={14} />
                </button>
                {emailMenuOpen ? (
                  <div className="absolute left-0 z-20 mt-2 w-56 rounded-2xl border border-rose-100 bg-white p-2 text-xs shadow-lg">
                    <button
                      type="button"
                      onClick={() => {
                        setEmailMenuOpen(false);
                        setDraftOpen(true);
                      }}
                      className="block rounded-xl px-3 py-2 font-semibold text-rose-600 transition hover:bg-rose-50"
                    >
                      Draft email / message
                    </button>
                    <a
                      href={draftGmail}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setEmailMenuOpen(false)}
                      className="mt-1 block rounded-xl px-3 py-2 font-semibold text-rose-600 transition hover:bg-rose-50"
                    >
                      Open in Gmail
                    </a>
                  </div>
                ) : null}
              </div>
              <a
                href={receiverLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-rose-300 px-5 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
              >
                Preview Experience ✨
              </a>
            </div>
          </div>
        ) : null}
      </div>
      <EmailDraftModal
        open={draftOpen}
        onClose={() => setDraftOpen(false)}
        title="Draft email / message"
        subject={draftContent?.subject}
        body={draftContent?.body}
      />
    </div>
  );
}
