/**
 * PWA Utilities for service worker management and offline detection
 */

export interface UpdatePrompt {
  show: () => Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferredPrompt: UpdatePrompt | null = null;
let updateAvailable = false;

/**
 * Check if the app is running as a PWA
 */
export const isPWA = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as any).standalone === true ||
    document.referrer.includes('android-app://');
};

/**
 * Check if service worker is supported
 */
export const isServiceWorkerSupported = (): boolean => {
  return 'serviceWorker' in navigator;
};

/**
 * Handle beforeinstallprompt event
 */
export const setupInstallPrompt = (callback?: (prompt: UpdatePrompt) => void) => {
  if (!isServiceWorkerSupported()) return;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e as unknown as UpdatePrompt;
    console.log('✅ Install prompt ready');
    if (callback) {
      callback(deferredPrompt);
    }
  });
};

/**
 * Show install prompt
 */
export const showInstallPrompt = async (): Promise<boolean> => {
  if (!deferredPrompt) {
    return false;
  }

  try {
    const { outcome } = await deferredPrompt.show();
    if (outcome === 'accepted') {
      console.log('✅ App installed');
      deferredPrompt = null;
      return true;
    }
  } catch (error) {
    console.error('Install prompt error:', error);
  }
  return false;
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
    console.log('🌐 Back online');
    if (onOnline) onOnline();
  });

  window.addEventListener('offline', () => {
    console.log('📡 Gone offline');
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
      console.log('✅ Update available');
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

    // Reload when the new service worker takes over
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('🔄 Reloading app with new version...');
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

      registration.active?.postMessage(
        { type: 'CLEAR_CACHE' },
        [messageChannel.port2]
      );
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
    console.log('Browser does not support notifications');
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

/**
 * Initialize all PWA features
 */
export const initializePWA = (callbacks?: {
  onInstallReady?: (prompt: UpdatePrompt) => void;
  onUpdateAvailable?: () => void;
  onOnline?: () => void;
  onOffline?: () => void;
}) => {
  console.log('🚀 Initializing PWA...');

  if (!isServiceWorkerSupported()) {
    console.warn('Service Workers not supported');
    return;
  }

  // Setup install prompt
  setupInstallPrompt(callbacks?.onInstallReady);

  // Setup offline detection
  setupOfflineDetection(callbacks?.onOnline, callbacks?.onOffline);

  // Check for updates periodically
  checkForUpdates(callbacks?.onUpdateAvailable);
  setInterval(() => {
    checkForUpdates(callbacks?.onUpdateAvailable);
  }, 60000); // Check every minute

  console.log('✅ PWA initialized');
};

// Log PWA info
export const logPWAInfo = () => {
  console.group('📱 PWA Information');
  console.log('Service Workers Supported:', isServiceWorkerSupported());
  console.log('Running as PWA:', isPWA());
  console.log('Online Status:', isOnline());
  console.log('Notification Permission:', Notification.permission);
  console.groupEnd();
};
