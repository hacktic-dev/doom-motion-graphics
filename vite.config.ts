import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';

export default defineConfig({
  server: {
    fs: {
      strict: false,
    },
  },
  plugins: [motionCanvas()],
});