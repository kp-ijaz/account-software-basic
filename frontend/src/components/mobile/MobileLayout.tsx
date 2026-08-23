import React from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Paper,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Settings as SettingsIcon,
  ReceiptLong as AuditIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { RootState } from '../../store';
import authService from '../../services/authService';
import MobileBottomNav from './BottomNavigation';

interface MobileLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children, title = 'Madrasa' }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [logoutLoading, setLogoutLoading] = React.useState(false);

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

  const menuItems = [
    {
      label: 'Settings',
      icon: <SettingsIcon sx={{ fontSize: 20 }} />,
      onClick: () => { navigate('/settings'); setDrawerOpen(false); }
    },
    {
      label: 'Audit Trail',
      icon: <AuditIcon sx={{ fontSize: 20 }} />,
      onClick: () => { navigate('/audit'); setDrawerOpen(false); }
    },
  ];

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      overflow: 'hidden',
      bgcolor: '#f8f9fa'
    }}>
      {/* Top App Bar */}
      <AppBar
        className="no-print"
        position="sticky"
        sx={{
          bgcolor: '#ffffff',
          color: 'primary.main',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          borderBottom: '1px solid #e0e0e0'
        }}
      >
        <Toolbar sx={{ px: 1.5 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 1.5 }}
          >
            <MenuIcon sx={{ fontSize: 24 }} />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              flex: 1,
              fontWeight: 700,
              fontSize: 16,
              color: 'primary.main'
            }}
          >
            {title}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Side Drawer Menu */}
      <Drawer
        className="no-print"
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: '#ffffff'
          }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header */}
          <Box sx={{
            p: 2,
            bgcolor: 'primary.main',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 16 }}>
              Menu
            </Typography>
            <IconButton
              onClick={() => setDrawerOpen(false)}
              sx={{ color: 'white' }}
              size="small"
            >
              <CloseIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>

          {/* User Info */}
          <Box sx={{
            p: 2,
            bgcolor: '#f9f9f9',
            borderBottom: '1px solid #e0e0e0'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  width: 36,
                  height: 36,
                  fontWeight: 700
                }}
              >
                {user?.email?.[0].toUpperCase() || 'A'}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
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
                  {user?.email?.split('@')[0] || 'Admin'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Madrasa Admin
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider />

          {/* Menu Items */}
          <List sx={{ py: 1 }}>
            {menuItems.map((item, idx) => (
              <ListItem
                button
                key={idx}
                onClick={item.onClick}
                sx={{
                  px: 2,
                  py: 1.5,
                  '&:hover': { bgcolor: '#f5f5f5' },
                  transition: 'background-color 0.2s'
                }}
              >
                <ListItemIcon sx={{ color: 'primary.main', minWidth: 36 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: 500,
                    fontSize: 13
                  }}
                />
              </ListItem>
            ))}
          </List>

          <Divider />

          {/* Logout */}
          <Box sx={{ p: 2, mt: 'auto' }}>
            <Paper
              sx={{
                p: 1.5,
                mb: 1.5,
                bgcolor: '#fff3cd',
                border: '1px solid #ffc107',
                borderRadius: 1
              }}
            >
              <Typography variant="caption" sx={{ color: '#856404', fontWeight: 600 }}>
                {user?.email || 'Logged in'}
              </Typography>
            </Paper>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleLogout}
              disabled={logoutLoading}
              startIcon={<LogoutIcon sx={{ fontSize: 18 }} />}
              sx={{
                justifyContent: 'center',
                gap: 1,
                color: 'error.main',
                borderColor: '#ffcdd2',
                borderRadius: 1,
                py: 1,
                '&:hover': { bgcolor: '#ffebee', borderColor: '#ef5350' },
                textTransform: 'none',
                fontWeight: 600,
                fontSize: 12
              }}
            >
              {logoutLoading ? 'Logging out...' : 'Logout'}
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          pb: 8,
          scrollBehavior: 'smooth',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: '#f1f1f1',
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: '#c1c1c1',
            borderRadius: '3px',
            '&:hover': {
              bgcolor: '#a8a8a8',
            },
          },
        }}
      >
        {children}
      </Box>

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </Box>
  );
};

export default MobileLayout;
