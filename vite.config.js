import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    proxy: {
      '/github-contributions': {
        target: 'https://github.com/users/kishore2611/contributions',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/github-contributions/, ''),
      },
    },
  },
})
