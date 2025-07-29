// Proxy Server para contornar CORS do Belle Biju
// Execute com: node server.js

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

// Configurar CORS para o proxy
app.use(
  cors({
    origin: [
      "https://belle-biju-react-v2.vercel.app",
      "https://belle-biju-react-v2-git-main-gabslopes055.vercel.app",
      "https://belle-biju-react-v2-gabslopes055.vercel.app",
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    credentials: true,
  })
);

// Configurar proxy para a API do backend
app.use(
  "/api",
  createProxyMiddleware({
    target: "https://bellebiju-backend-production-5cda.up.railway.app",
    changeOrigin: true,
    secure: true,
    pathRewrite: {
      "^/api": "/api", // manter o path /api
    },
    onProxyReq: (proxyReq, req) => {
      console.log(`🌐 Proxy: ${req.method} ${req.url} -> ${proxyReq.path}`);
    },
    onProxyRes: (proxyRes, req) => {
      console.log(`✅ Proxy Response: ${proxyRes.statusCode} ${req.url}`);
    },
    onError: (err, req, res) => {
      console.error(`❌ Proxy Error: ${err.message}`);
      res.status(500).json({ error: "Proxy error", message: err.message });
    },
  })
);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Proxy server running" });
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on port ${PORT}`);
  console.log(
    `📡 Proxying requests to: https://bellebiju-backend-production-5cda.up.railway.app`
  );
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

// Para usar este proxy:
// 1. cd proxy-server
// 2. npm install
// 3. npm start
// 4. Deployar em Railway, Heroku, etc.
// 5. Atualizar baseURL no frontend para apontar para este proxy
