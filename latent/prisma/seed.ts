import { PrismaClient } from "@prisma/client";
import { CLUBS } from "../lib/clubs";

const prisma = new PrismaClient();

async function main() {
  for (let i = 0; i < CLUBS.length; i++) {
    const club = CLUBS[i];
    await prisma.club.upsert({
      where: { slug: club.slug },
      update: { name: club.name, order: i },
      create: { slug: club.slug, name: club.name, order: i },
    });
  }
  console.log(`Seeded ${CLUBS.length} clubs.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
