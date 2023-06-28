import { defineConfig } from 'vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import uni from '@dcloudio/vite-plugin-uni'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
    basicSsl(),
  ],
  server: {
    https: true
  }
})
