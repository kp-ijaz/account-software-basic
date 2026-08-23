import React from 'react';
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Box,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  SwapHoriz as TransactionsIcon,
  AccountBalance as AccountsIcon,
  BarChart as ReportsIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const MobileBottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    if (location.pathname === '/') return 0;
    if (location.pathname.startsWith('/income') || location.pathname.startsWith('/expense')) return 1;
    if (location.pathname.startsWith('/daybook') || location.pathname.startsWith('/ledger')) return 2;
    if (location.pathname.startsWith('/reports')) return 3;
    return 0;
  };

  const handleNavigation = (event: any, newValue: number) => {
    const paths = ['/', '/income', '/daybook', '/reports'];
    navigate(paths[newValue]);
  };

  return (
    <Paper
      className="no-print"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: { xs: 'block', md: 'none' },
        zIndex: 1000,
      }}
      elevation={3}
    >
      <BottomNavigation
        value={getActiveTab()}
        onChange={handleNavigation}
        showLabels
        sx={{
          '& .MuiBottomNavigationAction-root': {
            minWidth: '25%',
            color: 'text.secondary',
            '&.Mui-selected': {
              color: 'primary.main',
            },
          },
        }}
      >
        <BottomNavigationAction
          label="Dashboard"
          icon={<DashboardIcon />}
        />
        <BottomNavigationAction
          label="Transactions"
          icon={<TransactionsIcon />}
        />
        <BottomNavigationAction
          label="Accounts"
          icon={<AccountsIcon />}
        />
        <BottomNavigationAction
          label="Reports"
          icon={<ReportsIcon />}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default MobileBottomNav;
