import { Router, Request, Response, NextFunction } from 'express';

import * as merchantsController from '../controllers/merchants';
import { MerchantSchema as MerchantSchema } from '../utils/types';

const router: Router = Router();

/**
 * Endpoint for fetching an array of all the merchants.
 */
router.get('/', merchantsController.getMerchants, (_req: Request, res: Response, next: NextFunction) => {
  if (!res.locals.merchants) {
    return next('Reached responding middleware function without res.locals.merchants set.');
  }

  const frontendMerchants: MerchantSchema = res.locals.merchants.map((merchant: MerchantSchema) => ({
    name: merchant.name,
    isOwnedByBezos: merchant.isOwnedByBezos,
  }));

  return res.json(frontendMerchants);
});

/**
 * Endpoint for creating new merchant entries in database. Accepts an array of merchant objects in body
 * of the request.
 */
router.post('/', merchantsController.updateOrCreate, (_req: Request, res: Response) => {
  return res.json({ message: 'success' });
});

/**
 * Endpoint for updating (with upsert) merchant entries in database. Accepts an array of merchant objects
 * in body of the request.
 */
router.put('/', merchantsController.updateOrCreate, (_req: Request, res: Response) => {
  return res.json({ message: 'success' });
});

/**
 * Endpoint for deleting merchant entries in database. Accepts an array of merchant objects in body of
 * the request.
 */
router.delete('/', merchantsController.deleteMany, (_req: Request, res: Response) => {
  return res.json({ message: 'success' });
});

export default router;
