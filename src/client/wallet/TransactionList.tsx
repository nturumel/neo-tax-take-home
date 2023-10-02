import React from 'react';
import Stack from '@mui/material/Stack';

import TogglableTransaction from './../shared/TogglableTransaction';
import { Billionaire, Transaction } from './../../shared/types';

export default function TransactionList({
  transactions,
  merchantsMap,
  handleChangeOfOwner,
  billionaires
}: {
  transactions: Transaction[];
  merchantsMap: Map<string, {
    name: string;
    isOwnedBy: string;
  }>;
  billionaires: Billionaire[]
  handleChangeOfOwner: (name: string, isOwnedBy: string) => void;
}) {
  return (
    <Stack spacing={1}>
      {transactions.map((transaction: Transaction): JSX.Element => {
        const isOwnedBy = merchantsMap.get(transaction.merchantName)?.isOwnedBy || '';

        return (
          <TogglableTransaction
            key={transaction.id}
            transaction={Object.assign({ isOwnedBy }, transaction)}
            handleChangeOfOwner={handleChangeOfOwner}
            billionaires={billionaires}
          />
        );
      })}
    </Stack>
  );
}
