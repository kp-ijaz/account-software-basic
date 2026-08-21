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
import IncomePage from './IncomePage';
import ExpensePage from './ExpensePage';

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

const TransactionsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Desktop: Show Income by default
  if (!isMobile) {
    return (
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <IncomePage />
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
          <Tab label="Income" />
          <Tab label="Expense" />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <IncomePage />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <ExpensePage />
      </TabPanel>
    </Container>
  );
};

export default TransactionsPage;
