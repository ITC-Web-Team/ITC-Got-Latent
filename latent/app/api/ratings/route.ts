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
  const rounded = Math.round(raw * 10) / 10;
  return rounded;
}

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

  const ratings = (body as { ratings?: unknown }).ratings;
  if (!ratings || typeof ratings !== "object" || Array.isArray(ratings)) {
    return NextResponse.json(
      { error: "Body must be { ratings: { [clubSlug]: number } }" },
      { status: 400 }
    );
  }

  const entries = Object.entries(ratings as Record<string, unknown>);

  // Require a rating for every club — matches "submits after rating all clubs".
  const missing = CLUBS.filter((c) => !(c.slug in (ratings as Record<string, unknown>)));
  if (missing.length > 0) {
    return NextResponse.json(
      { error: "Missing ratings for: " + missing.map((c) => c.name).join(", ") },
      { status: 400 }
    );
  }

  const normalized: { slug: string; score: number }[] = [];
  for (const [slug, value] of entries) {
    if (!VALID_SLUGS.has(slug)) {
      return NextResponse.json({ error: `Unknown club: ${slug}` }, { status: 400 });
    }
    const score = normalizeScore(value);
    if (score === null) {
      return NextResponse.json(
        { error: `Invalid score for ${slug}: must be a number between 0 and 10` },
        { status: 400 }
      );
    }
    normalized.push({ slug, score });
  }

  const clubs = await prisma.club.findMany({
    where: { slug: { in: normalized.map((n) => n.slug) } },
  });
  const clubIdBySlug = new Map(clubs.map((c) => [c.slug, c.id]));

  const missingInDb = normalized.filter((n) => !clubIdBySlug.has(n.slug));
  if (missingInDb.length > 0) {
    return NextResponse.json(
      {
        error:
          "Clubs not found in database — run the seed script first: " +
          missingInDb.map((m) => m.slug).join(", "),
      },
      { status: 500 }
    );
  }

  await prisma.$transaction(
    normalized.map((n) =>
      prisma.rating.upsert({
        where: {
          userId_clubId: {
            userId: user.userId,
            clubId: clubIdBySlug.get(n.slug)!,
          },
        },
        update: { score: n.score },
        create: {
          userId: user.userId,
          clubId: clubIdBySlug.get(n.slug)!,
          score: n.score,
        },
      })
    )
  );

  return NextResponse.json({ ok: true });
}
