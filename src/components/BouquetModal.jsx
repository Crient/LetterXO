import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const WRAPPER_TEXTURE_SRC = '/bouq_wrapper_texture.png?v=2';
const BOW_TEXTURE_SRC = '/bouq_bow.png?v=1';
const SPOTLIGHT_SRC = '/spotlight.png?v=1';
const BOUQUET_TILT = (-15 * Math.PI) / 180;

const ROSES = [
  { x: -30, y: -155, z: 0 },
  { x: 25, y: -150, z: 0 },
  { x: -70, y: -130, z: 0 },
  { x: 65, y: -125, z: 0 },
  { x: 0, y: -140, z: 1 },
  { x: -50, y: -115, z: 1 },
  { x: 45, y: -110, z: 1 },
  { x: -85, y: -95, z: 1 },
  { x: 80, y: -90, z: 1 },
  { x: -25, y: -100, z: 2 },
  { x: 20, y: -95, z: 2 },
  { x: -60, y: -75, z: 2 },
  { x: 55, y: -70, z: 2 },
  { x: -40, y: -55, z: 2 },
  { x: 35, y: -50, z: 2 },
  { x: 0, y: -60, z: 2 },
  { x: -70, y: -45, z: 2 },
  { x: 65, y: -40, z: 2 },
];

const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const map = (value, start, end) => Math.max(0, Math.min(1, (value - start) / (end - start)));

