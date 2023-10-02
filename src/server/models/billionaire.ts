import { PrismaClient } from '@prisma/client';
import { billionaires } from '@prisma/client';

const prisma = new PrismaClient();


/**
 * Get all billionaires in the database.
 * @returns Array of billionaire objects with additional database fields.
 */
export async function getBillionaires(): Promise<billionaires[]> {
  return await prisma.billionaires.findMany();
}

/**
 * Update or create if the entity doesn't exist, a billionaire in the database.
 * @param billionaire New or existing billionaire.
 * @returns Boolean result of operation.
 */
export async function updateOrCreate(billionaire: billionaires): Promise<void> {
  await prisma.billionaires.upsert({
    where: {
      name: billionaire.name,
    },
    update: {},
    create: billionaire,
  });
}

/**
 * Delete a billionaire if it exists in the database.
 * @param billionaire Billionaire to be deleted. Matched on name property.
 * @returns Boolean result of operation.
 */
export async function remove(billionaire: billionaires): Promise<void> {
  await prisma.billionaires.deleteMany({ where: { name: billionaire.name } });
}

/**
 * Create a new billionaire in the database.
 * @param data Object containing the name of the billionaire.
 * @returns Boolean result of operation.
 */
export async function create(data: { name: string }): Promise<void> {
  await prisma.billionaires.create({
    data: {
      name: data.name,
    },
  });
}

// Delete a billionaire by name
export async function removeByName(name: string): Promise<void> {
  await prisma.billionaires.deleteMany({ where: { name } });
}
