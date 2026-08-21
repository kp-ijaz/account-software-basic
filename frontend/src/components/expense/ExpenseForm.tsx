import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { CreateExpenseInput, Expense, ExpenseCategory } from '../../types/expense';
import expenseService from '../../services/expenseService';

interface ExpenseFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  expenseId?: string | null;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ open, onClose, onSuccess, expenseId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [formData, setFormData] = useState<CreateExpenseInput>({
    date: new Date().toISOString().split('T')[0],
    categoryId: '',
    description: '',
    amount: 0,
    paymentMethod: 'CASH',
  });

  useEffect(() => {
    if (open) {
      loadCategories();
      if (expenseId) {
        loadExpense(expenseId);
      } else {
        resetForm();
      }
    }
  }, [open, expenseId]);

  const loadCategories = async () => {
    try {
      // Categories would come from a backend endpoint
      // For now, using default categories
      setCategories([
        { id: '1', name: 'Teacher Salary' },
        { id: '2', name: 'Electricity' },
        { id: '3', name: 'Water' },
        { id: '4', name: 'Food' },
        { id: '5', name: 'Maintenance' },
        { id: '6', name: 'Stationery' },
        { id: '7', name: 'Events' },
        { id: '8', name: 'Building Maintenance' },
        { id: '9', name: 'Miscellaneous' },
      ]);
    } catch (err) {
      setError('Failed to load categories');
    }
  };

  const loadExpense = async (id: string) => {
    try {
      setLoading(true);
      const response = await expenseService.getExpenseById(id);
      const expense = response.data;
      setFormData({
        date: expense.date,
        categoryId: expense.categoryId,
        description: expense.description,
        amount: expense.amount,
        paymentMethod: expense.paymentMethod,
        reference: expense.reference,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load expense');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      categoryId: '',
      description: '',
      amount: 0,
      paymentMethod: 'CASH',
    });
    setError(null);
  };

  const handleSubmit = async () => {
    try {
      if (!formData.categoryId || !formData.description || formData.amount <= 0) {
        setError('Please fill in all required fields');
        return;
      }

      setLoading(true);
      setError(null);

      if (expenseId) {
        await expenseService.updateExpense(expenseId, formData);
      } else {
        await expenseService.createExpense(formData);
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {expenseId ? 'Edit Expense' : 'Add Expense'}
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          fullWidth
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={formData.categoryId}
            label="Category"
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
          >
            <MenuItem value="">Select Category</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          fullWidth
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Amount"
          type="number"
          inputProps={{ step: '0.01', min: '0' }}
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
          fullWidth
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Payment Method</InputLabel>
          <Select
            value={formData.paymentMethod}
            label="Payment Method"
            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as 'CASH' | 'BANK' })}
          >
            <MenuItem value="CASH">Cash</MenuItem>
            <MenuItem value="BANK">Bank</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Reference (Optional)"
          value={formData.reference || ''}
          onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : (expenseId ? 'Update' : 'Save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExpenseForm;
