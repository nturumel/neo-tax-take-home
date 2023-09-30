import React, { useState, useEffect, useCallback } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

import Header from './wallet/Header';
import Stats from './wallet/BezoStats';
import TransactionList from './wallet/TransactionList';
import Splash from './shared/Splash';
import { Transaction } from './../shared/types';
import { fetchTransactions, fetchMerchants, updateMerchant } from './utils/fetch';
import { BillionaireList } from '../shared/constants';
import { Grid, Typography } from '@mui/material';

const POLL_FREQUENCY_MS = 10000;

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [merchantsMap, setMerchantsMap] = useState<Map<string, { name: string, isOwnedBy: string }> | null>(null);
  const [billionaireSpending, setBillionaireSpending] = useState<Record<string, number>>({});
  const [totalSpending, setTotalSpending] = useState<number>(0);

  const handleChangeOfOwner = useCallback(
    async (merchantName: string, isOwnedBy: string) => {
      if (!merchantsMap) {
        console.error('MerchantsMap is not available.');
        return;
      }

      const updatedMerchantsMap = new Map(merchantsMap);
      updatedMerchantsMap.set(merchantName, { name: merchantName, isOwnedBy });
      setMerchantsMap(updatedMerchantsMap);

      const isUpdated = await updateMerchant({ name: merchantName, isOwnedBy });
      if (!isUpdated) {
        console.error('Unable to update merchant.');
        setMerchantsMap(merchantsMap);
        return;
      }

      const merchants = await fetchMerchants();
      if (merchants) {
        setMerchantsMap(new Map(merchants.map((merchant) => [merchant.name, merchant])));
      }
    },
    [merchantsMap],
  );

  useEffect(() => {
    const fetchTransactionsAndMerchants = async () => {
      const fetchedTransactions = await fetchTransactions();
      setTransactions(fetchedTransactions);

      const merchants = await fetchMerchants();
      if (merchants) {
        setMerchantsMap(new Map(merchants.map((merchant) => [merchant.name, merchant])));
      }
    };

    fetchTransactionsAndMerchants();
  }, []);

  useEffect(() => {
    const intervalID = setInterval(async () => {
      if (!transactions) return;

      const maxTransactionID = transactions.reduce((max, tx) => Math.max(max, tx.id), -1);
      const newTransactions = await fetchTransactions(maxTransactionID);

      if (newTransactions && newTransactions.length > 0) {
        setTransactions([...transactions, ...newTransactions]);
      }
    }, POLL_FREQUENCY_MS);

    return () => clearInterval(intervalID);
  }, [transactions]);

  useEffect(() => {
    if (transactions && merchantsMap) {
      const newTotalSpending = transactions.reduce((sum, tx) => sum + tx.amount, 0);
      const newBillionaireSpending: Record<string, number> = {};

      transactions.forEach((tx) => {
        const merchantInfo = merchantsMap.get(tx.merchantName);
        if (merchantInfo) {
          newBillionaireSpending[merchantInfo.isOwnedBy] = (newBillionaireSpending[merchantInfo.isOwnedBy] || 0) + tx.amount;
        }
      });

      setTotalSpending(newTotalSpending);
      setBillionaireSpending(newBillionaireSpending);
    }
  }, [transactions, merchantsMap]);

  return (
    <div id="app">
      <Paper sx={{ padding: 2, borderRadius: 3 }}>
        <Stack spacing={4}>
          <Header />
          {!transactions || !merchantsMap ? (
            <Splash />
          ) : (
            <>
              <Stack direction="row" justifyContent="center">
                <Typography variant="h3" color="primary.main">
                  Total Spending: ${totalSpending.toFixed(2)}
                </Typography>
              </Stack>
              <Grid container spacing={2}>
                {BillionaireList.map((billionaire) => {
                  const total = billionaireSpending[billionaire] || 0;
                  const percent = (total / totalSpending) * 100;
                  return (
                    <Grid item xs={12} sm={4} key={billionaire}>
                      <Stats key={billionaire} name={billionaire} total={total} percent={percent} />
                    </Grid>
                  );
                })}
              </Grid>
              <TransactionList
                transactions={transactions}
                merchantsMap={merchantsMap}
                handleChangeOfOwner={handleChangeOfOwner}
              />
            </>
          )}
        </Stack>
      </Paper>
    </div>
  );
}
