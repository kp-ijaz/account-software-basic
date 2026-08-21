import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Typography,
} from '@mui/material';
import {
  initializePWA,
  showInstallPrompt,
  skipWaitingAndReload,
  isOnline,
  showOfflineNotification,
  showUpdateNotification,
  requestNotificationPermission,
} from '../../utils/pwaUtils';

interface UpdatePrompt {
  show: () => Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState<UpdatePrompt | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isOnlineStatus, setIsOnlineStatus] = useState(true);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    // Initialize PWA features
    initializePWA({
      onInstallReady: (prompt) => {
        setInstallPrompt(prompt);
        setShowInstallBanner(true);
      },
      onUpdateAvailable: () => {
        setUpdateAvailable(true);
        showUpdateNotification();
      },
      onOnline: () => {
        setIsOnlineStatus(true);
        console.log('✅ Connection restored');
      },
      onOffline: () => {
        setIsOnlineStatus(false);
        showOfflineNotification();
      },
    });

    // Monitor online status
    setIsOnlineStatus(isOnline());
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    setInstalling(true);
    const installed = await showInstallPrompt();
    setInstalling(false);

    if (installed) {
      setShowInstallBanner(false);
      setInstallPrompt(null);
    }
  };

  const handleDismissInstall = () => {
    setShowInstallBanner(false);
  };

  const handleUpdateClick = () => {
    skipWaitingAndReload();
  };

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      console.log('✅ Notifications enabled');
    }
  };

  return (
    <>
      {/* Install Prompt */}
      <Snackbar
        open={showInstallBanner && !!installPrompt}
        autoHideDuration={null}
        onClose={handleDismissInstall}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleDismissInstall}
          severity="info"
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Install Madrasa Accounting
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Access your accounting system offline and from home screen
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              color="inherit"
              onClick={handleDismissInstall}
              sx={{ textTransform: 'none' }}
            >
              Later
            </Button>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={handleInstallClick}
              disabled={installing}
              sx={{ textTransform: 'none' }}
              startIcon={
                installing ? <CircularProgress size={16} /> : undefined
              }
            >
              Install
            </Button>
          </Box>
        </Alert>
      </Snackbar>

      {/* Update Available */}
      <Snackbar
        open={updateAvailable}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              New Version Available
            </Typography>
            <Typography variant="caption" color="textSecondary">
              A new version of the app is ready to use
            </Typography>
          </Box>
          <Button
            size="small"
            variant="contained"
            color="success"
            onClick={handleUpdateClick}
            sx={{ textTransform: 'none' }}
          >
            Update & Reload
          </Button>
        </Alert>
      </Snackbar>

      {/* Offline Status */}
      <Snackbar
        open={!isOnlineStatus}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          severity="warning"
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              📡 Offline Mode
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Changes will be synced when you go online
            </Typography>
          </Box>
          <Button
            size="small"
            color="inherit"
            onClick={handleEnableNotifications}
            sx={{ textTransform: 'none' }}
          >
            Enable Alerts
          </Button>
        </Alert>
      </Snackbar>
    </>
  );
};

export default PWAPrompt;
