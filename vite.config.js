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
    minify: 'esbuild',
    esbuild: {
      drop: ['debugger'],
      legalComments: 'none',
    },
    rollupOptions: {
      output: {
        // Rolldown (Vite 8) expects a function, not a package→chunk map
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('react-syntax-highlighter')) return 'vendor-syntax'
          if (id.includes('lenis')) return 'vendor-lenis'
          if (id.includes('liquid-glass-react')) return 'vendor-glass'
          if (id.includes('framer-motion')) return 'vendor-framer'
          if (id.includes('gsap')) return 'vendor-gsap'
          if (id.includes('@react-three/fiber') || id.includes('@react-three/drei')) return 'vendor-r3f'
          if (id.includes('three')) return 'vendor-three'
          if (id.includes('react-dom') || id.includes('/react/')) return 'vendor-react'
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
      'liquid-glass-react', // causes issues when pre-bundled
    ],
  },
})
