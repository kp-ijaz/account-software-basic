import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Pagination,
  Stack,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { RootState, AppDispatch } from '../store';
import ledgerService from '../services/ledgerService';
import { setLoading, setError, setLedger, setFilters } from '../store/slices/ledgerSlice';
import LedgerTable from '../components/ledger/LedgerTable';
import DateRangeFilter from '../components/common/DateRangeFilter';

const LedgerPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error, filters, page, pageSize, openingBalance, totalDebit, totalCredit, closingBalance, total } =
    useSelector((state: RootState) => state.ledger);

  const [searchQuery, setSearchQuery] = useState('');
  const [transactionType, setTransactionType] = useState<'INCOME' | 'EXPENSE' | ''>('');

  useEffect(() => {
    fetchLedger();
  }, [filters]);

  const fetchLedger = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await ledgerService.getLedger(filters);

      dispatch(setLedger({
        items: response.data.items,
        total: response.data.total,
        page: response.data.page,
        pageSize: response.data.pageSize,
        openingBalance: response.data.openingBalance,
        totalDebit: response.data.totalDebit,
        totalCredit: response.data.totalCredit,
        closingBalance: response.data.closingBalance,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch ledger';
      dispatch(setError(message));
    }
  };

  const handleSearch = () => {
    dispatch(setFilters({
      ...filters,
      search: searchQuery,
      page: 1,
    }));
  };

  const handleDateFilter = (startDate?: string, endDate?: string) => {
    dispatch(setFilters({
      ...filters,
      startDate,
      endDate,
      page: 1,
    }));
  };

  const handleTransactionTypeChange = (type: 'INCOME' | 'EXPENSE' | '') => {
    setTransactionType(type);
    dispatch(setFilters({
      ...filters,
      transactionType: type || undefined,
      page: 1,
    }));
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setFilters({
      ...filters,
      page: newPage,
    }));
  };

  const pages = Math.ceil(total / pageSize);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Ledger
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Account transactions with running balance
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <DateRangeFilter onFilter={handleDateFilter} loading={loading} />

      <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
        <TextField
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{ flex: 1 }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <FormControl sx={{ width: 180, minWidth: 150 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={transactionType}
            label="Type"
            onChange={(e) => handleTransactionTypeChange(e.target.value as 'INCOME' | 'EXPENSE' | '')}
            size="small"
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="INCOME">Income</MenuItem>
            <MenuItem value="EXPENSE">Expense</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          disabled={loading}
        >
          Search
        </Button>
      </Box>

      {loading && items.length === 0 ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <LedgerTable
            entries={items}
            loading={loading}
            openingBalance={openingBalance}
            closingBalance={closingBalance}
            totalDebit={totalDebit}
            totalCredit={totalCredit}
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
    </Container>
  );
};

export default LedgerPage;
