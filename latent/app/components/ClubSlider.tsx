"use client";

import type { SaveStatus } from "./RatingForm";

interface ClubSliderProps {
  name: string;
  value: number;
  status: SaveStatus;
  errorMessage?: string;
  onChange: (value: number) => void;
  onSave: () => void;
}

// Maps club names to descriptive 2-letter badges and custom styles
const CLUB_META: Record<string, { badge: string; desc: string }> = {
  "Krittika": { badge: "KT", desc: "Astronomy Club" },
  "Aeromodeling": { badge: "AE", desc: "Aero & Flight Club" },
  "WnCC": { badge: "WC", desc: "Web & Coding Club" },
  "Tinkerers Lab": { badge: "TL", desc: "Makerspace & Prototyping" },
  "Quant Club": { badge: "QC", desc: "Finance & Quantitative Analysis" },
  "CSeC Club": { badge: "CS", desc: "Cybersecurity Club" },
  "Biox": { badge: "BX", desc: "Biology & Bio-engineering" },
  "Energy and Sustainability Club": { badge: "ES", desc: "Clean Tech & Climate" },
  "Math and Physics Club": { badge: "MP", desc: "Theoretical Science" },
  "Electronics and Robotics Club": { badge: "ER", desc: "Robotics & Hardware" },
  "Chemistry Club & ChemE TL": { badge: "CH", desc: "Chemical Science & Engineering Lab" },
  "Web Team": { badge: "WT", desc: "ITC Digital Infrastructure" },
  "Design Team": { badge: "DT", desc: "Creative & UI/UX Design" },
  "Media Team": { badge: "MT", desc: "Videography & PR Outreach" },
};

export default function ClubSlider({
  name,
  value,
  status,
  errorMessage,
  onChange,
  onSave,
}: ClubSliderProps) {
  const meta = CLUB_META[name] || { badge: name.substring(0, 2).toUpperCase(), desc: "Technical Club" };

  // Determine descriptive label and colors for the rating scale
  let ratingLabel = "Average";
  let ratingColorClass = "text-amber-400 bg-amber-500/10 border-amber-500/20";
  let barColor = "bg-amber-500";
  
  if (value === 0) {
    ratingLabel = "Absolute Zero";
    ratingColorClass = "text-rose-500 bg-rose-500/10 border-rose-500/20";
    barColor = "bg-rose-600";
  } else if (value < 2.5) {
    ratingLabel = "Terrible";
    ratingColorClass = "text-rose-400 bg-rose-500/10 border-rose-500/20";
    barColor = "bg-rose-500";
  } else if (value < 4.5) {
    ratingLabel = "Disappointing";
    ratingColorClass = "text-orange-400 bg-orange-500/10 border-orange-500/20";
    barColor = "bg-orange-500";
  } else if (value <= 5.5) {
    ratingLabel = "Average";
    ratingColorClass = "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
    barColor = "bg-yellow-500";
  } else if (value < 7.0) {
    ratingLabel = "Decent";
    ratingColorClass = "text-sky-400 bg-sky-500/10 border-sky-500/20";
    barColor = "bg-sky-500";
  } else if (value < 8.5) {
    ratingLabel = "Strong";
    ratingColorClass = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    barColor = "bg-emerald-500";
  } else if (value < 9.5) {
    ratingLabel = "Outstanding";
    ratingColorClass = "text-purple-400 bg-purple-500/10 border-purple-500/20";
    barColor = "bg-purple-500";
  } else {
    ratingLabel = "God Tier";
    ratingColorClass = "text-amber-400 bg-amber-400/20 border-amber-400/40 text-glow-amber";
    barColor = "bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500";
  }

  const handleDecrement = () => {
    const newValue = Math.max(0, Math.round((value - 0.5) * 10) / 10);
    onChange(newValue);
  };

  const handleIncrement = () => {
    const newValue = Math.min(10, Math.round((value + 0.5) * 10) / 10);
    onChange(newValue);
  };

  return (
    <div
      className={`relative group rounded-2xl border p-5 transition-all duration-300 ${
        status === "saved"
          ? "border-amber-500/40 bg-slate-900/60 shadow-[0_4px_20px_rgba(245,158,11,0.06)]"
          : "border-slate-800/80 bg-slate-950/40 hover:border-slate-700/80 hover:bg-slate-900/40"
      } backdrop-blur-md`}
    >
      {/* Decorative top-right dot for saved states */}
      {status === "saved" && (
        <span className="absolute top-3 right-3 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
      )}

      {/* Card Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-sm font-bold tracking-wider text-slate-300">
            {meta.badge}
          </div>
          <div>
            <h3 className="font-semibold text-slate-200 group-hover:text-white transition-colors">
              {name}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-1">{meta.desc}</p>
          </div>
        </div>

        {/* Rating Value Bubble */}
        <div className="flex flex-col items-end gap-1">
          <span
            className={`px-2.5 py-1 text-base font-extrabold rounded-lg border font-mono tabular-nums transition-all ${ratingColorClass}`}
          >
            {value.toFixed(1)}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            {ratingLabel}
          </span>
        </div>
      </div>

      {/* Rating Slider Controls */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          {/* Minus button for precision control */}
          <button
            onClick={handleDecrement}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-colors text-sm focus:outline-none"
            aria-label="Decrease score by 0.1"
          >
            −
          </button>

          {/* Core Slider */}
          <div className="relative flex-1 flex items-center h-6">
            <input
              type="range"
              min={0}
              max={10}
              step={0.1}
              value={value}
              onChange={(e) => onChange(Math.round(Number(e.target.value) * 10) / 10)}
              className="premium-slider w-full"
              aria-label={`Rate ${name} from 0 to 10`}
            />
          </div>

          {/* Plus button for precision control */}
          <button
            onClick={handleIncrement}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-colors text-sm focus:outline-none"
            aria-label="Increase score by 0.1"
          >
            +
          </button>
        </div>

        {/* Range Labels */}
        <div className="flex justify-between px-1 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
          <span>0.0</span>
          <span>5.0</span>
          <span>10.0</span>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between gap-3">
        <button
          onClick={onSave}
          disabled={status === "saving"}
          className={`w-full py-2 px-4 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer focus:outline-none ${
            status === "saved"
              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20"
              : status === "saving"
              ? "bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed"
              : "bg-slate-200 text-slate-950 hover:bg-white hover:shadow-[0_0_15px_rgba(255,255,255,0.15)]"
          }`}
        >
          {status === "saving" ? (
            <>
              <svg className="animate-spin h-3 w-3 text-slate-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving Draft...
            </>
          ) : status === "saved" ? (
            <>
              <svg className="h-3 w-3 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Rating Saved
            </>
          ) : (
            "Save Rating"
          )}
        </button>

        {status === "error" && errorMessage && (
          <span className="absolute bottom-2 left-5 right-5 text-[10px] text-red-400 truncate bg-slate-950/80 px-2 py-0.5 rounded text-center border border-red-950/40">
            {errorMessage}
          </span>
        )}
      </div>
    </div>
  );
}
