import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import { RootState, AppDispatch } from '../store';
import {
  setLoading,
  setError,
  setMonthlyReport,
  setYearlyReport,
  setBalanceSheet,
  setSelectedMonth,
  setSelectedYear,
} from '../store/slices/reportSlice';
import reportService from '../services/reportService';
import MonthlyReportView from '../components/reports/MonthlyReportView';
import YearlyReportView from '../components/reports/YearlyReportView';
import BalanceSheetView from '../components/reports/BalanceSheetView';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index} role="tabpanel">
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const ReportsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    monthlyReport,
    yearlyReport,
    balanceSheet,
    loading,
    error,
    selectedMonth,
    selectedYear,
  } = useSelector((state: RootState) => state.reports);

  const [tabValue, setTabValue] = useState(0);
  const currentYear = new Date().getFullYear();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    // Load monthly report on component mount
    loadMonthlyReport(selectedMonth, selectedYear);
    loadYearlyReport(selectedYear);
    loadBalanceSheet();
  }, []);

  const loadMonthlyReport = async (month: number, year: number) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const response = await reportService.getMonthlyReport(month, year);
      dispatch(setMonthlyReport(response.data));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch monthly report';
      dispatch(setError(message));
    }
  };

  const loadYearlyReport = async (year: number) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const response = await reportService.getYearlyReport(year);
      dispatch(setYearlyReport(response.data));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch yearly report';
      dispatch(setError(message));
    }
  };

  const loadBalanceSheet = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const response = await reportService.getBalanceSheet();
      dispatch(setBalanceSheet(response.data));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch balance sheet';
      dispatch(setError(message));
    }
  };

  const handleMonthChange = (month: number) => {
    dispatch(setSelectedMonth(month));
    loadMonthlyReport(month, selectedYear);
  };

  const handleYearChange = (year: number) => {
    dispatch(setSelectedYear(year));
    loadMonthlyReport(selectedMonth, year);
    loadYearlyReport(year);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    reportService.downloadAsPDF(`Report_${selectedMonth}_${selectedYear}.pdf`);
  };

  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Financial Reports
        </Typography>
        <Typography variant="body2" color="textSecondary">
          View and export comprehensive financial reports
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Tab Navigation - Mobile Only */}
      {isMobile && (
        <Paper sx={{ mb: 3 }}>
          <Tabs value={tabValue} onChange={(_, value) => setTabValue(value)}>
            <Tab label="Monthly Report" />
            <Tab label="Yearly Report" />
            <Tab label="Balance Sheet" />
          </Tabs>
        </Paper>
      )}

      {/* Report Selection on Desktop */}
      {!isMobile && (
        <Box sx={{ mb: 3 }}>
          <Button
            variant={tabValue === 0 ? 'contained' : 'outlined'}
            onClick={() => setTabValue(0)}
            sx={{ mr: 1 }}
          >
            Monthly Report
          </Button>
          <Button
            variant={tabValue === 1 ? 'contained' : 'outlined'}
            onClick={() => setTabValue(1)}
            sx={{ mr: 1 }}
          >
            Yearly Report
          </Button>
          <Button
            variant={tabValue === 2 ? 'contained' : 'outlined'}
            onClick={() => setTabValue(2)}
          >
            Balance Sheet
          </Button>
        </Box>
      )}

      {/* Monthly Report Tab - Show on mobile with tab or on desktop when selected */}
      {(isMobile && tabValue === 0) || (!isMobile && tabValue === 0) ? (
      <Box>
        {/* Month/Year Selection */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Month</InputLabel>
              <Select
                value={selectedMonth}
                label="Month"
                onChange={(e) => handleMonthChange(e.target.value as number)}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <MenuItem key={month} value={month}>
                    {new Date(selectedYear, month - 1).toLocaleString('default', {
                      month: 'long',
                    })}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Year</InputLabel>
              <Select
                value={selectedYear}
                label="Year"
                onChange={(e) => handleYearChange(e.target.value as number)}
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              fullWidth
            >
              Print
            </Button>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              onClick={handleDownloadPDF}
              fullWidth
            >
              Download PDF
            </Button>
          </Grid>
        </Grid>

        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : monthlyReport ? (
          <MonthlyReportView report={monthlyReport} />
        ) : null}
      </Box>
      ) : null}

      {/* Yearly Report Tab - Show on mobile with tab */}
      {isMobile && tabValue === 1 ? (
      <Box>
        {/* Year Selection */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Year</InputLabel>
              <Select
                value={selectedYear}
                label="Year"
                onChange={(e) => handleYearChange(e.target.value as number)}
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              fullWidth
            >
              Print
            </Button>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              onClick={handleDownloadPDF}
              fullWidth
            >
              Download PDF
            </Button>
          </Grid>
        </Grid>

        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : yearlyReport ? (
          <YearlyReportView report={yearlyReport} />
        ) : null}
      </Box>
      ) : null}

      {/* Balance Sheet Tab - Show on mobile with tab */}
      {isMobile && tabValue === 2 ? (
      <Box>
        {/* Actions */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              fullWidth
            >
              Print
            </Button>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              onClick={handleDownloadPDF}
              fullWidth
            >
              Download PDF
            </Button>
          </Grid>
        </Grid>

        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : balanceSheet ? (
          <BalanceSheetView balanceSheet={balanceSheet} />
        ) : null}
      </Box>
      ) : null}
    </Container>
  );
};

export default ReportsPage;
