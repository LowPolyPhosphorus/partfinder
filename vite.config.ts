import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves from a subpath unless you're using a custom domain
// at the repo root. Since this is going on finder.lowpolyphosphor.us as a
// custom domain (CNAME), base stays '/'.
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
  },
})
