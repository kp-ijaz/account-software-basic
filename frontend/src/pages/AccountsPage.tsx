import React, { useState } from 'react';
import {
  Box,
  Container,
  Tabs,
  Tab,
  Paper,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import DayBookPage from './DayBookPage';
import LedgerPage from './LedgerPage';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index} role="tabpanel">
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const AccountsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Desktop: Show DayBook by default
  if (!isMobile) {
    return (
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <DayBookPage />
      </Container>
    );
  }

  // Mobile: Show tabs
  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Day Book" />
          <Tab label="Ledger" />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <DayBookPage />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <LedgerPage />
      </TabPanel>
    </Container>
  );
};

export default AccountsPage;
