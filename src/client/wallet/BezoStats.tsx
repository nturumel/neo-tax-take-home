import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

export default function Stats({ name, total, percent }: { name: string, total: number; percent: number }) {
  const percentDecimalPlaces = percent % 1 !== 0 ? 1 : 0;

  return (
    <Stack direction="row" justifyContent="center">
      <Paper elevation={3} sx={{ padding: 1, borderRadius: 3, maxWidth: 300 }}> {/* Reduced padding, borderRadius, and maxWidth */}
        <Stack spacing={1}> {/* Reduced spacing */}
          <Stack direction="row" justifyContent="space-around" sx={{ flexWrap: 'wrap' }}>
            <Typography variant="body1" color="info.main" sx={{ paddingRight: 1 }}> {/* Changed from h4 to body1 */}
              {name}
            </Typography>
            <Typography variant="body1" color="info.main" sx={{ paddingRight: 1 }}> {/* Changed from h4 to body1 */}
              ${total.toFixed(2)}
            </Typography>
            <Typography variant="body1" color="info.main"> {/* Changed from h4 to body1 */}
              {percent.toFixed(percentDecimalPlaces)}%
            </Typography>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}
