"use client";

import { useMemo, useState } from "react";
import ClubSlider from "./ClubSlider";
import type { ClubDef } from "@/lib/clubs";

interface RatingFormProps {
  clubs: ClubDef[];
  userName: string;
}

type Status = "idle" | "submitting" | "success" | "error";

export default function RatingForm({ clubs, userName }: RatingFormProps) {
  const [values, setValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(clubs.map((c) => [c.slug, 5.0]))
  );
  const [touched, setTouched] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(clubs.map((c) => [c.slug, false]))
  );
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const allTouched = useMemo(() => Object.values(touched).every(Boolean), [touched]);
  const touchedCount = useMemo(() => Object.values(touched).filter(Boolean).length, [touched]);

  function handleChange(slug: string, value: number) {
    setValues((prev) => ({ ...prev, [slug]: value }));
    setTouched((prev) => ({ ...prev, [slug]: true }));
  }

  async function handleSubmit() {
    if (!allTouched || status === "submitting") return;
    setStatus("submitting");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ratings: values }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Request failed with status ${res.status}`);
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-[#e2d3b4] bg-[#fbf6ea] p-10 text-center">
        <h2 className="text-2xl font-semibold text-[#3d3427]">Thanks, {userName}!</h2>
        <p className="mt-2 text-[#695943]">Your ratings have been recorded.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#9a7b4f]">
            Rate every club
          </p>
          <h1 className="text-3xl font-semibold text-[#3d3427]">Hi {userName}, welcome</h1>
        </div>
        <div className="rounded-full border border-[#e2d3b4] bg-[#fffdf8] px-4 py-2 text-sm font-semibold text-[#3d3427]">
          {touchedCount} / {clubs.length} rated
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {clubs.map((club) => (
          <ClubSlider
            key={club.slug}
            name={club.name}
            value={values[club.slug]}
            touched={touched[club.slug]}
            onChange={(v) => handleChange(club.slug, v)}
          />
        ))}
      </div>

      {status === "error" && errorMessage && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={!allTouched || status === "submitting"}
        className="mt-8 w-full rounded-full bg-[#3d3427] px-6 py-4 text-lg font-semibold text-[#f7f0e1] transition-colors hover:bg-[#554530] disabled:cursor-not-allowed disabled:bg-[#c9bda3]"
      >
        {status === "submitting"
          ? "Submitting…"
          : allTouched
          ? "Submit ratings"
          : `Rate all ${clubs.length} clubs to submit`}
      </button>
    </div>
  );
}
