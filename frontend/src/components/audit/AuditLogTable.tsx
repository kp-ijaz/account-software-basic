import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import { AuditLogEntry } from '../../types/audit';

interface AuditLogTableProps {
  entries: AuditLogEntry[];
  loading: boolean;
}

const AuditLogTable: React.FC<AuditLogTableProps> = ({ entries, loading }) => {
  if (loading && entries.length === 0) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (entries.length === 0) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography color="textSecondary" textAlign="center">
          No audit log entries found
        </Typography>
      </Paper>
    );
  }

  const getActionColor = (action: string) => {
    if (action.includes('LOGIN') || action.includes('LOGOUT')) return 'info';
    if (action.includes('CREATED')) return 'success';
    if (action.includes('UPDATED')) return 'warning';
    if (action.includes('DELETED')) return 'error';
    return 'default';
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
          <TableRow>
            <TableCell><strong>Date/Time</strong></TableCell>
            <TableCell><strong>Action</strong></TableCell>
            <TableCell><strong>User</strong></TableCell>
            <TableCell><strong>Description</strong></TableCell>
            <TableCell><strong>Entity Type</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id} hover>
              <TableCell sx={{ fontSize: '0.9rem' }}>
                {formatDateTime(entry.createdAt)}
              </TableCell>
              <TableCell>
                <Chip
                  label={entry.action}
                  color={getActionColor(entry.action) as any}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell>{entry.userEmail || entry.userId}</TableCell>
              <TableCell>{entry.description}</TableCell>
              <TableCell>{entry.entityType || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AuditLogTable;
