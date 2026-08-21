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
          minHeight: isMobile ? 140 : 160
        }}>
          <ResponsiveContainer width="100%" height={isMobile ? 140 : 160}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={isMobile ? 20 : 25}
                outerRadius={isMobile ? 40 : 50}
                paddingAngle={1}
                dataKey="value"
              >
                {data.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => formatCurrency(value)} />
              {!isMobile && (
                <Legend
                  wrapperStyle={{
                    fontSize: '0.7rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '8px',
                    paddingTop: '8px',
                    width: '100%'
                  }}
                  iconType="circle"
                  verticalAlign="bottom"
                  height={40}
                />
              )}
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* Table Grid - 2 columns */}
        <Box sx={{
          overflowX: 'auto',
          minHeight: isMobile ? 'auto' : 160
        }}>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
            fontSize: '0.7rem'
          }}>
            {data.map((item, index) => (
              <Box
                key={item.category}
                sx={{
                  padding: '6px 8px',
                  backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
                  borderRadius: '4px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  minHeight: '40px',
                  justifyContent: 'center'
                }}
              >
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
                  <span style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontWeight: 500
                  }}>
                    {item.category}
                  </span>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#666' }}>
                  <span>{formatCurrency(item.amount)}</span>
                  <span>{item.percentage.toFixed(1)}%</span>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default CategoryBreakdownChart;
