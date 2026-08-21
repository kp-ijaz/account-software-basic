import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Paper, Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, useMediaQuery, useTheme } from '@mui/material';
import { CategoryBreakdown } from '../../types/dashboard';

interface CategoryBreakdownChartProps {
  data: CategoryBreakdown[];
  title: string;
  type: 'INCOME' | 'EXPENSE';
}

const COLORS = [
  '#2196F3',
  '#4CAF50',
  '#FF9800',
  '#F44336',
  '#9C27B0',
  '#00BCD4',
  '#8BC34A',
  '#FFC107',
];

const CategoryBreakdownChart: React.FC<CategoryBreakdownChartProps> = ({
  data,
  title,
  type,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography color="textSecondary" textAlign="center">
          No data available
        </Typography>
      </Paper>
    );
  }

  const chartData = data.map((item) => ({
    name: item.category,
    value: item.amount,
  }));

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
        {title}
      </Typography>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? 2 : 4,
        alignItems: 'start'
      }}>
        {/* Pie Chart */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: isMobile ? 250 : 320
        }}>
          <ResponsiveContainer width="100%" height={isMobile ? 250 : 320}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={isMobile ? 40 : 60}
                outerRadius={isMobile ? 70 : 90}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => formatCurrency(value)} />
              {!isMobile && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* Table */}
        <Box sx={{
          overflowX: 'auto',
          minHeight: isMobile ? 'auto' : 320
        }}>
          <Table size={isMobile ? 'small' : 'medium'} sx={{ width: '100%' }}>
            <TableHead sx={{ backgroundColor: '#f5f5f5', position: 'sticky', top: 0 }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', width: '50%' }}>Category</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', width: '30%' }}>Amount</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', width: '20%' }}>%</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={item.category} hover>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: COLORS[index % COLORS.length],
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.category}
                      </span>
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                    {formatCurrency(item.amount)}
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                    {item.percentage.toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Paper>
  );
};

export default CategoryBreakdownChart;
