import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GetAppIcon from '@mui/icons-material/GetApp';
import IosShareIcon from '@mui/icons-material/IosShare';
import {
  dismissInstallPrompt,
  isIosDevice,
  isInstallDismissed,
  isPWA,
  setupInstallPrompt,
  getDeferredInstallPrompt,
  showNativeInstallPrompt,
} from '../../utils/pwaUtils';

const PWAInstallPrompt = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [canInstall, setCanInstall] = useState(false);
  const [showIosHint, setShowIosHint] = useState(false);
  const [visible, setVisible] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    if (isPWA() || isInstallDismissed()) {
      return;
    }

    setupInstallPrompt(() => {
      setCanInstall(true);
      setVisible(true);
    });

    const existingPrompt = getDeferredInstallPrompt();
    if (existingPrompt) {
      setCanInstall(true);
      setVisible(true);
    }

    if (isIosDevice() && !isPWA()) {
      setShowIosHint(true);
      setVisible(true);
    }
  }, []);

  const handleClose = () => {
    dismissInstallPrompt();
    setVisible(false);
  };

  const handleInstall = async () => {
    setInstalling(true);
    const installed = await showNativeInstallPrompt();
    setInstalling(false);

    if (installed) {
      setVisible(false);
      return;
    }

    handleClose();
  };

  if (!visible || isPWA() || (!canInstall && !showIosHint)) {
    return null;
  }

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        left: { xs: 12, sm: '50%' },
        right: { xs: 12, sm: 'auto' },
        bottom: { xs: 'calc(16px + env(safe-area-inset-bottom))', sm: 24 },
        transform: { sm: 'translateX(-50%)' },
        width: { sm: 440 },
        zIndex: 1400,
        p: 1.5,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        borderRadius: 2,
      }}
    >
      <Box
        component="img"
        src="/icon.svg"
        alt=""
        sx={{ width: 40, height: 40, borderRadius: 1, flexShrink: 0 }}
      />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
          Install Accounting
        </Typography>
        {showIosHint && !canInstall ? (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            Tap <IosShareIcon sx={{ fontSize: 14 }} /> then Add to Home Screen
          </Typography>
        ) : (
          <Typography variant="caption" color="text.secondary">
            Add this app to your home screen for quick access
          </Typography>
        )}
      </Box>

      {canInstall && (
        <Button
          size="small"
          variant="contained"
          onClick={handleInstall}
          disabled={installing}
          startIcon={!isMobile ? <GetAppIcon /> : undefined}
          sx={{ textTransform: 'none', flexShrink: 0 }}
        >
          {installing ? 'Installing...' : 'Install'}
        </Button>
      )}

      <IconButton size="small" onClick={handleClose} aria-label="Dismiss install prompt">
        <CloseIcon fontSize="small" />
      </IconButton>
    </Paper>
  );
};

export default PWAInstallPrompt;
