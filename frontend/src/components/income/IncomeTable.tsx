import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { Income } from '../../types/income';

interface IncomeTableProps {
  items: Income[];
  total: number;
  page: number;
  pageSize: number;
  loading?: boolean;
  error?: string | null;
  onEdit: (income: Income) => void;
  onDelete: (incomeId: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export default function IncomeTable({
  items,
  total,
  page,
  pageSize,
  loading = false,
  error,
  onEdit,
  onDelete,
  onPageChange,
  onPageSizeChange,
}: IncomeTableProps) {
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (loading && items.length === 0) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell>Method</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                No income records found
              </TableCell>
            </TableRow>
          ) : (
            items.map((income) => (
              <TableRow key={income.id} hover>
                <TableCell>{income.date}</TableCell>
                <TableCell>{income.category?.name || '-'}</TableCell>
                <TableCell>{income.description}</TableCell>
                <TableCell align="right" sx={{ color: '#2e7d32', fontWeight: 600 }}>
                  ${parseFloat(income.amount.toString()).toFixed(2)}
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: 'inline-block',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      backgroundColor: income.paymentMethod === 'CASH' ? '#e3f2fd' : '#f3e5f5',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                    }}
                  >
                    {income.paymentMethod}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={() => onEdit(income)}
                    color="primary"
                    title="Edit"
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this income?')) {
                        onDelete(income.id);
                      }
                    }}
                    color="error"
                    title="Delete"
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={total}
        rowsPerPage={pageSize}
        page={page - 1} // MUI uses 0-based indexing
        onPageChange={(event, newPage) => onPageChange(newPage + 1)}
        onRowsPerPageChange={(event) => onPageSizeChange(parseInt(event.target.value, 10))}
      />
    </TableContainer>
  );
}
