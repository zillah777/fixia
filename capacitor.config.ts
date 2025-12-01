import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.fixia.pwa',
  appName: 'Fixia',
  webDir: 'public',
  server: {
    url: 'https://fixia.app',
    cleartext: true,
    androidScheme: 'https'
  }
};

export default config;
