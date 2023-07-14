/**
 * Main router used to connect all api endpoints to Express app.
 */

import { Router } from 'express';

import transactionsRouter from './transactions';
import merchantsRouter from './merchants';

const router: Router = Router();

router.use('/transactions', transactionsRouter);
router.use('/merchants', merchantsRouter);

export default router;
