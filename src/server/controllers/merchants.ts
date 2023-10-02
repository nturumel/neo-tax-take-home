import { Request, Response, NextFunction } from 'express';

import * as merchantsModel from '../models/merchant';
import { MerchantSchema } from '../utils/types';

/**
 * Fetch a list of merchants from the database.
 * @param res If successful, res.locals.merchants will contain an array of Merchant objects.
 */
export async function getMerchants(req: Request, res: Response, next: NextFunction): Promise<void> {
  const dbMerchants: MerchantSchema[] = await merchantsModel.getMerchants();
  // Sanitize merchants and convert to front-end compatible format
  const merchants: MerchantSchema[] = dbMerchants.map((dbMerchant) => ({
    name: dbMerchant.name,
    isOwnedBy: dbMerchant.isOwnedBy,
  }));
  res.locals.merchants = merchants;
  return next();
}

/**
 * Update or create if entry doesn't exist a list of Merchant objects to the database.
 * @param req Requires request body to contain the list of merchants.
 */
export async function updateOrCreate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const merchants: MerchantSchema[] = req.body;
  await Promise.all(merchants.map((merchant) => merchantsModel.updateOrCreate(merchant)));
  return next();
}

/**
 * Delete a list of Merchant objects from the database.
 * @param req Requires request body to contain the list of merchants.
 */
export async function deleteMany(req: Request, res: Response, next: NextFunction): Promise<void> {
  const merchants: MerchantSchema[] = req.body;
  await Promise.all(merchants.map((merchant) => merchantsModel.remove(merchant)));
  return next();
}
