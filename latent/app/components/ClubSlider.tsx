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

export default function ClubSlider({
  name,
  value,
  status,
  errorMessage,
  onChange,
  onSave,
}: ClubSliderProps) {
  return (
    <div
      className={`rounded-lg border p-5 transition-colors ${
        status === "saved" ? "border-[#ffb454]/40 bg-[#10161d]" : "border-[#1f2a37] bg-[#10161d]"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="font-medium text-[#e7edf3]">{name}</span>
        <span
          className={`min-w-[3.5rem] rounded-md px-3 py-1 text-center text-sm font-bold tabular-nums ${
            status === "saved" ? "bg-[#ffb454] text-[#1a1206]" : "bg-[#1f2a37] text-[#7c8a99]"
          }`}
        >
          {value.toFixed(1)}
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={10}
        step={0.1}
        value={value}
        onChange={(e) => onChange(Math.round(Number(e.target.value) * 10) / 10)}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#1f2a37] accent-[#ffb454]"
        aria-label={`Rate ${name} from 0 to 10`}
      />
      <div className="mt-1 flex justify-between text-xs text-[#5c6773]">
        <span>0.0</span>
        <span>10.0</span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <button
          onClick={onSave}
          disabled={status === "saving"}
          className="rounded-md bg-[#ffb454] px-4 py-1.5 text-sm font-semibold text-[#1a1206] transition-colors hover:bg-[#ffc476] disabled:cursor-not-allowed disabled:bg-[#1f2a37] disabled:text-[#5c6773]"
        >
          {status === "saving" ? "Saving…" : status === "saved" ? "Saved ✓" : "Save"}
        </button>
        {status === "error" && errorMessage && (
          <span className="truncate text-xs text-red-300">{errorMessage}</span>
        )}
      </div>
    </div>
  );
}
