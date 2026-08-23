import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Divider,
} from '@mui/material';
import { AuditLogEntry } from '../../types/audit';
import {
  formatAuditDateTime,
  getAuditActionLabel,
  getAuditChanges,
  getAuditEventKind,
  getAuditModule,
  shortenRecordId,
} from '../../utils/auditFormat';

interface AuditLogDetailDialogProps {
  entry: AuditLogEntry | null;
  open: boolean;
  onClose: () => void;
}

const AuditLogDetailDialog: React.FC<AuditLogDetailDialogProps> = ({ entry, open, onClose }) => {
  if (!entry) return null;

  const changes = getAuditChanges(entry);
  const changedRows = changes.filter((row) => row.changed);
  const kind = getAuditEventKind(entry.action);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Audit trail details
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {getAuditActionLabel(entry.action)}
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">Date & time</Typography>
            <Typography variant="body2">{formatAuditDateTime(entry.createdAt)}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">User</Typography>
            <Typography variant="body2">{entry.userEmail || 'Administrator'}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Module</Typography>
            <Typography variant="body2">{getAuditModule(entry.action, entry.tableName)}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Record ID</Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              {shortenRecordId(entry.recordId || entry.transactionId)}
            </Typography>
          </Box>
        </Box>

        <Typography variant="body2" sx={{ mb: 2 }}>
          {entry.description}
        </Typography>

        {changedRows.length > 0 && (
          <>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              {kind === 'updated' ? 'What changed' : kind === 'created' ? 'Recorded values' : 'Previous values'}
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Field</strong></TableCell>
                  {kind !== 'created' && <TableCell><strong>Before</strong></TableCell>}
                  {kind !== 'deleted' && <TableCell><strong>After</strong></TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {changedRows.map((row) => (
                  <TableRow key={row.field}>
                    <TableCell>{row.label}</TableCell>
                    {kind !== 'created' && (
                      <TableCell sx={{ color: kind === 'updated' ? 'error.main' : 'text.primary' }}>
                        {row.before}
                      </TableCell>
                    )}
                    {kind !== 'deleted' && (
                      <TableCell sx={{ color: kind === 'updated' ? 'success.main' : 'text.primary' }}>
                        {row.after}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}

        {kind === 'created' && changedRows.length === 0 && entry.newValues && (
          <Typography variant="body2" color="text.secondary">
            This record was created. Open the related income or expense entry to view current details.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Chip size="small" label="Cannot be edited or deleted" variant="outlined" />
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AuditLogDetailDialog;
