import { Heart } from 'lucide-react';
import LetterBackground from '../LetterBackground.jsx';

export default function GreetingPage({ toName, fromName, intro, theme, onNext, pageIndex, total, onDotClick }) {
  const heartColor = theme?.primary || '#e46a6a';
  const headlineColor = theme?.headline || '#D94A5B';

  return (
    <LetterBackground theme={theme} page={pageIndex} total={total} onDotClick={onDotClick}>
      <div className="flex min-h-[22rem] flex-col items-center justify-center gap-5 text-center sm:min-h-[23rem]">
        <div className="flex items-center justify-center gap-3">
          <Heart
            size={24}
            className="heart-beat heart-beat--one"
            style={{ color: heartColor, fill: heartColor }}
          />
          <Heart
            size={32}
            className="heart-beat heart-beat--two"
            style={{ color: heartColor, fill: heartColor }}
          />
          <Heart
            size={24}
            className="heart-beat heart-beat--three"
            style={{ color: heartColor, fill: heartColor }}
          />
        </div>
        <h1 className="font-cursive text-5xl leading-none sm:text-7xl" style={{ color: headlineColor }}>
          Hi {toName || 'there'}
        </h1>
        <p className="max-w-md text-lg text-gray-700 sm:text-xl">
          You have a special note from {fromName || 'someone who adores you'}.
        </p>
        {intro ? (
          <div
            className="max-w-lg whitespace-pre-wrap break-words rounded-3xl border px-7 py-5 text-base leading-relaxed text-gray-700 shadow-sm sm:text-lg"
            style={{ borderColor: heartColor, backgroundColor: theme?.secondary || 'rgba(255,255,255,0.7)' }}
          >
            {intro}
          </div>
        ) : null}
        <button
          type="button"
          onClick={onNext}
          className="rounded-full px-10 py-3 text-base font-semibold shadow-lg transition duration-200 hover:-translate-y-0.5 active:translate-y-0 sm:text-lg"
          style={{ backgroundColor: heartColor, color: theme?.buttonText }}
        >
          Keep going
        </button>
      </div>
    </LetterBackground>
  );
}
