"use client";

import { useState, useMemo } from "react";
import ClubSlider from "./ClubSlider";
import type { ClubDef } from "@/lib/clubs";

interface RatingFormProps {
  clubs: ClubDef[];
  userName: string;
  initialValues: Record<string, number>;
  initiallySavedSlugs?: string[];
}

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export default function RatingForm({
  clubs,
  userName,
  initialValues,
  initiallySavedSlugs = [],
}: RatingFormProps) {
  const [values, setValues] = useState<Record<string, number>>(initialValues);
  const [saveStatus, setSaveStatus] = useState<Record<string, SaveStatus>>(() =>
    Object.fromEntries(
      clubs.map((c) => [c.slug, initiallySavedSlugs.includes(c.slug) ? "saved" : "idle" as SaveStatus])
    )
  );
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});
  
  // Filter state: "all" | "saved" | "pending"
  const [filter, setFilter] = useState<"all" | "saved" | "pending">("all");
  // Search query
  const [searchQuery, setSearchQuery] = useState("");

  function handleChange(slug: string, value: number) {
    setValues((prev) => ({ ...prev, [slug]: value }));
    // Moving the slider again after a save resets to idle
    setSaveStatus((prev) => (prev[slug] === "saved" ? { ...prev, [slug]: "idle" } : prev));
  }

  async function handleSave(slug: string) {
    setSaveStatus((prev) => ({ ...prev, [slug]: "saving" }));
    setErrorMessages((prev) => ({ ...prev, [slug]: "" }));

    try {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, score: values[slug] }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Request failed with status ${res.status}`);
      }

      setSaveStatus((prev) => ({ ...prev, [slug]: "saved" }));
    } catch (err) {
      setSaveStatus((prev) => ({ ...prev, [slug]: "error" }));
      setErrorMessages((prev) => ({
        ...prev,
        [slug]: err instanceof Error ? err.message : "Something went wrong.",
      }));
    }
  }

  // Calculate live statistics
  const stats = useMemo(() => {
    const savedCount = Object.values(saveStatus).filter((s) => s === "saved").length;
    
    // Calculate stats based on explicit user saves
    const savedEntries = Object.entries(saveStatus)
      .filter(([_, status]) => status === "saved")
      .map(([slug, _]) => values[slug]);
      
    const average = savedEntries.length > 0
      ? Math.round((savedEntries.reduce((a, b) => a + b, 0) / savedEntries.length) * 10) / 10
      : 0;

    const highest = savedEntries.length > 0 ? Math.max(...savedEntries) : 0;
    const lowest = savedEntries.length > 0 ? Math.min(...savedEntries) : 0;

    return {
      savedCount,
      average,
      highest,
      lowest,
      percentComplete: Math.round((savedCount / clubs.length) * 100),
    };
  }, [saveStatus, values, clubs.length]);

  // Filter clubs based on active filters and search
  const filteredClubs = useMemo(() => {
    return clubs.filter((club) => {
      const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase());
      const status = saveStatus[club.slug];
      
      if (!matchesSearch) return false;
      if (filter === "saved") return status === "saved";
      if (filter === "pending") return status !== "saved";
      return true;
    });
  }, [clubs, saveStatus, filter, searchQuery]);

  return (
    <div className="mx-auto max-w-6xl w-full">
      {/* Premium Top Navigation Bar */}
      <header className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-900">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-black text-lg shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            L
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              ITC GOT Latent <span className="text-[10px] uppercase bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20">Voter Panel</span>
            </h2>
            <p className="text-xs text-slate-500">Logged in as {userName}</p>
          </div>
        </div>

        {/* Global completion bar */}
        <div className="flex items-center gap-4 bg-slate-950/60 border border-slate-900 rounded-2xl px-5 py-2.5 backdrop-blur-md">
          <div className="text-right">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Your Progress</p>
            <p className="text-sm font-black text-slate-200 tabular-nums">{stats.savedCount} / {clubs.length} Clubs Saved</p>
          </div>
          <div className="relative w-28 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500 rounded-full"
              style={{ width: `${stats.percentComplete}%` }}
            />
          </div>
          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
            {stats.percentComplete}%
          </span>
        </div>
      </header>

      {/* Welcome & Instruction Hero */}
      <section className="mb-10 relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/40 p-6 md:p-8 backdrop-blur-md">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-[10px] font-mono font-extrabold uppercase tracking-[0.35em] text-amber-500">
              SYS://ITC-VOTING-CONSOLE
            </span>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">
              Alright {userName}, rate the council.
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Every club is initialized at a neutral <strong className="text-slate-200">5.0</strong>. Move the precision dial for each club to your custom rating (0.0 to 10.0) and save it. Only explicitly saved clubs count towards the council leaderboard.
            </p>
          </div>
          
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-3 gap-3 shrink-0 md:w-80">
            <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-3 text-center">
              <span className="text-[9px] uppercase tracking-wider text-slate-500 block font-bold">My Avg</span>
              <span className="text-base font-black text-amber-400 font-mono mt-1 block">{stats.average > 0 ? stats.average.toFixed(1) : "—"}</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-3 text-center">
              <span className="text-[9px] uppercase tracking-wider text-slate-500 block font-bold">Highest</span>
              <span className="text-base font-black text-emerald-400 font-mono mt-1 block">{stats.highest > 0 ? stats.highest.toFixed(1) : "—"}</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-3 text-center">
              <span className="text-[9px] uppercase tracking-wider text-slate-500 block font-bold">Lowest</span>
              <span className="text-base font-black text-rose-400 font-mono mt-1 block">{stats.lowest > 0 ? stats.lowest.toFixed(1) : "—"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters, Search & Layout controls */}
      <section className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950/20 border border-slate-900 rounded-2xl p-4">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search clubs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-700 focus:ring-1 focus:ring-slate-700 transition-colors"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex gap-1 bg-slate-900 border border-slate-800/80 p-1 rounded-xl">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === "all"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            All Clubs ({clubs.length})
          </button>
          <button
            onClick={() => setFilter("saved")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === "saved"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Saved ({stats.savedCount})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === "pending"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Pending ({clubs.length - stats.savedCount})
          </button>
        </div>
      </section>

      {/* Grid of Sliders */}
      {filteredClubs.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredClubs.map((club) => (
            <ClubSlider
              key={club.slug}
              name={club.name}
              value={values[club.slug]}
              status={saveStatus[club.slug]}
              errorMessage={errorMessages[club.slug]}
              onChange={(v) => handleChange(club.slug, v)}
              onSave={() => handleSave(club.slug)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-slate-800 rounded-3xl bg-slate-950/20">
          <svg className="mx-auto h-12 w-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-sm font-semibold text-slate-300">No clubs found</h3>
          <p className="mt-1 text-xs text-slate-500">Try adjusting your filters or search query.</p>
        </div>
      )}
    </div>
  );
}
