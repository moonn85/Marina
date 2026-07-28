import { defineConfig, type PreviewServer } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

const servePrerenderedHtml = () => ({
  name: 'serve-prerendered-html',
  configurePreviewServer(server: PreviewServer) {
    const distDir = path.resolve(process.cwd(), 'dist')

    server.middlewares.use((req, res, next) => {
      if (req.method !== 'GET') return next()

      let pathname: string
      try {
        pathname = decodeURIComponent(new URL(req.url || '/', 'http://localhost').pathname)
      } catch {
        return next()
      }

      if (pathname === '/' || path.extname(pathname)) return next()

      const filePath = path.resolve(distDir, `.${pathname}`, 'index.html')
      if (!filePath.startsWith(`${distDir}${path.sep}`) || !fs.existsSync(filePath)) return next()

      res.statusCode = 200
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.end(fs.readFileSync(filePath))
    })
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), servePrerenderedHtml()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  ssr: {
    external: ['react-router-dom', 'react-helmet-async'],
  },
  server: {
    port: 3000,
    host: true,
    watch: {
      usePolling: true,
      interval: 1000,
    },
    hmr: {
      overlay: true,
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    modulePreload: {
      resolveDependencies: () => [],
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      format: {
        comments: false,
      },
    },
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Tối ưu chunk size
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    // Tăng chunk size limit để tránh cảnh báo
    chunkSizeWarningLimit: 1000,
    // Optimize deps
    reportCompressedSize: false,
  },
  preview: {
    port: 4173,
    host: true,
  },
})
