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
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { CreateExpenseInput, Expense, ExpenseCategory } from '../../types/expense';
import expenseService from '../../services/expenseService';
import categoryService from '../../services/categoryService';

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
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');
  const [categoryCreating, setCategoryCreating] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);

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
      const response = await categoryService.getExpenseCategories();
      setCategories(response.data as ExpenseCategory[]);
    } catch (err) {
      setError('Failed to load categories');
    }
  };

  const handleCreateCategory = async () => {
    try {
      if (!newCategoryName.trim()) {
        setCategoryError('Category name is required');
        return;
      }

      setCategoryCreating(true);
      setCategoryError(null);

      const response = await categoryService.createExpenseCategory(
        newCategoryName.trim(),
        newCategoryDesc.trim()
      );

      // Add new category to the list
      setCategories([...categories, response.data as ExpenseCategory]);

      // Update form to select the new category
      setFormData({ ...formData, categoryId: response.data.id });

      // Reset dialog
      setNewCategoryName('');
      setNewCategoryDesc('');
      setShowCategoryDialog(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create category';
      setCategoryError(message);
    } finally {
      setCategoryCreating(false);
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

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', mb: 2 }}>
          <FormControl fullWidth>
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
          <IconButton
            size="small"
            onClick={() => setShowCategoryDialog(true)}
            disabled={loading}
            sx={{ mt: 1 }}
            title="Add new category"
          >
            <AddIcon />
          </IconButton>
        </Box>

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

      {/* Add Category Dialog */}
      <Dialog
        open={showCategoryDialog}
        onClose={() => {
          setShowCategoryDialog(false);
          setNewCategoryName('');
          setNewCategoryDesc('');
          setCategoryError(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Expense Category</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {categoryError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {categoryError}
            </Alert>
          )}
          <TextField
            fullWidth
            label="Category Name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            disabled={categoryCreating}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description (Optional)"
            value={newCategoryDesc}
            onChange={(e) => setNewCategoryDesc(e.target.value)}
            disabled={categoryCreating}
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowCategoryDialog(false);
              setNewCategoryName('');
              setNewCategoryDesc('');
              setCategoryError(null);
            }}
            disabled={categoryCreating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateCategory}
            variant="contained"
            color="primary"
            disabled={categoryCreating || !newCategoryName.trim()}
          >
            {categoryCreating ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default ExpenseForm;
