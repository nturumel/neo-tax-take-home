import { Request, Response, NextFunction } from 'express';

import * as merchantsModel from '../models/merchant';
import { merchant } from '@prisma/client';

/**
 * Fetch a list of merchants from the database.
 * @param res If successful, res.locals.merchants will contain an array of Merchant objects.
 */
export async function getMerchants(req: Request, res: Response, next: NextFunction): Promise<void> {
  const dbMerchants: merchant[] = await merchantsModel.getMerchants();
  // Sanitize merchants and convert to front-end compatible format
  const merchants: merchant[] = dbMerchants.map((dbMerchant) => ({
    id: dbMerchant.id,
    name: dbMerchant.name,
    billionaireId: dbMerchant.billionaireId,
  }));
  res.locals.merchants = merchants;
  return next();
}

/**
 * Update or create if entry doesn't exist a list of Merchant objects to the database.
 * @param req Requires request body to contain the list of merchants.
 */
export async function updateOrCreate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const merchants: merchant[] = req.body;
  await Promise.all(merchants.map((merchant) => merchantsModel.updateOrCreate(merchant)));
  return next();
}

/**
 * Delete a list of Merchant objects from the database.
 * @param req Requires request body to contain the list of merchants.
 */
export async function deleteMany(req: Request, res: Response, next: NextFunction): Promise<void> {
  const merchants: merchant[] = req.body;
  await Promise.all(merchants.map((merchant) => merchantsModel.remove(merchant)));
  return next();
}
