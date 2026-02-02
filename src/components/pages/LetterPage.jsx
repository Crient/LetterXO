import { useEffect, useRef, useState } from 'react';
import { Heart } from 'lucide-react';

export default function LetterPage({ toName, fromName, theme, onFlyOut }) {
  const [stage, setStage] = useState('closed');
  const [showRibbon, setShowRibbon] = useState(true);
  const [hasOpened, setHasOpened] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const letterRef = useRef(null);
  const flyTimeout = useRef(null);
  const isOpen = stage === 'open';

  const handleMouseEnter = () => {
    if (!isOpen && !hasOpened) setStage('peek');
  };

  const handleMouseLeave = () => {
    if (!isOpen && !hasOpened) setStage('closed');
  };

  const handleClick = () => {
    if (hasOpened) return;
    setStage('open');
    setHasOpened(true);
    const pullDuration = 520;
    const flyDuration = 920;
    flyTimeout.current = window.setTimeout(() => {
      const rect = letterRef.current?.getBoundingClientRect();
      setIsFlying(true);
      onFlyOut?.({
        rect: rect
          ? {
              left: rect.left,
              top: rect.top,
              width: rect.width,
              height: rect.height,
            }
          : null,
        flyDuration,
      });
    }, pullDuration);
  };

  const letterTranslate = isFlying ? '-210%' : stage === 'open' ? '-85%' : stage === 'peek' ? '-20%' : '35%';
  const letterTransform = `translate(-50%, ${letterTranslate}) translateZ(0)`;
  const letterClip =
    stage === 'open' || isFlying ? 'inset(0 0 0 0)' : stage === 'peek' ? 'inset(0 0 30% 0)' : 'inset(0 0 40% 0)';

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
    backgroundImage: `url("${insideTextureSrc}")`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
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

  useEffect(() => {
    return () => {
      if (flyTimeout.current) window.clearTimeout(flyTimeout.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 text-center"
    style={{marginTop: "32px"}}>
      <div className="origin-center scale-100 sm:scale-110">
      <div
        className={`envelope-3d relative h-56 w-[88vw] max-w-sm cursor-pointer outline-none focus:outline-none focus-visible:outline-none sm:h-64 sm:w-96 ${isFlying ? 'envelope-tilt' : 'envelope-float'}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        style={{
          willChange: 'transform',
          transition: isFlying ? 'transform 260ms ease' : 'none',
        }}
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
        {/* Specular highlight removed */}
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
          className="absolute left-1/2 top-6 z-40 w-[94%]"
          style={{
            transform: letterTransform,
            opacity: letterOpacity,
            transitionDelay: letterDelay,
            clipPath: letterClip,
            transition: isFlying
              ? 'transform 620ms cubic-bezier(0.16, 0.84, 0.3, 1), opacity 240ms ease-out'
              : 'transform 750ms cubic-bezier(0.16, 0.8, 0.35, 1), opacity 280ms ease-out, clip-path 520ms ease',
            willChange: 'transform, opacity',
          }}
        >
          <div
            ref={letterRef}
            className="min-h-[18rem] px-6 py-8 text-left sm:min-h-[20rem] sm:px-12 sm:py-10"
            style={{
              backgroundImage: 'url("/envelope_paper.png")',
              backgroundSize: '100% 100%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <p className="text-sm font-semibold" style={{ paddingTop: '2.5rem',paddingLeft:"10px", color: theme?.accent }}>
              To: {toName || 'Someone special'}
            </p>
            <p className="mt-2 text-xs text-gray-500"
            style={{paddingLeft:"10px"}}>(Click to open your letter)</p>
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400"
            style={{paddingLeft:"10px"}}>
              <Heart size={12} />
              <span style={{paddingLeft:"-5px"}}>From {fromName || 'your secret admirer'}</span>
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

      <p className="text-sm text-white-600" style={{ marginTop: '25px' }}>
        Hover to peek inside.
      </p>
    </div>
  );
}
