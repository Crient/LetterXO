import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

function StatusCard({ title, message }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center px-4 py-12">
      <div className="w-full rounded-3xl border bg-white/85 p-8 text-center shadow-xl">
        <h2 className="font-cursive text-4xl text-rose-600">{title}</h2>
        <p className="mt-3 text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );
}

const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
};

export default function ResultsPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('t');
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id || !token) {
      setError('This link is missing a token. Please double-check the URL.');
      setStatus('error');
      return;
    }

    const controller = new AbortController();

    const loadResults = async () => {
      setStatus('loading');
      try {
        const response = await fetch(
          `/api/valentine/results?id=${encodeURIComponent(id)}&t=${encodeURIComponent(token)}`,
          { signal: controller.signal }
        );
        const resultData = await response.json();
        if (!response.ok) {
          throw new Error(resultData?.error || 'Unable to load results.');
        }
        setResult(resultData.result);
        setStatus('ready');
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err?.message || 'Unable to load results.');
        setStatus('error');
      }
    };

    loadResults();

    return () => controller.abort();
  }, [id, token]);

  const respondedAt = useMemo(() => formatDate(result?.responded_at), [result]);

  if (status === 'loading') {
    return <StatusCard title="One moment" message="Loading results…" />;
  }

  if (status === 'error') {
    return <StatusCard title="Oops" message={error || 'Something went wrong.'} />;
  }

  if (!result) {
    return <StatusCard title="Oops" message="Results are missing." />;
  }

  const responseReady = Boolean(result?.responded_at);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-4 py-12">
      <div className="w-full rounded-3xl border bg-white/85 p-8 shadow-xl">
        <div className="text-center">
          <h1 className="font-cursive text-5xl text-rose-600">Your Valentine Results</h1>
          <p className="mt-2 text-sm text-gray-600">
            {responseReady
              ? `Answered on ${respondedAt}`
              : 'No response yet. Check back later.'}
          </p>
        </div>

        <div className="mt-6 grid gap-4 text-sm text-gray-700">
          <div className="rounded-2xl bg-rose-50 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-500">From</p>
            <p className="mt-1 break-words text-base font-semibold text-rose-700">{result.sender_name}</p>
            {result.sender_email ? (
              <p className="break-all text-xs text-rose-400">{result.sender_email}</p>
            ) : null}
          </div>

          <div className="rounded-2xl bg-rose-50 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-500">To</p>
            <p className="mt-1 break-words text-base font-semibold text-rose-700">{result.receiver_name}</p>
            {result.receiver_email ? (
              <p className="break-all text-xs text-rose-400">{result.receiver_email}</p>
            ) : null}
          </div>

          {result.letter_message ? (
            <div className="rounded-2xl bg-white px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-rose-500">Letter message</p>
              <p className="mt-2 whitespace-pre-wrap break-all text-sm text-gray-700">
                {result.letter_message}
              </p>
            </div>
          ) : null}

          <div className="rounded-2xl bg-white px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-500">Response summary</p>
            <div className="mt-3 grid gap-2">
              <div className="flex items-start gap-4">
                <span className="shrink-0 font-semibold">Vibe</span>
                <span className="min-w-0 flex-1 break-all text-right">{result.vibe || '—'}</span>
              </div>
              <div className="flex items-start gap-4">
                <span className="shrink-0 font-semibold">Main plan</span>
                <span className="min-w-0 flex-1 break-all text-right">{result.main_plan || '—'}</span>
              </div>
              <div className="flex items-start gap-4">
                <span className="shrink-0 font-semibold">Food</span>
                <span className="min-w-0 flex-1 break-all text-right">{result.food || '—'}</span>
              </div>
              <div className="flex items-start gap-4">
                <span className="shrink-0 font-semibold">Notes</span>
                <span className="min-w-0 flex-1 break-all text-right">
                  {result.place_text || '—'}
                </span>
              </div>
            </div>
          </div>

          {result.receiver_note ? (
            <div className="rounded-2xl bg-white px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-rose-500">Receiver note</p>
              <p className="mt-2 whitespace-pre-wrap break-all text-sm text-gray-700">
                {result.receiver_note}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
