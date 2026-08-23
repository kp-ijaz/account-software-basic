import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Grid,
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
import {
  downloadMonthlyReportPDF,
  downloadYearlyReportPDF,
  downloadBalanceSheetPDF,
  printReportHtml,
  monthlyReportPrintHtml,
  yearlyReportPrintHtml,
  balanceSheetPrintHtml,
  getMonthlyReportFilename,
  getYearlyReportFilename,
  getBalanceSheetFilename,
  getMonthlyReportTitle,
  getYearlyReportTitle,
  getBalanceSheetTitle,
} from '../utils/reportExport';

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
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const currentYear = new Date().getFullYear();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
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

  const getActiveReportMeta = () => {
    if (tabValue === 0) {
      return {
        title: getMonthlyReportTitle(selectedMonth, selectedYear),
        filename: getMonthlyReportFilename(selectedMonth, selectedYear),
        hasData: !!monthlyReport,
      };
    }

    if (tabValue === 1) {
      return {
        title: getYearlyReportTitle(selectedYear),
        filename: getYearlyReportFilename(selectedYear),
        hasData: !!yearlyReport,
      };
    }

    return {
      title: getBalanceSheetTitle(balanceSheet?.asOf),
      filename: getBalanceSheetFilename(balanceSheet?.asOf),
      hasData: !!balanceSheet,
    };
  };

  const handlePrint = async () => {
    const { title, hasData } = getActiveReportMeta();
    if (!hasData) {
      setExportError('Report data is not ready yet. Please wait for it to load.');
      return;
    }

    try {
      setExporting(true);
      setExportError(null);

      if (tabValue === 0 && monthlyReport) {
        await printReportHtml(monthlyReportPrintHtml(monthlyReport), title);
      } else if (tabValue === 1 && yearlyReport) {
        await printReportHtml(yearlyReportPrintHtml(yearlyReport), title);
      } else if (tabValue === 2 && balanceSheet) {
        await printReportHtml(balanceSheetPrintHtml(balanceSheet), title);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to print report';
      setExportError(message);
    } finally {
      setExporting(false);
    }
  };

  const handleDownloadPDF = async () => {
    const { filename, hasData } = getActiveReportMeta();
    if (!hasData) {
      setExportError('Report data is not ready yet. Please wait for it to load.');
      return;
    }

    try {
      setExporting(true);
      setExportError(null);

      if (tabValue === 0 && monthlyReport) {
        downloadMonthlyReportPDF(monthlyReport, filename);
      } else if (tabValue === 1 && yearlyReport) {
        downloadYearlyReportPDF(yearlyReport, filename);
      } else if (tabValue === 2 && balanceSheet) {
        downloadBalanceSheetPDF(balanceSheet, filename);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to download PDF';
      setExportError(message);
    } finally {
      setExporting(false);
    }
  };

  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const renderReportActions = () => (
    <>
      <Grid item xs={12} sm={6} md={3}>
        <Button
          variant="outlined"
          startIcon={exporting ? <CircularProgress size={18} /> : <PrintIcon />}
          onClick={handlePrint}
          disabled={exporting || loading}
          fullWidth
        >
          Print
        </Button>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Button
          variant="outlined"
          startIcon={exporting ? <CircularProgress size={18} /> : <FileDownloadIcon />}
          onClick={handleDownloadPDF}
          disabled={exporting || loading}
          fullWidth
        >
          Download PDF
        </Button>
      </Grid>
    </>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box className="no-print" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Financial Reports
        </Typography>
        <Typography variant="body2" color="textSecondary">
          View and export comprehensive financial reports
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" className="no-print" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {exportError && (
        <Alert severity="error" className="no-print" sx={{ mb: 2 }} onClose={() => setExportError(null)}>
          {exportError}
        </Alert>
      )}

      {isMobile && (
        <Paper className="no-print" sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 1, p: 1, flexWrap: 'wrap' }}>
            {['Monthly Report', 'Yearly Report', 'Balance Sheet'].map((label, index) => (
              <Button
                key={label}
                variant={tabValue === index ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setTabValue(index)}
              >
                {label}
              </Button>
            ))}
          </Box>
        </Paper>
      )}

      {!isMobile && (
        <Box className="no-print" sx={{ mb: 3 }}>
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

      {tabValue === 0 && (
        <Box>
          <Grid container spacing={2} className="no-print" sx={{ mb: 3 }}>
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

            {renderReportActions()}
          </Grid>

          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : monthlyReport ? (
            <Box className="report-print-content">
              <MonthlyReportView report={monthlyReport} />
            </Box>
          ) : null}
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          <Grid container spacing={2} className="no-print" sx={{ mb: 3 }}>
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

            {renderReportActions()}
          </Grid>

          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : yearlyReport ? (
            <Box className="report-print-content">
              <YearlyReportView report={yearlyReport} />
            </Box>
          ) : null}
        </Box>
      )}

      {tabValue === 2 && (
        <Box>
          <Grid container spacing={2} className="no-print" sx={{ mb: 3 }}>
            {renderReportActions()}
          </Grid>

          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : balanceSheet ? (
            <Box className="report-print-content">
              <BalanceSheetView balanceSheet={balanceSheet} />
            </Box>
          ) : null}
        </Box>
      )}
    </Container>
  );
};

export default ReportsPage;
