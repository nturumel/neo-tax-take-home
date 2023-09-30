import React, { useState, useEffect, useCallback } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

import Header from './wallet/Header';
import BillionaireStats from './wallet/BillionaireStats';
import TransactionList from './wallet/TransactionList';
import Splash from './shared/Splash';
import { Transaction } from './../shared/types';
import { fetchTransactions, fetchMerchants, addMerchants, fetchBillionaires } from './utils/fetch';
import { billionaire, merchant } from '.prisma/client';

const POLL_FREQUENCY_MS = 10000;

export default function App() {
  const [transactionMap, setTransactionMap] = useState<Map<number, Transaction>>();
  const [billionaireMap, setBillionaireMap] = useState<Map<number, billionaire>>();
  const [merchantMap, setMerchantMap] = useState<Map<string, merchant>>();
  const [billionaireTotalMap, setBillionaireTotal] = useState<Map<string, { amount: number, percent: number }>>();
  const [totalSpending, setTotalSpending] = useState<number>(0);
  /**
   * Coordinate setting app state and request to back-end to set a merchant as owned or not owned by Billionaire.
   * @param merchantName Name of merchant
   * @param billionaireName string indicating if merchant is owned by a billionaire.
   */
  const handleMerchantOwnerChange = useCallback(
    async (merchantName: string, billionaireId: number | null) => {

      // Step 1: Update local state
      const updatedMerchantMap = new Map(merchantMap);
      const merchant = updatedMerchantMap.get(merchantName);
      const billionaire = billionaireMap?.get(billionaireId || -1);

      if (merchant && billionaire) {
        merchant.billionaireId = billionaire.id;
      } else if (merchant) {
        merchant.billionaireId = null;
      }
      setMerchantMap(updatedMerchantMap);

      // Step 2: Send updated information to the backend
      const isAdded = await addMerchants(Array.from(updatedMerchantMap.values()));
      if (!isAdded) {
        console.error('Failed to update merchants.');
        return;
      }

      // Step 3: Refresh the list (it might be outdated)
      const updatedMerchants = await fetchMerchants();
      if (updatedMerchants) {
        setMerchantMap(new Map(updatedMerchants.map(m => [m.name, m])));
      }

      const updatedBillionaires = await fetchBillionaires();
      if (updatedBillionaires) {
        setBillionaireMap(new Map(updatedBillionaires.map(b => [b.id, b])));
      }
    },
    [billionaireMap, merchantMap]
  );

  // Add this useEffect for initial data fetching
  useEffect(() => {
    console.log('Initial Rendering')
    // Fetch initial transactions
    const fetchData = async () => {
      const initialTransactions = await fetchTransactions();
      if (initialTransactions) {
        setTransactionMap(new Map(initialTransactions.map(t => [t.id, t])));
      }

      // Similarly, you can fetch initial merchants and billionaires
      const initialMerchants = await fetchMerchants();
      if (initialMerchants) {
        setMerchantMap(new Map(initialMerchants.map(m => [m.name, m])));
      }

      const initialBillionaires = await fetchBillionaires();
      if (initialBillionaires) {
        setBillionaireMap(new Map(initialBillionaires.map(b => [b.id, b])));
      }
    };

    fetchData();
  }, []);


  // Set up and tear down update polling as transactions update
  useEffect(() => {
    if (!transactionMap) return;

    const maxTransactionID: number = Array.from(transactionMap.values()).reduce((max, transaction) => Math.max(max, transaction.id), -1);

    const intervalID = setInterval(async () => {
      const newTransactions: Transaction[] | null = await fetchTransactions(maxTransactionID);
      if (!newTransactions || newTransactions.length === 0) return;

      setTransactionMap((prevTransactionsMap) => {
        const updatedTransactionsMap = new Map(prevTransactionsMap);
        newTransactions.forEach((transaction) => {
          updatedTransactionsMap.set(transaction.id, transaction);
        });
        return updatedTransactionsMap;
      });
    }, POLL_FREQUENCY_MS);

    // Teardown function
    return () => clearInterval(intervalID);
  }, [transactionMap]);


  const calculateTotals = useCallback(() => {
    const newBillionaireTotalMap = new Map<string, { amount: number, percent: number }>();

    if (transactionMap && billionaireMap && merchantMap) {

      transactionMap.forEach((transaction) => {
        setTotalSpending(totalSpending + transaction.amount);
        const merchant = merchantMap.get(transaction.merchantName);
        if (merchant && merchant.billionaireId) {
          const billionaire = billionaireMap.get(merchant.billionaireId);
          if (billionaire) {
            const billionaireName = billionaire.name;
            const prevTotal = newBillionaireTotalMap.get(billionaireName) || { amount: 0, percent: 0 };
            newBillionaireTotalMap.set(billionaireName, { ...prevTotal, amount: prevTotal.amount + transaction.amount });
          }
        }
      });

      // Calculate percent
      newBillionaireTotalMap.forEach((value, key) => {
        newBillionaireTotalMap.set(key, { ...value, percent: (value.amount / totalSpending) * 100 });
      });
    }

    setBillionaireTotal(newBillionaireTotalMap);
  }, [transactionMap, billionaireMap, merchantMap, totalSpending]);

  useEffect(() => {
    calculateTotals();
  }, [transactionMap, billionaireMap, merchantMap, calculateTotals]);


  return (
    <div id="app">
      <Paper sx={{ padding: 2, borderRadius: 3 }}>
        <Stack spacing={4}>
          <Header />
          {!transactionMap || !billionaireMap ? (
            <Splash />
          ) : (
            <>
              {Array.from(billionaireTotalMap?.entries() ?? []).map(([billionaireName, { amount, percent }]) => (
                <BillionaireStats key={billionaireName} billionaireName={billionaireName} total={amount} percent={percent} />
              ))}
              <TransactionList
                transactions={transactionMap ? Array.from(transactionMap.values()) : []}
                billionaires={billionaireMap ? Array.from(billionaireMap.values()) : []}
                merchantMap={merchantMap}
                handleMerchantOwnerChange={handleMerchantOwnerChange}
              />
            </>
          )}
        </Stack>
      </Paper>
    </div>
  );
}
