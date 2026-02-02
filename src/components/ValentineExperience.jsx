import { useEffect, useMemo, useRef, useState } from 'react';
import FloatingHearts from './FloatingHearts.jsx';
import CelebrationPage from './pages/CelebrationPage.jsx';
import GreetingPage from './pages/GreetingPage.jsx';
import LetterPage from './pages/LetterPage.jsx';
import MemoryPage from './pages/MemoryPage.jsx';
import PlanPage from './pages/PlanPage.jsx';
import QuestionPage from './pages/QuestionPage.jsx';
import themes from '../config/themes.js';
import { buildReceiverToHostDraft, buildReceiverToHostGmail } from '../utils/mailto.js';

const PAGE_SWING_MS = 900;
const PAGE_SWING_DISTANCE = '100vw';
const initialPlan = {
  food: '',
  vibe: '',
  mainPlan: '',
  customPlan: '',
  placeText: '',
  placePref: '',
};

export default function ValentineExperience({
  valentine,
  onSubmitResponse,
  isPreview = false,
  previewResultsLink = '',
}) {
  const [page, setPage] = useState(0);
  const [plan, setPlan] = useState(initialPlan);
  const [toast, setToast] = useState(null);
  const [letterTransition, setLetterTransition] = useState(null);
  const [pageTransition, setPageTransition] = useState(null);
  const [resultsLink, setResultsLink] = useState('');
  const [submitState, setSubmitState] = useState({ status: 'idle', error: null });
  const transitionTimers = useRef([]);
  const pageTransitionTimers = useRef([]);

  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(null), toast?.duration ?? 3500);
    return () => clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

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

  const activeData = useMemo(
    () => ({
      to: valentine?.receiver_name || '',
      from: valentine?.sender_name || '',
      intro: valentine?.letter_message || '',
    }),
    [valentine]
  );

  const replyDraft = useMemo(() => {
    if (!resultsLink) return null;
    return buildReceiverToHostDraft({
      senderName: valentine?.sender_name || '',
      receiverName: valentine?.receiver_name || '',
      resultsLink,
    });
  }, [resultsLink, valentine]);

  const replyGmail = useMemo(() => {
    if (!resultsLink) return '';
    return buildReceiverToHostGmail({
      senderName: valentine?.sender_name || '',
      senderEmail: valentine?.sender_email || '',
      receiverName: valentine?.receiver_name || '',
      resultsLink,
    });
  }, [resultsLink, valentine]);

  const theme = themes.Normal;

  const handleSend = async (note) => {
    if (submitState.status === 'sending') return;

    if (isPreview) {
      setToast({
        title: 'Preview mode',
        message: 'This response will not be recorded.',
        duration: 8000,
      });
      if (previewResultsLink) {
        setResultsLink(previewResultsLink);
      }
      setSubmitState({ status: 'success', error: null });
      return;
    }

    if (!onSubmitResponse) return;

    setSubmitState({ status: 'sending', error: null });
    try {
      const response = await onSubmitResponse({ plan, note });
      setResultsLink(response?.resultsLink || '');
      setSubmitState({ status: 'success', error: null });
    } catch (error) {
      setSubmitState({ status: 'error', error: error?.message || 'Something went wrong.' });
    }
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
            setToast={setToast}
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
              setPage(0);
              setResultsLink('');
              setSubmitState({ status: 'idle', error: null });
            }}
            isSubmitting={submitState.status === 'sending'}
            submitError={submitState.error}
            resultsLink={resultsLink}
            replyDraft={replyDraft}
            replyGmail={replyGmail}
            isPreview={isPreview}
          />
        );
      default:
        return null;
    }
  };

  const toastElement = toast ? (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl bg-rose-500 px-6 py-4 text-white shadow-xl">
      <p className="text-sm font-semibold">{toast.title}</p>
      <p className="mt-1 text-xs text-rose-100">{toast.message}</p>
    </div>
  ) : null;

  return (
    <>
      {toastElement}
      <div className="relative min-h-screen overflow-x-hidden">
        <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
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
    </>
  );
}
