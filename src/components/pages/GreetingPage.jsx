import { Heart } from 'lucide-react';
import LetterBackground from '../LetterBackground.jsx';

export default function GreetingPage({ toName, fromName, intro, theme, onNext, pageIndex, total, onDotClick }) {
  return (
    <LetterBackground theme={theme} page={pageIndex} total={total} onDotClick={onDotClick}>
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <Heart size={20} style={{ color: theme?.primary }} />
          <Heart size={28} style={{ color: theme?.primary }} />
          <Heart size={20} style={{ color: theme?.primary }} />
        </div>
        <h1 className="font-cursive text-5xl" style={{ color: theme?.accent }}>
          Hi {toName || 'there'}
        </h1>
        <p className="text-base text-gray-700">You have a special note from {fromName || 'someone who adores you'}.</p>
        {intro ? (
          <div className="rounded-2xl border px-6 py-4 text-sm" style={{ borderColor: theme?.primary }}>
            {intro}
          </div>
        ) : null}
        <button
          type="button"
          onClick={onNext}
          className="rounded-full px-6 py-2 text-sm font-semibold shadow-md transition"
          style={{ backgroundColor: theme?.primary, color: theme?.buttonText }}
        >
          Keep going
        </button>
      </div>
    </LetterBackground>
  );
}
