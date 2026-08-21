import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { YearlyReportData } from '../../types/reports';

interface YearlyReportViewProps {
  report: YearlyReportData['data'];
}

const YearlyReportView: React.FC<YearlyReportViewProps> = ({ report }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Box>
      {/* Report Header */}
      <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f5f5f5' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
          Yearly Financial Report
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Year {report.year}
        </Typography>
      </Paper>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" variant="body2">
                Total Annual Income
              </Typography>
              <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 'bold', mt: 1 }}>
                {formatCurrency(report.totalIncome)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" variant="body2">
                Total Annual Expense
              </Typography>
              <Typography variant="h6" sx={{ color: '#f44336', fontWeight: 'bold', mt: 1 }}>
                {formatCurrency(report.totalExpense)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" variant="body2">
                Annual Net Balance
              </Typography>
              <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 'bold', mt: 1 }}>
                {formatCurrency(report.netBalance)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Monthly Breakdown Table */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          Monthly Breakdown
        </Typography>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><strong>Month</strong></TableCell>
                <TableCell align="right"><strong>Income</strong></TableCell>
                <TableCell align="right"><strong>Expense</strong></TableCell>
                <TableCell align="right"><strong>Balance</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {report.months.map((month) => (
                <TableRow key={month.month}>
                  <TableCell><strong>{month.month}</strong></TableCell>
                  <TableCell align="right" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                    {formatCurrency(month.income)}
                  </TableCell>
                  <TableCell align="right" sx={{ color: '#f44336', fontWeight: 'bold' }}>
                    {formatCurrency(month.expense)}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                    {formatCurrency(month.balance)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default YearlyReportView;
