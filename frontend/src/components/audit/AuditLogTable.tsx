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
  IconButton,
  Tooltip,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { AuditLogEntry } from '../../types/audit';
import {
  formatAuditDateTime,
  getAuditActionLabel,
  getAuditAmount,
  getAuditEventKind,
  getAuditModule,
  shortenRecordId,
} from '../../utils/auditFormat';

interface AuditLogTableProps {
  entries: AuditLogEntry[];
  loading: boolean;
  onView: (entry: AuditLogEntry) => void;
}

const AuditLogTable: React.FC<AuditLogTableProps> = ({ entries, loading, onView }) => {
  if (loading && entries.length === 0) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (entries.length === 0) {
    return (
      <Paper sx={{ p: 4 }}>
        <Typography color="textSecondary" textAlign="center">
          No audit trail entries match the selected filters.
        </Typography>
      </Paper>
    );
  }

  const getActionColor = (action: string) => {
    const kind = getAuditEventKind(action);
    if (kind === 'security') return 'info';
    if (kind === 'created') return 'success';
    if (kind === 'updated') return 'warning';
    if (kind === 'deleted') return 'error';
    return 'default';
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
          <TableRow>
            <TableCell><strong>Date & time</strong></TableCell>
            <TableCell><strong>Event</strong></TableCell>
            <TableCell><strong>Module</strong></TableCell>
            <TableCell><strong>Details</strong></TableCell>
            <TableCell><strong>Amount</strong></TableCell>
            <TableCell><strong>User</strong></TableCell>
            <TableCell><strong>Record</strong></TableCell>
            <TableCell align="right"><strong>View</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.map((entry) => (
            <TableRow
              key={entry.id}
              hover
              sx={{ cursor: 'pointer' }}
              onClick={() => onView(entry)}
            >
              <TableCell sx={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                {formatAuditDateTime(entry.createdAt)}
              </TableCell>
              <TableCell>
                <Chip
                  label={getAuditActionLabel(entry.action)}
                  color={getActionColor(entry.action) as 'info' | 'success' | 'warning' | 'error' | 'default'}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell>{getAuditModule(entry.action, entry.tableName)}</TableCell>
              <TableCell sx={{ maxWidth: 320 }}>
                <Typography variant="body2" noWrap title={entry.description}>
                  {entry.description}
                </Typography>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                {getAuditAmount(entry) || '-'}
              </TableCell>
              <TableCell>{entry.userEmail || 'Administrator'}</TableCell>
              <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                {shortenRecordId(entry.recordId || entry.transactionId)}
              </TableCell>
              <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                <Tooltip title="View before and after values">
                  <IconButton size="small" onClick={() => onView(entry)}>
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AuditLogTable;
