import { PrismaClient, merchant } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get all merchants in database.
 * @returns Array of merchant objects with additional database fields.
 */
export async function getMerchants(): Promise<merchant[]> {
  console.log('getMerchants function called ');
  try {
    const merchants = await prisma.merchant.findMany();
    console.log('Fetched merchants:', merchants);
    return merchants;
  } catch (error) {
    console.error('Error fetching merchants:', error);
    throw error;
  }
}

/**
 * Update or create if entity doesn't exist a merchant in the database.
 * @param merchant New or existing merchant.
 * @returns Promise<void>
 */
export async function updateOrCreate(merchant: merchant): Promise<void> {
  console.log('updateOrCreate function called with merchant:', merchant);
  try {
    await prisma.merchant.upsert({
      where: {
        name: merchant.name,
      },
      update: {
        billionaireId: merchant.billionaireId,
      },
      create: merchant,
    });
    console.log('Successfully upserted merchant:', merchant.name);
  } catch (error) {
    console.error('Error upserting merchant:', error);
    throw error;
  }
}

/**
 * Delete a merchant if it exists in the database.
 * @param merchant Merchant to be deleted. Matched on name property.
 * @returns Promise<void>
 */
export async function remove(merchant: merchant): Promise<void> {
  console.log('remove function called with merchant:', merchant);
  try {
    await prisma.merchant.deleteMany({ where: { name: merchant.name } });
    console.log('Successfully deleted merchant:', merchant.name);
  } catch (error) {
    console.error('Error deleting merchant:', error);
    throw error;
  }
}
