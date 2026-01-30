import { useMemo } from 'react';

const heartPath =
  'M23.6,0c-2.9,0-5.4,1.4-7.6,4.1C13.8,1.4,11.3,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,16,21.2,16,21.2s16-11.8,16-21.2C32,3.8,28.2,0,23.6,0z';

export default function FloatingHearts({ color = '#ff7ab6' }) {
  const hearts = useMemo(() => {
    return Array.from({ length: 18 }, (_, index) => ({
      id: index,
      left: Math.random() * 100,
      size: 12 + Math.random() * 18,
      duration: 12 + Math.random() * 12,
      delay: Math.random() * -16,
      opacity: 0.35 + Math.random() * 0.5,
    }));
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute bottom-[-10vh] animate-float"
          style={{
            left: `${heart.left}%`,
            width: `${heart.size}px`,
            height: `${heart.size}px`,
            opacity: heart.opacity,
            '--float-dur': `${heart.duration}s`,
            animationDelay: `${heart.delay}s`,
          }}
        >
          <svg viewBox="0 0 32 29.6" fill={color} aria-hidden="true">
            <path d={heartPath} />
          </svg>
        </div>
      ))}
    </div>
  );
}
