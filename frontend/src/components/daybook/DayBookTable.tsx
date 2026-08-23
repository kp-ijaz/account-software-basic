import { formatINR } from '../../utils/currency';
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material';
import { DayBookEntry } from '../../types/daybook';

interface DayBookTableProps {
  entries: DayBookEntry[];
  loading: boolean;
  openingBalance: number;
  closingBalance: number;
  totalIncome: number;
  totalExpense: number;
}

const DayBookTable: React.FC<DayBookTableProps> = ({
  entries,
  loading,
  openingBalance,
  closingBalance,
  totalIncome,
  totalExpense,
}) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (entries.length === 0) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography color="textSecondary" textAlign="center">
          No transactions found
        </Typography>
      </Paper>
    );
  }

  const formatCurrency = (amount: number) => {
    return formatINR(amount);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
          <TableRow>
            <TableCell><strong>Date</strong></TableCell>
            <TableCell><strong>Description</strong></TableCell>
            <TableCell><strong>Category</strong></TableCell>
            <TableCell align="right"><strong>Income</strong></TableCell>
            <TableCell align="right"><strong>Expense</strong></TableCell>
            <TableCell align="right"><strong>Balance</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id} hover>
              <TableCell>{entry.date}</TableCell>
              <TableCell>{entry.description}</TableCell>
              <TableCell>{entry.category}</TableCell>
              <TableCell align="right" sx={{ color: entry.income > 0 ? '#4caf50' : 'inherit' }}>
                {entry.income > 0 ? formatCurrency(entry.income) : '-'}
              </TableCell>
              <TableCell align="right" sx={{ color: entry.expense > 0 ? '#f44336' : 'inherit' }}>
                {entry.expense > 0 ? formatCurrency(entry.expense) : '-'}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                {formatCurrency(entry.balance)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderTop: '2px solid #ddd' }}>
        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
          <Box>
            <Typography variant="body2" color="textSecondary">
              Opening Balance
            </Typography>
            <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
              {formatCurrency(openingBalance)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="textSecondary">
              Total Income / Expense
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              <span style={{ color: '#4caf50' }}>{formatCurrency(totalIncome)}</span> / <span style={{ color: '#f44336' }}>{formatCurrency(totalExpense)}</span>
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="textSecondary">
              Closing Balance
            </Typography>
            <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
              {formatCurrency(closingBalance)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </TableContainer>
  );
};

export default DayBookTable;
