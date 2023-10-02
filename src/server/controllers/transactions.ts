import { Request, Response, NextFunction } from 'express';
import fetch from 'node-fetch';

import { PlaidTransaction } from '../utils/types';

const STATIC_ROUTE = 'https://61b3dea5af5ff70017ca20bf.mockapi.io/transactions';

/**
 * Fetch user' transactions from Plaid-like mock server.
 * @param req If lastID query parameters is provided, returned transactions will all have an ID greater than lastID.
 * @param res If successful, res.locals.transactions will be set to an array of PlaidTransaction.
 */
export async function getTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {
  // Note actual implementation would use query parameters to fetch a specific date range
  const response = await fetch(STATIC_ROUTE, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  const transactions: PlaidTransaction[] = await response.json();

  // If lastID query parameters is provided, only return transactions with an id greater than lastID
  const lastID: number = parseInt(req.query.lastID as string);

  const sanitizedTransactions: PlaidTransaction[] = transactions.filter((transaction) => {
    return isPlaidTransaction(transaction) && (isNaN(lastID) || transaction.id > lastID);
  });

  res.locals.transactions = sanitizedTransactions;
  return next();
}

/**
 * Verify a transaction contains all properties of a PlaidTransaction.
 * @param transaction Transaction object
 */
function isPlaidTransaction(transaction: PlaidTransaction): boolean {
  return (
    typeof transaction.id === 'number' &&
    typeof transaction.merchant_name === 'string' &&
    (!('category' in transaction) ||
      (transaction.category instanceof Array &&
        transaction.category.every((category) => typeof category === 'string'))) &&
    typeof transaction.date === 'string' &&
    typeof transaction.amount === 'number'
  );
}
