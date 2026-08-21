import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import { BalanceSheetData } from '../../types/reports';

interface BalanceSheetViewProps {
  balanceSheet: BalanceSheetData['data'];
}

const BalanceSheetView: React.FC<BalanceSheetViewProps> = ({ balanceSheet }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const { assets, liabilities, equity, asOf } = balanceSheet;

  return (
    <Box>
      {/* Report Header */}
      <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f5f5f5' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
          Balance Sheet
        </Typography>
        <Typography variant="body1" color="textSecondary">
          As of {asOf}
        </Typography>
      </Paper>

      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Left side - Assets and Liabilities */}
        <Box sx={{ flex: 1 }}>
          {/* Assets */}
          <Paper sx={{ mb: 3 }}>
            <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                ASSETS
              </Typography>
            </Box>

            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Cash</TableCell>
                    <TableCell align="right">{formatCurrency(assets.cash)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Bank Balance</TableCell>
                    <TableCell align="right">{formatCurrency(assets.bankBalance)}</TableCell>
                  </TableRow>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 'bold' }}>Total Assets</Typography></TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                        {formatCurrency(assets.totalAssets)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Liabilities */}
          <Paper>
            <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                LIABILITIES
              </Typography>
            </Box>

            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Pending Payables</TableCell>
                    <TableCell align="right">{formatCurrency(liabilities.pendingPayables)}</TableCell>
                  </TableRow>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 'bold' }}>Total Liabilities</Typography></TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                        {formatCurrency(liabilities.totalLiabilities)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>

        {/* Right side - Equity */}
        <Box sx={{ flex: 1 }}>
          <Paper>
            <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                EQUITY
              </Typography>
            </Box>

            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Opening Balance</TableCell>
                    <TableCell align="right">{formatCurrency(equity.openingBalance)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Current Income</TableCell>
                    <TableCell align="right" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                      {formatCurrency(equity.currentIncome)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Current Expense</TableCell>
                    <TableCell align="right" sx={{ color: '#f44336', fontWeight: 'bold' }}>
                      ({formatCurrency(equity.currentExpense)})
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Net Profit</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(equity.netProfit)}
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 'bold' }}>Total Equity</Typography></TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                        {formatCurrency(equity.totalEquity)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Box>

      {/* Verification */}
      <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body1">
            Total Assets:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            {formatCurrency(assets.totalAssets)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body1">
            Total Liabilities & Equity:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            {formatCurrency(balanceSheet.totalLiabilitiesAndEquity)}
          </Typography>
        </Box>
        {Math.abs(assets.totalAssets - balanceSheet.totalLiabilitiesAndEquity) < 0.01 && (
          <Box sx={{ mt: 2, color: '#4caf50', fontWeight: 'bold' }}>
            ✓ Balance Sheet is balanced
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default BalanceSheetView;
