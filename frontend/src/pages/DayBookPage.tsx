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
} from '@mui/material';
import { RootState, AppDispatch } from '../store';
import dayBookService from '../services/dayBookService';
import { setLoading, setError, setDayBook, setFilters } from '../store/slices/dayBookSlice';
import DayBookTable from '../components/daybook/DayBookTable';
import DateRangeFilter from '../components/common/DateRangeFilter';

const DayBookPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error, filters, page, pageSize, openingBalance, totalIncome, totalExpense, closingBalance, total } =
    useSelector((state: RootState) => state.daybook);

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDayBook();
  }, [filters]);

  const fetchDayBook = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await dayBookService.getDayBook(filters);

      dispatch(setDayBook({
        items: response.data.items,
        total: response.data.total,
        page: response.data.page,
        pageSize: response.data.pageSize,
        openingBalance: response.data.openingBalance,
        totalIncome: response.data.totalIncome,
        totalExpense: response.data.totalExpense,
        closingBalance: response.data.closingBalance,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch day book';
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
          Day Book
        </Typography>
        <Typography variant="body2" color="textSecondary">
          All financial transactions in chronological order
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
          <DayBookTable
            entries={items}
            loading={loading}
            openingBalance={openingBalance}
            closingBalance={closingBalance}
            totalIncome={totalIncome}
            totalExpense={totalExpense}
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

export default DayBookPage;
