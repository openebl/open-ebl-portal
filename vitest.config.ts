import { fileURLToPath } from 'url';
import { configDefaults, defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';

const vitestConfig = ({ mode }: { mode: string }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };

  return defineConfig({
    test: {
      globals: true,
      exclude: [...configDefaults.exclude, '**/playwright/**'],
      alias: {
        '@/': fileURLToPath(new URL('./src/', import.meta.url))
      },
    },
  });
};

export default vitestConfig;
