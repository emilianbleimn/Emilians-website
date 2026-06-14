import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
// base: './' -> relative Pfade, damit der Build auch in der Electron-Desktop-App
// (file://) und auf Unterpfaden (z. B. GitHub Pages) korrekt lädt.
export default defineConfig({
  base: './',
  plugins: [react()],
});
