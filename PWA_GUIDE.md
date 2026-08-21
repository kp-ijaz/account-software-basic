# Progressive Web App (PWA) Guide

## Overview

Madrasa Accounting Software is now a fully-featured Progressive Web App (PWA). This means you can:

- 📱 Install it on your phone or desktop
- 🏠 Add it to your home screen
- 📡 Work offline with cached data
- 🔄 Automatic updates with notifications
- 💾 Persistent local storage
- ⚡ Fast loading with service worker caching

---

## ✨ Features

### 1. **Installation**

#### On Desktop (Chrome, Edge, Firefox)
- Open http://localhost:3000 in your browser
- Look for the install prompt banner at the bottom
- Click "Install" to add to desktop
- The app opens in standalone mode (no browser UI)

#### On Mobile (Android)
- Open http://localhost:3000 in Chrome
- Tap the three-dot menu
- Select "Add to Home Screen" or "Install app"
- App will appear on home screen

#### On iOS
- Open http://localhost:3000 in Safari
- Tap the Share button
- Select "Add to Home Screen"
- Enter app name and tap "Add"

---

### 2. **Offline Support**

The app works offline using a service worker that caches:

**Static Assets (Cache-First)**
- JavaScript bundles
- CSS stylesheets
- Images and fonts
- HTML pages

**API Requests (Network-First)**
- Fetch from server when online
- Use cached responses when offline
- Sync data when connection restored

**Offline Indicators**
- 📡 Banner shows "Offline Mode" status
- Changes saved locally while offline
- Automatic sync when online

---

### 3. **Automatic Updates**

When a new version is deployed:

- ✅ Service worker detects update
- 🔔 "Update Available" notification appears
- Click "Update & Reload" to get latest version
- No manual refresh needed

---

### 4. **Notifications**

The app sends notifications for:

- **Install Prompt** - Suggests installing the app
- **Updates** - New version available
- **Offline Status** - When connection lost/restored
- **Sync Complete** - Data synced after being offline

To enable notifications:
1. When prompted, click "Enable" or "Allow Notifications"
2. Grant permission in browser prompt
3. You'll receive notifications for important events

---

## 🔧 Technical Details

### Files Structure

```
frontend/
├── public/
│   ├── manifest.json          # PWA metadata and configuration
│   ├── sw.js                  # Service worker (offline support)
│   ├── browserconfig.xml       # Windows PWA config
│   └── icon.svg               # App icon
├── src/
│   ├── components/
│   │   └── pwa/
│   │       └── PWAPrompt.tsx   # PWA UI notifications
│   ├── utils/
│   │   └── pwaUtils.ts        # PWA utilities and helpers
│   └── App.tsx                # PWA integrated
└── index.html                 # PWA meta tags
```

### Service Worker Caching Strategy

**Cache-First** (for static assets):
```
Check cache → Return cached
           → Fetch from network
           → Cache new version
           → Return response
```

**Network-First** (for API calls):
```
Try fetch → Return response
        → Cache response
        → On error: return cached
        → On offline: return cached or error
```

### Key Technologies

- **Service Worker API** - Background sync & offline support
- **Cache API** - Data caching and retrieval
- **Web App Manifest** - Installation metadata
- **Notification API** - User notifications
- **Online Status API** - Detect connection changes

---

## 📊 Offline Data Handling

When offline:

1. **Read Operations**
   - Cached data displays normally
   - Recent transactions visible
   - Reports show cached data

2. **Write Operations**
   - Changes saved locally
   - Status shows "Offline Mode"
   - Data queued for sync

3. **Auto-Sync**
   - When connection restored
   - Data syncs automatically
   - Notification confirms sync

---

## 🔒 Security

PWA includes security features:

- ✅ HTTPS required (in production)
- ✅ Secure token storage
- ✅ Validated API requests
- ✅ Content Security Policy
- ✅ No plain-text storage

---

## 🚀 Deployment

