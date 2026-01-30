import { useEffect, useMemo, useState } from 'react';
import FloatingHearts from './components/FloatingHearts.jsx';
import PreviewBanner from './components/PreviewBanner.jsx';
import CelebrationPage from './components/pages/CelebrationPage.jsx';
import GreetingPage from './components/pages/GreetingPage.jsx';
import LetterPage from './components/pages/LetterPage.jsx';
import MemoryPage from './components/pages/MemoryPage.jsx';
import PlanPage from './components/pages/PlanPage.jsx';
import QuestionPage from './components/pages/QuestionPage.jsx';
import HostCreation from './components/host/HostCreation.jsx';
import themes from './config/themes.js';

const DEFAULT_INTRO = "I've been wanting to ask you something…";

const initialHostData = {
  from: '',
  fromEmail: '',
  to: '',
  email: '',
  intro: DEFAULT_INTRO,
  theme: 'Normal',
};

const initialPlan = {
  food: '',
  location: '',
};

function buildShareUrl(data, includePreview = false) {
  const params = new URLSearchParams();
  if (data.to) params.set('to', data.to);
  if (data.theme) params.set('theme', data.theme);
  if (data.intro) params.set('intro', data.intro);
  if (data.email) params.set('email', data.email);
  if (data.from) params.set('from', data.from);
  if (data.fromEmail) params.set('fromEmail', data.fromEmail);
  if (includePreview) params.set('preview', '1');

  const base = `${window.location.origin}${window.location.pathname}`;
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

export default function App() {
  const [mode, setMode] = useState('check');
  const [hostData, setHostData] = useState(initialHostData);
  const [recipientData, setRecipientData] = useState(null);
  const [shareUrl, setShareUrl] = useState('');
  const [page, setPage] = useState(0);
  const [plan, setPlan] = useState(initialPlan);
  const [accepted, setAccepted] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to');
    if (to) {
      const data = {
        to,
        theme: params.get('theme') || 'Normal',
        intro: params.get('intro') || '',
        email: params.get('email') || '',
        from: params.get('from') || '',
        fromEmail: params.get('fromEmail') || '',
      };
      setRecipientData(data);
      setMode(params.get('preview') === '1' || params.get('mode') === 'preview' ? 'preview' : 'recipient');
      setPage(0);
    } else {
      setMode('create');
    }
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timeout);
  }, [toast]);

  const activeData = useMemo(() => {
    if (mode === 'recipient' || mode === 'preview') {
      return recipientData || hostData;
    }
    return hostData;
  }, [mode, recipientData, hostData]);

  const theme = themes[activeData?.theme] || themes.Normal;

  const handleCreate = () => {
    const missingRequired =
      !hostData.from.trim() || !hostData.fromEmail.trim() || !hostData.to.trim();

    if (missingRequired) {
      setToast({
        title: 'Please fill in all required fields',
        message: 'Your name, email, and their name are required.',
      });
      return;
    }

    const sanitizedData = {
      ...hostData,
      intro: hostData.intro.trim() || DEFAULT_INTRO,
    };
    setHostData(sanitizedData);
    const url = buildShareUrl(sanitizedData);
    setShareUrl(url);
  };

  const handlePreview = () => {
    const data = { ...hostData };
    setRecipientData(data);
    setPlan(initialPlan);
    setAccepted(false);
    setPage(0);
    setMode('preview');
    const url = buildShareUrl(data, true);
    window.history.replaceState({}, '', url);
  };

  const handleExitPreview = () => {
    setMode('create');
    const url = buildShareUrl(hostData);
    window.history.replaceState({}, '', url);
  };

  const handleSend = () => {
    const payload = {
      ...activeData,
      plan,
      accepted,
    };
    // Placeholder for email API call.
    console.log('Send to host:', payload);
  };

  const totalSteps = 5;
  const dotIndex = Math.max(0, page - 1);

  if (mode === 'check') {
    return null;
  }

  if (mode === 'create') {
    return (
      <>
        <HostCreation
          data={hostData}
          setData={setHostData}
          onCreate={handleCreate}
          shareUrl={shareUrl}
          onPreview={handlePreview}
        />
        {toast ? (
          <div className="fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl bg-rose-500 px-6 py-4 text-white shadow-xl">
            <p className="text-sm font-semibold">{toast.title}</p>
            <p className="mt-1 text-xs text-rose-100">{toast.message}</p>
          </div>
        ) : null}
      </>
    );
  }

  return (
    <div className="relative min-h-screen">
      {mode === 'preview' ? <PreviewBanner onExit={handleExitPreview} /> : null}
      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <FloatingHearts color={theme.primary} />
        <div className="relative z-10 w-full max-w-4xl">
          {page === 0 && (
            <LetterPage
              toName={activeData?.to}
              fromName={activeData?.from}
              theme={theme}
              onNext={() => setPage(1)}
            />
          )}
          {page === 1 && (
            <GreetingPage
              toName={activeData?.to}
              fromName={activeData?.from}
              intro={activeData?.intro}
              theme={theme}
              onNext={() => setPage(2)}
              pageIndex={dotIndex}
              total={totalSteps}
              onDotClick={(index) => setPage(index + 1)}
            />
          )}
          {page === 2 && (
            <QuestionPage
              theme={theme}
              onYes={() => {
                setAccepted(true);
                setPage(3);
              }}
              pageIndex={dotIndex}
              total={totalSteps}
              onDotClick={(index) => setPage(index + 1)}
            />
          )}
          {page === 3 && (
            <CelebrationPage
              theme={theme}
              onNext={() => setPage(4)}
              pageIndex={dotIndex}
              total={totalSteps}
              onDotClick={(index) => setPage(index + 1)}
            />
          )}
          {page === 4 && (
            <PlanPage
              theme={theme}
              plan={plan}
              setPlan={setPlan}
              onNext={() => setPage(5)}
              pageIndex={dotIndex}
              total={totalSteps}
              onDotClick={(index) => setPage(index + 1)}
            />
          )}
          {page === 5 && (
            <MemoryPage
              data={activeData}
              plan={plan}
              theme={theme}
              onSend={handleSend}
              onReplay={() => {
                setPlan(initialPlan);
                setAccepted(false);
                setPage(0);
              }}
              pageIndex={dotIndex}
              total={totalSteps}
              onDotClick={(index) => setPage(index + 1)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
