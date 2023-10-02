import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SEED_DATA = [
  // Jeff Bezos
  { name: 'Amazon', isOwnedBy: 'Jeff Bezos' },
  { name: 'Washington Post', isOwnedBy: 'Jeff Bezos' },
  { name: 'Whole Foods', isOwnedBy: 'Jeff Bezos' },
  { name: 'Blue Origin', isOwnedBy: 'Jeff Bezos' },


  // Bill Gates
  { name: 'Microsoft', isOwnedBy: 'Bill Gates' },
  { name: 'Cascade Investment', isOwnedBy: 'Bill Gates' },

  // Mark Zuckerberg
  { name: 'Facebook', isOwnedBy: 'Mark Zuckerberg' },
  { name: 'Instagram', isOwnedBy: 'Mark Zuckerberg' },
  { name: 'WhatsApp', isOwnedBy: 'Mark Zuckerberg' },

  // Elon Musk
  { name: 'Tesla', isOwnedBy: 'Elon Musk' },
  { name: 'SpaceX', isOwnedBy: 'Elon Musk' },
  { name: 'SolarCity', isOwnedBy: 'Elon Musk' },

  // Warren Buffett
  { name: 'Berkshire Hathaway', isOwnedBy: 'Warren Buffett' },

  // Larry Ellison
  { name: 'Oracle', isOwnedBy: 'Larry Ellison' },

  // Larry Page
  { name: 'Google', isOwnedBy: 'Larry Page' },

  // Mukesh Ambani
  { name: 'Reliance Industries', isOwnedBy: 'Mukesh Ambani' },

  // Bernard Arnault
  { name: 'LVMH', isOwnedBy: 'Bernard Arnault' }
];

async function main() {
  try {
    await prisma.$executeRaw`TRUNCATE merchants RESTART IDENTITY CASCADE`;

    for (const entry of SEED_DATA) {
      await prisma.merchants.create({
        data: entry
      });
    }

  } catch (error) {
    console.error('An error occurred while seeding the database:', error);
  }
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
