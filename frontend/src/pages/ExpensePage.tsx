import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Pagination,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { RootState, AppDispatch } from '../store';
import expenseService from '../services/expenseService';
import { setLoading, setError, setExpenses } from '../store/slices/expenseSlice';
import ExpenseForm from '../components/expense/ExpenseForm';
import ExpenseTable from '../components/expense/ExpenseTable';
import { formatINR } from '../utils/currency';

const ExpensePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error, filters, page, pageSize, total } = useSelector(
    (state: RootState) => state.expense
  );

  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchExpenses();
  }, [filters]);

  const fetchExpenses = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await expenseService.getExpenses(filters);
      dispatch(setExpenses({
        items: response.data.items,
        total: response.data.total,
        page: response.data.page,
        pageSize: response.data.pageSize,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch expenses';
      dispatch(setError(message));
    }
  };

  const handleSearch = () => {
    dispatch(setError(null));
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setError(null));
  };

  const pages = Math.ceil(total / pageSize);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Expenses
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage expense transactions
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingId(null);
            setOpenForm(true);
          }}
        >
          Add Expense
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Expense
              </Typography>
              <Typography variant="h5" sx={{ color: '#f44336', fontWeight: 700 }}>
                {formatINR(items.reduce((sum, item) => sum + parseFloat(item.amount.toString()), 0))}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                All time
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                This Month
              </Typography>
              <Typography variant="h5" sx={{ color: '#ff6f00', fontWeight: 700 }}>
                {formatINR(items
                  .filter(item => {
                    const itemDate = new Date(item.date);
                    const now = new Date();
                    return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
                  })
                  .reduce((sum, item) => sum + parseFloat(item.amount.toString()), 0)
                )}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Current month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Transactions
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {total}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                All expense entries
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Expense
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {formatINR(
                  items.length > 0
                    ? items.reduce((sum, item) => sum + parseFloat(item.amount.toString()), 0) / items.length
                    : 0
                )}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Per transaction
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mb: 2 }}>
        <TextField
          placeholder="Search expenses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          fullWidth
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
      </Box>

      {loading && items.length === 0 ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <ExpenseTable
            expenses={items}
            loading={loading}
            onEdit={(id) => {
              setEditingId(id);
              setOpenForm(true);
            }}
            onDelete={() => {
              fetchExpenses();
            }}
          />

          {pages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={pages}
                page={page}
                onChange={(_, newPage) => handlePageChange(newPage)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      <ExpenseForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditingId(null);
        }}
        onSuccess={() => {
          setOpenForm(false);
          setEditingId(null);
          fetchExpenses();
        }}
        expenseId={editingId}
      />
    </Container>
  );
};

export default ExpensePage;
