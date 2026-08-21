import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useSelector } from 'react-redux';
import { useMediaQuery, useTheme } from '@mui/material';
import { RootState } from './store';
import { theme } from './styles/theme';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import AccountsPage from './pages/AccountsPage';
import ExpensePage from './pages/ExpensePage';
import LedgerPage from './pages/LedgerPage';
import ReportsPage from './pages/ReportsPage';
import AuditLogPage from './pages/AuditLogPage';
import SettingsPage from './pages/SettingsPage';
import PrivateRoute from './components/common/PrivateRoute';
import Layout from './components/common/Layout';
import MobileLayout from './components/mobile/MobileLayout';

// Responsive Layout Wrapper
const ResponsiveLayout = ({ children, title }: { children: React.ReactNode; title?: string }) => {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  if (isMobile) {
    return <MobileLayout title={title}>{children}</MobileLayout>;
  }

  return <Layout>{children}</Layout>;
};

function App() {
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes with Responsive Layout */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <ResponsiveLayout title="Dashboard">
                  <DashboardPage />
                </ResponsiveLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/income"
            element={
              <PrivateRoute>
                <ResponsiveLayout title="Transactions">
                  <TransactionsPage />
                </ResponsiveLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/expense"
            element={
              <PrivateRoute>
                <ResponsiveLayout title="Expense">
                  <ExpensePage />
                </ResponsiveLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/daybook"
            element={
              <PrivateRoute>
                <ResponsiveLayout title="Accounts">
                  <AccountsPage />
                </ResponsiveLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/ledger"
            element={
              <PrivateRoute>
                <ResponsiveLayout title="Ledger">
                  <LedgerPage />
                </ResponsiveLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <PrivateRoute>
                <ResponsiveLayout title="Reports">
                  <ReportsPage />
                </ResponsiveLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/audit"
            element={
              <PrivateRoute>
                <ResponsiveLayout title="Audit Log">
                  <AuditLogPage />
                </ResponsiveLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <ResponsiveLayout title="Settings">
                  <SettingsPage />
                </ResponsiveLayout>
              </PrivateRoute>
            }
          />

          {/* Fallback */}
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
