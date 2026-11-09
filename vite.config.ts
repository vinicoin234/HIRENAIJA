import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, Plugin} from 'vite';

function apkServePlugin(): Plugin {
  return {
    name: 'apk-serve-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.includes('.apk')) {
          const cleanUrl = req.url.split('?')[0];
          const localPath = path.resolve(__dirname, 'public', cleanUrl.replace(/^\//, ''));
          if (fs.existsSync(localPath) && fs.statSync(localPath).isFile()) {
            const fileName = path.basename(localPath);
            const stat = fs.statSync(localPath);
            res.setHeader('Content-Type', 'application/vnd.android.package-archive');
            res.setHeader('Content-Length', stat.size);
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            fs.createReadStream(localPath).pipe(res);
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apkServePlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

