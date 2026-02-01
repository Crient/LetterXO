import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import LetterBackground from '../LetterBackground.jsx';
import BouquetModal from '../BouquetModal.jsx';

export default function CelebrationPage({ theme, onNext, pageIndex, total, onDotClick }) {
  const [showBouquet, setShowBouquet] = useState(false);
  const confetti = useMemo(() => {
    return Array.from({ length: 48 }, (_, index) => {
      const variant = Math.random();
      const width = 6 + Math.random() * 8;
      const height = variant > 0.7 ? width : width * (1.6 + Math.random() * 0.9);
      const radius = variant > 0.8 ? '999px' : `${2 + Math.random() * 4}px`;
      return {
        id: index,
        left: Math.random() * 100,
        delay: Math.random() * 2.5,
        duration: 3.6 + Math.random() * 2.4,
        width,
        height,
        radius,
        opacity: 0.55 + Math.random() * 0.45,
        drift: (Math.random() - 0.5) * 140,
        rotate: Math.floor(Math.random() * 180) - 90,
      };
    });
  }, []);

  const colors = [theme?.primary, theme?.accent, '#ffd166', '#06d6a0'];
  const ringColor = theme?.primary || '#e46a6a';
  const confettiLayer =
    typeof document !== 'undefined'
      ? createPortal(
          <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
            {confetti.map((piece) => (
              <div
                key={piece.id}
                className="confetti-piece absolute animate-confetti"
                style={{
                  left: `${piece.left}%`,
                  top: 0,
                  width: `${piece.width}px`,
                  height: `${piece.height}px`,
                  borderRadius: piece.radius,
                  opacity: piece.opacity,
                  backgroundColor: colors[piece.id % colors.length],
                  animationDelay: `${piece.delay}s`,
                  animationDuration: `${piece.duration}s`,
                  animationTimingFunction: 'linear',
                  '--confetti-drift': `${piece.drift}px`,
                  '--confetti-rotate': `${piece.rotate}deg`,
                }}
              />
            ))}
          </div>,
          document.body
        )
      : null;

  return (
    <>
      {confettiLayer}
      <BouquetModal
        open={showBouquet}
        onClose={() => setShowBouquet(false)}
        onNext={() => {
          setShowBouquet(false);
          onNext();
        }}
        theme={theme}
      />
      <LetterBackground theme={theme} page={pageIndex} total={total} onDotClick={onDotClick}>
        <div className="relative text-center">
          <div className="relative z-10 flex min-h-[22rem] flex-col items-center justify-center gap-5 text-center sm:min-h-[23rem]">
          <img
            src="/xoxo.png"
            alt="XOXO"
            className=" -mb-[60px] h-[9rem] w-[9rem] object-contain sm:h-[10.75rem] sm:w-[10.75rem]"
          />
            <h2 className="valentine-title text-[50px] font-bold leading-[1.12] sm:text-[75px]">
              You made someone <br></br>very happy :)
            </h2>
            <p className="max-w-md text-md text-gray-700 sm:text-xl">
              I have something for you.
            </p>
            <button
              type="button"
              onClick={() => setShowBouquet(true)}
              className="rounded-full px-10 py-3 text-base font-semibold shadow-lg transition duration-200 hover:-translate-y-0.5 active:translate-y-0 sm:text-lg"
              style={{ backgroundColor: ringColor, color: theme?.buttonText }}
            >
              Open it up!
            </button>
          </div>
        </div>
      </LetterBackground>
    </>
  );
}
