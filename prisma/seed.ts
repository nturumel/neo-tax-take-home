import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SEED_DATA = [
  { name: 'Amazon', isOwnedByBezos: true },
  { name: 'Washington Post', isOwnedByBezos: true },
  { name: 'Whole Foods', isOwnedByBezos: true },
  { name: 'Blue Origin', isOwnedByBezos: true },
];

async function main() {
  await prisma.$executeRaw`TRUNCATE merchants RESTART IDENTITY CASCADE`;
  await prisma.merchants.createMany({ data: SEED_DATA });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
