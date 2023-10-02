import { Router, Request, Response, NextFunction } from 'express';
import * as billionaireController from '../controllers/billionaires';
import { billionaires } from '@prisma/client';

const router: Router = Router();

router.get('/', billionaireController.getBillionaires, (_req: Request, res: Response, next: NextFunction) => {
  try {
    if (!res.locals.billionaires) {
      throw new Error('Reached responding middleware function without res.locals.billionaires set.');
    }

    const frontendBillionaires: billionaires[] = res.locals.billionaires.map((billionaire: billionaires) => ({
      name: billionaire.name,
      id: billionaire.id
    }));

    return res.json(frontendBillionaires);
  } catch (error) {
    next(error);
  }
});

router.post('/', billionaireController.updateOrCreate, (_req: Request, res: Response, next: NextFunction) => {
  try {
    return res.json({ message: 'success' });
  } catch (error) {
    next(error);
  }
});

router.put('/', billionaireController.updateOrCreate, (_req: Request, res: Response, next: NextFunction) => {
  try {
    return res.json({ message: 'success' });
  } catch (error) {
    next(error);
  }
});

router.delete('/', billionaireController.deleteMany, (_req: Request, res: Response, next: NextFunction) => {
  try {
    return res.json({ message: 'success' });
  } catch (error) {
    next(error);
  }
});

export default router;
