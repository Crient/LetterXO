import { useEffect, useRef, useState } from 'react';
import LetterBackground from '../LetterBackground.jsx';

const NO_PHRASES = [
  'No',
  'Are you sure?',
  'Really sure?',
  'Think again!',
  'Pretty please?',
  'With a cherry on top?',
  'Come on!',
  'Just say yes!',
  "You're breaking my heart 💔",
  "I'll be sad...",
];

const BUTTON_WIDTH = 220;
const BUTTON_HEIGHT = 48;
const BUTTON_GAP = 20;

export default function QuestionPage({ theme, onYes, pageIndex, total, onDotClick }) {
  const paperRef = useRef(null);
  const rowRef = useRef(null);
  const [paperBounds, setPaperBounds] = useState(null);
  const [rowBounds, setRowBounds] = useState(null);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [noIndex, setNoIndex] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  const clampNoPos = (pos, buttonWidth, buttonHeight, padding, bounds) => ({
    x: Math.min(Math.max(pos.x, padding), bounds.width - buttonWidth - padding),
    y: Math.min(Math.max(pos.y, padding), bounds.height - buttonHeight - padding),
  });

  const getButtonWidth = (bounds) => {
    const isMobile = bounds.width < 420;
    const target = isMobile ? 180 : BUTTON_WIDTH;
    return Math.min(target, bounds.width - 40);
  };

  const moveNo = () => {
    if (!paperBounds || !rowBounds) return;
    const padding = 20;
    const buttonWidth = getButtonWidth(paperBounds);
    const buttonHeight = BUTTON_HEIGHT;
    const minX = padding;
    const maxX = paperBounds.width - buttonWidth - padding;
    const minY = padding;
    const maxY = paperBounds.height - buttonHeight - padding;

    const rowLeft = rowBounds.left - paperBounds.left;
    const rowTop = rowBounds.top - paperBounds.top;
    const yesCenterX = rowLeft + buttonWidth / 2;
    const yesCenterY = rowTop + buttonHeight / 2;
    const currentCenterX = noPos.x + buttonWidth / 2;
    const currentCenterY = noPos.y + buttonHeight / 2;
    const minJump = Math.min(paperBounds.width, paperBounds.height) * 0.45;
    const minFromYes = Math.min(paperBounds.width, paperBounds.height) * 0.3;
    let nextX = padding;
    let nextY = padding;

    for (let attempt = 0; attempt < 20; attempt += 1) {
      const candidateX = minX + Math.random() * (maxX - minX);
      const candidateY = minY + Math.random() * (maxY - minY);
      const candidateCenterX = candidateX + buttonWidth / 2;
      const candidateCenterY = candidateY + buttonHeight / 2;
      const distanceFromYes = Math.hypot(candidateCenterX - yesCenterX, candidateCenterY - yesCenterY);
      const distanceFromCurrent = Math.hypot(candidateCenterX - currentCenterX, candidateCenterY - currentCenterY);
      if ((distanceFromYes > minFromYes && distanceFromCurrent > minJump) || attempt === 19) {
        nextX = candidateX;
        nextY = candidateY;
        break;
      }
    }

    setHasMoved(true);
    setNoPos({ x: nextX, y: nextY });
    setNoIndex((prev) => (prev + 1) % NO_PHRASES.length);
  };

  useEffect(() => {
    const paper = paperRef.current;
    const row = rowRef.current;
    if (!paper || !row) return;

    const updateBounds = () => {
      const paperRect = paper.getBoundingClientRect();
      const rowRect = row.getBoundingClientRect();
      setPaperBounds({
        left: paperRect.left,
        top: paperRect.top,
        width: paperRect.width,
        height: paperRect.height,
      });
      setRowBounds({
        left: rowRect.left,
        top: rowRect.top,
        width: rowRect.width,
        height: rowRect.height,
      });
    };

    updateBounds();
    const observer = new ResizeObserver(updateBounds);
    observer.observe(paper);
    observer.observe(row);
    window.addEventListener('resize', updateBounds);
    window.addEventListener('scroll', updateBounds, true);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateBounds);
      window.removeEventListener('scroll', updateBounds, true);
    };
  }, []);

  useEffect(() => {
    if (!paperBounds || !rowBounds) return;
    const padding = 20;
    const buttonWidth = getButtonWidth(paperBounds);
    const buttonHeight = BUTTON_HEIGHT;
    const rowLeft = rowBounds.left - paperBounds.left;
    const rowTop = rowBounds.top - paperBounds.top;
    const initialNo = { x: rowLeft + buttonWidth + BUTTON_GAP, y: rowTop };
    if (!hasMoved) {
      setNoPos(initialNo);
    } else {
      setNoPos((prev) => clampNoPos(prev, buttonWidth, buttonHeight, padding, paperBounds));
    }
  }, [paperBounds, rowBounds, hasMoved]);

  return (
    <LetterBackground
      theme={theme}
      page={pageIndex}
      total={total}
      onDotClick={onDotClick}
      containerRef={paperRef}
      overlay={
        paperBounds && rowBounds ? (
          <button
            type="button"
            onMouseEnter={moveNo}
            onClick={moveNo}
            onFocus={moveNo}
            className="pointer-events-auto absolute h-11 w-[180px] whitespace-nowrap rounded-full border text-sm font-semibold shadow-md no-button-move sm:h-12 sm:w-[220px] sm:text-base"
            style={{
              left: noPos.x,
              top: noPos.y,
              borderColor: theme?.primary,
              color: theme?.accent,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            {NO_PHRASES[noIndex]}
          </button>
        ) : null
      }
    >
      <div className="flex min-h-[22rem] flex-col items-center justify-center gap-5 text-center sm:min-h-[23rem]">
        <h2 className="valentine-title text-[44px] font-bold leading-tight sm:text-[75px]">
          Will you be my <br className="hidden sm:block" /> Valentine?
        </h2>
        <div className="flex w-full justify-center">
          <div ref={rowRef} className="inline-flex items-center gap-5">
            <button
              type="button"
              onClick={onYes}
              className="h-11 w-[180px] rounded-full text-sm font-semibold shadow-lg transition sm:h-12 sm:w-[220px] sm:text-base"
              style={{ backgroundColor: theme?.primary, color: theme?.buttonText }}
            >
              Yes!
            </button>
            <div className="h-11 w-[180px] opacity-0 sm:h-12 sm:w-[220px]" aria-hidden="true" />
          </div>
        </div>
        <p className="text-sm text-gray-600"
        style={{marginTop:"15px"}}>Psst... the Yes button is looking pretty good right now</p>
      </div>
    </LetterBackground>
  );
}
