import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  Typography,
  Button,
  Avatar,
  Paper,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  TrendingUp as IncomeIcon,
  TrendingDown as ExpenseIcon,
  EventNote as DayBookIcon,
  MenuBook as LedgerIcon,
  BarChart as ReportsIcon,
  Settings as SettingsIcon,
  ReceiptLong as AuditIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { RootState } from '../../store';
import authService from '../../services/authService';

const DRAWER_WIDTH = 260;

interface SidebarProps {
  open: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [logoutLoading, setLogoutLoading] = React.useState(false);

  const menuItems = [
    { label: 'Dashboard', icon: <DashboardIcon sx={{ fontSize: 20 }} />, path: '/', id: 'dashboard' },
    { label: 'Income', icon: <IncomeIcon sx={{ fontSize: 20 }} />, path: '/income', id: 'income' },
    { label: 'Expense', icon: <ExpenseIcon sx={{ fontSize: 20 }} />, path: '/expense', id: 'expense' },
    { label: 'Day Book', icon: <DayBookIcon sx={{ fontSize: 20 }} />, path: '/daybook', id: 'daybook' },
    { label: 'Ledger', icon: <LedgerIcon sx={{ fontSize: 20 }} />, path: '/ledger', id: 'ledger' },
    { label: 'Reports', icon: <ReportsIcon sx={{ fontSize: 20 }} />, path: '/reports', id: 'reports' },
    { label: 'Settings', icon: <SettingsIcon sx={{ fontSize: 20 }} />, path: '/settings', id: 'settings' },
    { label: 'Audit Log', icon: <AuditIcon sx={{ fontSize: 20 }} />, path: '/audit', id: 'audit' },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    if (onClose) onClose();
  };

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await authService.logout();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLogoutLoading(false);
    }
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#ffffff' }}>
      {/* Header - Logo & Brand */}
      <Box sx={{
        p: 2.5,
        bgcolor: 'primary.main',
        color: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              bgcolor: 'rgba(255,255,255,0.25)',
              color: 'white',
              width: 40,
              height: 40,
              fontWeight: 'bold',
              fontSize: 18
            }}
          >
            MA
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 16 }}>
              Madrasa
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Accounting
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Menu Items */}
      <List sx={{ flex: 1, px: 1.5, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.id}
            onClick={() => handleNavigate(item.path)}
            sx={{
              mb: 0.8,
              borderRadius: 1.2,
              bgcolor: isActive(item.path) ? 'primary.light' : 'transparent',
              color: isActive(item.path) ? 'primary.main' : 'text.primary',
              '&:hover': {
                bgcolor: isActive(item.path) ? 'primary.light' : '#f5f5f5',
              },
              transition: 'all 0.2s ease',
              pl: 2,
            }}
          >
            <ListItemIcon
              sx={{
                color: isActive(item.path) ? 'primary.main' : 'text.secondary',
                minWidth: 36,
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontWeight: isActive(item.path) ? 600 : 500,
                fontSize: 13,
              }}
            />
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* User & Logout Section */}
      <Box sx={{ p: 2 }}>
        <Paper
          sx={{
            p: 1.5,
            mb: 1.5,
            bgcolor: '#f9f9f9',
            border: '1px solid #e0e0e0',
            borderRadius: 1.2
          }}
        >
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            LOGGED IN AS
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {user?.email || 'Admin'}
          </Typography>
        </Paper>

        <Button
          variant="outlined"
          color="error"
          fullWidth
          startIcon={<LogoutIcon sx={{ fontSize: 18 }} />}
          onClick={handleLogout}
          disabled={logoutLoading}
          size="small"
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            fontSize: 12,
            py: 1,
            borderColor: '#ffcdd2',
            '&:hover': {
              bgcolor: '#ffebee',
              borderColor: '#ef5350'
            }
          }}
        >
          {logoutLoading ? 'Logging out...' : 'Logout'}
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: '#ffffff',
            borderRight: '1px solid #e0e0e0',
            boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
          },
          display: { xs: 'none', md: 'block' },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
export { DRAWER_WIDTH };
