import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Alert,
  Paper,
  Button,
  CircularProgress,
} from '@mui/material';
import { RootState, AppDispatch } from '../store';
import { setLoading, setError, setDashboardData } from '../store/slices/dashboardSlice';
import dashboardService from '../services/dashboardService';
import SummaryCard from '../components/dashboard/SummaryCard';
import IncomeExpenseChart from '../components/dashboard/IncomeExpenseChart';
import CategoryBreakdownChart from '../components/dashboard/CategoryBreakdownChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { summary, monthlyData, incomeBreakdown, expenseBreakdown, recentTransactions, loading, error } =
    useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await dashboardService.getDashboardData();
      dispatch(setDashboardData({
        summary: response.data.summary,
        recentTransactions: response.data.recentTransactions,
        monthlyData: response.data.monthlyData,
        incomeBreakdown: response.data.incomeBreakdown,
        expenseBreakdown: response.data.expenseBreakdown,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch dashboard data';
      dispatch(setError(message));
    }
  };

  if (loading && !summary) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          Welcome back!
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Here's your financial overview
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Dashboard Content */}
      <Grid container spacing={3}>
        {/* Welcome Card */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)', color: 'white' }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              Madrasa Accounting System
            </Typography>
            <Typography variant="body1">
              Your financial overview at a glance. Track income, expenses, and account balance in real-time.
            </Typography>
          </Paper>
        </Grid>

        {/* Summary Cards */}
        {summary && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard
                title="Today's Income"
                amount={summary.todayIncome}
                type="income"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard
                title="Today's Expense"
                amount={summary.todayExpense}
                type="expense"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard
                title="This Month's Income"
                amount={summary.monthlyIncome}
                type="income"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard
                title="Current Balance"
                amount={summary.currentBalance}
                type="balance"
              />
            </Grid>
          </>
        )}

        {/* Monthly Trend Chart */}
        {monthlyData && monthlyData.length > 0 && (
          <Grid item xs={12}>
            <IncomeExpenseChart
              data={monthlyData}
              title="12-Month Income vs Expense Trend"
              chartType="line"
            />
          </Grid>
        )}

        {/* Category Breakdown Charts */}
        <Grid item xs={12} md={6}>
          {incomeBreakdown && incomeBreakdown.length > 0 && (
            <CategoryBreakdownChart
              data={incomeBreakdown}
              title="Income by Category"
              type="INCOME"
            />
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          {expenseBreakdown && expenseBreakdown.length > 0 && (
            <CategoryBreakdownChart
              data={expenseBreakdown}
              title="Expense by Category"
              type="EXPENSE"
            />
          )}
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12}>
          <RecentTransactions transactions={recentTransactions} limit={10} />
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button variant="contained" color="primary" onClick={() => navigate('/income')}>
                Add Income
              </Button>
              <Button variant="contained" color="primary" onClick={() => navigate('/expense')}>
                Add Expense
              </Button>
              <Button variant="outlined" color="primary" onClick={() => navigate('/daybook')}>
                View Day Book
              </Button>
              <Button variant="outlined" color="primary" onClick={() => navigate('/ledger')}>
                View Ledger
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
