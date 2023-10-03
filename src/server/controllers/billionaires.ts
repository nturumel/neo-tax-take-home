import { Request, Response, NextFunction } from 'express';
import * as billionaireModel from '../models/billionaire';
import { billionaires } from '@prisma/client';

/**
 * Fetch a list of billionaires from the database.
 * @param res If successful, res.locals.billionaires will contain an array of Billionaire objects.
 */
export async function getBillionaires(req: Request, res: Response, next: NextFunction): Promise<void> {
  const dbBillionaires: billionaires[] = await billionaireModel.getBillionaires();
  // Sanitize billionaires and convert to front-end compatible format
  const billionaires: billionaires[] = dbBillionaires.map((dbBillionaire) => ({
    name: dbBillionaire.name,
    id: dbBillionaire.id
  }));
  res.locals.billionaires = billionaires;
  return next();
}

/**
 * Update or create if entry doesn't exist a list of Billionaire objects to the database.
 * @param req Requires request body to contain the list of billionaires.
 */
export async function updateOrCreate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const billionaires: billionaires[] = req.body;
  await Promise.all(billionaires.map((billionaire) => billionaireModel.updateOrCreate(billionaire)));
  return next();
}

/**
 * Delete a list of Billionaire objects from the database.
 * @param req Requires request body to contain the list of billionaires.
 */
export async function deleteMany(req: Request, res: Response, next: NextFunction): Promise<void> {
  const billionaires: billionaires[] = req.body;
  await Promise.all(billionaires.map((billionaire) => billionaireModel.remove(billionaire)));
  return next();
}

// In your billionaireController file
export async function createBillionaire(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { name } = req.body;
  try {
    await billionaireModel.create({ name });
    return next();
  } catch (error) {
    return next(error);
  }
}

// Delete a single billionaire by name
export async function deleteByName(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { name } = req.body;
  try {
    await billionaireModel.removeByName(name);
    return next();
  } catch (error) {
    return next(error);
  }
}