### Production Checklist

- [ ] HTTPS enabled
- [ ] manifest.json served with correct headers
- [ ] Service worker registered on all pages
- [ ] Icons uploaded (multiple sizes)
- [ ] Cache busting implemented
- [ ] Offline page created
- [ ] Update strategy documented

### Environment Configuration

```javascript
// Production manifest includes:
- Full app metadata
- Multiple icon sizes
- Update strategy
- Installation shortcuts
- Display mode: standalone
```

---

## 📱 Browser Support

| Browser | Desktop | Mobile | Offline |
|---------|---------|--------|---------|
| Chrome | ✅ | ✅ | ✅ |
| Edge | ✅ | ✅ | ✅ |
| Firefox | ✅ | ⚠️ Limited | ✅ |
| Safari | ⚠️ Limited | ⚠️ Limited | ⚠️ |

---

## 🆘 Troubleshooting

### App Won't Install
- Check HTTPS is enabled (http://localhost works for dev)
- Ensure manifest.json is accessible
- Check browser console for errors
- Wait 30+ seconds (caching delay)

### Offline Not Working
- Service worker may not be registered
- Check browser's Application > Service Workers
- Clear site data and reinstall
- Verify sw.js has no errors

### Updates Not Showing
- Service worker may be cached
- Hard refresh (Ctrl+Shift+R)
- Clear browser cache
- Reinstall the app

### Data Not Syncing
- Check internet connection
- Verify API endpoints accessible
- Check browser console for errors
- Try manual refresh

---

## 📖 Usage Tips

### Best Practices

1. **Regular Backups**
   - Download reports as PDF
   - Export data periodically
   - Use cloud storage backup

2. **Updates**
   - Accept update prompts
   - Don't disable notifications
   - Restart app after major updates

3. **Offline Work**
   - Log in before going offline
   - Have recent data cached
   - Sync as soon as online

4. **Performance**
   - Use 4G/5G when available
   - Cache expires periodically
   - Refresh for latest data

---

## 🔗 Useful APIs

### JavaScript PWA Utils

```typescript
import { 
  isOnline,
  isPWA,
  showInstallPrompt,
  checkForUpdates,
  skipWaitingAndReload,
  clearAPICache
} from '@/utils/pwaUtils';

// Check if online
if (isOnline()) {
  console.log('Connected');
}

// Check if running as PWA
if (isPWA()) {
  console.log('Running as installed app');
}

// Show install prompt
await showInstallPrompt();

// Check for updates
await checkForUpdates(() => {
  console.log('Update available');
});

// Clear API cache
await clearAPICache();
```

---

## 📞 Support

For PWA-related issues:

1. Check browser DevTools
   - Application tab
   - Service Workers section
   - Cache Storage
   - Network tab (offline mode)

2. View logs
   - Browser console
   - Service worker console
   - Network tab errors

3. Debug manifest.json
   - Application > Manifest
   - Check all required fields
   - Verify icon paths

---

## 📚 References

- [MDN Web Docs - PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev - PWA Guide](https://web.dev/progressive-web-apps/)
- [Manifest.json Spec](https://www.w3.org/TR/appmanifest/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

## ✅ Verification Checklist

Your PWA is ready when:

- [ ] App can be installed on desktop
- [ ] App can be added to home screen (mobile)
- [ ] Works offline with cached data
- [ ] Shows offline indicator
- [ ] Update prompts appear
- [ ] Notifications work (if enabled)
- [ ] Service worker registered in DevTools
- [ ] Manifest.json loads correctly
- [ ] Icons display properly
- [ ] Data syncs after going online

---

## 🎉 Conclusion

The Madrasa Accounting Software PWA provides:

- **Reliability** - Works offline
- **Installability** - Like native apps
- **Engagement** - Notifications & updates
- **Performance** - Fast loading
- **Security** - Secure data handling

Enjoy using your accounting app anywhere, anytime! 📊✨
