import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'dist-server']),

  // Uygulama kaynağı: tarayıcı ortamı + React kuralları
  {
    files: ['src/**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },

  // Yapılandırma + build script'leri: Node ortamı (process, Buffer, console…).
  // React/refresh kuralları uygulanmaz (bunlar bileşen değil, araç dosyalarıdır).
  {
    files: ['vite.config.js', 'eslint.config.js', 'scripts/**/*.{js,mjs}', 'prerender.mjs'],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },
])
