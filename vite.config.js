import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],

  // ── Build optimisations ─────────────────────────────────────────────────────
  build: {
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.warn'],
        passes: 2,
      },
    },
    rollupOptions: {
      output: {
        // Manual chunk splitting — keeps initial bundle tiny
        manualChunks: {
          // Core React
          'vendor-react': ['react', 'react-dom'],
          // Three.js ecosystem (largest dependency — ~600KB)
          'vendor-three': ['three'],
          'vendor-r3f': ['@react-three/fiber', '@react-three/drei'],
          'vendor-postprocessing': ['@react-three/postprocessing', 'postprocessing'],
          // Animation stack
          'vendor-gsap': ['gsap'],
          'vendor-framer': ['framer-motion'],
          // Scroll
          'vendor-lenis': ['lenis'],
          // Liquid glass
          'vendor-glass': ['liquid-glass-react'],
        },
        // Content-hash filenames for long-term caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    // Inline small assets (< 4KB) directly in CSS
    assetsInlineLimit: 4096,
    // Report any chunk > 500KB as a warning
    chunkSizeWarningLimit: 500,
    sourcemap: false,
  },

  // ── CSS optimisations ───────────────────────────────────────────────────────
  css: {
    devSourcemap: false,
  },

  // ── Dev server ──────────────────────────────────────────────────────────────
  server: {
    proxy: {
      '/github-contributions': {
        target: 'https://github.com/users/kishore2611/contributions',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/github-contributions/, ''),
      },
    },
  },

  // ── Dependency pre-bundling (speeds up cold starts) ─────────────────────────
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'gsap',
      'gsap/ScrollTrigger',
      'lenis',
      'three',
    ],
    exclude: [
      'liquid-glass-react',          // causes issues when pre-bundled
      '@react-three/postprocessing', // large, lazy-loaded
    ],
  },
})
