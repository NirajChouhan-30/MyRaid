import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Production build optimizations
  build: {
    // Output directory
    outDir: 'dist',
    
    // Generate sourcemaps for production debugging (optional)
    sourcemap: false,
    
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    
    // Rollup options for optimization
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code into separate chunk
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // Split axios into separate chunk
          api: ['axios']
        }
      }
    },
    
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true
      }
    }
  },
  
  // Server configuration for development
  server: {
    port: 5173,
    strictPort: false,
    host: true,
    open: false
  },
  
  // Preview server configuration
  preview: {
    port: 4173,
    strictPort: false,
    host: true,
    open: false
  }
})
