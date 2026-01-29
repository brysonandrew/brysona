import { defineConfig } from 'vitest/config';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    include: ['**/*.test.{ts,tsx}'],
    globals: false,
  },
});
