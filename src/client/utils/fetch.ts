import { Transaction, Merchant } from './../../shared/types';

/**
 * Fetch array of transactions from back-end.
 * @param lastID (Optional) Query parameter, returned transactions will all have an id greater than lastID.
 */
export async function fetchTransactions(lastID?: number): Promise<Transaction[] | null> {
  let URL = '/api/transactions';

  if (lastID) URL += `?lastID=${lastID}`;

  const response = await fetch(URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  const transactions: Transaction[] | { error: string } = await response.json();

  if (response.status !== 200 || 'error' in transactions) {
    console.error((transactions as { error: string }).error);
    return null;
  }

  // Sanitize received data
  const sanitizedTransactions = transactions.filter((transaction) => isValidTransaction(transaction));
  sanitizedTransactions.forEach((transaction) => (transaction.date = new Date(transaction.date)));

  if (sanitizedTransactions.length !== transactions.length) {
    console.error('Some of the received transactions were in an invalid format.');
  }

  return sanitizedTransactions;
}

/**
 * Verify a transaction contains all properties of a Transaction.
 * @param transaction Transaction object
 */
function isValidTransaction(transaction: Transaction): boolean {
  return (
    typeof transaction.id === 'number' &&
    typeof transaction.merchantName === 'string' &&
    typeof transaction.date === 'string' &&
    typeof transaction.amount === 'number'
  );
}

/**
 * Fetch array of merchants from back-end.
 */
export async function fetchMerchants(): Promise<Merchant[] | null> {
  const response = await fetch('/api/merchants', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  const merchants: Merchant[] | { error: string } = await response.json();

  if (response.status !== 200 || 'error' in merchants) {
    console.error((merchants as { error: string }).error);
    return null;
  }

  // Sanitize received data
  const sanitizedMerchants = merchants.filter((merchant) => isValidMerchant(merchant));

  if (sanitizedMerchants.length !== merchants.length) {
    console.error('Some of the received merchants were in an invalid format.');
  }

  return sanitizedMerchants;
}

function isValidMerchant(merchant: Merchant): boolean {
  return typeof merchant.name === 'string' && typeof merchant.isOwnedByBezos === 'boolean';
}

/**
 * Add merchants to back-end as Bezos owned.
 * @param merchants Array of Bezos owned merchants.
 */
export async function addMerchants(merchants: Merchant[]): Promise<boolean> {
  const response = await fetch('/api/merchants', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(merchants),
  });

  const result = await response.json();

  if (response.status !== 200) {
    console.error(result.error);
    return false;
  }

  return true;
}

/**
 * Delete merchants from back-end.
 * @param merchants Array of merchants to be removed.
 */
export async function deleteMerchants(merchants: Merchant[]): Promise<boolean> {
  const response = await fetch('/api/merchants', {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(merchants),
  });

  const result = await response.json();

  if (response.status !== 200) {
    console.error(result.error);
    return false;
  }

  return true;
}
