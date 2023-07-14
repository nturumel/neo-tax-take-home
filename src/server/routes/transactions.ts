import { Router, Request, Response, NextFunction } from 'express';
import * as transactionsController from '../controllers/transactions';

import { PlaidTransaction } from './../utils/types';
import { Transaction } from './../../shared/types';

const router: Router = Router();

/**
 * Endpoint for fetching array of transactions. Accepts optional lastID query parameter, used to filter for
 * transactions with ID greater than lastID.
 */
router.get('/', transactionsController.getTransactions, (req: Request, res: Response, next: NextFunction) => {
  if (!res.locals.transactions) {
    return next('Reached responding middleware function without res.locals.transactions set.');
  }

  // Sanitize transactions and convert to front-end compatible format
  const frontEndTransaction: Transaction[] = (res.locals.transactions as Array<PlaidTransaction>)
    .map((transaction) => ({
      id: transaction.id,
      merchantName: transaction.merchant_name,
      date: new Date(transaction.date),
      amount: transaction.amount,
    }))
    .filter((transaction) => {
      // Actual implementation would use request query parameters
      const month = 0,
        year = 2029;

      return transaction.date.getMonth() === month && transaction.date.getFullYear() === year;
    });

  return res.json(frontEndTransaction);
});

export default router;
