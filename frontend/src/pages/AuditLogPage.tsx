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
  Paper,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { RootState, AppDispatch } from '../store';
import auditService from '../services/auditService';
import {
  setLoading,
  setError,
  setAuditLogs,
  setAuditSummary,
  setFilters,
} from '../store/slices/auditSlice';
import AuditLogTable from '../components/audit/AuditLogTable';
import { AUDIT_ACTIONS } from '../types/audit';

const AuditLogPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error, filters, page, pageSize, total, summary } = useSelector(
    (state: RootState) => state.audit
  );

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAuditLogs();
    fetchAuditSummary();
  }, [filters]);

  const fetchAuditLogs = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await auditService.getAuditLogs(filters);
      dispatch(setAuditLogs({
        items: response.data.items,
        total: response.data.total,
        page: response.data.page,
        pageSize: response.data.pageSize,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch audit logs';
      dispatch(setError(message));
    }
  };

  const fetchAuditSummary = async () => {
    try {
      const response = await auditService.getAuditSummary();
      dispatch(setAuditSummary(response.data));
    } catch (err) {
      // Summary is optional, don't show error
      console.error('Failed to fetch audit summary:', err);
    }
  };

  const handleSearch = () => {
    dispatch(setFilters({
      ...filters,
      search: searchQuery,
      page: 1,
    }));
  };

  const handleActionFilter = (action: string) => {
    dispatch(setFilters({
      ...filters,
      action: action || undefined,
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
          Audit Log
        </Typography>
        <Typography variant="body2" color="textSecondary">
          View all financial transactions and system changes
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      {summary && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" variant="body2">
                  Total Entries
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>
                  {summary.totalEntries}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" variant="body2">
                  Last Action
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1, fontSize: '0.9rem' }}>
                  {summary.lastEntry ? summary.lastEntry.action : 'None'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" variant="body2">
                  Transactions Created
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>
                  {(summary.actionCounts['INCOME_CREATED'] || 0) + (summary.actionCounts['EXPENSE_CREATED'] || 0)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" variant="body2">
                  Logins
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>
                  {summary.actionCounts['LOGIN'] || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Filters */}
      <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search audit logs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{ flex: 1, minWidth: 200 }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />

        <FormControl size="small" sx={{ width: 200, minWidth: 150 }}>
          <InputLabel>Action</InputLabel>
          <Select
            value={filters.action || ''}
            label="Action"
            onChange={(e) => handleActionFilter(e.target.value)}
          >
            <MenuItem value="">All Actions</MenuItem>
            {Object.entries(AUDIT_ACTIONS).map(([key, value]) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
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

      {/* Audit Logs Table */}
      {loading && items.length === 0 ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <AuditLogTable entries={items} loading={loading} />

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

      {/* Info Box */}
      <Paper sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5' }}>
        <Typography variant="body2" color="textSecondary">
          <strong>Note:</strong> Audit logs are immutable and cannot be deleted. All financial transactions and system changes are recorded for security and compliance purposes.
        </Typography>
      </Paper>
    </Container>
  );
};

export default AuditLogPage;
