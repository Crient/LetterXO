import { useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import LetterBackground from '../LetterBackground.jsx';

export default function CelebrationPage({ theme, onNext, pageIndex, total, onDotClick }) {
  const confetti = useMemo(() => {
    return Array.from({ length: 20 }, (_, index) => ({
      id: index,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2.6 + Math.random() * 1.5,
    }));
  }, []);

  const colors = [theme?.primary, theme?.accent, '#ffd166', '#06d6a0'];

  return (
    <LetterBackground theme={theme} page={pageIndex} total={total} onDotClick={onDotClick}>
      <div className="relative overflow-hidden text-center">
        {confetti.map((piece) => (
          <div
            key={piece.id}
            className="confetti-piece absolute top-[-10px] animate-confetti"
            style={{
              left: `${piece.left}%`,
              backgroundColor: colors[piece.id % colors.length],
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
            }}
          />
        ))}
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-4"
          style={{ borderColor: theme?.primary }}
        >
          <Sparkles size={32} style={{ color: theme?.primary }} />
        </div>
        <h2 className="font-cursive text-4xl" style={{ color: theme?.accent }}>
          You made someone very happy!
        </h2>
        <p className="mt-2 text-sm text-gray-600">Cue the confetti and a bouquet of smiles.</p>
        <button
          type="button"
          onClick={onNext}
          className="mt-6 rounded-full px-6 py-2 text-sm font-semibold shadow-md transition"
          style={{ backgroundColor: theme?.primary, color: theme?.buttonText }}
        >
          Plan our date
        </button>
      </div>
    </LetterBackground>
  );
}
