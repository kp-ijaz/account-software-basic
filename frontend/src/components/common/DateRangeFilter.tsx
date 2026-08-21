import React, { useState } from 'react';
import { Box, TextField, Button, Stack } from '@mui/material';

interface DateRangeFilterProps {
  onFilter: (startDate?: string, endDate?: string) => void;
  loading?: boolean;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ onFilter, loading = false }) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleFilter = () => {
    onFilter(startDate || undefined, endDate || undefined);
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    onFilter(undefined, undefined);
  };

  return (
    <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
          sx={{ width: 200 }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
          sx={{ width: 200 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleFilter}
          disabled={loading}
          sx={{ mt: 1 }}
        >
          Filter
        </Button>
        <Button
          variant="outlined"
          onClick={handleReset}
          disabled={loading}
          sx={{ mt: 1 }}
        >
          Reset
        </Button>
      </Stack>
    </Box>
  );
};

export default DateRangeFilter;
