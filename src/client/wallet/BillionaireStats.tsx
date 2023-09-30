import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

export default function BillionaireStats({ billionaireName, total, percent }: { billionaireName: string, total: number; percent: number }) {
  const percentDecimalPlaces = percent % 1 !== 0 ? 1 : 0;

  return (
    <Stack direction="row" justifyContent="center">
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 5, maxWidth: 500 }}>
        <Stack spacing={2}>
          <Typography variant="h4" color="secondary.main">
            {billionaireName}
          </Typography>
          <Typography variant="h4" color="secondary.main">
            Your contribution
          </Typography>
          <Stack direction="row" justifyContent="space-around" sx={{ flexWrap: 'wrap' }}>
            <Typography variant="h4" color="info.main" sx={{ paddingRight: 2 }}>
              ${total.toFixed(2)}
            </Typography>
            <Typography variant="h4" color="info.main">
              {percent.toFixed(percentDecimalPlaces)}%
            </Typography>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}
