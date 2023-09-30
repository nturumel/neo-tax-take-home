import React from 'react';
import Stack from '@mui/material/Stack';

import IndividualTransaction from '../shared/IndividualTransaction';
import { Transaction } from './../../shared/types';

export default function TransactionList({
  transactions,
  billionaires,
  handleMerchantOwnerChange,
  merchantMap
}: {
  transactions: Transaction[];
  billionaires: {
    id: number;
    name: string;
  }[];
  merchantMap: Map<string, {
    id: number;
    name: string;
    billionaireId: number | null;
  }> | undefined;
  handleMerchantOwnerChange: (merchantName: string, billionaireId: number | null) => void;
}) {
  return (
    <Stack spacing={1}>
      {transactions.map((transaction: Transaction): JSX.Element => {
        const merchant = merchantMap?.get(transaction.merchantName);
        return (
          <IndividualTransaction
            key={transaction.id}
            billionaires={billionaires}
            transaction={{
              ...transaction,
              billionaireId: merchant?.billionaireId || -1
            }}
            handleMerchantOwnerChange={handleMerchantOwnerChange}
          />
        );
      })}
    </Stack>
  );
}
