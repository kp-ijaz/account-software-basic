import React from 'react';
import { Box } from '@mui/material';
import Sidebar, { DRAWER_WIDTH } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Sidebar */}
      <Sidebar open={false} />

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Page Content */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            p: { xs: 2, sm: 3, md: 4 },
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              bgcolor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: '#d0d0d0',
              borderRadius: '4px',
              '&:hover': {
                bgcolor: '#b0b0b0',
              },
            },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
