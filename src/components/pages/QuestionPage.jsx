import { useEffect, useRef, useState } from 'react';
import LetterBackground from '../LetterBackground.jsx';

export default function QuestionPage({ theme, onYes, pageIndex, total, onDotClick }) {
  const containerRef = useRef(null);
  const [noPos, setNoPos] = useState({ x: 60, y: 45 });

  const moveNo = () => {
    const container = containerRef.current;
    if (!container) return;
    const bounds = container.getBoundingClientRect();
    const maxX = Math.max(10, bounds.width - 120);
    const maxY = Math.max(10, bounds.height - 50);
    const nextX = 10 + Math.random() * maxX;
    const nextY = 10 + Math.random() * maxY;
    setNoPos({ x: nextX, y: nextY });
  };

  useEffect(() => {
    moveNo();
  }, []);

  return (
    <LetterBackground theme={theme} page={pageIndex} total={total} onDotClick={onDotClick}>
      <div className="text-center">
        <h2 className="font-cursive text-4xl" style={{ color: theme?.accent }}>
          Will you be my Valentine?
        </h2>
        <p className="mt-2 text-sm text-gray-600">Choose wisely... the No button is shy.</p>
        <div ref={containerRef} className="relative mt-8 h-36">
          <button
            type="button"
            onClick={onYes}
            className="absolute left-6 top-6 rounded-full px-6 py-2 text-sm font-semibold shadow-lg transition"
            style={{ backgroundColor: theme?.primary, color: theme?.buttonText }}
          >
            Yes
          </button>
          <button
            type="button"
            onMouseEnter={moveNo}
            onClick={moveNo}
            className="absolute rounded-full border px-6 py-2 text-sm font-semibold shadow-md transition"
            style={{ left: noPos.x, top: noPos.y, borderColor: theme?.primary, color: theme?.accent }}
          >
            No
          </button>
        </div>
      </div>
    </LetterBackground>
  );
}
