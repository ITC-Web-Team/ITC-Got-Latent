"use client";

interface ClubSliderProps {
  name: string;
  value: number;
  onChange: (value: number) => void;
  touched: boolean;
}

export default function ClubSlider({ name, value, onChange, touched }: ClubSliderProps) {
  return (
    <div className="rounded-2xl border border-[#e2d3b4] bg-[#fbf6ea] p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-semibold text-[#3d3427]">{name}</span>
        <span
          className={`min-w-[3.5rem] rounded-full px-3 py-1 text-center text-sm font-bold tabular-nums ${
            touched
              ? "bg-[#3d3427] text-[#f7f0e1]"
              : "bg-[#e2d3b4] text-[#7a6a54]"
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
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#e2d3b4] accent-[#3d3427]"
        aria-label={`Rate ${name} from 0 to 10`}
      />
      <div className="mt-1 flex justify-between text-xs text-[#9a8a70]">
        <span>0.0</span>
        <span>10.0</span>
      </div>
    </div>
  );
}
