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
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, fontSize: '0.95rem' }}>
        {title}
      </Typography>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? 1.5 : 2.5,
        alignItems: 'start'
      }}>
        {/* Pie Chart */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: isMobile ? 180 : 220
        }}>
          <ResponsiveContainer width="100%" height={isMobile ? 180 : 220}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={isMobile ? 30 : 40}
                outerRadius={isMobile ? 55 : 70}
                paddingAngle={1.5}
                dataKey="value"
              >
                {data.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => formatCurrency(value)} />
              {!isMobile && <Legend wrapperStyle={{ fontSize: '0.75rem' }} />}
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* Table */}
        <Box sx={{
          overflowX: 'auto',
          minHeight: isMobile ? 'auto' : 220
        }}>
          <Table size="small" sx={{ width: '100%' }}>
            <TableHead sx={{ backgroundColor: '#f5f5f5', position: 'sticky', top: 0 }}>
              <TableRow sx={{ height: '32px' }}>
                <TableCell sx={{ fontWeight: 'bold', width: '50%', padding: '4px 8px', fontSize: '0.75rem' }}>
                  Category
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', width: '30%', padding: '4px 8px', fontSize: '0.75rem' }}>
                  Amount
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', width: '20%', padding: '4px 8px', fontSize: '0.75rem' }}>
                  %
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={item.category} hover sx={{ height: '28px' }}>
                  <TableCell sx={{ whiteSpace: 'nowrap', padding: '4px 8px', fontSize: '0.7rem' }}>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          backgroundColor: COLORS[index % COLORS.length],
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80px' }}>
                        {item.category}
                      </span>
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ padding: '4px 8px', fontSize: '0.7rem' }}>
                    {formatCurrency(item.amount)}
                  </TableCell>
                  <TableCell align="right" sx={{ padding: '4px 8px', fontSize: '0.7rem' }}>
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
