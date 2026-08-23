import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Typography,
  Box,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DashboardTransaction } from '../../types/dashboard';
import { formatINR } from '../../utils/currency';

interface RecentTransactionsProps {
  transactions: DashboardTransaction[];
  limit?: number;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions, limit = 10 }) => {
  const navigate = useNavigate();
  const displayTransactions = transactions.slice(0, limit);

  const formatCurrency = (amount: number) => formatINR(amount);

  if (displayTransactions.length === 0) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography color="textSecondary" textAlign="center">
          No transactions yet
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper>
      <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Recent Transactions
          </Typography>
          <Button
            variant="text"
            size="small"
            onClick={() => navigate('/daybook')}
          >
            View All
          </Button>
        </Box>
      </Box>
      <TableContainer>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell><strong>Category</strong></TableCell>
              <TableCell align="right"><strong>Amount</strong></TableCell>
              <TableCell><strong>Type</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayTransactions.map((tx) => (
              <TableRow key={tx.id} hover>
                <TableCell>{tx.date}</TableCell>
                <TableCell>{tx.description}</TableCell>
                <TableCell>{tx.category}</TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color: tx.type === 'INCOME' ? '#4caf50' : '#f44336',
                    fontWeight: 'bold',
                  }}
                >
                  {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                </TableCell>
                <TableCell>
                  <Chip
                    label={tx.type}
                    color={tx.type === 'INCOME' ? 'success' : 'error'}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default RecentTransactions;
