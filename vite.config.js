import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [
        {
            name: 'js-as-jsx',
            enforce: 'pre',
            async transform(code, id) {
                if (/\.js$/.test(id) && !id.includes('node_modules')) {
                    return transformWithEsbuild(code, id + '.jsx', {
                        loader: 'jsx',
                        jsx: 'automatic',
                    });
                }
            },
        },
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    optimizeDeps: {
        esbuildOptions: {
            loader: {
                '.js': 'jsx',
            },
        },
    },
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
            },
        },
    },
    build: {
        outDir: 'dist',
    },
});
