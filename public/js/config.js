// CampusConnect - Cloudflare Pages to Render Backend Configuration
// This file connects the Cloudflare-hosted frontend with the Render-hosted backend.

window.CAMPUSCONNECT_CONFIG = {
  // Render Backend URL:
  // If your Render service URL differs, update it here (e.g. 'https://your-custom-name.onrender.com')
  BACKEND_URL: 'https://campusconnect-backend.onrender.com',

  // Fallback to relative '/api' when using Cloudflare Pages _redirects proxy
  USE_PROXY_IF_AVAILABLE: true,

  // App version
  VERSION: '1.0.0',
  DEPLOYMENT: 'Cloudflare Pages (Frontend) -> Render (Backend)'
};
