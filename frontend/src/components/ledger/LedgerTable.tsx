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
  Chip,
} from '@mui/material';
import { LedgerEntry } from '../../types/ledger';
import { formatINR } from '../../utils/currency';

interface LedgerTableProps {
  entries: LedgerEntry[];
  loading: boolean;
  openingBalance: number;
  closingBalance: number;
  totalDebit: number;
  totalCredit: number;
}

const LedgerTable: React.FC<LedgerTableProps> = ({
  entries,
  loading,
  openingBalance,
  closingBalance,
  totalDebit,
  totalCredit,
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

  const formatCurrency = (amount: number) => formatINR(amount);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
          <TableRow>
            <TableCell><strong>Date</strong></TableCell>
            <TableCell><strong>Description</strong></TableCell>
            <TableCell><strong>Category</strong></TableCell>
            <TableCell><strong>Type</strong></TableCell>
            <TableCell align="right"><strong>Debit</strong></TableCell>
            <TableCell align="right"><strong>Credit</strong></TableCell>
            <TableCell align="right"><strong>Balance</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id} hover>
              <TableCell>{entry.date}</TableCell>
              <TableCell>{entry.description}</TableCell>
              <TableCell>{entry.categoryName}</TableCell>
              <TableCell>
                <Chip
                  label={entry.transactionType}
                  color={entry.transactionType === 'INCOME' ? 'success' : 'error'}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell align="right" sx={{ color: entry.debit > 0 ? '#4caf50' : 'inherit' }}>
                {entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
              </TableCell>
              <TableCell align="right" sx={{ color: entry.credit > 0 ? '#f44336' : 'inherit' }}>
                {entry.credit > 0 ? formatCurrency(entry.credit) : '-'}
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
              Total Debit / Credit
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              <span style={{ color: '#4caf50' }}>{formatCurrency(totalDebit)}</span> / <span style={{ color: '#f44336' }}>{formatCurrency(totalCredit)}</span>
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

export default LedgerTable;
