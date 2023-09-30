import { PrismaClient, billionaire as BillionaireType, billionaire } from '@prisma/client';

const prisma = new PrismaClient();

const BILLIONAIRES_WITH_COMPANIES = [
  {
    name: 'Elon Musk',
    companies: ['Tesla', 'SpaceX', 'Neuralink']
  },
  {
    name: 'Bill Gates',
    companies: ['Microsoft', 'Breakthrough Energy']
  },
  {
    name: 'Warren Buffett',
    companies: ['Berkshire Hathaway', 'Geico']
  }
];

async function main() {
  try {
    // Truncate tables
    await prisma.$executeRaw`TRUNCATE "merchants", "billionaires" RESTART IDENTITY CASCADE`;
    console.log('Tables truncated.');

    for (const { name, companies } of BILLIONAIRES_WITH_COMPANIES) {
      // Create billionaire
      const billionaireRecord: BillionaireType = await prisma.billionaire.create({
        data: {
          name: name,
        },
      });
      console.log(`Billionaire created: ${name}`);

      let fetchedBillionaire: billionaire | null = null;
      let attempts = 0;
      const MAX_ATTEMPTS = 5;

      // Keep checking until the billionaire is found or max attempts are reached
      while (!fetchedBillionaire && attempts < MAX_ATTEMPTS) {
        fetchedBillionaire = await prisma.billionaire.findUnique({
          where: {
            id: billionaireRecord.id,
          },
        });
        attempts++;
        if (!fetchedBillionaire) {
          console.log(`Billionaire ${name} not found, retrying...`);
          await new Promise(resolve => setTimeout(resolve, 1000));  // Wait for 1 second
        }
      }

      if (fetchedBillionaire) {
        // Create companies (merchants) and associate them with the billionaire
        console.log(`Billionaire ${fetchedBillionaire.name} found, retrying...`);
        await prisma.merchant.createMany({
          data: companies.map((company) => ({
            name: company,
            billionaireId: billionaireRecord.id,
          })),
        });
        console.log(`Companies for ${name} created.`);
      } else {
        console.warn(`Billionaire ${name} not found in the database after ${MAX_ATTEMPTS} attempts. Skipping associated companies.`);
      }
    }

  } catch (e) {
    console.error('Error during seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main()
  .then(async () => {
    console.log('Seeding complete!');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Unexpected error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
