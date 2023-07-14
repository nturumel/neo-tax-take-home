import React from 'react';
import Stack from '@mui/material/Stack';

import TogglableTransaction from './../shared/TogglableTransaction';
import { Transaction } from './../../shared/types';

export default function TransactionList({
  transactions,
  bezosMerchants,
  toggleBezosMerchant,
}: {
  transactions: Transaction[];
  bezosMerchants: Set<string>;
  toggleBezosMerchant: (name: string, isOwnedByBezos: boolean) => void;
}) {
  return (
    <Stack spacing={1}>
      {transactions.map((transaction: Transaction): JSX.Element => {
        const isOwnedByBezos: boolean = bezosMerchants.has(transaction.merchantName);

        return (
          <TogglableTransaction
            key={transaction.id}
            transaction={Object.assign({ isOwnedByBezos }, transaction)}
            toggleBezosMerchant={toggleBezosMerchant}
          />
        );
      })}
    </Stack>
  );
}
