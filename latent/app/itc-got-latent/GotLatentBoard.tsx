"use client";

import { useState, type CSSProperties } from "react";
import { Bebas_Neue, Space_Mono, Libre_Franklin } from "next/font/google";
import "./got-latent.css";

const display = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-gl-display" });
const mono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-gl-mono" });
const body = Libre_Franklin({ subsets: ["latin"] });

export interface LeaderboardEntry {
  slug: string;
  name: string;
  average: number | null;
  votes: number;
}

const CONFETTI_COUNT = 30;
const confettiPieces = Array.from({ length: CONFETTI_COUNT }, (_, i) => {
  const seed = i * 137.5;
  const angle = seed % 360;
  const dist = 140 + ((i * 57) % 110);
  const hue = (i * 73) % 360;
  return {
    rot: `${angle}deg`,
    dist: `-${dist}px`,
    x: `${Math.round(Math.sin(seed) * 100)}px`,
    delay: `${(i % 10) * 0.04}s`,
    color: `hsl(${hue}, 90%, 65%)`,
  };
});

export default function GotLatentBoard({ entries }: { entries: LeaderboardEntry[] }) {
  const [champion, ...rest] = entries;
  
  // State for the interactive judge buzzers!
  const [buzzers, setBuzzers] = useState<boolean[]>([true, false, false, true]);
  // State to trigger a dramatic screen flash when the main golden buzzer is clicked
  const [flash, setFlash] = useState(false);

  const toggleBuzzer = (index: number) => {
    setBuzzers((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const triggerGoldenFlash = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 800);
  };

  return (
    <main className={`gl-stage ${body.className} min-h-screen relative overflow-hidden pb-24`}>
      {/* Dramatic Screen Flash Overlay */}
      <div 
        className={`absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-500 ${
          flash ? "opacity-90" : "opacity-0"
        }`} 
      />

      {/* Spotlights and Stage Effects */}
      <div className="gl-spotlights" />
      <div className="gl-curtain gl-curtain--left hidden lg:block" />
      <div className="gl-curtain gl-curtain--right hidden lg:block" />

      {/* Stage Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#000000_90%)] pointer-events-none z-1" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-12 sm:px-8">
        
        {/* Header */}
        <header className="text-center relative">
          <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-amber-400">
            Technical Councils &middot; Got Latent Leaderboard
          </p>
          <h1
            className={`gl-marquee-title mt-2 text-6xl sm:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 font-extrabold ${display.variable} ${display.className}`}
          >
            ITC GOT LATENT
          </h1>
          
          {/* Signage Bulbs */}
          <div className="gl-bulbs mt-4">
            {Array.from({ length: 11 }).map((_, i) => (
              <span key={i} className="gl-bulb" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </header>

        {/* 4 Interactive Judge Buzzer X Panels (Vibe of the Show!) */}
        <section className="mt-8 mb-12 flex justify-center gap-3 sm:gap-6">
          {buzzers.map((isBuzzed, idx) => (
            <button
              key={idx}
              onClick={() => toggleBuzzer(idx)}
              className={`relative flex h-14 w-14 sm:h-20 sm:w-20 items-center justify-center rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                isBuzzed
                  ? "bg-red-950/80 border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.5),inset_0_0_15px_rgba(239,68,68,0.3)]"
                  : "bg-slate-950/90 border-slate-800 hover:border-slate-700"
              }`}
              aria-label={`Judge Buzzer ${idx + 1}`}
            >
              {/* Outer glowing X */}
              <span 
                className={`text-2xl sm:text-4xl font-black font-mono transition-all duration-300 ${
                  isBuzzed 
                    ? "text-red-500 text-glow-red scale-110" 
                    : "text-slate-800"
                }`}
              >
                X
              </span>
              
              {/* Judge Labels */}
              <span className="absolute bottom-1 text-[8px] sm:text-[9px] uppercase tracking-wider text-slate-500 font-semibold font-mono">
                J-{idx + 1}
              </span>
            </button>
          ))}
        </section>

        {entries.length === 0 && (
          <p className="mt-20 text-center text-sm uppercase tracking-[0.3em] text-slate-500">
            Curtain&apos;s up, but no votes have been saved yet.
          </p>
        )}

        {/* Golden Buzzer / Top Ranked Club */}
        {champion && (
          <section className="relative mt-8 flex flex-col items-center">
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-amber-400 bg-amber-400/10 border border-amber-500/20 px-3 py-1 rounded-full text-glow-amber">
              👑 Current Champion
            </span>

            {/* Glowing Golden Buzzer Structure */}
            <div 
              onClick={triggerGoldenFlash}
              className="group relative mt-6 flex h-60 w-60 items-center justify-center rounded-full cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95"
            >
              {/* Confetti Explosion (deterministic placement) */}
              {champion.average !== null &&
                confettiPieces.map((c, i) => (
                  <span
                    key={i}
                    className="gl-confetti-piece"
                    style={
                      {
                        "--gl-rot": c.rot,
                        "--gl-dist": c.dist,
                        "--gl-x": c.x,
                        "--gl-delay": c.delay,
                        background: c.color,
                      } as CSSProperties
                    }
                  />
                ))}

              {/* Glowing Aura Rings */}
              <div className="absolute inset-0 rounded-full bg-amber-500/10 blur-xl animate-pulse-glow" />
              
              {/* Golden Outer Conic Rim */}
              <div className="gl-buzzer-ring flex h-52 w-52 items-center justify-center rounded-full p-2.5 shadow-[0_0_50px_rgba(245,158,11,0.3)]">
                {/* Metallic Inner Button Face */}
                <div className="gl-buzzer-inner flex h-full w-full flex-col items-center justify-center rounded-full text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
                  <span className={`${mono.variable} ${mono.className} text-6xl font-black text-amber-950 font-mono`}>
                    {champion.average !== null ? champion.average.toFixed(1) : "—"}
                  </span>
                  <span className="mt-1 px-4 text-xs font-bold uppercase tracking-wider text-amber-900 line-clamp-1">
                    {champion.name}
                  </span>
                </div>
              </div>
            </div>
            
            <p className="mt-3 text-xs text-slate-400 font-mono">
              Score computed from {champion.votes} explicit {champion.votes === 1 ? "voter" : "voters"}
            </p>
          </section>
        )}

        {/* Leaderboard Table Grid */}
        <section className="mt-16 space-y-4">
          <div className="flex justify-between items-center px-4 text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">
            <span>Rank & Club</span>
            <div className="flex items-center gap-12 sm:gap-24">
              <span className="hidden sm:inline">Rating Bar</span>
              <span>Average Rating</span>
            </div>
          </div>

          <div className="space-y-3">
            {rest.map((entry, i) => {
              const rank = i + 2;
              const hasRating = entry.average !== null;
              const avgPercent = hasRating ? (entry.average! / 10) * 100 : 0;
              
              // Top ranks gets highlighted medals/styles
              let rankStyle = "text-slate-400";
              let cardBorder = "border-slate-900 bg-slate-950/40";
              let scoreColor = "text-slate-300";
              
              if (rank === 2) {
                rankStyle = "text-slate-300 font-extrabold";
                cardBorder = "border-slate-800 bg-slate-950/60 shadow-[0_2px_15px_rgba(200,200,200,0.02)]";
                scoreColor = "text-slate-200";
              } else if (rank === 3) {
                rankStyle = "text-amber-700/80 font-extrabold";
                cardBorder = "border-slate-900 bg-slate-950/50";
                scoreColor = "text-slate-300";
              }

              return (
                <div
                  key={entry.slug}
                  className={`gl-row flex items-center justify-between gap-4 rounded-2xl border px-5 py-4 backdrop-blur-md transition-all hover:border-slate-800 ${cardBorder}`}
                  style={{ "--gl-row-delay": `${i * 0.05}s` } as CSSProperties}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Rank indicator */}
                    <span
                      className={`${mono.variable} ${mono.className} w-6 shrink-0 text-sm font-bold font-mono ${rankStyle}`}
                    >
                      #{String(rank).padStart(2, "0")}
                    </span>
                    <span className="truncate font-semibold text-slate-200 text-sm sm:text-base">{entry.name}</span>
                  </div>

                  <div className="flex items-center gap-6 sm:gap-16 shrink-0">
                    {/* Inline Voting Score Line (Aesthetic visual meter!) */}
                    <div className="hidden sm:flex items-center gap-2 w-32 md:w-44">
                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-900/60">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
                          style={{ width: `${avgPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Numeric Score */}
                    <span
                      className={`gl-score w-12 text-right text-lg font-bold font-mono tabular-nums ${scoreColor} ${
                        hasRating ? "text-amber-400 font-extrabold" : ""
                      }`}
                    >
                      {hasRating ? entry.average!.toFixed(1) : "—"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 text-center text-[10px] uppercase tracking-widest text-slate-600 font-mono">
          Direct Access Only &middot; ITC Got Latent Analytics &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </main>
  );
}
