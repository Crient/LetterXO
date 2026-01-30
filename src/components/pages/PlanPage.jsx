import { MapPin, Utensils } from 'lucide-react';
import LetterBackground from '../LetterBackground.jsx';

const foodOptions = ['Pizza', 'Sushi', 'Tacos', 'Dessert', 'Surprise me'];

export default function PlanPage({ theme, plan, setPlan, onNext, pageIndex, total, onDotClick }) {
  return (
    <LetterBackground theme={theme} page={pageIndex} total={total} onDotClick={onDotClick}>
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="font-cursive text-4xl" style={{ color: theme?.accent }}>
            Let us plan something sweet
          </h2>
          <p className="mt-2 text-sm text-gray-600">Pick the perfect vibe for the date.</p>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold" style={{ color: theme?.accent }}>
            <Utensils size={16} />
            <span>Food choice</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {foodOptions.map((option) => {
              const isActive = plan.food === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setPlan({ ...plan, food: option })}
                  className="rounded-full px-4 py-2 text-xs font-semibold transition"
                  style={{
                    backgroundColor: isActive ? theme?.primary : 'rgba(255,255,255,0.6)',
                    color: isActive ? theme?.buttonText : theme?.accent,
                    border: `1px solid ${theme?.primary}`,
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold" style={{ color: theme?.accent }}>
            <MapPin size={16} />
            <span>Where should we meet?</span>
          </div>
          <input
            type="text"
            value={plan.location}
            onChange={(event) => setPlan({ ...plan, location: event.target.value })}
            placeholder="Cafe, park, or your favorite place"
            className="w-full rounded-2xl border px-4 py-3 text-sm shadow-sm outline-none"
            style={{ borderColor: theme?.primary }}
          />
        </div>

        <button
          type="button"
          onClick={onNext}
          className="w-full rounded-full px-6 py-3 text-sm font-semibold shadow-md transition"
          style={{ backgroundColor: theme?.primary, color: theme?.buttonText }}
        >
          Save the plan
        </button>
      </div>
    </LetterBackground>
  );
}
