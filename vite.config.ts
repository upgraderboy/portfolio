import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import https from 'https'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/gdrive': {
        target: 'https://drive.google.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/gdrive/, ''),
        headers: {
          Referer: 'https://drive.google.com'
        },
        selfHandleResponse: true,
        configure: (proxy, _options) => {
          proxy.on('proxyRes', (proxyRes, req, res) => {
            const statusCode = proxyRes.statusCode;
            if (statusCode === 302 || statusCode === 303) {
              const redirectUrl = proxyRes.headers.location;
              if (redirectUrl) {
                // Fetch the redirected content server-side to bypass client CORS checks
                https.get(redirectUrl, (redirectRes) => {
                  // Forward all headers and pipe the binary stream directly
                  res.writeHead(redirectRes.statusCode || 200, {
                    ...redirectRes.headers,
                    'Access-Control-Allow-Origin': '*'
                  });
                  redirectRes.pipe(res);
                }).on('error', (e) => {
                  res.writeHead(500);
                  res.end('Error following redirect: ' + e.message);
                });
                return;
              }
            }
            
            // Forward original response headers and body
            res.writeHead(proxyRes.statusCode || 200, {
              ...proxyRes.headers,
              'Access-Control-Allow-Origin': '*'
            });
            proxyRes.pipe(res);
          });
        }
      }
    }
  }
})
