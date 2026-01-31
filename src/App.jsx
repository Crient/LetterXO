import { useEffect, useMemo, useRef, useState } from 'react';
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
const PAGE_SWING_MS = 900;
const PAGE_SWING_DISTANCE = '100vw';
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
  const [letterTransition, setLetterTransition] = useState(null);
  const [pageTransition, setPageTransition] = useState(null);
  const transitionTimers = useRef([]);
  const pageTransitionTimers = useRef([]);

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

  useEffect(() => {
    return () => {
      transitionTimers.current.forEach((timer) => window.clearTimeout(timer));
      transitionTimers.current = [];
      pageTransitionTimers.current.forEach((timer) => window.clearTimeout(timer));
      pageTransitionTimers.current = [];
    };
  }, []);

  const startLetterTransition = ({ flyDuration = 920 }) => {
    transitionTimers.current.forEach((timer) => window.clearTimeout(timer));
    transitionTimers.current = [];

    const dropDuration = 720;
    const dropDelay = Math.max(0, Math.round(flyDuration * 0.35));
    setLetterTransition({ dropIn: false, dropDuration });

    transitionTimers.current.push(
      window.setTimeout(
        () => setLetterTransition((prev) => (prev ? { ...prev, dropIn: true } : prev)),
        dropDelay
      ),
      window.setTimeout(() => setPage(1), dropDelay + dropDuration - 80),
      window.setTimeout(() => setLetterTransition(null), dropDelay + dropDuration + 200)
    );
  };

  const startPageTransition = (nextPage) => {
    if (letterTransition || nextPage === page || pageTransition) return;
    const from = page;
    const to = nextPage;
    pageTransitionTimers.current.forEach((timer) => window.clearTimeout(timer));
    pageTransitionTimers.current = [];
    setPageTransition({ from, to, phase: 'exit' });
    pageTransitionTimers.current.push(
      window.setTimeout(() => {
        setPage(to);
        setPageTransition({ from, to, phase: 'enter' });
      }, PAGE_SWING_MS),
      window.setTimeout(() => setPageTransition(null), PAGE_SWING_MS * 2)
    );
  };

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
  const dropDuration = letterTransition?.dropDuration || 720;
  const pageTransitionStyle = {
    '--swing-duration': `${PAGE_SWING_MS}ms`,
    '--swing-distance': PAGE_SWING_DISTANCE,
  };
  const greetingMotionStyle = letterTransition
    ? {
        transform: letterTransition.dropIn ? 'translateY(0)' : 'translateY(-28vh)',
        opacity: letterTransition.dropIn ? 1 : 0,
        transition: `transform ${dropDuration}ms cubic-bezier(0.16, 0.84, 0.3, 1), opacity 320ms ease`,
        willChange: 'transform, opacity',
      }
    : undefined;

  const renderStep = (pageNumber) => {
    const pageIndex = Math.max(0, pageNumber - 1);

    switch (pageNumber) {
      case 1:
        return (
          <GreetingPage
            toName={activeData?.to}
            fromName={activeData?.from}
            intro={activeData?.intro}
            theme={theme}
            onNext={() => startPageTransition(2)}
            pageIndex={pageIndex}
            total={totalSteps}
            onDotClick={(index) => startPageTransition(index + 1)}
          />
        );
      case 2:
        return (
          <QuestionPage
            theme={theme}
            onYes={() => {
              setAccepted(true);
              startPageTransition(3);
            }}
            pageIndex={pageIndex}
            total={totalSteps}
            onDotClick={(index) => startPageTransition(index + 1)}
          />
        );
      case 3:
        return (
          <CelebrationPage
            theme={theme}
            onNext={() => startPageTransition(4)}
            pageIndex={pageIndex}
            total={totalSteps}
            onDotClick={(index) => startPageTransition(index + 1)}
          />
        );
      case 4:
        return (
          <PlanPage
            theme={theme}
            plan={plan}
            setPlan={setPlan}
            onNext={() => startPageTransition(5)}
            pageIndex={pageIndex}
            total={totalSteps}
            onDotClick={(index) => startPageTransition(index + 1)}
          />
        );
      case 5:
        return (
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
            pageIndex={pageIndex}
            total={totalSteps}
            onDotClick={(index) => startPageTransition(index + 1)}
          />
        );
      default:
        return null;
    }
  };

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
    <div className="relative h-screen overflow-hidden">
      {mode === 'preview' ? <PreviewBanner onExit={handleExitPreview} /> : null}
      <div
        className={`relative flex h-full items-center justify-center px-4 ${
          mode === 'preview' ? 'pt-16 pb-12' : 'py-12'
        }`}
      >
        <FloatingHearts color={theme.primary} />
        <div className="relative z-10 w-full max-w-4xl">
          {(page === 0 || letterTransition) && (
            <div
              className={`transition-opacity duration-500 ${
                letterTransition ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
              style={{ transitionDelay: letterTransition ? '200ms' : '0ms' }}
            >
              <LetterPage
                toName={activeData?.to}
                fromName={activeData?.from}
                theme={theme}
                onFlyOut={startLetterTransition}
              />
            </div>
          )}
          {letterTransition ? (
            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
              <div className="w-full" style={greetingMotionStyle}>
                <GreetingPage
                  toName={activeData?.to}
                  fromName={activeData?.from}
                  intro={activeData?.intro}
                  theme={theme}
                  onNext={() => {}}
                  pageIndex={0}
                  total={totalSteps}
                  onDotClick={() => {}}
                />
              </div>
            </div>
          ) : null}
          {!letterTransition && pageTransition ? (
            <div className="page-swing-stage" style={pageTransitionStyle}>
              {pageTransition.phase === 'exit' ? (
                <div className="page-swing-layer page-swing-exit">
                  {renderStep(pageTransition.from)}
                </div>
              ) : (
                <div className="page-swing-layer page-swing-enter">
                  {renderStep(pageTransition.to)}
                </div>
              )}
            </div>
          ) : null}
          {!letterTransition && !pageTransition && page >= 1 ? renderStep(page) : null}
        </div>
      </div>
    </div>
  );
}
