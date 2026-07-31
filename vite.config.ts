import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * base задаётся переменной окружения, потому что адрес сайта зависит от площадки:
 * на GitHub Pages это подпапка /<репозиторий>/, на своём домене — корень.
 * Пути к файлам из public/ собираются через asset() в src/lib/asset.ts.
 */
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
});
