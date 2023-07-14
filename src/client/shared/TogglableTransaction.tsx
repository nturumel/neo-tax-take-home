import React from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';

import { OwnableTransaction } from './../utils/types';

export default function TogglableTransaction({
  transaction,
  toggleBezosMerchant,
}: {
  transaction: OwnableTransaction;
  toggleBezosMerchant: (name: string, isOwnedByBezos: boolean) => void;
}) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    toggleBezosMerchant(transaction.merchantName, event.target.checked);
  };

  return (
    <Paper elevation={1} sx={{ backgroundColor: 'primary' }}>
      <Stack direction="row" alignItems="center">
        <Checkbox
          aria-label="Is transaction merchant owned by Bezos? checkbox"
          checked={transaction.isOwnedByBezos}
          onChange={handleChange}
        />
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-around"
          width="100%"
          sx={{ flexWrap: 'wrap', paddingLeft: 2, paddingRight: 2 }}
        >
          <Stack direction="row" minWidth="25%">
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {transaction.date.toLocaleDateString()}
            </Typography>
          </Stack>

          <Stack direction="row" minWidth="40%">
            <Typography variant="body1" sx={{ fontWeight: 800 }}>
              {transaction.merchantName}
            </Typography>
          </Stack>

          <Stack direction="row" minWidth="15%">
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              ${transaction.amount.toFixed(2)}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
}
