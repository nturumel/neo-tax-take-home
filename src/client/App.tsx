import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import React, { useCallback, useEffect, useState } from 'react';

import { Button, Grid, List, ListItem, TextField, Typography } from '@mui/material';
import { Billionaire, Merchant, Transaction } from './../shared/types';
import Splash from './shared/Splash';
import { addBillionaires, deleteBillionaires, fetchBillionaires, fetchMerchants, fetchTransactions, updateMerchant } from './utils/fetch';
import Stats from './wallet/BezoStats';
import Header from './wallet/Header';
import TransactionList from './wallet/TransactionList';

const POLL_FREQUENCY_MS = 10000;

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [merchantsMap, setMerchantsMap] = useState<Map<string, Merchant> | null>(null);
  const [billionaires, setBillionaires] = useState<Billionaire[] | null>(null);
  const [billionaireSpending, setBillionaireSpending] = useState<Record<string, number>>({});
  const [totalSpending, setTotalSpending] = useState<number>(0);

  const [newBillionaireName, setNewBillionaireName] = useState('');

  const handleAddBillionaire = async () => {
    const newBillionaire = { name: newBillionaireName, id: -1 }; // Assuming the backend will auto-generate an ID
    const isSuccess = await addBillionaires([newBillionaire]);
    if (isSuccess) {
      setBillionaires([...(billionaires || []), newBillionaire]);
      setNewBillionaireName('');
    }
  };

  const handleDeleteBillionaire = async (name: string) => {
    const isSuccess = await deleteBillionaires([{ name: name, id: -1 }]);
    if (isSuccess) {
      setBillionaires(billionaires?.filter(b => b.name !== name) || null);
    }
  };

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
    const fetchTransactionsAndMerchantsAndBillionaires = async () => {
      const fetchedTransactions = await fetchTransactions();
      setTransactions(fetchedTransactions);

      const merchants = await fetchMerchants();
      if (merchants) {
        setMerchantsMap(new Map(merchants.map((merchant) => [merchant.name, merchant])));
      }

      const billionaires = await fetchBillionaires();
      console.log(`Billionaires: ${billionaires}`);
      if (billionaires) {
        setBillionaires(billionaires);
      }
    };

    fetchTransactionsAndMerchantsAndBillionaires();
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
              <Header />
              {/* Add/Delete Billionaire Section */}
              <Stack direction="row" spacing={2}>
                <TextField
                  label="New Billionaire"
                  value={newBillionaireName}
                  onChange={(e) => setNewBillionaireName(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleAddBillionaire}>
                  Add Billionaire
                </Button>
              </Stack>
              <List>
                <Typography variant="h6">List of Billionaires:</Typography>
                {billionaires?.map((billionaire) => (
                  <ListItem key={billionaire.name}>
                    {billionaire.name}
                    <Button variant="contained" color="secondary" onClick={() => handleDeleteBillionaire(billionaire.name)}>
                      Delete
                    </Button>
                  </ListItem>
                ))}
              </List>
              <Stack direction="row" justifyContent="center">
                <Typography variant="h3" color="primary.main">
                  Total Spending: ${totalSpending.toFixed(2)}
                </Typography>
              </Stack>
              <Grid container spacing={2}>
                {billionaires?.map((billionaire) => {
                  const total = billionaireSpending[billionaire.name] || 0;
                  const percent = (total / totalSpending) * 100;
                  return (
                    <Grid item xs={12} sm={4} key={billionaire.name}>
                      <Stats key={billionaire.name} name={billionaire.name} total={total} percent={percent} />
                    </Grid>
                  );
                })}
              </Grid>
              <TransactionList
                transactions={transactions}
                merchantsMap={merchantsMap}
                handleChangeOfOwner={handleChangeOfOwner}
                billionaires={billionaires || []}
              />
            </>
          )}
        </Stack>
      </Paper>
    </div>
  );
}
