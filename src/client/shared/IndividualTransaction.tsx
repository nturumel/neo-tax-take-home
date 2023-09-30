import React from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { MerchantTransaction } from 'utils/types.ts';

export default function IndividualTransaction({
  transaction,
  handleMerchantOwnerChange,
  billionaires,
}: {
  transaction: MerchantTransaction;
  handleMerchantOwnerChange: (name: string, billionaireId: number | null) => void;
  billionaires: {
    id: number;
    name: string;
  }[];
}) {
  const handleChange = (event: SelectChangeEvent<number>, child: React.ReactNode) => {
    handleMerchantOwnerChange(transaction.merchantName, event.target.value as number | null);
  };

  return (
    <Paper elevation={1} sx={{ backgroundColor: 'primary' }}>
      <Stack direction="row" alignItems="center">
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

          <Stack direction="row" minWidth="30%">
            <Typography variant="body1" sx={{ fontWeight: 800 }}>
              {transaction.merchantName}
            </Typography>
          </Stack>

          <Stack direction="row" minWidth="15%">
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              ${transaction.amount.toFixed(2)}
            </Typography>
          </Stack>

          <Stack direction="row" minWidth="20%">
            <FormControl>
              <InputLabel>Billionaire</InputLabel>
              <Select value={transaction.billionaireId || -1} onChange={handleChange}>
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {billionaires.map((billionaire) => (
                  <MenuItem value={billionaire.id} key={billionaire.id}>
                    {billionaire.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
}
