// Centralized API Client Wrapper
const API = {
  // Configurable base URL: reads from localStorage, config.js, or defaults to '/api'
  getBaseUrl() {
    // 1. Explicit manual override in browser localStorage (via "Set Backend URL")
    const customUrl = localStorage.getItem('cc_backend_api_url');
    if (customUrl) {
      return customUrl.replace(/\/+$/, '');
    }

    // 2. Global window override
    if (window.CAMPUSCONNECT_API_URL) {
      return window.CAMPUSCONNECT_API_URL.replace(/\/+$/, '');
    }

    // 3. Cloudflare Pages config.js pointing to Render backend
    if (window.CAMPUSCONNECT_CONFIG && window.CAMPUSCONNECT_CONFIG.BACKEND_URL) {
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return '/api';
      }
      let base = window.CAMPUSCONNECT_CONFIG.BACKEND_URL.replace(/\/+$/, '');
      if (!base.endsWith('/api')) base += '/api';
      return base;
    }

    return '/api';
  },

  setBaseUrl(url) {
    if (!url) {
      localStorage.removeItem('cc_backend_api_url');
    } else {
      let clean = url.trim().replace(/\/+$/, '');
      if (!clean.endsWith('/api') && !clean.includes('/api/')) {
        clean = `${clean}/api`;
      }
      localStorage.setItem('cc_backend_api_url', clean);
    }
  },

  getToken() {
    return localStorage.getItem('cc_token');
  },

  getHeaders(isMultipart = false) {
    const headers = {};
    if (!isMultipart) {
      headers['Content-Type'] = 'application/json';
    }
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  async request(endpoint, options = {}) {
    const isMultipart = options.body instanceof FormData;
    const base = this.getBaseUrl();
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(isMultipart),
        ...(options.headers || {})
      }
    };

    try {
      const response = await fetch(`${base}${endpoint}`, config);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `HTTP error ${response.status}`);
      }
      return data;
    } catch (err) {
      console.error(`API Error [${endpoint}]:`, err.message);
      throw err;
    }
  },

  get(endpoint, params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${endpoint}?${query}` : endpoint;
    return this.request(url, { method: 'GET' });
  },

  post(endpoint, body = {}) {
    const isFormData = body instanceof FormData;
    return this.request(endpoint, {
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body)
    });
  },

  patch(endpoint, body = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body)
    });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
};

window.API = API;
