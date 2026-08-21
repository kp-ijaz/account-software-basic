import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  setLoading,
  setError,
  setIncomes,
  addIncome,
  updateIncomeItem,
  removeIncome,
} from '../store/slices/incomeSlice';
import IncomeForm from '../components/income/IncomeForm';
import IncomeTable from '../components/income/IncomeTable';
import incomeService from '../services/incomeService';
import { Income, IncomeCategory } from '../types/income';

// Mock income categories - replace with API call
const mockCategories: IncomeCategory[] = [
  { id: '1', name: 'Student Fees' },
  { id: '2', name: 'Donations' },
  { id: '3', name: 'Zakat' },
  { id: '4', name: 'Sadaqah' },
  { id: '5', name: 'Sponsorship' },
  { id: '6', name: 'Building Fund' },
  { id: '7', name: 'Other Income' },
];

export default function IncomePage() {
  const dispatch = useDispatch();
  const { items, total, page, pageSize, loading, error } = useSelector(
    (state: RootState) => state.income
  );

  const [formOpen, setFormOpen] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch incomes on mount and when filters change
  useEffect(() => {
    fetchIncomes();
  }, [page, pageSize]);

  const fetchIncomes = async () => {
    try {
      dispatch(setLoading(true));
      const response = await incomeService.getIncomes({
        page,
        pageSize,
        search: searchTerm,
      });
      dispatch(
        setIncomes({
          items: response.data.items,
          total: response.data.total,
          page: response.data.page,
          pageSize: response.data.pageSize,
        })
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch incomes';
      dispatch(setError(message));
    }
  };

  const handleAddClick = () => {
    setSelectedIncome(null);
    setFormOpen(true);
  };

  const handleEdit = (income: Income) => {
    setSelectedIncome(income);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedIncome(null);
  };

  const handleFormSuccess = (income: Income) => {
    if (selectedIncome) {
      dispatch(updateIncomeItem(income));
    } else {
      dispatch(addIncome(income));
    }
    handleFormClose();
  };

  const handleDelete = async (incomeId: string) => {
    try {
      await incomeService.deleteIncome(incomeId);
      dispatch(removeIncome(incomeId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete income';
      dispatch(setError(message));
    }
  };

  const handleSearch = () => {
    fetchIncomes();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <div>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Income Management
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Manage and track all income transactions
          </Typography>
        </div>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Add Income
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Income
              </Typography>
              <Typography variant="h5" sx={{ color: 'success.main', fontWeight: 700 }}>
                $0.00
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
              <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 700 }}>
                $0.00
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
                All income entries
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Income
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                $0.00
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Per transaction
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filter */}
      <Card sx={{ mb: 4, p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={8}>
            <TextField
              fullWidth
              placeholder="Search income by description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="contained" onClick={handleSearch} fullWidth>
                Search
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setSearchTerm('');
                  fetchIncomes();
                }}
              >
                Reset
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Income Table */}
      {loading && items.length === 0 ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <IncomeTable
          items={items}
          total={total}
          page={page}
          pageSize={pageSize}
          loading={loading}
          error={error}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPageChange={(newPage) => {
            // Update page in Redux
          }}
          onPageSizeChange={(newSize) => {
            // Update page size in Redux
          }}
        />
      )}

      {/* Income Form Dialog */}
      <IncomeForm
        open={formOpen}
        income={selectedIncome}
        categories={mockCategories}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        loading={loading}
      />
    </Container>
  );
}
