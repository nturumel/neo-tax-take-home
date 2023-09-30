import { Router, Request, Response, NextFunction } from 'express';

import transactionsRouter from './transactions';
import merchantsRouter from './merchants';

const router: Router = Router();

router.use('/transactions', transactionsRouter);
router.use('/merchants', merchantsRouter);

// Global Error Handler
router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);

    // Sanitize the error if it exposes sensitive information
    let sanitizedMessage = 'An unexpected error occurred. Please try again later.';

    // In development, you might want more detailed errors
    if (process.env.NODE_ENV === 'development') {
        sanitizedMessage = err.message;
    }

    res.status(500).json({
        error: sanitizedMessage
    });
});

export default router;
