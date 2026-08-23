import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { Paper, Box, Typography } from '@mui/material';
import { DashboardChartData } from '../../types/dashboard';

interface IncomeExpenseChartProps {
  data: DashboardChartData[];
  title: string;
  chartType?: 'bar' | 'line';
}

// Custom curved tick component for labels
const CurvedTick = (props: any) => {
  const { x, y, payload } = props;
  const radius = 80;
  const angle = (Math.PI / 180) * (x / 10 - 50);
  const curveX = x + Math.sin(angle) * radius * 0.3;
  const curveY = y + Math.cos(angle) * radius * 0.5 - 20;

  return (
    <g transform={`translate(${curveX},${curveY})`}>
      <text
        x={0}
        y={0}
        dy={4}
        textAnchor="middle"
        fill="#666"
        fontSize={12}
        transform={`rotate(${-45})`}
        style={{
          fontWeight: 500,
          letterSpacing: '0.5px',
        }}
      >
        {payload.value}
      </text>
    </g>
  );
};

const IncomeExpenseChart: React.FC<IncomeExpenseChartProps> = ({
  data,
  title,
  chartType = 'bar',
}) => {
  const formatCurrency = (value: number) => {
    return `₹${(value / 1000).toFixed(1)}k`;
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

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        {title}
      </Typography>
      <Box sx={{ width: '100%', height: 450 }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 100 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={<CurvedTick />} height={120} />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip
                formatter={(value: any) => formatCurrency(value)}
                labelStyle={{ color: '#000' }}
              />
              <Legend />
              <Bar dataKey="income" fill="#4caf50" name="Income" />
              <Bar dataKey="expense" fill="#f44336" name="Expense" />
            </BarChart>
          ) : (
            <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 100 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={<CurvedTick />} height={120} />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip
                formatter={(value: any) => formatCurrency(value)}
                labelStyle={{ color: '#000' }}
              />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#4caf50" name="Income" />
              <Line type="monotone" dataKey="expense" stroke="#f44336" name="Expense" />
              <Line type="monotone" dataKey="balance" stroke="#2e7d32" name="Balance" />
            </LineChart>
          )}
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default IncomeExpenseChart;
