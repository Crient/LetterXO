import { Activity, MapPin, Sparkles, Utensils } from 'lucide-react';

const VIBE_OPTIONS = ['Cozy', 'Fancy', 'Fun', 'Chill', 'Surprise me'];
const MAIN_OPTIONS = [
  { label: 'Arcade', emoji: '🕹️' },
  { label: 'Movie night', emoji: '🎬' },
  { label: 'Picnic', emoji: '🧺' },
  { label: 'Activity date', emoji: '🎯' },
  { label: 'Stay in', emoji: '🛋️' },
  { label: 'Surprise me', emoji: '🎁' },
];
const FOOD_OPTIONS = [
  { label: 'Sushi', emoji: '🍣' },
  { label: 'Italian', emoji: '🍝' },
  { label: 'Korean BBQ', emoji: '🔥' },
  { label: 'Hispanic', emoji: '🌮' },
  { label: 'Steakhouse', emoji: '🥩' },
  { label: 'Dessert', emoji: '🍰' },
];

export default function PlanPage({ theme, plan, setPlan, onNext, pageIndex, total, onDotClick, setToast }) {
  const primary = theme?.primary || '#e46a6a';
  const accent = theme?.accent || '#3b1f2a';
  const buttonVisual = (isActive) => ({
    backgroundColor: isActive ? primary : '#fff',
    color: isActive ? '#fff' : accent,
    borderColor: primary,
  });

  const updatePlan = (updates) => setPlan({ ...plan, ...updates });

  const handleMainSelect = (option) => {
    const next = { ...plan, mainPlan: option.label, customPlan: '' };
    if (option.label === 'Surprise me') {
      next.food = 'Surprise me';
    } else if (next.food === 'Surprise me') {
      next.food = '';
    }
    setPlan(next);
  };

  const PLACE_TEXT_MAX = 250;

  const handleContinue = () => {
    const noteLength = (plan.placeText || '').trim().length;
    if (noteLength > PLACE_TEXT_MAX) {
      setToast?.({
        title: 'Notes too long',
        message: "Notes (Let's plan) must be 250 characters or fewer.",
      });
      return;
    }

    const hasVibe = Boolean(plan.vibe);
    const hasMainPlan = Boolean(plan.mainPlan) || Boolean(plan.customPlan);
    const hasFood = Boolean(plan.food);

    if (!hasVibe || !hasMainPlan || !hasFood) {
      setToast?.({
        title: 'Please fill in all required fields',
        message: 'Pick a vibe, an activity, and a food option before continuing.',
      });
      return;
    }
    onNext();
  };

  return (
    <div className="scrollbar-hidden flex w-full flex-col items-center justify-start px-4 py-6">
      <div
        className="w-full max-w-[45rem] rounded-[2.5rem] border border-white/70 bg-white/95 px-8 py-10 shadow-[0_30px_70px_rgba(233,77,140,0.35)] backdrop-blur-sm"
        style={{ color: accent }}
      >
        <div className="space-y-8">
          <header className="text-center">
            <h2 className="valentine-title text-7xl font-bold sm:text-8xl">Let&apos;s Plan It!</h2>
            <p className="mt-2 text-sm text-gray-600">Tell me what you want. I&apos;ll take care of the rest.</p>
            <div className="mt-3 flex items-center justify-center gap-2 text-2xl text-pink-500">
              <span aria-hidden="true">❤</span>
              <span aria-hidden="true">❤</span>
            </div>
          </header>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles size={18} className="text-pink-500" aria-hidden="true" />
              <span>What&apos;s the vibe today?</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {VIBE_OPTIONS.map((option) => {
                const isActive = plan.vibe === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => updatePlan({ vibe: option })}
                    className="rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition"
                    style={{
                      ...buttonVisual(isActive),
                      borderWidth: 1,
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Activity size={18} className="text-pink-500" aria-hidden="true" />
              <span>What do you feel like doing?</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {MAIN_OPTIONS.map((option) => {
                const isActive = plan.mainPlan === option.label;
                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => handleMainSelect(option)}
                    className="rounded-2xl border px-4 py-3 text-sm font-semibold transition"
                    style={{
                      ...buttonVisual(isActive),
                      borderWidth: 2,
                    }}
                  >
                    <span className="mr-2" aria-hidden="true">
                      {option.emoji}
                    </span>
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
            <input
              type="text"
              value={plan.customPlan}
              onChange={(event) => updatePlan({ customPlan: event.target.value })}
              placeholder="Or type something else..."
              className="w-full rounded-2xl border px-4 py-3 text-sm shadow-sm outline-none"
              style={{ borderColor: primary }}
            />
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Utensils size={18} className="text-pink-500" aria-hidden="true" />
              <span>What sounds good to eat?</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {FOOD_OPTIONS.map((option) => {
                const isActive = plan.food === option.label;
                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => updatePlan({ food: option.label })}
                    className="rounded-2xl border px-4 py-3 text-sm font-semibold transition"
                    style={{
                      ...buttonVisual(isActive),
                      borderWidth: 2,
                    }}
                  >
                    <span className="mr-2"
                    aria-hidden="true">{option.emoji}</span>
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => updatePlan({ food: 'Surprise me' })}
              className="w-full rounded-2xl border border-pink-500 px-4 py-3 text-sm font-semibold transition"
              style={{
                backgroundColor: plan.food === 'Surprise me' ? primary : '#fff',
                color: plan.food === 'Surprise me' ? '#fff' : accent,
                borderColor: primary,
                borderWidth: 2,
              }}
            >
              Surprise me
            </button>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <MapPin size={18} className="text-pink-500" aria-hidden="true" />
              <span>Any notes? (optional)</span>
            </div>
            <input
              type="text"
              value={plan.placeText}
              onChange={(event) => updatePlan({ placeText: event.target.value })}
              placeholder="Anything you want to add..."
              className="w-full rounded-2xl border px-4 py-3 text-sm shadow-sm outline-none"
              style={{ borderColor: primary }}
            />
            <p className="text-xs text-pink-500">Notes can be 250 characters or fewer.</p>
          </section>

          <button
            type="button"
            onClick={handleContinue}
            className="rounded-full bg-[#e94d8c] px-6 py-3 text-sm font-semibold text-white shadow-lg transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e94d8c] sm:text-base
            item-center mx-auto flex"
          >
            Continue <span className="ml-2" aria-hidden="true">❤</span>
          </button>
        </div>
      </div>
      {total > 0 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: total }).map((_, index) => (
            <button
              key={index}
              type="button"
              className="h-2.5 w-2.5 rounded-full transition"
              style={{
                backgroundColor:
                  index === pageIndex ? theme?.primary || '#e46a6a' : 'rgba(0, 0, 0, 0.2)',
              }}
              onClick={() => onDotClick?.(index)}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
