import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import dts from 'vite-plugin-dts'

function resolve(_path: string) {
  return path.resolve(__dirname, _path)
}

const libName = 'react-keep-alive'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === 'library') {
    return {
      plugins: [
        react(),
        dts({
          outDir: './dist/types',
          tsconfigPath: './tsconfig.lib.json',
        }),
      ],
      build: {
        outDir: resolve('./dist'),
        sourcemap: true,
        lib: {
          entry: './components/index.ts', // 指定组件编译入口文件
          name: libName,
          fileName: libName,
        },
        rollupOptions: {
          external: ['react', 'react-dom'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
            },
          },
        },
      },
    }
  }
  return {
    plugins: [react()],
  }
})
