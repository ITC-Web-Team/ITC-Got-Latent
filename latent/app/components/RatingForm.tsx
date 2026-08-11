"use client";

import { useState } from "react";
import ClubSlider from "./ClubSlider";
import type { ClubDef } from "@/lib/clubs";

interface RatingFormProps {
  clubs: ClubDef[];
  userName: string;
  initialValues: Record<string, number>;
}

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export default function RatingForm({ clubs, userName, initialValues }: RatingFormProps) {
  const [values, setValues] = useState<Record<string, number>>(initialValues);
  const [saveStatus, setSaveStatus] = useState<Record<string, SaveStatus>>(() =>
    Object.fromEntries(clubs.map((c) => [c.slug, "idle" as SaveStatus]))
  );
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});

  function handleChange(slug: string, value: number) {
    setValues((prev) => ({ ...prev, [slug]: value }));
    // Moving the slider again after a save un-does the "saved" checkmark
    // so it's clear this club has an unsaved change again.
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

  const savedCount = Object.values(saveStatus).filter((s) => s === "saved").length;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#ffb454]">
            SYS://ITC-RATINGS
          </p>
          <h1 className="mt-1 text-3xl font-semibold text-[#f4f7fa]">
            Alright {userName}, don&apos;t hold back.
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[#7c8a99]">
            Every club starts at a neutral 5.0. Move the dial and hit save on
            whichever ones you actually have an opinion about — no need to
            touch the rest.
          </p>
        </div>
        <div className="rounded-md border border-[#1f2a37] bg-[#10161d] px-4 py-2 text-sm font-semibold tabular-nums text-[#e7edf3]">
          {savedCount} / {clubs.length} saved
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {clubs.map((club) => (
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
    </div>
  );
}