export default function BouquetModal({ open, onClose, onNext, theme }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const wrapperPatternRef = useRef(null);
  const bowImageRef = useRef(null);
  const spotlightImageRef = useRef(null);
  const stateRef = useRef({
    W: 0,
    H: 0,
    cx: 0,
    cy: 0,
    sc: 1,
    progress: 0,
    blooming: false,
    startTime: null,
    bob: 0,
  });
  const completeRef = useRef(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!open) return undefined;

    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const state = stateRef.current;
    state.progress = 0;
    state.blooming = true;
    state.startTime = null;
    state.bob = 0;
    completeRef.current = false;
    setIsComplete(false);

    const wrapperTexture = new Image();
    wrapperTexture.src = WRAPPER_TEXTURE_SRC;
    wrapperTexture.onload = () => {
      wrapperPatternRef.current = ctx.createPattern(wrapperTexture, 'repeat');
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      state.W = window.innerWidth;
      state.H = window.innerHeight;
      canvas.width = state.W * dpr;
      canvas.height = state.H * dpr;
      canvas.style.width = `${state.W}px`;
      canvas.style.height = `${state.H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      state.cx = state.W / 2;
      state.cy = state.H / 2;
      state.sc = Math.min(state.W / 500, state.H / 650);
    };

    const bowImage = new Image();
    bowImage.src = BOW_TEXTURE_SRC;
    bowImage.onload = () => {
      bowImageRef.current = bowImage;
    };

    const spotlightImage = new Image();
    spotlightImage.src = SPOTLIGHT_SRC;
    spotlightImage.onload = () => {
      spotlightImageRef.current = spotlightImage;
    };

    const drawWrapperBack = (p) => {
      if (p <= 0) return;
      ctx.save();
      ctx.translate(state.cx, state.cy + state.bob);
      ctx.rotate(BOUQUET_TILT);
      ctx.scale(state.sc * p, state.sc * p);
      ctx.fillStyle = wrapperPatternRef.current || '#f5e6d3';
      ctx.beginPath();
      ctx.moveTo(0, 210);
      ctx.bezierCurveTo(-30, 210, -50, 180, -50, 180);
      ctx.lineTo(-88, -31);
      ctx.lineTo(-143, -150);
      ctx.bezierCurveTo(-121, -170, -99, -180, -77, -180);
      ctx.lineTo(77, -180);
      ctx.bezierCurveTo(99, -180, 121, -170, 143, -150);
      ctx.lineTo(88, -31);
      ctx.lineTo(50, 180);
      ctx.bezierCurveTo(50, 180, 30, 210, 0, 210);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.restore();
    };

    const drawStems = (p) => {
      if (p <= 0) return;
      ctx.save();
      ctx.translate(state.cx, state.cy + state.bob);
      ctx.rotate(BOUQUET_TILT);
      ctx.scale(state.sc, state.sc);
      ctx.beginPath();
      ctx.moveTo(-83, -200);
      ctx.lineTo(-83, -31);
      ctx.lineTo(0, 44);
      ctx.lineTo(83, -31);
      ctx.lineTo(83, -200);
      ctx.closePath();
      ctx.clip();
      ctx.strokeStyle = '#2e7d32';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ROSES.forEach((rose) => {
        const startX = rose.x * 0.1;
        const startY = 200;
        const endX = rose.x;
        const endY = rose.y;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX + (endX - startX) * p, startY + (endY - startY) * p);
        ctx.stroke();
      });
      ctx.restore();
    };

    const drawWrapperFront = (p) => {
      if (p <= 0) return;
      ctx.save();
      ctx.translate(state.cx, state.cy + state.bob);
      ctx.rotate(BOUQUET_TILT);
      ctx.scale(state.sc * p, state.sc * p);
      ctx.fillStyle = wrapperPatternRef.current || '#f5e6d3';
      ctx.beginPath();
      ctx.moveTo(-88, -31);
      ctx.lineTo(0, 49);
      ctx.lineTo(88, -31);
      ctx.lineTo(50, 180);
      ctx.quadraticCurveTo(0, 210, -50, 180);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 0.22;
      ctx.fillStyle = '#d7c3ad';
      ctx.fill();
      ctx.globalAlpha = 0.4;
      ctx.strokeStyle = '#b89f86';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(-88, -31);
      ctx.lineTo(0, 49);
      ctx.lineTo(88, -31);
      ctx.stroke();
      ctx.globalAlpha = 0.18;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(-88, -31);
      ctx.lineTo(0, 49);
      ctx.lineTo(88, -31);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.moveTo(-88, -31);
      ctx.lineTo(-143, -150);
      ctx.bezierCurveTo(-110, -130, -94, -80, -88, -31);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 0.14;
      ctx.fillStyle = '#d1bca5';
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.moveTo(88, -31);
      ctx.lineTo(143, -150);
      ctx.bezierCurveTo(110, -130, 94, -80, 88, -31);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 0.14;
      ctx.fillStyle = '#d1bca5';
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.restore();
    };

    const drawRose = (x, y, p) => {
      if (p <= 0) return;
      const s = (0.5 + p * 0.5) * 22 * state.sc;
      ctx.save();
      ctx.translate(state.cx, state.cy + state.bob);
      ctx.rotate(BOUQUET_TILT);
      ctx.translate(x * state.sc, y * state.sc);
      ctx.strokeStyle = 'transparent';
      ctx.lineWidth = 0;
      ctx.fillStyle = '#9b1a1a';
      ctx.beginPath();
      ctx.moveTo(0, 0.35 * s);
      ctx.bezierCurveTo(-1 * s, -0.1 * s, -1.1 * s, -1.2 * s, -0.45 * s, -1.7 * s);
      ctx.bezierCurveTo(0, -1.85 * s, 0, -1.85 * s, 0.45 * s, -1.7 * s);
      ctx.bezierCurveTo(1.1 * s, -1.2 * s, 1 * s, -0.1 * s, 0, 0.35 * s);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#b61f1f';
      ctx.beginPath();
      ctx.moveTo(-0.08 * s, 0.28 * s);
      ctx.bezierCurveTo(-0.85 * s, 0, -0.9 * s, -0.95 * s, -0.48 * s, -1.5 * s);
      ctx.bezierCurveTo(-0.18 * s, -1.35 * s, -0.08 * s, -0.6 * s, -0.08 * s, 0.28 * s);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0.08 * s, 0.28 * s);
      ctx.bezierCurveTo(0.85 * s, 0, 0.9 * s, -0.95 * s, 0.48 * s, -1.5 * s);
      ctx.bezierCurveTo(0.18 * s, -1.35 * s, 0.08 * s, -0.6 * s, 0.08 * s, 0.28 * s);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#d0364c';
      ctx.beginPath();
      ctx.moveTo(0, 0.2 * s);
      ctx.bezierCurveTo(-0.6 * s, 0, -0.65 * s, -0.75 * s, -0.3 * s, -1.2 * s);
      ctx.bezierCurveTo(-0.1 * s, -1.1 * s, 0, -0.5 * s, 0, 0.2 * s);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, 0.2 * s);
      ctx.bezierCurveTo(0.6 * s, 0, 0.65 * s, -0.75 * s, 0.3 * s, -1.2 * s);
      ctx.bezierCurveTo(0.1 * s, -1.1 * s, 0, -0.5 * s, 0, 0.2 * s);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#e0505f';
      ctx.beginPath();
      ctx.moveTo(0, 0.15 * s);
      ctx.bezierCurveTo(-0.42 * s, 0, -0.42 * s, -0.6 * s, -0.18 * s, -1 * s);
      ctx.bezierCurveTo(0, -1.08 * s, 0, -1.08 * s, 0.18 * s, -1 * s);
      ctx.bezierCurveTo(0.42 * s, -0.6 * s, 0.42 * s, 0, 0, 0.15 * s);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#e85d6c';
      ctx.beginPath();
      ctx.ellipse(0, -0.65 * s, 0.15 * s, 0.22 * s, 0, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const drawBow = (p) => {
      if (p <= 0) return;
      const bowImageReady = bowImageRef.current;
      if (!bowImageReady) return;
      const baseWidth = 210;
      const ratio = bowImageReady.naturalHeight / bowImageReady.naturalWidth || 0.5;
      const scaledWidth = baseWidth * state.sc * p;
      const scaledHeight = scaledWidth * ratio;
      ctx.save();
      ctx.translate(state.cx, state.cy + state.bob);
      ctx.rotate(BOUQUET_TILT);
      const x = -scaledWidth / 2;
      const y = 140 * state.sc - scaledHeight / 2;
      ctx.globalAlpha = 0.98;
      ctx.drawImage(bowImageReady, x, y, scaledWidth, scaledHeight);
      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, state.W, state.H);
      const spotlightP = ease(map(state.progress, 0, 0.2));
      if (spotlightP > 0 && spotlightImageRef.current) {
        const spotlight = spotlightImageRef.current;
        const baseWidth = Math.min(state.W * 0.9, 720) * 0.92;
        const scale = 0.65 + spotlightP * 0.3;
        const width = baseWidth * scale;
        const height = width * (spotlight.naturalHeight / spotlight.naturalWidth || 1.1);
        const x = state.cx - width / 2;
        const y = state.cy + state.bob - height / 2;
        ctx.save();
        ctx.globalAlpha = 0.70;
        ctx.drawImage(spotlight, x, y, width, height);
        ctx.restore();
      }
      const wrapperP = ease(map(state.progress, 0, 0.2));
      drawWrapperBack(wrapperP);
      const stemP = ease(map(state.progress, 0.1, 0.4));
      drawStems(stemP);
      [0, 1, 2].forEach((z) => {
        ROSES.filter((rose) => rose.z === z).forEach((rose, index) => {
          const delay = z * 0.04 + index * 0.015;
          const roseP = easeOut(map(state.progress, 0.25 + delay, 0.6 + delay));
          drawRose(rose.x, rose.y, roseP);
        });
      });
      drawWrapperFront(wrapperP);
      const bowP = ease(map(state.progress, 0.55, 0.8));
      drawBow(bowP);
    };

    const animate = (time) => {
      if (state.startTime === null) {
        state.startTime = time;
      }
      const t = time - state.startTime;
      state.bob = Math.sin(t * 0.002) * (10 * state.sc);
      if (state.blooming && state.progress < 1) {
        state.progress = Math.min(1, state.progress + 0.004);
      }
      draw();

      if (state.progress >= 1 && !completeRef.current) {
        completeRef.current = true;
        state.blooming = false;
        setIsComplete(true);
      }

      rafRef.current = window.requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    rafRef.current = window.requestAnimationFrame(animate);

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      wrapperPatternRef.current = null;
      bowImageRef.current = null;
      spotlightImageRef.current = null;
    };
  }, [open, onClose]);

  if (!open) return null;

  const primary = theme?.primary || '#e91e63';
  const buttonText = theme?.buttonText || '#fff';

  return createPortal(
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-rose-100/80 backdrop-blur-sm" />
      <canvas ref={canvasRef} className="absolute inset-0 block" aria-hidden="true" />
      <div className="pointer-events-none relative z-10 flex h-full w-full items-center justify-center">
        <div className="pointer-events-auto absolute right-6 top-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/60 bg-white/80 px-4 py-2 text-xs font-semibold shadow-sm transition hover:bg-white"
          >
            Close
          </button>
        </div>
        <div className="pointer-events-auto absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3">
          {isComplete ? (
            <button
              type="button"
              onClick={onNext}
              className="rounded-full px-8 py-2.5 text-sm font-semibold shadow-lg transition duration-200 hover:-translate-y-0.5 active:translate-y-0 sm:text-base"
              style={{ backgroundColor: primary, color: buttonText }}
            >
              Plan our date
            </button>
          ) : null}
        </div>
      </div>
    </div>,
    document.body
  );
}
