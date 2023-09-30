import { Request, Response, NextFunction } from 'express';

import * as billionairesModel from '../models/billionaire';
import { billionaire } from '@prisma/client';

/**
 * Fetch a list of billionaires from the database.
 * @param res If successful, res.locals.billionaires will contain an array of Billionaire objects.
 */
export async function getBillionaires(req: Request, res: Response, next: NextFunction): Promise<void> {
  const dbBillionaires: billionaire[] = await billionairesModel.getBillionaires();
  // Sanitize billionaires and convert to front-end compatible format
  const billionaires: billionaire[] = dbBillionaires.map((dbBillionaire) => ({
    id: dbBillionaire.id,
    name: dbBillionaire.name,
  }));
  res.locals.billionaires = billionaires;
  return next();
}

/**
 * Update or create if entry doesn't exist a list of Billionaire objects to the database.
 * @param req Requires request body to contain the list of billionaires.
 */
export async function updateOrCreate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const billionaires: billionaire[] = req.body;
  await Promise.all(billionaires.map((billionaire) => billionairesModel.updateOrCreate(billionaire)));
  return next();
}

/**
 * Delete a list of Billionaire objects from the database.
 * @param req Requires request body to contain the list of billionaires.
 */
export async function deleteMany(req: Request, res: Response, next: NextFunction): Promise<void> {
  const billionaires: billionaire[] = req.body;
  await Promise.all(billionaires.map((billionaire) => billionairesModel.remove(billionaire)));
  return next();
}
