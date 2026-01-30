import { useState } from 'react';
import { Heart } from 'lucide-react';

export default function LetterPage({ toName, fromName, theme, onNext }) {
  const [stage, setStage] = useState('closed');
  const [showRibbon, setShowRibbon] = useState(true);
  const [hasOpened, setHasOpened] = useState(false);
  const isOpen = stage === 'open';

  const handleMouseEnter = () => {
    if (!isOpen) setStage('peek');
  };

  const handleMouseLeave = () => {
    if (!isOpen) setStage('closed');
  };

  const handleClick = () => {
    if (hasOpened) return;
    setStage('open');
    setHasOpened(true);
    window.setTimeout(() => {
      onNext?.();
    }, 900);
  };

  const letterTranslate = stage === 'open' ? '-55%' : stage === 'peek' ? '-10%' : '35%';
  const letterTransform = `translate(-50%, ${letterTranslate}) translateZ(0)`;

  const flapTransform = stage === 'closed' ? 'rotateX(0deg)' : 'rotateX(-150deg)';
  const letterOpacity = stage === 'closed' ? 0 : 1;
  const letterDelay = stage === 'peek' ? '120ms' : '0ms';
  const stickerScale = stage === 'closed' ? 1 : 0;
  const stickerOpacity = stage === 'closed' ? 1 : 0;
  const ribbonScale = stage === 'closed' ? 1 : 0.85;
  const ribbonOpacity = stage === 'closed' ? 1 : 0;

  const insideTextureSrc = '/envelope-inside-texture.png';
  const flapTextureSrc = '/envelope-top-texture.png';
  const bottomTextureSrc = '/envelope-bottom-texture.png';
  const sealSrc = `${import.meta.env.BASE_URL}envelope-heart.png`;
  const ribbonSrc = `${import.meta.env.BASE_URL}ribbon.png`;

  const baseTexture = {
    backgroundColor: theme?.secondary,
    backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.45), rgba(255,255,255,0) 45%), url("${insideTextureSrc}")`,
    backgroundSize: '100% 100%, cover',
    backgroundRepeat: 'no-repeat, no-repeat',
    backgroundBlendMode: 'soft-light, multiply',
    boxShadow:
      '0 26px 40px rgba(0,0,0,0.16), 0 10px 18px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.5)',
  };

  const flapTexture = {
    backgroundColor: theme?.primary,
    backgroundImage: `linear-gradient(165deg, rgba(255,255,255,0.3), rgba(0,0,0,0.16)), radial-gradient(circle at 75% 30%, rgba(255,255,255,0.55), rgba(255,255,255,0) 55%), linear-gradient(110deg, rgba(255,255,255,0.2), rgba(255,255,255,0) 55%), url("${flapTextureSrc}")`,
    backgroundSize: '100% 100%, 46% 70%, 100% 100%, cover',
    backgroundRepeat: 'no-repeat, no-repeat',
    backgroundBlendMode: 'screen, multiply',
  };

  const bottomTexture = {
    backgroundColor: theme?.background,
    backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.42), rgba(0,0,0,0.08)), url("${bottomTextureSrc}")`,
    backgroundSize: '100% 100%, cover',
    backgroundRepeat: 'no-repeat, no-repeat',
    backgroundBlendMode: 'soft-light, multiply',
    boxShadow: 'inset 0 10px 16px rgba(255,255,255,0.35), inset 0 -10px 14px rgba(0,0,0,0.08)',
  };

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="origin-center" style={{ transform: 'scale(1.1)' }}>
      <div
        className="envelope-3d envelope-float relative h-64 w-96 cursor-pointer outline-none focus:outline-none focus-visible:outline-none"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        style={{ willChange: 'transform' }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            handleClick();
          }
        }}
        >
        <div className="absolute inset-0 rounded-[2.5rem] shadow-xl" style={baseTexture} />
        <div
          className="pointer-events-none absolute inset-0 rounded-[2.5rem]"
          style={{
            boxShadow:
              'inset 0 2px 6px rgba(255,255,255,0.65), inset 0 -14px 18px rgba(0,0,0,0.12)',
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-2/5 rounded-r-[2.5rem]"
          style={{
            background:
              'linear-gradient(120deg, rgba(255,255,255,0.55), rgba(255,255,255,0.08) 60%)',
            opacity: 0.65,
          }}
          aria-hidden="true"
        />
        <div
          className="flap absolute left-0 top-0 z-30 h-1/2 w-full rounded-t-[2.5rem]"
          style={{
            ...flapTexture,
            transform: flapTransform,
            transition: 'transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1)',
            willChange: 'transform',
          }}
        />
        <div
          className="pointer-events-none absolute right-6 top-4 z-30 h-[60%] w-1 rounded-full"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.1))',
            opacity: 0.5,
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute right-6 top-6 z-30 h-10 w-10 rounded-full"
          style={{
            background:
              'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.85), rgba(255,255,255,0) 55%), radial-gradient(circle at 70% 70%, rgba(0,0,0,0.15), rgba(0,0,0,0) 60%), linear-gradient(135deg, rgba(255,255,255,0.45), rgba(0,0,0,0.25))',
            boxShadow:
              '0 10px 16px rgba(0,0,0,0.18), inset 0 2px 6px rgba(255,255,255,0.5), inset 0 -6px 10px rgba(0,0,0,0.22)',
            opacity: 0.55,
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 z-30 h-1/2 rounded-t-[2.5rem]"
          style={{
            boxShadow: 'inset 0 -10px 14px rgba(0,0,0,0.18)',
            opacity: 0.45,
          }}
          aria-hidden="true"
        />
        {showRibbon ? (
          <img
            src={ribbonSrc}
            alt=""
            onError={() => setShowRibbon(false)}
            className="pointer-events-none absolute left-1/2 top-[-4%] z-40 w-44 -translate-x-1/2 transition-all duration-300"
            style={{
              transform: `translateX(-50%) scale(${ribbonScale})`,
              opacity: ribbonOpacity,
            }}
          />
        ) : null}
        <div
          className="absolute left-1/2 top-1/2 z-50 h-[5.4rem] w-[5.4rem] -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
          style={{
            transform: `translate(-50%, -50%) scale(${stickerScale})`,
            opacity: stickerOpacity,
            filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.18))',
            backgroundImage: `url("${sealSrc}")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'contain',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute left-1/2 top-6 z-40 w-[88%]"
          style={{
            transform: letterTransform,
            opacity: letterOpacity,
            transitionDelay: letterDelay,
            transition: 'transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1), opacity 300ms ease-out',
            willChange: 'transform, opacity',
          }}
        >
          <div
            className="rounded-3xl border bg-white px-7 py-7 text-left shadow-lg"
            style={{ borderColor: theme?.primary }}
          >
            <p className="text-sm font-semibold" style={{ color: theme?.accent }}>
              To: {toName || 'Someone special'}
            </p>
            <p className="mt-2 text-xs text-gray-500">(Click to open your letter)</p>
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
              <Heart size={14} />
              <span>From {fromName || 'your secret admirer'}</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 z-40 h-[52%] w-full rounded-b-[2.5rem]" style={bottomTexture} />
        <div
          className="pointer-events-none absolute bottom-0 left-0 z-40 h-[52%] w-full rounded-b-[2.5rem]"
          style={{
            boxShadow: 'inset 0 8px 12px rgba(255,255,255,0.45), inset 0 -10px 16px rgba(0,0,0,0.12)',
          }}
          aria-hidden="true"
        />
        </div>
      </div>

      <p className="text-sm text-gray-600" style={{ marginTop: '25px' }}>
        Hover to peek, click to reveal.
      </p>
    </div>
  );
}
