import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Income, IncomeCategory, CreateIncomeInput } from '../../types/income';
import incomeService from '../../services/incomeService';

// Form validation schema
const incomeSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  categoryId: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required').max(255, 'Description too long'),
  amount: z.number().gt(0, 'Amount must be greater than zero'),
  paymentMethod: z.enum(['CASH', 'BANK']),
  reference: z.string().optional(),
});

type IncomeFormData = z.infer<typeof incomeSchema>;

interface IncomeFormProps {
  open: boolean;
  income?: Income | null;
  categories: IncomeCategory[];
  onClose: () => void;
  onSuccess: (income: Income) => void;
  loading?: boolean;
}

export default function IncomeForm({
  open,
  income,
  categories,
  onClose,
  onSuccess,
  loading = false,
}: IncomeFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IncomeFormData>({
    resolver: zodResolver(incomeSchema),
    defaultValues: income
      ? {
          date: income.date,
          categoryId: income.categoryId,
          description: income.description,
          amount: income.amount,
          paymentMethod: income.paymentMethod,
          reference: income.reference,
        }
      : {
          date: new Date().toISOString().split('T')[0],
          categoryId: '',
          description: '',
          amount: 0,
          paymentMethod: 'CASH',
          reference: '',
        },
  });

  useEffect(() => {
    if (open && income) {
      reset({
        date: income.date,
        categoryId: income.categoryId,
        description: income.description,
        amount: income.amount,
        paymentMethod: income.paymentMethod,
        reference: income.reference,
      });
    }
  }, [open, income, reset]);

  const onSubmit = async (data: IncomeFormData) => {
    try {
      setSubmitting(true);
      setError(null);

      const input: CreateIncomeInput = {
        ...data,
        amount: parseFloat(data.amount.toString()),
      };

      if (income) {
        // Update
        const response = await incomeService.updateIncome(income.id, input);
        onSuccess(response.data);
      } else {
        // Create
        const response = await incomeService.createIncome(input);
        onSuccess(response.data);
      }

      reset();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{income ? 'Edit Income' : 'Add Income'}</DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2}>
          {/* Date */}
          <Grid item xs={12}>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.date}
                  helperText={errors.date?.message}
                  disabled={submitting}
                />
              )}
            />
          </Grid>

          {/* Category */}
          <Grid item xs={12}>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Category"
                  select
                  error={!!errors.categoryId}
                  helperText={errors.categoryId?.message}
                  disabled={submitting}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Description"
                  multiline
                  rows={2}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  disabled={submitting}
                />
              )}
            />
          </Grid>

          {/* Amount */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Amount"
                  type="number"
                  inputProps={{ step: '0.01', min: '0' }}
                  error={!!errors.amount}
                  helperText={errors.amount?.message}
                  disabled={submitting}
                />
              )}
            />
          </Grid>

          {/* Payment Method */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="paymentMethod"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Payment Method"
                  select
                  error={!!errors.paymentMethod}
                  helperText={errors.paymentMethod?.message}
                  disabled={submitting}
                >
                  <MenuItem value="CASH">Cash</MenuItem>
                  <MenuItem value="BANK">Bank</MenuItem>
                </TextField>
              )}
            />
          </Grid>

          {/* Reference */}
          <Grid item xs={12}>
            <Controller
              name="reference"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Reference (Optional)"
                  placeholder="Check #, Receipt #, etc."
                  error={!!errors.reference}
                  helperText={errors.reference?.message}
                  disabled={submitting}
                />
              )}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          color="primary"
          disabled={submitting}
        >
          {submitting ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
          {income ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
