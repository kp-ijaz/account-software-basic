import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Pagination,
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
import AuditLogDetailDialog from '../components/audit/AuditLogDetailDialog';
import { AUDIT_ACTIONS, AUDIT_ACTION_LABELS, AUDIT_MODULES, AuditLogEntry } from '../types/audit';
import { getAuditActionLabel } from '../utils/auditFormat';

const AuditLogPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error, filters, page, pageSize, total, summary } = useSelector(
    (state: RootState) => state.audit
  );

  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [startDate, setStartDate] = useState(filters.startDate || '');
  const [endDate, setEndDate] = useState(filters.endDate || '');
  const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(null);

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
      const message = err instanceof Error ? err.message : 'Failed to fetch audit trail';
      dispatch(setError(message));
    }
  };

  const fetchAuditSummary = async () => {
    try {
      const response = await auditService.getAuditSummary();
      dispatch(setAuditSummary(response.data));
    } catch (err) {
      console.error('Failed to fetch audit summary:', err);
    }
  };

  const applyFilters = (updates: Partial<typeof filters>) => {
    dispatch(setFilters({
      ...filters,
      ...updates,
      page: updates.page ?? 1,
    }));
  };

  const handleSearch = () => {
    applyFilters({
      search: searchQuery.trim() || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
    dispatch(setFilters({
      page: 1,
      pageSize: filters.pageSize || 50,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    }));
  };

  const counts = summary?.actionCounts || {};
  const createdCount = (counts.INCOME_CREATED || 0) + (counts.EXPENSE_CREATED || 0);
  const modifiedCount = (counts.INCOME_UPDATED || 0) + (counts.EXPENSE_UPDATED || 0);
  const deletedCount = (counts.INCOME_DELETED || 0) + (counts.EXPENSE_DELETED || 0);
  const pages = Math.ceil(total / pageSize) || 1;

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Audit Trail
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Permanent record of who created, changed, or deleted financial data. These entries cannot be edited or removed.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {summary && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" variant="body2">All events</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>
                  {summary.totalEntries}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" variant="body2">Created</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1, color: 'success.main' }}>
                  {createdCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" variant="body2">Modified</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1, color: 'warning.main' }}>
                  {modifiedCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" variant="body2">Deleted</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1, color: 'error.main' }}>
                  {deletedCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              placeholder="Search description, action, or record ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              fullWidth
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField
              label="From"
              type="date"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField
              label="To"
              type="date"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <FormControl size="small" fullWidth>
              <InputLabel>Module</InputLabel>
              <Select
                value={filters.module || ''}
                label="Module"
                onChange={(e) => applyFilters({ module: e.target.value || undefined })}
              >
                {AUDIT_MODULES.map((module) => (
                  <MenuItem key={module.value} value={module.value}>
                    {module.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={2}>
            <FormControl size="small" fullWidth>
              <InputLabel>Event</InputLabel>
              <Select
                value={filters.action || ''}
                label="Event"
                onChange={(e) => applyFilters({ action: e.target.value || undefined })}
              >
                <MenuItem value="">All events</MenuItem>
                {Object.values(AUDIT_ACTIONS).map((action) => (
                  <MenuItem key={action} value={action}>
                    {AUDIT_ACTION_LABELS[action] || action}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={handleClearFilters} disabled={loading}>
              Clear
            </Button>
            <Button variant="contained" onClick={handleSearch} disabled={loading}>
              Search
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {summary?.lastEntry && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          Latest event: {getAuditActionLabel(summary.lastEntry.action)} on {new Date(summary.lastEntry.createdAt).toLocaleString('en-IN')}
        </Typography>
      )}

      {loading && items.length === 0 ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <AuditLogTable
            entries={items}
            loading={loading}
            onView={setSelectedEntry}
          />

          {pages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={pages}
                page={page}
                onChange={(_, newPage) => applyFilters({ page: newPage })}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      <Paper sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5' }}>
        <Typography variant="body2" color="textSecondary">
          <strong>How this is used:</strong> When income or expense is added, edited, or deleted, the system records the user, time, amount, and previous values. Use this trail to verify who changed a voucher and what was changed. Audit records cannot be deleted from this screen.
        </Typography>
      </Paper>

      <AuditLogDetailDialog
        entry={selectedEntry}
        open={!!selectedEntry}
        onClose={() => setSelectedEntry(null)}
      />
    </Container>
  );
};

export default AuditLogPage;
