import { prisma } from "@/lib/prisma";
import GotLatentBoard, { type LeaderboardEntry } from "./GotLatentBoard";

// Intentionally not linked anywhere in nav — reachable only by direct URL.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "ITC GOT Latent",
  robots: { index: false, follow: false },
};

export default async function ItcGotLatentPage() {
  const [clubs, aggregates] = await Promise.all([
    prisma.club.findMany({ orderBy: { order: "asc" } }),
    prisma.rating.groupBy({
      by: ["clubId"],
      _avg: { score: true },
      _count: { score: true },
    }),
  ]);

  const aggByClubId = new Map(
    aggregates.map((a) => [a.clubId, { avg: a._avg.score, count: a._count.score }])
  );

  const entries: LeaderboardEntry[] = clubs
    .map((club) => {
      const agg = aggByClubId.get(club.id);
      return {
        slug: club.slug,
        name: club.name,
        average: agg?.avg ?? null,
        votes: agg?.count ?? 0,
      };
    })
    .sort((a, b) => {
      if (a.average === null) return 1;
      if (b.average === null) return -1;
      return b.average - a.average;
    });

  return <GotLatentBoard entries={entries} />;
}
