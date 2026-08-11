import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import RatingForm from "@/app/components/RatingForm";
import { CLUBS } from "@/lib/clubs";

const DEFAULT_SCORE = 5.0;

export default async function HomePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const clubs = await prisma.club.findMany({ orderBy: { order: "asc" } });

  const existingRatings = await prisma.rating.findMany({
    where: { userId: user!.userId },
    include: { club: true },
  });
  const ratedSlugs = new Set(existingRatings.map((r) => r.club.slug));

  // Give every club a default 5.0 rating the moment someone reaches this
  // page — so ratings exist for all clubs even if the user never touches
  // some sliders. Saving a slider just overwrites the default.
  const missingClubs = clubs.filter((c) => !ratedSlugs.has(c.slug));
  if (missingClubs.length > 0) {
    await prisma.rating.createMany({
      data: missingClubs.map((c) => ({
        userId: user!.userId,
        clubId: c.id,
        score: DEFAULT_SCORE,
      })),
      skipDuplicates: true,
    });
  }

  const scoreBySlug = new Map(existingRatings.map((r) => [r.club.slug, r.score]));
  const initialValues = Object.fromEntries(
    CLUBS.map((c) => [c.slug, scoreBySlug.get(c.slug) ?? DEFAULT_SCORE])
  );

  return (
    <main className="min-h-dvh bg-[#0b0f14] px-6 py-12 text-[#e7edf3]">
      <RatingForm clubs={CLUBS} userName={user!.name} initialValues={initialValues} />
    </main>
  );
}
