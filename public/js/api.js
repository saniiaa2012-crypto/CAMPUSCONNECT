// Centralized API Client Wrapper
const API = {
  // Configurable base URL: reads from localStorage, window variable, or defaults to '/api'
  getBaseUrl() {
    if (window.CAMPUSCONNECT_API_URL) {
      return window.CAMPUSCONNECT_API_URL.replace(/\/+$/, '');
    }
    const customUrl = localStorage.getItem('cc_backend_api_url');
    if (customUrl) {
      return customUrl.replace(/\/+$/, '');
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
