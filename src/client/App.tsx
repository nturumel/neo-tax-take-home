import React, { useState, useEffect, useCallback } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

import Header from './wallet/Header';
import Stats from './wallet/BezoStats';
import TransactionList from './wallet/TransactionList';
import Splash from './shared/Splash';
import { Transaction } from './../shared/types';
import { fetchTransactions, fetchMerchants, addMerchants, deleteMerchants } from './utils/fetch';

const POLL_FREQUENCY_MS = 10000;

/**
 * Remove a merchant from app state.
 * @param name Merchant name
 * @param setBezosMerchants Setter function bezosMerchants state.
 */
function removeMerchant(name: string, setBezosMerchants: React.Dispatch<React.SetStateAction<Set<string> | null>>) {
  setBezosMerchants((bezosMerchants) => {
    if (!bezosMerchants) return bezosMerchants;

    const newSet: Set<string> = new Set(bezosMerchants);
    newSet.delete(name);

    return newSet;
  });
}

/**
 * Add a merchant to app state.
 * @param name Merchant name
 * @param setBezosMerchants Setter function bezosMerchants state.
 */
function addMerchant(name: string, setBezosMerchants: React.Dispatch<React.SetStateAction<Set<string> | null>>) {
  setBezosMerchants((bezosMerchants) => {
    if (!bezosMerchants) return bezosMerchants;

    const newSet: Set<string> = new Set(bezosMerchants);
    newSet.add(name);

    return newSet;
  });
}

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  // Using a set for O(1) merchant lookup
  const [bezosMerchants, setBezosMerchants] = useState<Set<string> | null>(null);

  /**
   * Coordinate setting app state and request to back-end to set a merchant as owned or not owned by Bezos.
   * @param name Name of merchant
   * @param isOwnedByBezos Boolean indicating if merchant is owned by Bezos.
   */
  const toggleBezosMerchant = useCallback(
    async (name: string, isOwnedByBezos: boolean) => {
      if (!bezosMerchants) {
        throw new Error(
          'Should not be able to toggle merchant ownership before we have list of merchants owned by Bezos.',
        );
      }

      if (bezosMerchants.has(name)) {
        if (!isOwnedByBezos) {
          removeMerchant(name, setBezosMerchants);

          const isDeleted: boolean = await deleteMerchants([{ name, isOwnedByBezos }]);

          if (!isDeleted) {
            console.error('Unable to delete merchant.');
            addMerchant(name, setBezosMerchants);

            // Front-end may be out of sync due to multiple clients, fetch list of merchants
            const merchants = await fetchMerchants();
            if (!merchants) return;

            setBezosMerchants(new Set(merchants.map((merchant) => merchant.name)));
          }
        }
      } else {
        if (isOwnedByBezos) {
          addMerchant(name, setBezosMerchants);

          const isAdded: boolean = await addMerchants([{ name, isOwnedByBezos }]);

          if (!isAdded) {
            console.error('Unable to add merchant.');
            removeMerchant(name, setBezosMerchants);
          }
        }
      }
    },
    [bezosMerchants],
  );

  // On component did mount, send request to for transactions and Bezos' merchants
  useEffect(() => {
    const fetchTransactionsAndMerchants = async () => {
      const transactions = await fetchTransactions();
      setTransactions(transactions);

      const merchants = await fetchMerchants();
      if (!merchants) return;

      setBezosMerchants(
        new Set(merchants.filter((merchant) => merchant.isOwnedByBezos).map((merchant) => merchant.name)),
      );
    };
    fetchTransactionsAndMerchants();
  }, []);

  // Set up and tear down update polling as transactions update
  useEffect(() => {
    if (!transactions) return;

    const maxTransactionID: number = transactions.reduce((max, transaction) => Math.max(max, transaction.id), -1);

    const intervalID = setInterval(async () => {
      const newTransactions: Transaction[] | null = await fetchTransactions(maxTransactionID);
      if (!newTransactions || newTransactions.length === 0) return;

      setTransactions((transactions) => (!transactions ? transactions : [...transactions, ...newTransactions]));
    }, POLL_FREQUENCY_MS);

    // Teardown function
    return () => clearInterval(intervalID);
  }, [transactions]);

  let totalSpending: number = 0;
  let bezosTotal: number = 0;
  if (transactions && bezosMerchants) {
    transactions?.forEach((transaction) => {
      totalSpending += transaction.amount;
      if (bezosMerchants?.has(transaction.merchantName)) bezosTotal += transaction.amount;
    });
  }
  const percent: number = (bezosTotal / totalSpending) * 100;

  return (
    <div id="app">
      <Paper sx={{ padding: 2, borderRadius: 3 }}>
        <Stack spacing={4}>
          <Header />
          {!transactions || !bezosMerchants ? (
            <Splash />
          ) : (
            <>
              <Stats total={bezosTotal} percent={percent} />
              <TransactionList
                transactions={transactions}
                bezosMerchants={bezosMerchants}
                toggleBezosMerchant={toggleBezosMerchant}
              />
            </>
          )}
        </Stack>
      </Paper>
    </div>
  );
}
