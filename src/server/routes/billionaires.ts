import { Router, Request, Response, NextFunction } from 'express';

import * as billionaireController from '../controllers/billionaire';
import { billionaire } from 'prisma/prisma-client';

const router: Router = Router();

/**
 * Endpoint for fetching an array of all the merchants.
 */
router.get('/', billionaireController.getBillionaires, (_req: Request, res: Response, next: NextFunction) => {
  if (!res.locals.merchants) {
    return next('Reached responding middleware function without res.locals.merchants set.');
  }

  const frontendMerchants: billionaire = res.locals.merchants.map((billionaire: billionaire) => ({
    name: billionaire.name,
    id: billionaire.id,
  }));

  return res.json(frontendMerchants);
});

/**
 * Endpoint for creating new merchant entries in database. Accepts an array of merchant objects in body
 * of the request.
 */
router.post('/', billionaireController.updateOrCreate, (_req: Request, res: Response) => {
  return res.json({ message: 'success' });
});

/**
 * Endpoint for updating (with upsert) merchant entries in database. Accepts an array of merchant objects
 * in body of the request.
 */
router.put('/', billionaireController.updateOrCreate, (_req: Request, res: Response) => {
  return res.json({ message: 'success' });
});

/**
 * Endpoint for deleting merchant entries in database. Accepts an array of merchant objects in body of
 * the request.
 */
router.delete('/', billionaireController.deleteMany, (_req: Request, res: Response) => {
  return res.json({ message: 'success' });
});

export default router;
