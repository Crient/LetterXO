export default function LetterBackground({
  children,
  theme,
  page = 0,
  total = 0,
  onDotClick,
  frameWidth,
}) {
  return (
    <div
      className="torn-edge torn-paper-shadow relative mx-auto w-full max-w-[50rem] rounded-2xl px-8 py-8 min-h-[30rem]"
      style={{
        backgroundColor: 'transparent',
        backgroundImage: 'url("/envelope_paper.png")',
        backgroundSize: '200% 200%',
        backgroundPosition: '50% 50%',
        backgroundRepeat: 'no-repeat',
        width: frameWidth,
        color: theme?.accent || '#2d1b24',
        boxShadow:
          '0 38px 80px rgba(0, 0, 0, 0.22), 0 18px 36px rgba(0, 0, 0, 0.16), 0 6px 12px rgba(0, 0, 0, 0.12), inset 0 2px 4px rgba(255,255,255,0.55), inset 0 -12px 20px rgba(0,0,0,0.1)',
        filter: 'drop-shadow(0 22px 40px rgba(0,0,0,0.22)) drop-shadow(0 6px 14px rgba(0,0,0,0.14))',
      }}
    >
      <div className="relative z-10 space-y-6">{children}</div>
      {total > 0 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {Array.from({ length: total }).map((_, index) => (
            <button
              key={index}
              type="button"
              className="h-2.5 w-2.5 rounded-full transition"
              style={{
                backgroundColor:
                  index === page ? theme?.primary || '#e46a6a' : 'rgba(0, 0, 0, 0.2)',
              }}
              onClick={() => onDotClick?.(index)}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
