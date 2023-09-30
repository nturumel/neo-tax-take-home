import { PrismaClient, billionaire } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get all billionaires in the database.
 * @returns Array of billionaire objects with additional database fields.
 */
export async function getBillionaires(): Promise<billionaire[]> {
  return await prisma.billionaire.findMany();
}

/**
 * Update or create if the entity doesn't exist a billionaire in the database.
 * @param billionaire New or existing billionaire.
 * @returns Promise<void>
 */
export async function updateOrCreate(billionaire: billionaire): Promise<void> {
  await prisma.billionaire.upsert({
    where: {
      name: billionaire.name,
    },
    update: {
      name: billionaire.name,
    },
    create: billionaire,
  });
}

/**
 * Delete a billionaire if it exists in the database.
 * @param billionaire Billionaire to be deleted. Matched on name property.
 * @returns Promise<void>
 */
export async function remove(billionaire: billionaire): Promise<void> {
  await prisma.billionaire.deleteMany({ where: { name: billionaire.name } });
}
