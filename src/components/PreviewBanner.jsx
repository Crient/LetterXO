export default function PreviewBanner({ onExit }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 bg-purple-600 px-4 py-2 text-sm text-white">
      <span className="font-semibold">Preview mode is on. This is what your recipient will see.</span>
      <button
        type="button"
        onClick={onExit}
        className="rounded-full border border-white/70 px-3 py-1 text-xs uppercase tracking-wide hover:bg-white hover:text-purple-700"
      >
        Exit preview
      </button>
    </div>
  );
}
