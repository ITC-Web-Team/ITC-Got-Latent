import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { CLUBS } from "@/lib/clubs";

const VALID_SLUGS = new Set(CLUBS.map((c) => c.slug));

// Rounds to 1 decimal place and rejects anything that isn't a clean
// multiple of 0.1 once rounded — keeps "exactly 1 decimal place" honest
// even though floats can't represent 0.1 exactly.
function normalizeScore(raw: unknown): number | null {
  if (typeof raw !== "number" || !Number.isFinite(raw)) return null;
  if (raw < 0 || raw > 10) return null;
  return Math.round(raw * 10) / 10;
}

// Saves one club's rating at a time — { slug, score }. The row for every
// club already exists at a default of 5.0 by the time a user reaches the
// form (created on login in app/page.tsx), so this is really an update,
// but upsert keeps it self-healing if that row is ever missing.
export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { slug, score: rawScore } = (body ?? {}) as { slug?: unknown; score?: unknown };

  if (typeof slug !== "string" || !VALID_SLUGS.has(slug)) {
    return NextResponse.json({ error: "Unknown or missing club slug" }, { status: 400 });
  }

  const score = normalizeScore(rawScore);
  if (score === null) {
    return NextResponse.json(
      { error: "Score must be a number between 0 and 10" },
      { status: 400 }
    );
  }

  const club = await prisma.club.findUnique({ where: { slug } });
  if (!club) {
    return NextResponse.json(
      { error: "Club not found in database — run the seed script first." },
      { status: 500 }
    );
  }

  const rating = await prisma.rating.upsert({
    where: { userId_clubId: { userId: user.userId, clubId: club.id } },
    update: { score },
    create: { userId: user.userId, clubId: club.id, score },
  });

  return NextResponse.json({ ok: true, slug, score: rating.score });
}
