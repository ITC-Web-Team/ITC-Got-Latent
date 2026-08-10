import type { CSSProperties } from "react";
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

const CONFETTI_COUNT = 26;
// Deterministic "randomness" (no Math.random) so server and client markup match.
const confettiPieces = Array.from({ length: CONFETTI_COUNT }, (_, i) => {
  const seed = i * 137.5;
  const angle = seed % 360;
  const dist = 120 + ((i * 53) % 90);
  const hue = (i * 61) % 360;
  return {
    rot: `${angle}deg`,
    dist: `-${dist}px`,
    x: `${Math.round(Math.sin(seed) * 80)}px`,
    delay: `${(i % 8) * 0.05}s`,
    color: `hsl(${hue}, 85%, 60%)`,
  };
});

function ScoreStars({ average }: { average: number | null }) {
  if (average === null) return null;
  const filled = Math.round(average / 2);
  return (
    <span aria-hidden className="text-[#ffd76a]">
      {"★".repeat(filled)}
      <span className="text-[#5a4a2a]">{"★".repeat(5 - filled)}</span>
    </span>
  );
}

export default function GotLatentBoard({ entries }: { entries: LeaderboardEntry[] }) {
  const [champion, ...rest] = entries;

  return (
    <main className={`gl-stage ${body.className}`}>
      <div className="gl-spotlights" />
      <div className="gl-curtain gl-curtain--left" />
      <div className="gl-curtain gl-curtain--right" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-16 sm:px-12">
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.5em] text-[#d4af37]">
            Season 2026 &middot; Live Rankings
          </p>
          <h1
            className={`gl-marquee-title mt-3 text-6xl text-[#ffe9a8] sm:text-7xl ${display.variable} ${display.className}`}
          >
            ITC GOT Latent
          </h1>
          <div className="gl-bulbs mt-5">
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} className="gl-bulb" style={{ animationDelay: `${i * 0.12}s` }} />
            ))}
          </div>
        </header>

        {champion && (
          <section className="relative mt-14 flex flex-col items-center">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#ffd76a]">
              Golden Buzzer
            </p>

            <div className="relative mt-4 flex h-56 w-56 items-center justify-center rounded-full">
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
              <div className="gl-buzzer-ring flex h-56 w-56 items-center justify-center rounded-full p-3">
                <div className="gl-buzzer-inner flex h-full w-full flex-col items-center justify-center rounded-full text-center">
                  <span className={`${mono.variable} ${mono.className} text-5xl font-bold text-[#3a2a05]`}>
                    {champion.average !== null ? champion.average.toFixed(1) : "—"}
                  </span>
                  <span className="mt-1 px-4 text-sm font-semibold uppercase tracking-wide text-[#5a3f0a]">
                    {champion.name}
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs text-[#c9b58a]">
              {champion.votes} {champion.votes === 1 ? "vote" : "votes"}
            </p>
          </section>
        )}

        <section className="mt-16 space-y-3">
          {rest.map((entry, i) => (
            <div
              key={entry.slug}
              className="gl-row flex items-center gap-4 rounded-xl border border-[#3a1420] bg-[#1a0a10]/70 px-5 py-4 backdrop-blur-sm"
              style={{ "--gl-row-delay": `${i * 0.06}s` } as CSSProperties}
            >
              <span
                className={`${mono.variable} ${mono.className} w-8 shrink-0 text-lg text-[#8a6a3a]`}
              >
                {String(i + 2).padStart(2, "0")}
              </span>
              <span className="flex-1 truncate font-semibold text-[#f5e6c8]">{entry.name}</span>
              <ScoreStars average={entry.average} />
              <span
                className={`gl-score w-16 shrink-0 text-right text-xl font-bold text-[#ffd76a] ${mono.variable}`}
              >
                {entry.average !== null ? entry.average.toFixed(1) : "—"}
              </span>
            </div>
          ))}
        </section>

        <footer className="mt-16 text-center text-xs uppercase tracking-[0.3em] text-[#6a5236]">
          Not on the menu &middot; direct link only
        </footer>
      </div>
    </main>
  );
}
