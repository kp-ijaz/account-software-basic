/**
 * PWA Utilities for service worker management and offline detection
 */

let updateAvailable = false;

/**
 * Check if the app is running as a PWA
 */
export const isPWA = (): boolean => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true ||
    document.referrer.includes('android-app://')
  );
};

/**
 * Check if service worker is supported
 */
export const isServiceWorkerSupported = (): boolean => {
  return 'serviceWorker' in navigator;
};

/**
 * Detect offline/online status
 */
export const isOnline = (): boolean => {
  return navigator.onLine;
};

/**
 * Listen for online/offline changes
 */
export const setupOfflineDetection = (
  onOnline?: () => void,
  onOffline?: () => void
) => {
  window.addEventListener('online', () => {
    if (onOnline) onOnline();
  });

  window.addEventListener('offline', () => {
    if (onOffline) onOffline();
  });
};

/**
 * Check for service worker updates
 */
export const checkForUpdates = async (
  onUpdateAvailable?: () => void
): Promise<boolean> => {
  if (!isServiceWorkerSupported()) return false;

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) return false;

    const update = await registration.update();
    if (update && update.installing) {
      updateAvailable = true;
      if (onUpdateAvailable) {
        onUpdateAvailable();
      }
      return true;
    }
  } catch (error) {
    console.error('Update check error:', error);
  }
  return false;
};

/**
 * Skip waiting and reload (for new updates)
 */
export const skipWaitingAndReload = async (): Promise<void> => {
  if (!isServiceWorkerSupported()) return;

  const registration = await navigator.serviceWorker.getRegistration();
  if (registration?.waiting) {
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  }
};

/**
 * Clear API cache
 */
export const clearAPICache = async (): Promise<boolean> => {
  if (!isServiceWorkerSupported()) return false;

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration?.active) return false;

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.success);
      };

      registration.active?.postMessage({ type: 'CLEAR_CACHE' }, [messageChannel.port2]);
    });
  } catch (error) {
    console.error('Cache clear error:', error);
    return false;
  }
};

/**
 * Request permission for offline notifications
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Notification permission error:', error);
    }
  }

  return false;
};

/**
 * Show offline notification
 */
export const showOfflineNotification = () => {
  if (Notification.permission === 'granted') {
    new Notification('Offline Mode', {
      body: 'You are offline. Changes will be synced when connection is restored.',
      icon: '/icon.svg',
      badge: '/icon.svg',
      tag: 'offline-notification',
      requireInteraction: false,
    });
  }
};

/**
 * Show update notification
 */
export const showUpdateNotification = () => {
  if (Notification.permission === 'granted') {
    new Notification('Update Available', {
      body: 'A new version is available. Refresh to update.',
      icon: '/icon.svg',
      badge: '/icon.svg',
      tag: 'update-notification',
      requireInteraction: true,
    });
  }
};

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const INSTALL_DISMISS_KEY = 'pwa-install-dismissed-at';
const DISMISS_FOR_MS = 7 * 24 * 60 * 60 * 1000;

let deferredInstallPrompt: BeforeInstallPromptEvent | null = null;
let pwaInitialized = false;

export const isIosDevice = (): boolean => {
  const ua = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua) || (ua.includes('mac') && 'ontouchend' in document);
};

export const isInstallDismissed = (): boolean => {
  const raw = localStorage.getItem(INSTALL_DISMISS_KEY);
  if (!raw) return false;
  const dismissedAt = Number(raw);
  if (Number.isNaN(dismissedAt)) return false;
  return Date.now() - dismissedAt < DISMISS_FOR_MS;
};

export const dismissInstallPrompt = (): void => {
  localStorage.setItem(INSTALL_DISMISS_KEY, String(Date.now()));
};

export const setupInstallPrompt = (
  onReady?: (event: BeforeInstallPromptEvent) => void
): void => {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event as BeforeInstallPromptEvent;
    onReady?.(deferredInstallPrompt);
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
  });
};

export const getDeferredInstallPrompt = (): BeforeInstallPromptEvent | null => {
  return deferredInstallPrompt;
};

export const showNativeInstallPrompt = async (): Promise<boolean> => {
  if (!deferredInstallPrompt) return false;

  try {
    await deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    return outcome === 'accepted';
  } catch (error) {
    console.error('Install prompt error:', error);
    return false;
  }
};

/**
 * Initialize PWA features (service worker updates, offline detection, install prompt).
 */
export const initializePWA = (callbacks?: {
  onUpdateAvailable?: () => void;
  onOnline?: () => void;
  onOffline?: () => void;
  onInstallReady?: (event: BeforeInstallPromptEvent) => void;
}) => {
  setupInstallPrompt(callbacks?.onInstallReady);

  if (pwaInitialized) {
    return;
  }
  pwaInitialized = true;

  if (!isServiceWorkerSupported()) {
    return;
  }

  setupOfflineDetection(callbacks?.onOnline, callbacks?.onOffline);

  checkForUpdates(callbacks?.onUpdateAvailable);
  setInterval(() => {
    checkForUpdates(callbacks?.onUpdateAvailable);
  }, 60000);
};

export const logPWAInfo = () => {
  console.group('PWA Information');
  console.log('Service Workers Supported:', isServiceWorkerSupported());
  console.log('Running as PWA:', isPWA());
  console.log('Online Status:', isOnline());
  console.log('Notification Permission:', Notification.permission);
  console.groupEnd();
};
