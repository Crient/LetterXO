import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ValentineExperience from '../components/ValentineExperience.jsx';

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

const cleanText = (value) => {
  if (typeof value !== 'string') return '';
  return value.trim();
};

export default function ReceiverPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('t');
  const [valentine, setValentine] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id || !token) {
      setError('This link is missing a token. Please double-check the URL.');
      setStatus('error');
      return;
    }

    const controller = new AbortController();

    const loadValentine = async () => {
      setStatus('loading');
      try {
        const response = await fetch(
          `/api/valentine/get?id=${encodeURIComponent(id)}&t=${encodeURIComponent(token)}`,
          { signal: controller.signal }
        );
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result?.error || 'Unable to load this Valentine.');
        }
        setValentine(result.valentine);
        setStatus('ready');
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err?.message || 'Unable to load this Valentine.');
        setStatus('error');
      }
    };

    loadValentine();

    return () => controller.abort();
  }, [id, token]);

  const handleSubmitResponse = async ({ plan, note }) => {
    if (!id || !token) {
      throw new Error('Missing link token.');
    }

    const mainPlan = cleanText(plan.customPlan) || cleanText(plan.mainPlan) || null;
    const payload = {
      id,
      t: token,
      vibe: cleanText(plan.vibe) || null,
      main_plan: mainPlan,
      food: cleanText(plan.food) || null,
      place_text: cleanText(plan.placeText) || null,
      place_pref: cleanText(plan.placePref) || null,
      receiver_note: cleanText(note) || null,
    };

    const response = await fetch('/api/valentine/respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result?.error || 'Unable to submit your response.');
    }

    const origin = window.location.origin;
    return {
      resultsLink: `${origin}/r/${id}?t=${result.view_token}`,
    };
  };

  if (status === 'loading') {
    return <StatusCard title="One moment" message="Loading your Valentine…" />;
  }

  if (status === 'error') {
    return <StatusCard title="Oops" message={error || 'Something went wrong.'} />;
  }

  if (!valentine) {
    return <StatusCard title="Oops" message="This Valentine could not be found." />;
  }

  return <ValentineExperience valentine={valentine} onSubmitResponse={handleSubmitResponse} />;
}
