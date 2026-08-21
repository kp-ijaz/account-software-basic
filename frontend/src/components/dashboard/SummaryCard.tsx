import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

interface SummaryCardProps {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'balance';
  icon?: React.ReactNode;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, type, icon }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const getColor = () => {
    switch (type) {
      case 'income':
        return '#4caf50';
      case 'expense':
        return '#f44336';
      case 'balance':
        return '#2e7d32';
      default:
        return '#1976d2';
    }
  };

  const getIcon = () => {
    if (icon) return icon;
    switch (type) {
      case 'income':
        return <ArrowUpwardIcon sx={{ color: '#4caf50', fontSize: 32 }} />;
      case 'expense':
        return <ArrowDownwardIcon sx={{ color: '#f44336', fontSize: 32 }} />;
      case 'balance':
        return <AccountBalanceIcon sx={{ color: '#2e7d32', fontSize: 32 }} />;
      default:
        return null;
    }
  };

  return (
    <Card sx={{ borderLeft: `5px solid ${getColor()}` }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" variant="body2" sx={{ mb: 1 }}>
              {title}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: getColor(),
              }}
            >
              {formatCurrency(amount)}
            </Typography>
          </Box>
          <Box>{getIcon()}</Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
