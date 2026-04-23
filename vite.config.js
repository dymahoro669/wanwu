import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        fingerprint: resolve(__dirname, 'fingerprint.html'),
        home: resolve(__dirname, 'home.html'),
        data: resolve(__dirname, 'data.html'),
        profile: resolve(__dirname, 'profile.html'),
        assetDetail: resolve(__dirname, 'assetDetail.html'),
        safeVerify: resolve(__dirname, 'safeVerify.html'),
        quickLogin: resolve(__dirname, 'quickLogin.html'),
        firstFingerprint: resolve(__dirname, 'firstFingerprint.html'),
        pwdLogin: resolve(__dirname, 'pwdLogin.html')
      }
    }
  },
  server: {
    port: 3000
  }
});