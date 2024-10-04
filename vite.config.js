import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import ViteCSSExportPlugin from 'vite-plugin-css-export'
import copy from 'rollup-plugin-copy';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'classic',
    }),
    ViteCSSExportPlugin(),
    copy({
      targets: [
        { src: 'src/index.d.ts', dest: 'dist/' },
      ],
      hook: 'writeBundle',
    }),
  ],
  resolve: {
    alias: {
      'react-calendar-timeline-v3': './src/index.js',
    },
  },
  build: {
    lib: {
      entry: './src/index.js',
      name: 'ReactCalendarTimelineV3',
      fileName: 'react-calendar-timeline-v3',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
