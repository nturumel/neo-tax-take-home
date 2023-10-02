import { Router, Request, Response, NextFunction } from 'express';
import * as merchantsController from '../controllers/merchants';
import { MerchantSchema } from '../utils/types';

const router: Router = Router();

router.get('/', merchantsController.getMerchants, (_req: Request, res: Response, next: NextFunction) => {
  try {
    if (!res.locals.merchants) {
      throw new Error('Reached responding middleware function without res.locals.merchants set.');
    }

    const frontendMerchants: MerchantSchema[] = res.locals.merchants.map((merchant: MerchantSchema) => ({
      name: merchant.name,
      isOwnedBy: merchant.isOwnedBy,
    }));

    return res.json(frontendMerchants);
  } catch (error) {
    next(error);
  }
});

router.post('/', merchantsController.updateOrCreate, (_req: Request, res: Response, next: NextFunction) => {
  try {
    return res.json({ message: 'success' });
  } catch (error) {
    next(error);
  }
});

router.put('/', merchantsController.updateOrCreate, (_req: Request, res: Response, next: NextFunction) => {
  try {
    return res.json({ message: 'success' });
  } catch (error) {
    next(error);
  }
});

router.delete('/', merchantsController.deleteMany, (_req: Request, res: Response, next: NextFunction) => {
  try {
    return res.json({ message: 'success' });
  } catch (error) {
    next(error);
  }
});

export default router;
