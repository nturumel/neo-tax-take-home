import React from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { OwnableTransaction } from './../utils/types';
import { Billionaire } from '../../shared/types';

export default function TogglableTransaction({
  transaction,
  handleChangeOfOwner,
  billionaires
}: {
  transaction: OwnableTransaction;
  handleChangeOfOwner: (name: string, isOwnedBy: string) => void;
  billionaires: Billionaire[]
}) {
  const handleChange = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
    handleChangeOfOwner(transaction.merchantName, event.target.value as string);
  };

  return (
    <Paper elevation={1}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Stack flexGrow={1} justifyContent="center">
          <Select
            value={transaction.isOwnedBy || ''}
            onChange={handleChange}
            label="Owned By"
            variant="outlined"
            fullWidth
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {billionaires.map((billionaire) => (
              <MenuItem key={billionaire.name} value={billionaire.name}>
                {billionaire.name}
              </MenuItem>
            ))}
          </Select>
        </Stack>

        <Stack flexGrow={1} justifyContent="center">
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {transaction.date.toLocaleDateString()}
          </Typography>
        </Stack>

        <Stack flexGrow={1} justifyContent="center">
          <Typography variant="body1" sx={{ fontWeight: 800 }}>
            {transaction.merchantName}
          </Typography>
        </Stack>

        <Stack flexGrow={1} justifyContent="center">
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            ${transaction.amount.toFixed(2)}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}
