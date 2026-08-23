import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Snackbar,
  Alert,
  Typography,
} from '@mui/material';
import {
  initializePWA,
  skipWaitingAndReload,
  isOnline,
  showOfflineNotification,
  showUpdateNotification,
  requestNotificationPermission,
} from '../../utils/pwaUtils';

export const PWAStatus = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isOnlineStatus, setIsOnlineStatus] = useState(true);

  useEffect(() => {
    initializePWA({
      onUpdateAvailable: () => {
        setUpdateAvailable(true);
        showUpdateNotification();
      },
      onOnline: () => {
        setIsOnlineStatus(true);
      },
      onOffline: () => {
        setIsOnlineStatus(false);
        showOfflineNotification();
      },
    });

    setIsOnlineStatus(isOnline());
  }, []);

  const handleEnableNotifications = async () => {
    await requestNotificationPermission();
  };

  return (
    <>
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
            onClick={skipWaitingAndReload}
            sx={{ textTransform: 'none' }}
          >
            Update & Reload
          </Button>
        </Alert>
      </Snackbar>

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
              Offline Mode
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

export default PWAStatus;
