export default function LetterBackground({
  children,
  theme,
  page = 0,
  total = 0,
  onDotClick,
}) {
  return (
    <div
      className="torn-edge relative w-full max-w-2xl rounded-2xl px-8 py-10 shadow-2xl"
      style={{ backgroundColor: theme?.secondary || '#fff', color: theme?.accent || '#2d1b24' }}
    >
      <div className="space-y-6">{children}</div>
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
